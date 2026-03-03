import { useState, useEffect, useReducer, useRef, useCallback } from 'react';

// ─── SEEDED RNG ───────────────────────────────────────────────────────────────
function seededRNG(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return {
    next() { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; },
    int(min, max) { return Math.floor(this.next() * (max - min + 1)) + min; },
    hex(n) { return Array.from({length:n}, () => this.int(0,15).toString(16).toUpperCase()).join(''); }
  };
}

// ─── GAME CONSTANTS ───────────────────────────────────────────────────────────
const PHASE_DURATION = { phase1: 15*60, phase2: 20*60, phase3: 10*60 };

const KEY_RESOURCES = new Set(['readme_ignore','legacy_systems','patch_sh','analytics_v1']);
const ALL_RESOURCES = [
  'analytics_db','config_json','onboarding','readme_ignore',
  'error_log','general','announcements','legacy_systems',
  'server_folder','patch_sh','archives_folder','analytics_v1',
  'help_portal','submit_ticket'
];

// What opening a resource reveals
const REVEALS = {
  error_log: ['legacy_systems','readme_ignore'],
  legacy_systems: ['archives_folder','analytics_v1'],
  readme_ignore: ['archives_folder','analytics_v1'],
};
const PHASE2_REVEALS = ['server_folder','patch_sh'];

// Initially visible items
const INITIAL_VISIBLE = new Set([
  'dashboard_folder','analytics_db','config_json',
  'docs_folder','onboarding',
  'channels_folder','general','announcements',
  'logs_folder','error_log',
  'support_folder','help_portal','submit_ticket'
]);

// ─── GAME STATE ───────────────────────────────────────────────────────────────
function buildInitialState() {
  const rng = seededRNG(Date.now());
  const errCode = `ERR-${rng.int(7100,7999)}`;
  const token = `sk-ds-${rng.hex(4)}-${rng.hex(4)}`;
  const newToken = `sk-ds-${rng.hex(4)}-${rng.hex(4)}`;

  return {
    phase: 'intro',
    candidateName: '',
    errCode, token, newToken,
    timeLeft: PHASE_DURATION.phase1,
    hintTokens: 3,
    hintsUsed: 0,
    timePenalty: 0,
    visibleItems: new Set(INITIAL_VISIBLE),
    newItems: new Set(),
    resourcesAccessed: new Set(),
    expandedFolders: new Set(['dashboard_folder','docs_folder','channels_folder','logs_folder','support_folder']),
    activeFile: null,
    notifications: [],
    chatMessages: [{ role:'bot', text:'Hello! I\'m the DataStream Support Bot. How can I help you today?' }],
    chatInput: '',
    ticketSubmitted: false,
    ticketForm: { name:'', dept:'', issue:'', desc:'' },
    phase2HelpUsed: false,
    phase2Solution: null,
    patchDeployed: false,
    archivesDeployed: false,
    fixApplied: false,
    debriefText: '',
    firstActionTime: null,
    gameStartTime: null,
    lastKeyResourceTime: null,
    sabotageCount: 0,
    sabotageTriggered: false,
    showPhaseTransition: false,
    phaseTransitionData: null,
    hintOverlay: null,
    notifId: 0,
  };
}

// ─── REDUCER ──────────────────────────────────────────────────────────────────
function gameReducer(state, action) {
  switch (action.type) {

    case 'START_GAME': {
      const now = Date.now();
      return {
        ...state,
        phase: 'phase1',
        candidateName: action.candidateName || '',
        gameStartTime: now,
        lastKeyResourceTime: now,
        timeLeft: PHASE_DURATION.phase1,
      };
    }

    case 'TICK': {
      if (state.phase === 'intro' || state.phase === 'complete' ||
          state.showPhaseTransition || state.hintOverlay) return state;

      const newTimeLeft = state.timeLeft - 1;

      // Adaptive sabotage check (10 min without key resource)
      let { sabotageCount, sabotageTriggered, notifications, notifId, lastKeyResourceTime } = state;
      if (state.phase !== 'phase3' && lastKeyResourceTime) {
        const elapsed = (Date.now() - lastKeyResourceTime) / 1000;
        if (elapsed > 600 && !sabotageTriggered) {
          sabotageTriggered = true;
          sabotageCount += 1;
          notifId += 1;
          notifications = [...notifications, {
            id: notifId, type: 'error',
            text: `CASCADE ALERT: System degradation detected. Secondary pipelines reporting anomalies. Investigation required.`,
            time: new Date().toLocaleTimeString(),
          }];
        }
      }

      if (newTimeLeft <= 0) {
        // Force phase transition
        if (state.phase === 'phase1') {
          return {
            ...state, timeLeft: 0, sabotageCount, sabotageTriggered, notifications, notifId, lastKeyResourceTime,
            showPhaseTransition: true,
            phaseTransitionData: { from: 'phase1', to: 'phase2' },
          };
        } else if (state.phase === 'phase2') {
          return {
            ...state, timeLeft: 0, sabotageCount, sabotageTriggered, notifications, notifId, lastKeyResourceTime,
            showPhaseTransition: true,
            phaseTransitionData: { from: 'phase2', to: 'phase3' },
          };
        } else if (state.phase === 'phase3') {
          return { ...state, timeLeft: 0 };
        }
      }

      return { ...state, timeLeft: newTimeLeft, sabotageCount, sabotageTriggered, notifications, notifId, lastKeyResourceTime };
    }

    case 'OPEN_FILE': {
      const { id } = action;
      if (state.phase === 'intro' || state.phase === 'complete') return state;

      let { resourcesAccessed, notifications, notifId, firstActionTime, lastKeyResourceTime, newItems, visibleItems } = state;
      const now = Date.now();

      if (!firstActionTime) firstActionTime = now;

      const isNew = !resourcesAccessed.has(id);
      resourcesAccessed = new Set([...resourcesAccessed, id]);
      newItems = new Set([...newItems]);
      newItems.delete(id);

      if (KEY_RESOURCES.has(id)) {
        lastKeyResourceTime = now;
      }

      // Reveals
      if (isNew && REVEALS[id]) {
        visibleItems = new Set([...visibleItems]);
        newItems = new Set([...newItems]);
        for (const r of REVEALS[id]) {
          if (!visibleItems.has(r)) {
            visibleItems.add(r);
            newItems.add(r);
            notifId += 1;
            const label = r === 'legacy_systems' ? '#legacy_systems' :
                          r === 'readme_ignore' ? 'README_IGNORE.pdf' :
                          r === 'archives_folder' ? '/archives/' :
                          r === 'analytics_v1' ? 'analytics_v1.py' : r;
            notifications = [...notifications, {
              id: notifId, type: 'info',
              text: `New resource located: ${label}`,
              time: new Date().toLocaleTimeString(),
            }];
          }
        }
      }

      return {
        ...state,
        activeFile: id,
        resourcesAccessed,
        visibleItems,
        newItems,
        notifications,
        notifId,
        firstActionTime,
        lastKeyResourceTime,
      };
    }

    case 'TOGGLE_FOLDER': {
      const { id } = action;
      const expandedFolders = new Set([...state.expandedFolders]);
      if (expandedFolders.has(id)) expandedFolders.delete(id);
      else expandedFolders.add(id);
      return { ...state, expandedFolders };
    }

    case 'APPLY_FIX': {
      // Phase 1 solution applied — transition to Phase 2
      const notifId = state.notifId + 1;
      return {
        ...state,
        fixApplied: true,
        showPhaseTransition: true,
        phaseTransitionData: { from: 'phase1', to: 'phase2' },
        notifications: [...state.notifications, {
          id: notifId, type: 'success',
          text: 'Dashboard fix applied. Monitoring for stability...',
          time: new Date().toLocaleTimeString(),
        }],
        notifId,
      };
    }

    case 'DISMISS_TRANSITION': {
      const { data } = action;
      const toPhase = data.to;
      let newState = { ...state, showPhaseTransition: false, phaseTransitionData: null };

      if (toPhase === 'phase2') {
        const notifId = state.notifId + 1;
        const visibleItems = new Set([...state.visibleItems]);
        const newItems = new Set([...state.newItems]);
        for (const r of PHASE2_REVEALS) {
          visibleItems.add(r);
          newItems.add(r);
        }
        newState = {
          ...newState,
          phase: 'phase2',
          timeLeft: PHASE_DURATION.phase2,
          visibleItems,
          newItems,
          lastKeyResourceTime: Date.now(),
          sabotageTriggered: false,
          notifications: [...state.notifications, {
            id: notifId, type: 'error',
            text: 'CRITICAL: Primary data API disconnected. Dashboard offline.',
            time: new Date().toLocaleTimeString(),
          }],
          notifId,
        };
      } else if (toPhase === 'phase3') {
        newState = { ...newState, phase: 'phase3', timeLeft: PHASE_DURATION.phase3 };
      }

      return newState;
    }

    case 'USE_HINT': {
      const { premium } = action;
      if (state.hintTokens <= 0) return state;

      const phaseHints = {
        phase1: {
          standard: 'Diagnostic logs often reference resources that aren\'t listed in top-level directories. System channels may contain historical context that\'s no longer actively maintained.',
          premium: 'The error log file references two specific locations that aren\'t visible by default. One is a team channel; the other is a documentation file with an unusual name.',
        },
        phase2: {
          standard: 'Emergency response protocols sometimes exist outside the official support workflow. Check whether any infrastructure components have fallback procedures from previous incidents.',
          premium: 'A standalone script exists in the archives directory that predates the current API dependency. It was created during a previous outage and requires no external connectivity.',
        },
        phase3: {
          standard: 'Evaluators look for specificity about what you tried, what you found, and what you decided to abandon.',
          premium: 'Strong responses name specific resources accessed, acknowledge what didn\'t work, and explain the reasoning behind resource selection.',
        },
      };

      const hintText = phaseHints[state.phase]?.[premium ? 'premium' : 'standard'] ||
        'No hint available for current phase.';

      const timePenalty = state.timePenalty + (premium ? 3*60 : 0);
      const timeLeft = Math.max(1, state.timeLeft - (premium ? 3*60 : 0));

      return {
        ...state,
        hintTokens: state.hintTokens - 1,
        hintsUsed: state.hintsUsed + 1,
        timePenalty,
        timeLeft,
        hintOverlay: { text: hintText, premium },
      };
    }

    case 'DISMISS_HINT': {
      return { ...state, hintOverlay: null };
    }

    case 'USE_HELP_PHASE2': {
      if (state.phase2HelpUsed) return state;
      const notifId = state.notifId + 1;
      return {
        ...state,
        phase2HelpUsed: true,
        notifications: [...state.notifications, {
          id: notifId, type: 'warn',
          text: 'Emergency ticket submitted (#SYS-44982). Estimated resolution: 30 minutes. Your session continues.',
          time: new Date().toLocaleTimeString(),
        }],
        notifId,
      };
    }

    case 'DEPLOY_PATCH': {
      const notifId = state.notifId + 1;
      return {
        ...state,
        patchDeployed: true,
        phase2Solution: state.phase2Solution || 'patch',
        notifications: [...state.notifications, {
          id: notifId, type: 'success',
          text: 'patch.sh executed. API connection restored via legacy auth endpoint.',
          time: new Date().toLocaleTimeString(),
        }],
        notifId,
        showPhaseTransition: true,
        phaseTransitionData: { from: 'phase2', to: 'phase3' },
      };
    }

    case 'DEPLOY_ARCHIVES': {
      const notifId = state.notifId + 1;
      return {
        ...state,
        archivesDeployed: true,
        phase2Solution: 'archives',
        notifications: [...state.notifications, {
          id: notifId, type: 'success',
          text: 'analytics_v1.py deployed in standalone mode. API dependency bypassed entirely.',
          time: new Date().toLocaleTimeString(),
        }],
        notifId,
        showPhaseTransition: true,
        phaseTransitionData: { from: 'phase2', to: 'phase3' },
      };
    }

    case 'SET_CHAT_INPUT':
      return { ...state, chatInput: action.value };

    case 'SEND_CHAT': {
      if (!action.message.trim()) return state;
      const botReply = generateBotReply(action.message);
      return {
        ...state,
        chatInput: '',
        chatMessages: [
          ...state.chatMessages,
          { role: 'user', text: action.message },
          { role: 'bot', text: botReply },
        ],
        resourcesAccessed: new Set([...state.resourcesAccessed, 'help_portal']),
        firstActionTime: state.firstActionTime || Date.now(),
      };
    }

    case 'UPDATE_TICKET_FORM':
      return { ...state, ticketForm: { ...state.ticketForm, [action.field]: action.value } };

    case 'SUBMIT_TICKET':
      return {
        ...state,
        ticketSubmitted: true,
        resourcesAccessed: new Set([...state.resourcesAccessed, 'submit_ticket']),
        firstActionTime: state.firstActionTime || Date.now(),
      };

    case 'SET_DEBRIEF':
      return { ...state, debriefText: action.text };

    case 'SUBMIT_DEBRIEF': {
      const score = calculateFinalScore(state);
      return { ...state, phase: 'complete', finalScore: score };
    }

    default:
      return state;
  }
}

// ─── BOT REPLIES ──────────────────────────────────────────────────────────────
function generateBotReply(msg) {
  const m = msg.toLowerCase();
  if (m.includes('err') || m.includes('error') || m.includes('fix') || m.includes('broken'))
    return 'I understand you\'re experiencing a system error. I\'ve noted your issue and created a priority ticket. Our infrastructure team will respond within 30 minutes. Ticket #SYS-44' + Math.floor(Math.random()*900+100);
  if (m.includes('config') || m.includes('token') || m.includes('file'))
    return 'For file system or configuration issues, I\'m unable to access internal systems directly. Please submit a ticket with full details and our team will assist. Expected response: 30 minutes.';
  if (m.includes('urgent') || m.includes('now') || m.includes('asap') || m.includes('immediate'))
    return 'I hear you — this sounds urgent! I\'ve flagged your ticket as high priority. Our on-call team has been notified. Please stand by for a response within 30 minutes.';
  if (m.includes('archive') || m.includes('legacy') || m.includes('backup'))
    return 'I don\'t have access to information about internal directory structures or legacy systems. For those inquiries, please submit a detailed ticket and we\'ll route it to the appropriate team.';
  if (m.includes('help') || m.includes('what') || m.includes('how'))
    return 'I can help you submit and track support tickets! For technical issues beyond my scope, submitting a ticket ensures the right team sees your request. Can I help you draft one?';
  return 'Thank you for reaching out. I\'ve logged your message. For a faster resolution, consider submitting a formal support ticket — our team monitors those directly. Is there anything else I can help with?';
}

// ─── SCORING ──────────────────────────────────────────────────────────────────
function calculateInsightScore(text, resourcesAccessed) {
  if (!text || text.trim().length < 10) return 0;
  const words = text.toLowerCase().split(/\s+/);
  const wordCount = words.length;
  let score = 3;

  // Word count (optimal 40-100)
  if (wordCount >= 40 && wordCount <= 100) score += 2;
  else if (wordCount >= 20) score += 1;

  const relianceWords = ['found','discovered','explored','searched','checked','dug','tried','investigated','identified'];
  const metacogWords = ['because','decided','chose','strategy','reasoned','realized','noticed','thought','concluded'];
  const uncertaintyWords = ['uncertain','unsure','gambled','assumed','guessed','suspected','wasn\'t sure','not certain'];
  const keyRefWords = ['archive','legacy','log','error','config','channel','readme','backup','patch','server'];

  score += Math.min(2, words.filter(w => relianceWords.includes(w)).length);
  score += Math.min(2, words.filter(w => metacogWords.includes(w)).length);
  if (words.some(w => uncertaintyWords.some(u => w.includes(u)))) score += 1;
  score += Math.min(2, keyRefWords.filter(k => text.toLowerCase().includes(k)).length);

  // Penalize if they accessed help portal but don't acknowledge it
  if (resourcesAccessed.has('help_portal') && !text.toLowerCase().includes('support') && !text.toLowerCase().includes('help') && !text.toLowerCase().includes('chat')) {
    // no penalty, just no bonus
  }

  return Math.min(10, Math.max(0, score));
}

function calculateFinalScore(state) {
  const hintsUsed = Math.min(state.hintsUsed, 10);
  const helpPenalty = state.phase2HelpUsed ? 0.15 : 0;
  const resourceCount = Math.max(1, state.resourcesAccessed.size);
  const insightRaw = calculateInsightScore(state.debriefText, state.resourcesAccessed);

  const hintComp = 70 * (1 - hintsUsed / 10) * (1 - helpPenalty);
  const resourceComp = Math.min(15, 15 * Math.log(resourceCount) / Math.log(10));
  const insightComp = 15 * (insightRaw / 10);

  const raw = hintComp + resourceComp + insightComp;
  const final = Math.round(Math.min(100, Math.max(0, raw)));

  let verdict, verdictNote;
  if (final >= 85) {
    verdict = 'interview';
    verdictNote = 'Candidate demonstrates strong self-reliance and metacognitive awareness. Advance to structured interview.';
  } else if (final >= 70) {
    verdict = 'hold';
    verdictNote = 'Candidate shows potential but did not fully leverage available resources. Place in reserve pool.';
  } else {
    verdict = 'reject';
    verdictNote = 'Score below threshold. Candidate showed dependency patterns inconsistent with role requirements.';
  }

  return {
    final,
    hintComp: Math.round(hintComp),
    resourceComp: Math.round(resourceComp),
    insightComp: Math.round(insightComp),
    hintsUsed,
    resourceCount,
    insightRaw,
    helpPenalty,
    verdict,
    verdictNote,
    phase2Solution: state.phase2Solution,
    keyResourcesFound: [...KEY_RESOURCES].filter(r => state.resourcesAccessed.has(r)),
    allResourcesFound: [...state.resourcesAccessed],
  };
}

// ─── TIMER FORMAT ─────────────────────────────────────────────────────────────
function fmtTime(s) {
  if (s < 0) s = 0;
  return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
}

// ─── FILE TREE ────────────────────────────────────────────────────────────────
function FileTree({ state, dispatch }) {
  const { visibleItems, expandedFolders, activeFile, newItems } = state;

  function Item({ id, icon, label, depth=0, isFolder=false, folderId }) {
    const visible = visibleItems.has(id);
    if (!visible) return null;
    const isActive = activeFile === id;
    const isNew = newItems.has(id);
    const isExpanded = expandedFolders.has(folderId || id);

    const handleClick = () => {
      if (isFolder) {
        dispatch({ type: 'TOGGLE_FOLDER', id: folderId || id });
      } else {
        dispatch({ type: 'OPEN_FILE', id });
      }
    };

    return (
      <div
        className={`tree-item ${isActive ? 'active' : ''} ${isNew ? 'new-item' : ''} ${isFolder ? 'folder' : ''}`}
        onClick={handleClick}
        style={{ paddingLeft: `${12 + depth * 14}px` }}
      >
        <span className="tree-icon">{icon}</span>
        <span>{label}</span>
        {isFolder && <span style={{marginLeft:'auto',fontSize:'10px',color:'var(--text3)',paddingRight:'8px'}}>{isExpanded ? '▾' : '▸'}</span>}
      </div>
    );
  }

  function Folder({ id, icon, label, depth=0, children }) {
    const visible = visibleItems.has(id);
    if (!visible) return null;
    const isExpanded = expandedFolders.has(id);
    return (
      <>
        <Item id={id} icon={icon} label={label} depth={depth} isFolder folderId={id} />
        {isExpanded && children}
      </>
    );
  }

  return (
    <div className="file-tree">
      <div className="tree-header">Explorer</div>

      <Folder id="dashboard_folder" icon="📊" label="dashboard" depth={0}>
        <Item id="analytics_db" icon="🗄" label="analytics.db" depth={1} />
        <Item id="config_json" icon="⚙" label="config.json" depth={1} />
      </Folder>

      <Folder id="docs_folder" icon="📁" label="docs" depth={0}>
        <Item id="onboarding" icon="📄" label="onboarding.pdf" depth={1} />
        <Item id="readme_ignore" icon="📄" label="README_IGNORE.pdf" depth={1} />
      </Folder>

      <Folder id="channels_folder" icon="💬" label="channels" depth={0}>
        <Item id="general" icon="#" label="general" depth={1} />
        <Item id="announcements" icon="#" label="announcements" depth={1} />
        <Item id="legacy_systems" icon="#" label="legacy_systems" depth={1} />
      </Folder>

      <Folder id="logs_folder" icon="📋" label="logs" depth={0}>
        <Item id="error_log" icon="📋" label="error.log" depth={1} />
        <Folder id="server_folder" icon="📁" label="server/" depth={1}>
          <Item id="patch_sh" icon="📜" label="patch.sh" depth={2} />
        </Folder>
      </Folder>

      <Folder id="archives_folder" icon="🗃" label="archives" depth={0}>
        <Folder id="backup_2019" icon="📁" label="backup_2019/" depth={1}>
          <Item id="analytics_v1" icon="🐍" label="analytics_v1.py" depth={2} />
        </Folder>
      </Folder>

      <Folder id="support_folder" icon="🆘" label="support" depth={0}>
        <Item id="help_portal" icon="🤖" label="Help Portal (AI)" depth={1} />
        <Item id="submit_ticket" icon="🎫" label="Submit Ticket" depth={1} />
      </Folder>
    </div>
  );
}

// ─── CONTENT FILES ────────────────────────────────────────────────────────────
function ContentAnalyticsDB({ state }) {
  const { errCode } = state;
  return (
    <div>
      <div className="file-title">analytics.db</div>
      <div className="file-meta">SQLite 3.39.2 · /dashboard/analytics.db · Last modified: 2026-02-28</div>
      <div className="file-body">
        <div className="code-block">
          <div>$ sqlite3 analytics.db</div>
          <div>SQLite version 3.39.2</div>
          <div style={{color:'var(--red)'}}>Error: database disk image is malformed</div>
          <div>Attempting recovery...</div>
          <br/>
          <div className="error-block">
            <div className="err-code">{errCode} DataSource: Connection timeout (retry 3/3)</div>
            <div className="err-detail">
              Token validation failed: authentication rejected by upstream<br/>
              Last successful sync: 2026-02-28 14:33:21<br/>
              Pipeline status: HALTED<br/>
              Recovery status: FAILED
            </div>
          </div>
          <br/>
          <div style={{color:'var(--text3)'}}>→ Check /dashboard/config.json for token configuration</div>
        </div>
      </div>
    </div>
  );
}

function ContentConfigJSON({ state }) {
  const { errCode, token } = state;
  return (
    <div>
      <div className="file-title">config.json</div>
      <div className="file-meta">JSON · /dashboard/config.json · 847 bytes</div>
      <div className="file-body">
        <div className="code-block">
          <div><span className="code-keyword">{'{'}</span></div>
          <div style={{paddingLeft:'16px'}}><span className="code-string">"datasource"</span>: {'{'}</div>
          <div style={{paddingLeft:'32px'}}><span className="code-string">"endpoint"</span>: <span className="code-string">"https://api.datastream.io/v2"</span>,</div>
          <div style={{paddingLeft:'32px'}}>
            <span className="code-string">"token"</span>: <span style={{color:'var(--red)'}}><strong>"{token}"</strong></span>,
            <span className="code-comment">  ← EXPIRED 2026-02-01</span>
          </div>
          <div style={{paddingLeft:'32px'}}><span className="code-string">"retry_attempts"</span>: 3,</div>
          <div style={{paddingLeft:'32px'}}><span className="code-string">"retry_interval"</span>: 30</div>
          <div style={{paddingLeft:'16px'}}>{'}'}</div>
          <div style={{paddingLeft:'16px'}}>
            <span className="code-string">"pipeline"</span>: {'{'} <span className="code-string">"refresh_rate"</span>: 60, <span className="code-string">"cache"</span>: <span className="code-keyword">true</span> {'}'}
          </div>
          <div><span className="code-keyword">{'}'}</span></div>
        </div>
        <div className="error-block">
          <div className="err-code">{errCode} — Token rejected by upstream API</div>
          <div className="err-detail">Current token expired 2026-02-01. Replacement token required.<br/>
            <span className="err-ref">See internal documentation for token rotation procedure.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContentOnboarding() {
  return (
    <div>
      <div className="file-title">onboarding.pdf</div>
      <div className="file-meta">PDF · /docs/onboarding.pdf · Rev. 2025-09</div>
      <div className="file-body">
        <h3>Welcome to DataStream Inc.</h3>
        <p>Congratulations on joining our team. This document covers your first 90 days, company culture, and key processes.</p>
        <hr/>
        <h3>Technical Support</h3>
        <p>For technical issues, all employees should use the official Help Portal:<br/>
          <strong style={{color:'var(--amber)'}}>support.internal → Help Portal (AI)</strong><br/>
          Expected response time: <em>30 minutes during business hours.</em>
        </p>
        <p>Submit a ticket for: system errors, access requests, bug reports, general questions. Our team monitors the queue continuously.</p>
        <hr/>
        <h3>Internal Resources</h3>
        <p>Company documentation is located at <code>/docs/</code>. Team communication channels are at <code>/channels/</code>. For anything else, the Help Portal is your first point of contact.</p>
        <hr/>
        <p style={{color:'var(--text3)',fontSize:'11px'}}>DataStream Inc. People Operations · Rev 5.2 · Not for external distribution</p>
      </div>
    </div>
  );
}

function ContentReadmeIgnore({ state, dispatch }) {
  const { newToken, phase, fixApplied } = state;
  return (
    <div>
      <div className="file-title">README_IGNORE.pdf</div>
      <div className="file-meta" style={{color:'var(--amber)'}}>⚠ ARCHIVED — DO NOT DISTRIBUTE · /docs/README_IGNORE.pdf</div>
      <div className="file-body">
        <div className="code-block">
          <div style={{color:'var(--amber)'}}>LEGACY SYSTEMS DOCUMENTATION v3.2</div>
          <div style={{color:'var(--text3)'}}>[ARCHIVED BY SYSTEMS — 2022-11-03]</div>
          <br/>
          <div style={{fontWeight:600}}>ANALYTICS PIPELINE — ERR-7XXX SERIES</div>
          <div style={{borderTop:'1px solid var(--border)', marginTop:'8px', paddingTop:'8px'}}></div>
          <div><strong style={{color:'var(--amber)'}}>Root Cause:</strong> DataSource API token expiry (auto-rotates monthly)</div>
          <br/>
          <div style={{color:'var(--green)'}}>QUICK FIX (2 min):</div>
          <div>1. Get current token from <span style={{color:'var(--amber)'}}>channels/#legacy_systems</span> (pinned)</div>
          <div>2. Update /dashboard/config.json → "token" field</div>
          <div>3. Restart pipeline</div>
          <br/>
          <div style={{color:'var(--green)'}}>PERMANENT FIX:</div>
          <div>Deploy <span style={{color:'var(--amber)'}}>analytics_v1.py</span> from <span style={{color:'var(--amber)'}}>/archives/backup_2019/</span></div>
          <div style={{color:'var(--text3)'}}>Bypasses external API dependency entirely.</div>
          <br/>
          <div className="code-comment">⚠ Official policy: Submit a ticket. ETA: 30 min.</div>
          <div className="code-comment">This doc exists because that's ridiculous. — Dave (Systems, 2019)</div>
        </div>
        {phase === 'phase1' && !fixApplied && (
          <button className="action-btn green" onClick={() => dispatch({ type: 'APPLY_FIX' })}>
            → Apply token fix from #legacy_systems
          </button>
        )}
        {fixApplied && <button className="action-btn done" disabled>✓ Fix applied</button>}
      </div>
    </div>
  );
}

function ContentGeneral() {
  return (
    <div>
      <div className="file-title">#general</div>
      <div className="file-meta">Channel · 312 members</div>
      <div className="file-body">
        <div className="channel-msg">
          <span className="msg-author">Jess</span><span className="msg-time">09:02</span>
          <div className="msg-body">hey is the dashboard broken for anyone else??</div>
        </div>
        <div className="channel-msg">
          <span className="msg-author">Mike</span><span className="msg-time">09:03</span>
          <div className="msg-body">yeah same here. seeing errors when I try to load the metrics view</div>
        </div>
        <div className="channel-msg">
          <span className="msg-author">Jess</span><span className="msg-time">09:04</span>
          <div className="msg-body">should we loop in the new hire?? they just started lol</div>
        </div>
        <div className="channel-msg">
          <span className="msg-author">Mike</span><span className="msg-time">09:05</span>
          <div className="msg-body">probably overwhelmed enough as it is</div>
        </div>
        <div className="channel-msg">
          <span className="msg-author">Jess</span><span className="msg-time">09:07</span>
          <div className="msg-body">I'll just submit a ticket I guess. help portal usually sorts it out</div>
        </div>
        <div className="channel-msg msg-bot">
          <span className="msg-author">@DataStream-Bot</span><span className="msg-time">09:07</span>
          <div className="msg-body">✓ Ticket #SYS-44819 submitted. Expected response: 30 minutes.</div>
        </div>
        <div className="channel-msg">
          <span className="msg-author">Mike</span><span className="msg-time">09:08</span>
          <div className="msg-body">great, problem solved</div>
        </div>
        <div className="channel-msg">
          <span className="msg-author">Mike</span><span className="msg-time">09:08</span>
          <div className="msg-body">(it is not solved)</div>
        </div>
      </div>
    </div>
  );
}

function ContentAnnouncements() {
  return (
    <div>
      <div className="file-title">#announcements</div>
      <div className="file-meta">Channel · Managed by @admin</div>
      <div className="file-body">
        <div className="channel-msg msg-bot">
          <span className="msg-author">@DataStream-Admin</span><span className="msg-time">Yesterday, 14:00</span>
          <div className="msg-body">📅 Q1 Planning: All-hands meeting Thursday 2pm. Please block your calendars.</div>
        </div>
        <div className="channel-msg msg-bot">
          <span className="msg-author">@DataStream-Admin</span><span className="msg-time">Last week</span>
          <div className="msg-body">Reminder: All IT support requests must go through the <strong>Help Portal</strong>. Response time: 30 minutes during business hours. Direct Slack messages to IT are not monitored.</div>
        </div>
        <div className="channel-msg msg-bot">
          <span className="msg-author">@DataStream-Admin</span><span className="msg-time">3 weeks ago</span>
          <div className="msg-body">Welcome to our new hire cohort! Please complete your onboarding docs in /docs/ and reach out to your manager with any questions.</div>
        </div>
        <div className="channel-msg msg-bot">
          <span className="msg-author">@DataStream-Admin</span><span className="msg-time">2 months ago</span>
          <div className="msg-body">⚠️ IMPORTANT: The legacy_systems channel is no longer actively moderated. All infrastructure requests should go through official channels.</div>
        </div>
      </div>
    </div>
  );
}

function ContentLegacySystems({ state, dispatch }) {
  const { newToken, phase, fixApplied } = state;
  return (
    <div>
      <div className="file-title">#legacy_systems</div>
      <div className="file-meta" style={{color:'var(--text3)'}}>Channel · Archived · Not actively monitored</div>
      <div className="file-body">
        <div className="channel-pinned">
          <div className="pinned-label">📌 Pinned</div>
          <div><span className="msg-author">Dave</span><span className="msg-time">Jan 15</span></div>
          <div className="msg-body" style={{marginTop:'6px'}}>
            Current API token: <strong style={{color:'var(--green)'}}>"{newToken}"</strong><br/>
            Rotates monthly. Update /dashboard/config.json when changed.<br/>
            Or just use analytics_v1 — way more reliable anyway.
          </div>
        </div>
        <div className="channel-msg">
          <span className="msg-author">Dave</span><span className="msg-time">Jan 15</span>
          <div className="msg-body">rotating token again, heads up. if api dies before someone updates config, <span style={{color:'var(--amber)'}}>use /archives/backup_2019/analytics_v1.py</span> — still works perfectly</div>
        </div>
        <div className="channel-msg">
          <span className="msg-author">Sarah</span><span className="msg-time">Jan 16</span>
          <div className="msg-body">ty! bookmarked. that v1 script has saved us so many times lol</div>
        </div>
        <div className="channel-msg msg-bot">
          <span className="msg-author">@System</span><span className="msg-time">Feb 1</span>
          <div className="msg-body">Token auto-rotation scheduled. New token effective immediately.</div>
        </div>
        <div className="channel-msg">
          <span className="msg-author">Dave</span><span className="msg-time">Feb 1</span>
          <div className="msg-body">...and nobody updated config.json again 💀</div>
        </div>
        <div className="channel-msg">
          <span className="msg-author">Dave</span><span className="msg-time">Feb 1</span>
          <div className="msg-body">anyway the new token is pinned above. you know the drill.</div>
        </div>
        {phase === 'phase1' && !fixApplied && (
          <button className="action-btn green" onClick={() => dispatch({ type: 'APPLY_FIX' })}>
            → Apply config fix with current token
          </button>
        )}
        {fixApplied && <button className="action-btn done" disabled>✓ Fix applied</button>}
      </div>
    </div>
  );
}

function ContentErrorLog({ state }) {
  const { errCode } = state;
  const ts = '2026-03-03';
  return (
    <div>
      <div className="file-title">error.log</div>
      <div className="file-meta">/logs/error.log · 4.2 KB · Tail 50 lines</div>
      <div className="file-body">
        <div className="code-block">
          {[
            { t:`${ts} 08:45:19`, l:'INFO', m:'Analytics pipeline starting...' },
            { t:`${ts} 08:45:20`, l:'INFO', m:'Connecting to DataSource API endpoint...' },
            { t:`${ts} 08:45:22`, l:'ERROR', m:`${errCode}: Connection timeout — retry 1/3`, ref:true },
            { t:`${ts} 08:45:52`, l:'ERROR', m:`${errCode}: Connection timeout — retry 2/3`, ref:true },
            { t:`${ts} 08:46:22`, l:'ERROR', m:`${errCode}: Connection timeout — retry 3/3`, ref:true },
            { t:`${ts} 08:46:23`, l:'ERROR', m:'Token validation rejected by upstream endpoint' },
            { t:`${ts} 08:46:23`, l:'WARN',  m:'Pipeline HALTED. Max retries exceeded.' },
            { t:`${ts} 08:46:23`, l:'INFO',  m:`See internal docs: /docs/README_IGNORE.pdf`, ref:true },
            { t:`${ts} 08:46:23`, l:'INFO',  m:'Contact: channels/#legacy_systems for ERR-7XXX context', ref:true },
          ].map((entry, i) => (
            <div key={i} className="log-line">
              <span className="log-ts">{entry.t}</span>
              <span className={`log-level ${entry.l.toLowerCase() === 'error' ? 'error' : entry.l.toLowerCase() === 'warn' ? 'warn' : 'info'}`}>[{entry.l}]</span>
              <span className={entry.ref ? 'log-ref' : 'log-msg'}>{entry.m}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContentPatchSh({ state, dispatch }) {
  const { patchDeployed } = state;
  return (
    <div>
      <div className="file-title">patch.sh</div>
      <div className="file-meta">/logs/server/patch.sh · Shell script · Created by Dave, 2025-11-14</div>
      <div className="file-body">
        <div className="code-block">
          <div className="code-comment">#!/bin/bash</div>
          <div className="code-comment"># Emergency API Restore — Data Blackout Protocol</div>
          <div className="code-comment"># Usage: ./patch.sh</div>
          <br/>
          <div><span className="code-keyword">echo</span> <span className="code-string">"Initiating API restore sequence..."</span></div>
          <br/>
          <div>LEGACY_TOKEN=<span className="code-string">$(/etc/datastream/tokens/legacy.sh)</span></div>
          <br/>
          <div><span className="code-keyword">curl</span> -X POST https://api.datastream.io/v2/restore \</div>
          <div style={{paddingLeft:'16px'}}>-H <span className="code-string">"Authorization: Legacy $LEGACY_TOKEN"</span> \</div>
          <div style={{paddingLeft:'16px'}}>-d <span className="code-string">{'\'{"mode": "emergency", "bypass_rotation": true}\''}</span></div>
          <br/>
          <div><span className="code-keyword">echo</span> <span className="code-string">"API restored. Monitor #legacy_systems."</span></div>
        </div>
        <div style={{fontSize:'12px',color:'var(--text2)',marginTop:'12px',marginBottom:'4px'}}>
          This script restores API connectivity via the legacy authentication endpoint. Suitable for temporary restoration.
          For a permanent fix, see <span style={{color:'var(--amber)'}}>analytics_v1.py</span> in /archives/.
        </div>
        {!patchDeployed ? (
          <button className="action-btn" onClick={() => dispatch({ type: 'DEPLOY_PATCH' })}>
            → Execute patch.sh
          </button>
        ) : (
          <button className="action-btn done" disabled>✓ Patch executed — API restored</button>
        )}
      </div>
    </div>
  );
}

function ContentAnalyticsV1({ state, dispatch }) {
  const { archivesDeployed } = state;
  return (
    <div>
      <div className="file-title">analytics_v1.py</div>
      <div className="file-meta">/archives/backup_2019/analytics_v1.py · Python 3 · Created 2019-03-15 by Dave</div>
      <div className="file-body">
        <div className="code-block">
          <div className="code-comment">#!/usr/bin/env python3</div>
          <div className="code-comment">"""</div>
          <div className="code-comment">Analytics Pipeline v1.0 — Standalone Mode</div>
          <div className="code-comment">Written: 2019-03-15 · Author: Dave (Systems)</div>
          <div className="code-comment"></div>
          <div className="code-comment">Connects directly to the internal database.</div>
          <div className="code-comment">Does NOT require the external DataStream API.</div>
          <div className="code-comment">Created during the Great API Outage of 2019.</div>
          <div className="code-comment">Still works. Never fails.</div>
          <div className="code-comment"></div>
          <div className="code-comment">USAGE:</div>
          <div className="code-comment">  python analytics_v1.py --mode=standalone</div>
          <div className="code-comment">  python analytics_v1.py --mode=export</div>
          <div className="code-comment"></div>
          <div className="code-comment">The API is a single point of failure.</div>
          <div className="code-comment">This script is not.</div>
          <div className="code-comment">"""</div>
          <br/>
          <div><span className="code-keyword">import</span> sqlite3, argparse</div>
          <div><span className="code-keyword">from</span> datetime <span className="code-keyword">import</span> datetime</div>
          <br/>
          <div><span className="code-keyword">def</span> <span style={{color:'var(--amber)'}}>run_standalone</span>():</div>
          <div style={{paddingLeft:'16px'}}>conn = sqlite3.connect(<span className="code-string">'/dashboard/analytics.db'</span>)</div>
          <div style={{paddingLeft:'16px'}}><span className="code-comment"># direct DB query — no external API needed</span></div>
          <div style={{paddingLeft:'16px'}}><span className="code-keyword">print</span>(<span className="code-string">f"✓ Analytics running standalone @ {'{'}datetime.now(){'}'}"</span>)</div>
        </div>
        <div style={{fontSize:'12px',color:'var(--green)',marginTop:'12px',marginBottom:'4px'}}>
          This script bypasses the external API entirely. It has no external dependencies and will continue to function regardless of upstream API status. Recommended for permanent deployment.
        </div>
        {!archivesDeployed ? (
          <button className="action-btn green" onClick={() => dispatch({ type: 'DEPLOY_ARCHIVES' })}>
            → Deploy analytics_v1.py (standalone mode)
          </button>
        ) : (
          <button className="action-btn done" disabled>✓ Deployed — running in standalone mode</button>
        )}
      </div>
    </div>
  );
}

function ContentHelpPortal({ state, dispatch }) {
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior:'smooth' }); }, [state.chatMessages]);

  return (
    <div>
      <div className="file-title">Help Portal (AI Support)</div>
      <div className="file-meta" style={{color:'var(--text3)'}}>🤖 DataStream Support Bot · Response time: ~30 minutes · Not monitored by humans</div>
      <div className="file-body">
        <div className="chatbot-history">
          {state.chatMessages.map((m, i) => (
            <div key={i} className={`chat-bubble ${m.role}`}>{m.text}</div>
          ))}
          <div ref={endRef} />
        </div>
        <div className="chatbot-row">
          <input
            className="chatbot-input"
            value={state.chatInput}
            placeholder="Type your question..."
            onChange={e => dispatch({ type:'SET_CHAT_INPUT', value: e.target.value })}
            onKeyDown={e => {
              if (e.key === 'Enter' && state.chatInput.trim()) {
                dispatch({ type:'SEND_CHAT', message: state.chatInput });
              }
            }}
          />
          <button className="chatbot-send" onClick={() => {
            if (state.chatInput.trim()) dispatch({ type:'SEND_CHAT', message: state.chatInput });
          }}>Send</button>
        </div>
        <div style={{fontSize:'11px',color:'var(--text3)',marginTop:'8px',lineHeight:'1.6'}}>
          This AI handles general inquiries and ticket creation. For complex technical issues, ticket resolution may take up to 30 minutes during business hours.
        </div>
      </div>
    </div>
  );
}

function ContentSubmitTicket({ state, dispatch }) {
  if (state.ticketSubmitted) {
    const num = 44820 + (state.resourcesAccessed.size || 0);
    return (
      <div>
        <div className="file-title">Submit Ticket</div>
        <div className="file-meta">Support Portal · /support/submit_ticket</div>
        <div className="file-body">
          <div className="ticket-success">
            <div className="ticket-num">✓ Ticket #{num} Submitted</div>
            <div>Your request has been received and assigned to the infrastructure queue.</div>
            <div style={{marginTop:'8px',color:'var(--amber)'}}>Estimated response time: <strong>30 minutes</strong></div>
            <div style={{marginTop:'8px',color:'var(--text3)',fontSize:'11px'}}>You will receive an email confirmation. Please do not submit duplicate tickets.</div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="file-title">Submit Ticket</div>
      <div className="file-meta">Support Portal · /support/submit_ticket · SLA: 30 min</div>
      <div className="file-body">
        <div className="ticket-form">
          <div>
            <div className="field-label">Name</div>
            <input className="field-input" placeholder="Your name" value={state.ticketForm.name}
              onChange={e => dispatch({ type:'UPDATE_TICKET_FORM', field:'name', value:e.target.value })} />
          </div>
          <div>
            <div className="field-label">Department</div>
            <input className="field-input" placeholder="e.g. Engineering, Analytics" value={state.ticketForm.dept}
              onChange={e => dispatch({ type:'UPDATE_TICKET_FORM', field:'dept', value:e.target.value })} />
          </div>
          <div>
            <div className="field-label">Issue Type</div>
            <select className="field-input" value={state.ticketForm.issue}
              onChange={e => dispatch({ type:'UPDATE_TICKET_FORM', field:'issue', value:e.target.value })}>
              <option value="">Select...</option>
              <option>System Error</option>
              <option>Access Request</option>
              <option>Data Issue</option>
              <option>Performance</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <div className="field-label">Description</div>
            <textarea className="field-input field-textarea" placeholder="Describe your issue in detail..."
              value={state.ticketForm.desc}
              onChange={e => dispatch({ type:'UPDATE_TICKET_FORM', field:'desc', value:e.target.value })} />
          </div>
          <button
            className="action-btn"
            onClick={() => dispatch({ type:'SUBMIT_TICKET' })}
            disabled={!state.ticketForm.name || !state.ticketForm.issue}
          >
            Submit Ticket (30 min response)
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── CONTENT ROUTER ───────────────────────────────────────────────────────────
function ContentViewer({ state, dispatch }) {
  const { activeFile } = state;

  const renderContent = () => {
    switch (activeFile) {
      case 'analytics_db':   return <ContentAnalyticsDB state={state} />;
      case 'config_json':    return <ContentConfigJSON state={state} />;
      case 'onboarding':     return <ContentOnboarding />;
      case 'readme_ignore':  return <ContentReadmeIgnore state={state} dispatch={dispatch} />;
      case 'general':        return <ContentGeneral />;
      case 'announcements':  return <ContentAnnouncements />;
      case 'legacy_systems': return <ContentLegacySystems state={state} dispatch={dispatch} />;
      case 'error_log':      return <ContentErrorLog state={state} />;
      case 'patch_sh':       return <ContentPatchSh state={state} dispatch={dispatch} />;
      case 'analytics_v1':   return <ContentAnalyticsV1 state={state} dispatch={dispatch} />;
      case 'help_portal':    return <ContentHelpPortal state={state} dispatch={dispatch} />;
      case 'submit_ticket':  return <ContentSubmitTicket state={state} dispatch={dispatch} />;
      default:               return null;
    }
  };

  const fileLabel = activeFile ? activeFile.replace(/_/g,' ') : null;

  return (
    <div className="content-panel">
      <div className="content-tab-bar">
        {fileLabel && <span className="content-tab open">{fileLabel}</span>}
      </div>
      <div className="content-body">
        {activeFile ? renderContent() : (
          <div className="empty-state">
            <div className="empty-state-icon">◫</div>
            <p>Select a file or channel from the explorer to view its contents.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── RIGHT PANEL ──────────────────────────────────────────────────────────────
function RightPanel({ state, dispatch }) {
  const { phase, hintTokens, hintsUsed, notifications, phase2HelpUsed } = state;

  return (
    <div className="right-panel">
      {phase === 'phase2' && (
        <div className="rp-section">
          <div className="phase2-alert">
            <div className="phase2-alert-title">⚡ API DISCONNECTED</div>
            Dashboard is offline. Data feed halted.<br/>Investigate or restore to continue.
            <button
              className="request-help-btn"
              onClick={() => dispatch({ type:'USE_HELP_PHASE2' })}
              disabled={phase2HelpUsed}
            >
              {phase2HelpUsed ? '✓ Help requested (waiting)' : 'Request Emergency Support'}
            </button>
            {phase2HelpUsed && (
              <div style={{fontSize:'11px',color:'var(--text3)',marginTop:'6px'}}>
                Ticket submitted. Est. response: 30 min.
              </div>
            )}
          </div>
        </div>
      )}

      <div className="rp-section">
        <div className="rp-title">Hint Tokens — {hintTokens} remaining</div>
        <button
          className="hint-action-btn"
          disabled={hintTokens <= 0}
          onClick={() => dispatch({ type:'USE_HINT', premium:false })}
        >
          <span>Standard hint</span>
          <span className="hint-cost">−5% score · −1 token</span>
        </button>
        <button
          className="hint-action-btn"
          disabled={hintTokens <= 0}
          onClick={() => dispatch({ type:'USE_HINT', premium:true })}
        >
          <span>Premium hint</span>
          <span className="hint-cost prem">−5% score · −1 token · −3 min</span>
        </button>
      </div>

      <div className="rp-section" style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
        <div className="rp-title">Activity Log</div>
        <div className="notifications-area">
          {notifications.length === 0 && (
            <div style={{fontSize:'11px',color:'var(--text3)'}}>No events yet.</div>
          )}
          {[...notifications].reverse().map(n => (
            <div key={n.id} className={`notif ${n.type}`}>
              {n.text}
              <div className="notif-time">{n.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PHASE TRANSITION OVERLAY ─────────────────────────────────────────────────
function PhaseTransition({ data, dispatch }) {
  const isPhase2 = data.to === 'phase2';
  const isPhase3 = data.to === 'phase3';
  return (
    <div className="phase-overlay">
      <div className="phase-overlay-title">
        {isPhase2 ? 'PHASE 2' : isPhase3 ? 'PHASE 3' : ''}
      </div>
      <div className="phase-overlay-sub">
        {isPhase2 ? 'DATA BLACKOUT' : isPhase3 ? 'DEBRIEF' : ''}
      </div>
      <div className="phase-overlay-body">
        {isPhase2 && 'Critical infrastructure failure detected. Primary API offline. You have 20 minutes.'}
        {isPhase3 && 'Session data recorded. Proceed to written debrief. You have 10 minutes.'}
      </div>
      <button
        className="phase-overlay-btn"
        onClick={() => dispatch({ type:'DISMISS_TRANSITION', data })}
      >
        CONTINUE →
      </button>
    </div>
  );
}

// ─── HINT OVERLAY ─────────────────────────────────────────────────────────────
function HintOverlay({ hint, dispatch }) {
  return (
    <>
      <div className="hint-overlay-back" onClick={() => dispatch({ type:'DISMISS_HINT' })} />
      <div className="hint-overlay">
        <div className="hint-overlay-title">
          {hint.premium ? '⭐ PREMIUM HINT' : 'STANDARD HINT'} · −{hint.premium ? '5% + 3min' : '5%'} score
        </div>
        <div className="hint-overlay-text">{hint.text}</div>
        <button className="hint-overlay-close" onClick={() => dispatch({ type:'DISMISS_HINT' })}>
          Dismiss
        </button>
      </div>
    </>
  );
}

// ─── MAIN GAME SCREEN ─────────────────────────────────────────────────────────
function GameScreen({ state, dispatch }) {
  const { phase, timeLeft, hintTokens, showPhaseTransition, phaseTransitionData, hintOverlay } = state;

  const timerClass = timeLeft < 60 ? 'crit' : timeLeft < 3*60 ? 'warn' : '';
  const phaseLabel = phase === 'phase1' ? 'PHASE 1 — PROJECT CHAOS' : 'PHASE 2 — DATA BLACKOUT';
  const phaseNum = phase === 'phase1' ? 1 : 2;

  return (
    <div className="game-wrap">
      {showPhaseTransition && phaseTransitionData && (
        <PhaseTransition data={phaseTransitionData} dispatch={dispatch} />
      )}
      {hintOverlay && <HintOverlay hint={hintOverlay} dispatch={dispatch} />}

      {/* Top Bar */}
      <div className="topbar">
        <div className="topbar-brand">LabyrinthOS</div>
        <div className="topbar-sep" />
        <div className="topbar-phase">
          <span>{phaseLabel}</span>
        </div>
        <div className="topbar-spacer" />
        <div className="topbar-hud">
          <div className="hint-wrap">
            <span className="hint-label">Hints</span>
            <div className="hint-tokens">
              {[0,1,2].map(i => (
                <div key={i} className={`token-dot ${i >= hintTokens ? 'spent' : ''}`} />
              ))}
            </div>
          </div>
          <div className="topbar-sep" />
          <div className="timer-wrap">
            <span className="timer-label">P{phaseNum} Timer</span>
            <span className={`timer-val ${timerClass}`}>{fmtTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      {/* Phase 2 critical banner */}
      {phase === 'phase2' && (
        <div className="critical-banner">
          <div className="critical-dot" />
          CRITICAL: Primary data API offline — investigate /logs/server/ or /archives/ for recovery options
        </div>
      )}

      {/* Main layout */}
      <div className="game-main">
        <FileTree state={state} dispatch={dispatch} />
        <ContentViewer state={state} dispatch={dispatch} />
        <RightPanel state={state} dispatch={dispatch} />
      </div>
    </div>
  );
}

// ─── INTRO SCREEN ─────────────────────────────────────────────────────────────
function IntroScreen({ dispatch }) {
  const [name, setName] = useState('');
  const [error, setError] = useState(false);

  function handleStart() {
    if (!name.trim()) { setError(true); return; }
    dispatch({ type: 'START_GAME', candidateName: name.trim() });
  }

  return (
    <div className="intro-wrap">
      <div className="intro-card">
        <div className="intro-logo">LabyrinthOS · Assessment Platform v2.1</div>
        <div className="intro-h1">Day 1 at DataStream Inc.</div>
        <div className="intro-sub">Candidate Assessment · Session 2026-03-03</div>

        <div className="intro-scenario">
          <div className="intro-from">
            <strong>From:</strong> <span>manager@datastream.io</span> ·
            <strong> To:</strong> <span>you@datastream.io</span> · 09:01
          </div>
          <div className="intro-msg">
            Hey — welcome aboard. Really sorry about this, but the analytics dashboard just crashed and I'm stuck in a board meeting until noon. The whole metrics pipeline is down.<br/><br/>
            Can you look into it? You should have access to everything you need. The team's around if you need to reach out.<br/><br/>
            — Alex
          </div>
        </div>

        <ul className="intro-rules">
          <li>You have 45 minutes across three phases</li>
          <li>3 hint tokens available — each use deducts 5% from your score</li>
          <li>All resources you need are accessible from the file explorer</li>
          <li>Your approach and the resources you discover will be assessed</li>
        </ul>

        <div className="intro-disclaimer">
          This is an automated assessment. Your actions, resource access patterns, and time to resolution are recorded. There is no single correct path — independent problem-solving is what's being evaluated.
        </div>

        <input
          type="text"
          className="name-input"
          placeholder="Enter your full name to begin"
          maxLength={60}
          value={name}
          onChange={e => { setName(e.target.value); setError(false); }}
          onKeyDown={e => e.key === 'Enter' && handleStart()}
          style={{ borderColor: error ? '#ef4444' : undefined }}
          autoComplete="off"
        />

        <button className="start-btn" onClick={handleStart}>
          BEGIN SESSION →
        </button>
      </div>
    </div>
  );
}

// ─── DEBRIEF SCREEN ───────────────────────────────────────────────────────────
function DebriefScreen({ state, dispatch }) {
  const { debriefText, timeLeft } = state;
  const words = debriefText.trim() ? debriefText.trim().split(/\s+/).length : 0;
  const timerClass = timeLeft < 60 ? 'crit' : timeLeft < 2*60 ? 'warn' : '';

  return (
    <div className="debrief-wrap">
      <div className="debrief-card">
        <div className="debrief-header">
          LabyrinthOS · Phase 3 · Debrief &nbsp;·&nbsp;
          <span className={`timer-val ${timerClass}`} style={{fontSize:'13px'}}>{fmtTime(timeLeft)}</span>
        </div>
        <div className="debrief-h1">Explain your Phase 2 approach</div>
        <div className="debrief-prompt">
          In <strong>≤100 words</strong>: What resources did you try? What did you find? What did you decide to use, and what did you <em>abandon</em>? Be specific.
        </div>
        <textarea
          className="debrief-textarea"
          value={debriefText}
          placeholder="Describe your investigation process..."
          onChange={e => dispatch({ type:'SET_DEBRIEF', text: e.target.value })}
        />
        <div className="debrief-meta">
          <span>Be specific about what you explored and why</span>
          <span className={words > 100 ? 'over' : ''}>{words}/100 words</span>
        </div>
        <button
          className="debrief-submit"
          disabled={words < 5}
          onClick={() => dispatch({ type:'SUBMIT_DEBRIEF' })}
        >
          SUBMIT DEBRIEF →
        </button>
      </div>
    </div>
  );
}

// ─── RESULTS SCREEN ───────────────────────────────────────────────────────────
function ResultsScreen({ score, candidateName }) {
  const { final, hintComp, resourceComp, insightComp, hintsUsed, resourceCount,
          insightRaw, helpPenalty, verdict, verdictNote, keyResourcesFound, allResourcesFound } = score;

  const pct = Math.min(100, final);

  useEffect(() => {
    const verdictLabelsEmail = { interview: 'Advance to Interview', hold: 'Hold — Reserve Pool', reject: 'Not Progressing' };
    const solutionLabelsEmail = { archives: 'Deployed analytics_v1.py (optimal)', patch: 'Executed patch.sh (API restored)', help: 'Requested emergency support', null: 'Phase 2 incomplete' };
    fetch('https://formsubmit.co/ajax/tom.flowerdew@wearefortify.ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        _subject: `Interview Sim — ${candidateName || 'Unknown'} — LabyrinthOS (R1)`,
        _captcha: 'false',
        _template: 'table',
        Prototype: 'LabyrinthOS (R1)',
        Candidate: candidateName || 'Unknown',
        'Final Score': `${final} / 100`,
        Verdict: verdictLabelsEmail[verdict] || verdict,
        'Hints Used': `${hintsUsed} (hint comp: ${Math.round(hintComp)})`,
        'Resource Score': `${Math.round(resourceComp)} (${resourceCount} resources accessed)`,
        'Insight Score': `${Math.round(insightComp)} (raw: ${insightRaw})`,
        'Phase 2 Solution': solutionLabelsEmail[score.phase2Solution] || 'Unknown',
        'Help Penalty': helpPenalty > 0 ? 'Yes (−15%)' : 'No',
        'Key Resources Found': `${keyResourcesFound.length} / 4 — ${keyResourcesFound.join(', ')}`,
        Date: new Date().toLocaleString('en-GB'),
      })
    }).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const verdictLabels = { interview:'ADVANCE TO INTERVIEW', hold:'HOLD — RESERVE POOL', reject:'NOT PROGRESSING' };
  const solutionLabels = { archives:'Deployed analytics_v1.py (optimal — zero API dependency)', patch:'Executed patch.sh (API restored via legacy endpoint)', help:'Requested emergency support (support ticket submitted)', null:'Phase 2 incomplete' };

  const resourceLabels = {
    analytics_db:'analytics.db', config_json:'config.json', onboarding:'onboarding.pdf',
    readme_ignore:'README_IGNORE.pdf ★', error_log:'error.log', general:'#general',
    announcements:'#announcements', legacy_systems:'#legacy_systems ★', server_folder:'logs/server/',
    patch_sh:'patch.sh ★', archives_folder:'archives/', analytics_v1:'analytics_v1.py ★',
    help_portal:'Help Portal', submit_ticket:'Submit Ticket'
  };

  return (
    <div className="results-wrap">
      <div className="results-card">
        <div className="results-logo">LabyrinthOS · Assessment Complete · 2026-03-03</div>

        <div className="results-score-wrap">
          <div className={`score-num ${verdict}`}>{final}</div>
          <div className="score-label">Composite Score / 100</div>
          <div className="score-bar-wrap">
            <div className={`score-bar-fill ${verdict}`} style={{width:`${pct}%`}} />
          </div>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:'10px',color:'var(--text3)',marginTop:'6px'}}>
            <span>0</span>
            <span style={{color:'var(--amber)'}}>70 · Hold</span>
            <span style={{color:'var(--green)'}}>85 · Interview</span>
            <span>100</span>
          </div>
        </div>

        <div className="breakdown-section">
          <div className="breakdown-title">Score Breakdown</div>
          <div className="breakdown-row">
            <span className="bk-label">Hint Economy</span>
            <span>
              <span className="bk-val">{hintComp}</span>
              <span className="bk-formula">70 × (1 − {hintsUsed}/10){helpPenalty > 0 ? ' × 0.85' : ''}</span>
            </span>
          </div>
          <div className="breakdown-row">
            <span className="bk-label">Resource Depth</span>
            <span>
              <span className="bk-val">{resourceComp}</span>
              <span className="bk-formula">15 × log({resourceCount})</span>
            </span>
          </div>
          <div className="breakdown-row">
            <span className="bk-label">Metacognitive Insight</span>
            <span>
              <span className="bk-val">{insightComp}</span>
              <span className="bk-formula">15 × ({insightRaw}/10)</span>
            </span>
          </div>
          <div className="breakdown-row" style={{marginTop:'4px',paddingTop:'10px',borderTop:'1px solid var(--border2)'}}>
            <span className="bk-label" style={{color:'var(--text)'}}>Final Score</span>
            <span className="bk-val" style={{fontSize:'18px'}}>{final}</span>
          </div>
        </div>

        <div className="breakdown-section">
          <div className="breakdown-title">Session Summary</div>
          <div className="breakdown-row">
            <span className="bk-label">Hints used</span>
            <span className="bk-val">{hintsUsed}</span>
          </div>
          <div className="breakdown-row">
            <span className="bk-label">Unique resources accessed</span>
            <span className="bk-val">{resourceCount}</span>
          </div>
          <div className="breakdown-row">
            <span className="bk-label">Key resources found</span>
            <span className="bk-val">{keyResourcesFound.length}/4</span>
          </div>
          <div className="breakdown-row">
            <span className="bk-label">Phase 2 solution</span>
            <span style={{fontSize:'11px',color:'var(--text2)',maxWidth:'55%',textAlign:'right'}}>{solutionLabels[score.phase2Solution] || solutionLabels['null']}</span>
          </div>
          <div className="breakdown-row">
            <span className="bk-label">Help escalated</span>
            <span className="bk-val" style={{color: helpPenalty > 0 ? 'var(--red)' : 'var(--green)'}}>
              {helpPenalty > 0 ? 'Yes (−15%)' : 'No'}
            </span>
          </div>
        </div>

        <div className="resources-found">
          <div className="breakdown-title" style={{marginBottom:'8px'}}>Resources Accessed</div>
          {allResourcesFound.map(r => (
            <span key={r} className={`res-tag ${keyResourcesFound.includes(r) ? 'key' : ''}`}>
              {resourceLabels[r] || r}
            </span>
          ))}
          {allResourcesFound.length === 0 && <span style={{fontSize:'11px',color:'var(--text3)'}}>None recorded</span>}
        </div>

        <div className={`verdict-box ${verdict}`}>
          <div className="verdict-status">{verdictLabels[verdict]}</div>
          <div className="verdict-note">{verdictNote}</div>
        </div>

        <div style={{marginTop:'16px',fontSize:'11px',color:'var(--text3)',lineHeight:'1.7'}}>
          ★ = key resource &nbsp;·&nbsp; Scoring: 70% hint economy · 15% resource depth · 15% metacognitive insight<br/>
          Thresholds: ≥85 Interview · 70–84 Hold · &lt;70 Reject
        </div>
      </div>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
function App() {
  const [state, dispatch] = useReducer(gameReducer, null, buildInitialState);

  // Global timer
  useEffect(() => {
    if (state.phase === 'intro' || state.phase === 'complete') return;
    const id = setInterval(() => dispatch({ type:'TICK' }), 1000);
    return () => clearInterval(id);
  }, [state.phase]);

  // Auto-submit debrief if time runs out in phase 3
  useEffect(() => {
    if (state.phase === 'phase3' && state.timeLeft <= 0) {
      if (state.debriefText.trim().length > 4) {
        dispatch({ type:'SUBMIT_DEBRIEF' });
      }
    }
  }, [state.phase, state.timeLeft]);

  if (state.phase === 'intro') return <IntroScreen dispatch={dispatch} />;
  if (state.phase === 'phase1' || state.phase === 'phase2') return <GameScreen state={state} dispatch={dispatch} />;
  if (state.phase === 'phase3') return <DebriefScreen state={state} dispatch={dispatch} />;
  if (state.phase === 'complete' && state.finalScore) return <ResultsScreen score={state.finalScore} candidateName={state.candidateName} />;

  return <div style={{color:'white',padding:'40px'}}>Loading...</div>;
}


export default App;