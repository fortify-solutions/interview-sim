// game.js — Core game engine for "Day One at Meridian"

(function () {
  'use strict';

  // ── State ──────────────────────────────────────────────────────────
  const state = {
    phase: 'intro',          // intro | playing | decision | results
    playerName: '',
    analytics: null,
    zCounter: 100,
    windows: {},             // appId → { open, minimized, x, y, w, h }
    drag: null,              // active drag state
    emailFolder: 'inbox',
    selectedEmailId: null,
    filesPath: [],
    filesSelectedFile: null,
    browserPage: 'home',
    browserHistory: ['home'],
    chatContactId: null,
    chatMessages: {},        // contactId → []
    decisionScore: 0,
    scoreResult: null,
  };

  // Default window configs
  const WINDOW_DEFAULTS = {
    email:   { title: 'Meridian Mail', icon: '✉️', x: 40,  y: 40,  w: 740, h: 520 },
    files:   { title: 'Files',         icon: '📁', x: 100, y: 60,  w: 640, h: 480 },
    browser: { title: 'Intranet',      icon: '🌐', x: 160, y: 50,  w: 680, h: 520 },
    chat:    { title: 'Team Chat',     icon: '💬', x: 220, y: 80,  w: 420, h: 520 },
  };

  const HELP_KEYWORDS = ['help', 'confused', "don't know", "dont know", 'what do i do',
    'what should', 'not sure', 'lost', 'no idea', 'clueless'];

  // ── Boot ───────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    initIntro();
    initDesktopIcons();
    initDragGlobal();
  });

  // ── Intro Screen ───────────────────────────────────────────────────
  function initIntro() {
    const input = document.getElementById('player-name-input');
    const btn   = document.getElementById('start-btn');

    btn.addEventListener('click', () => {
      const name = input.value.trim();
      if (!name) { input.classList.add('shake'); setTimeout(() => input.classList.remove('shake'), 500); return; }
      startGame(name);
    });

    input.addEventListener('keydown', e => { if (e.key === 'Enter') btn.click(); });
  }

  function startGame(name) {
    state.playerName = name;
    state.analytics  = new Analytics();

    // Personalise email salutation
    GAME_CONTENT.emails[0].body = GAME_CONTENT.emails[0].body.replace('Hi there,', `Hi ${name.split(' ')[0]},`);

    // Initialise chat message stores
    GAME_CONTENT.chat.contacts.forEach(c => {
      state.chatMessages[c.id] = [...c.initialMessages];
    });

    showScreen('desktop');
    state.phase = 'playing';
    showNotification('👋 Welcome, ' + name.split(' ')[0] + '. Your desktop is ready.', 4000);

    // Badge unread emails
    const unreadCount = GAME_CONTENT.emails.filter(e => e.isUnread && e.folder === 'inbox').length;
    if (unreadCount > 0) setBadge('email', unreadCount);

    updateDiscoveryTracker();
  }

  // ── Screen Manager ─────────────────────────────────────────────────
  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id + '-screen').classList.add('active');
    state.phase = id;
  }

  // ── Desktop Icons ──────────────────────────────────────────────────
  function initDesktopIcons() {
    document.querySelectorAll('.desktop-icon').forEach(icon => {
      icon.addEventListener('dblclick', () => {
        const app = icon.dataset.app;
        openApp(app);
      });
      // Single click selects
      icon.addEventListener('click', () => {
        document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
        icon.classList.add('selected');
      });
    });

    // Clicking desktop background deselects icons
    document.getElementById('desktop-area').addEventListener('click', e => {
      if (e.target === e.currentTarget || e.target.id === 'desktop-area') {
        document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
      }
    });
  }

  function setBadge(appId, count) {
    const icon = document.querySelector(`.desktop-icon[data-app="${appId}"]`);
    if (!icon) return;
    let badge = icon.querySelector('.badge');
    if (!badge) { badge = document.createElement('div'); badge.className = 'badge'; icon.appendChild(badge); }
    badge.textContent = count;
  }

  function clearBadge(appId) {
    const badge = document.querySelector(`.desktop-icon[data-app="${appId}"] .badge`);
    if (badge) badge.remove();
  }

  // ── App / Window Management ────────────────────────────────────────
  function openApp(appId) {
    state.analytics?.openApp(appId);

    if (state.windows[appId]?.open) {
      if (state.windows[appId].minimized) restoreWindow(appId);
      else focusWindow(appId);
      return;
    }

    const defaults = WINDOW_DEFAULTS[appId];
    state.windows[appId] = {
      open: true, minimized: false,
      x: defaults.x, y: defaults.y,
      w: defaults.w, h: defaults.h,
      z: ++state.zCounter
    };

    const win = createWindowEl(appId);
    document.getElementById('windows-container').appendChild(win);
    renderAppContent(appId);
    addTaskbarButton(appId);
    focusWindow(appId);
  }

  function createWindowEl(appId) {
    const cfg = WINDOW_DEFAULTS[appId];
    const ws  = state.windows[appId];
    const win = document.createElement('div');
    win.className = 'window';
    win.id = 'window-' + appId;
    win.style.cssText = `left:${ws.x}px;top:${ws.y}px;width:${ws.w}px;height:${ws.h}px;z-index:${ws.z}`;

    win.innerHTML = `
      <div class="window-titlebar" data-app="${appId}">
        <div class="window-title-group">
          <span class="win-icon">${cfg.icon}</span>
          <span class="win-title">${cfg.title}</span>
        </div>
        <div class="window-controls">
          <button class="win-ctrl win-min" data-app="${appId}" aria-label="Minimise" title="Minimise">─</button>
          <button class="win-ctrl win-close" data-app="${appId}" aria-label="Close" title="Close">✕</button>
        </div>
      </div>
      <div class="window-body" id="wbody-${appId}"></div>`;

    win.addEventListener('mousedown', () => focusWindow(appId));
    win.querySelector('.win-min').addEventListener('click', e => { e.stopPropagation(); minimizeWindow(appId); });
    win.querySelector('.win-close').addEventListener('click', e => { e.stopPropagation(); closeWindow(appId); });

    // Titlebar drag
    const titlebar = win.querySelector('.window-titlebar');
    titlebar.addEventListener('mousedown', e => {
      if (e.target.classList.contains('win-ctrl')) return;
      startDrag(e, appId);
    });

    return win;
  }

  function focusWindow(appId) {
    state.windows[appId].z = ++state.zCounter;
    document.getElementById('window-' + appId).style.zIndex = state.zCounter;
    document.querySelectorAll('.window').forEach(w => w.classList.remove('focused'));
    document.getElementById('window-' + appId).classList.add('focused');
    updateTaskbarButtons();
  }

  function closeWindow(appId) {
    const el = document.getElementById('window-' + appId);
    if (el) { el.classList.add('closing'); setTimeout(() => el.remove(), 200); }
    if (state.windows[appId]) state.windows[appId].open = false;
    removeTaskbarButton(appId);
  }

  function minimizeWindow(appId) {
    const el = document.getElementById('window-' + appId);
    if (el) el.classList.add('minimized');
    state.windows[appId].minimized = true;
    updateTaskbarButtons();
  }

  function restoreWindow(appId) {
    const el = document.getElementById('window-' + appId);
    if (el) el.classList.remove('minimized');
    state.windows[appId].minimized = false;
    focusWindow(appId);
  }

  // ── Taskbar ────────────────────────────────────────────────────────
  function addTaskbarButton(appId) {
    const cfg = WINDOW_DEFAULTS[appId];
    const bar = document.getElementById('taskbar-apps');
    if (bar.querySelector(`[data-app="${appId}"]`)) return;
    const btn = document.createElement('button');
    btn.className = 'taskbar-btn';
    btn.dataset.app = appId;
    btn.innerHTML = `<span>${cfg.icon}</span> ${cfg.title}`;
    btn.addEventListener('click', () => {
      if (state.windows[appId]?.minimized) restoreWindow(appId);
      else focusWindow(appId);
    });
    bar.appendChild(btn);
  }

  function removeTaskbarButton(appId) {
    document.querySelector(`#taskbar-apps [data-app="${appId}"]`)?.remove();
  }

  function updateTaskbarButtons() {
    document.querySelectorAll('.taskbar-btn').forEach(btn => {
      const appId = btn.dataset.app;
      btn.classList.toggle('active', !state.windows[appId]?.minimized);
    });
  }

  // ── Drag ───────────────────────────────────────────────────────────
  function startDrag(e, appId) {
    focusWindow(appId);
    const win = document.getElementById('window-' + appId);
    const rect = win.getBoundingClientRect();
    state.drag = { appId, startX: e.clientX - rect.left, startY: e.clientY - rect.top };
    e.preventDefault();
  }

  function initDragGlobal() {
    document.addEventListener('mousemove', e => {
      if (!state.drag) return;
      const { appId, startX, startY } = state.drag;
      const win = document.getElementById('window-' + appId);
      const desktop = document.getElementById('desktop-area');
      const dr = desktop.getBoundingClientRect();
      let nx = e.clientX - dr.left - startX;
      let ny = e.clientY - dr.top - startY;
      nx = Math.max(0, Math.min(nx, dr.width  - win.offsetWidth));
      ny = Math.max(0, Math.min(ny, dr.height - win.offsetHeight - 48)); // 48 = taskbar
      win.style.left = nx + 'px';
      win.style.top  = ny + 'px';
    });

    document.addEventListener('mouseup', () => { state.drag = null; });
  }

  // ── App Content Rendering ──────────────────────────────────────────
  function renderAppContent(appId) {
    switch (appId) {
      case 'email':   renderEmail(); break;
      case 'files':   renderFiles(); break;
      case 'browser': renderBrowser(); break;
      case 'chat':    renderChat(); break;
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // EMAIL APP
  // ═══════════════════════════════════════════════════════════════════
  function renderEmail() {
    const body = document.getElementById('wbody-email');
    body.innerHTML = `
      <div class="email-app">
        <div class="email-sidebar">
          <div class="email-folders">
            <button class="folder-btn active" data-folder="inbox">
              <span>📥</span> Inbox <span class="folder-count" id="inbox-count">
                ${GAME_CONTENT.emails.filter(e => e.folder === 'inbox').length}
              </span>
            </button>
            <button class="folder-btn" data-folder="sent"><span>📤</span> Sent</button>
            <button class="folder-btn" data-folder="starred"><span>⭐</span> Starred</button>
          </div>
        </div>
        <div class="email-list" id="email-list"></div>
        <div class="email-reading-pane" id="email-reading-pane">
          <div class="email-empty-state">
            <div class="empty-icon">✉️</div>
            <p>Select a message to read</p>
          </div>
        </div>
      </div>`;

    renderEmailList();

    body.querySelectorAll('.folder-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        body.querySelectorAll('.folder-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.emailFolder = btn.dataset.folder;
        state.selectedEmailId = null;
        renderEmailList();
        renderEmailReading(null);
      });
    });
  }

  function renderEmailList() {
    const list = document.getElementById('email-list');
    if (!list) return;
    const emails = GAME_CONTENT.emails.filter(e => e.folder === state.emailFolder);

    if (emails.length === 0) {
      list.innerHTML = '<div class="email-list-empty">No messages</div>';
      return;
    }

    list.innerHTML = emails.map(e => `
      <div class="email-item ${e.isUnread ? 'unread' : ''} ${state.selectedEmailId === e.id ? 'selected' : ''}"
           data-id="${e.id}">
        <div class="email-item-sender">${escHtml(e.fromName)}</div>
        <div class="email-item-subject">${escHtml(e.subject)}</div>
        <div class="email-item-time">${e.time}</div>
      </div>`).join('');

    list.querySelectorAll('.email-item').forEach(item => {
      item.addEventListener('click', () => {
        state.selectedEmailId = item.dataset.id;
        // Mark as read
        const email = GAME_CONTENT.emails.find(e => e.id === item.dataset.id);
        if (email) email.isUnread = false;
        renderEmailList();
        renderEmailReading(item.dataset.id);
        updateEmailBadge();
      });
    });
  }

  function renderEmailReading(emailId) {
    const pane = document.getElementById('email-reading-pane');
    if (!pane) return;

    if (!emailId) {
      pane.innerHTML = `<div class="email-empty-state"><div class="empty-icon">✉️</div><p>Select a message to read</p></div>`;
      return;
    }

    const email = GAME_CONTENT.emails.find(e => e.id === emailId);
    if (!email) return;

    pane.innerHTML = `
      <div class="email-reading">
        <div class="email-reading-header">
          <h2 class="email-reading-subject">${escHtml(email.subject)}</h2>
          <div class="email-reading-meta">
            <div class="email-avatar">${email.fromName.split(' ').map(n => n[0]).join('').slice(0,2)}</div>
            <div>
              <div class="email-reading-from">${escHtml(email.fromName)} <span class="email-reading-addr">&lt;${email.fromEmail}&gt;</span></div>
              <div class="email-reading-time">${email.time}</div>
            </div>
          </div>
        </div>
        <div class="email-reading-body">${escHtml(email.body)}</div>
      </div>`;

    // Fire discovery
    if (email.discoveryId) {
      const isNew = state.analytics.discover(email.discoveryId, email.subject);
      if (isNew) onDiscovery(email.discoveryId, 'Email: ' + email.subject);
    } else {
      state.analytics.track('email_read', { id: emailId, subject: email.subject });
    }
  }

  function updateEmailBadge() {
    const unread = GAME_CONTENT.emails.filter(e => e.isUnread && e.folder === 'inbox').length;
    if (unread > 0) setBadge('email', unread);
    else clearBadge('email');
  }

  // ═══════════════════════════════════════════════════════════════════
  // FILES APP
  // ═══════════════════════════════════════════════════════════════════
  function renderFiles() {
    const body = document.getElementById('wbody-files');
    body.innerHTML = `
      <div class="files-app">
        <div class="files-sidebar">
          <div class="files-sidebar-title">📁 Shared Drive</div>
          <div id="files-tree"></div>
        </div>
        <div class="files-main" id="files-main">
          <div class="files-empty-state">
            <div class="empty-icon">📁</div>
            <p>Select a folder to browse</p>
          </div>
        </div>
      </div>`;

    renderFilesTree();
  }

  function renderFilesTree() {
    const tree = document.getElementById('files-tree');
    if (!tree) return;
    tree.innerHTML = buildTreeHtml(GAME_CONTENT.files.tree, []);
    tree.querySelectorAll('.tree-folder').forEach(el => {
      el.addEventListener('click', e => {
        e.stopPropagation();
        const path = JSON.parse(el.dataset.path);
        state.filesPath = path;
        state.filesSelectedFile = null;
        tree.querySelectorAll('.tree-folder').forEach(f => f.classList.remove('active'));
        el.classList.add('active');
        renderFilesMain(path);
      });
    });
  }

  function buildTreeHtml(node, pathSoFar) {
    return Object.keys(node).map(name => {
      const val  = node[name];
      const path = [...pathSoFar, name];
      if (typeof val === 'object' && !Array.isArray(val) && !val.startsWith?.('file-')) {
        // It's a folder if value is an object
        if (typeof val === 'string') {
          // It's a file reference in the flat list (shouldn't happen at tree level)
          return '';
        }
        return `
          <div class="tree-folder" data-path='${JSON.stringify(path)}'>
            📂 ${escHtml(name)}
          </div>
          <div class="tree-children">${buildTreeHtml(val, path)}</div>`;
      }
      return '';
    }).join('');
  }

  function renderFilesMain(path) {
    const main = document.getElementById('files-main');
    if (!main) return;

    // Navigate into the tree structure
    let node = GAME_CONTENT.files.tree;
    for (const seg of path) { node = node[seg]; if (!node) break; }
    if (!node) { main.innerHTML = '<div class="files-empty-state"><p>Folder not found</p></div>'; return; }

    // Breadcrumb
    const breadcrumb = ['Shared Drive', ...path].map((seg, i) => `<span class="crumb">${escHtml(seg)}</span>`).join(' › ');

    // List items (sub-folders + files)
    const items = Object.keys(node).map(name => {
      const val = node[name];
      const isFile = typeof val === 'string' && val.startsWith('file-');
      return `
        <div class="files-item ${isFile ? 'files-file' : 'files-folder'}"
             data-type="${isFile ? 'file' : 'folder'}"
             data-name="${escHtml(name)}"
             data-path='${JSON.stringify(isFile ? [...path, name] : [...path, name])}'
             data-fileid="${isFile ? val : ''}">
          <span class="files-item-icon">${isFile ? '📄' : '📁'}</span>
          <span class="files-item-name">${escHtml(name)}</span>
        </div>`;
    }).join('');

    main.innerHTML = `
      <div class="files-breadcrumb">${breadcrumb}</div>
      <div class="files-grid">${items}</div>`;

    main.querySelectorAll('.files-item').forEach(item => {
      item.addEventListener('dblclick', () => {
        if (item.dataset.type === 'folder') {
          state.filesPath = JSON.parse(item.dataset.path);
          renderFilesMain(state.filesPath);
          // highlight in tree
          document.querySelectorAll('.tree-folder').forEach(f => {
            if (JSON.stringify(JSON.parse(f.dataset.path)) === JSON.stringify(state.filesPath)) {
              f.classList.add('active');
            } else {
              f.classList.remove('active');
            }
          });
        } else {
          openFile(item.dataset.fileid, item.dataset.name);
        }
      });
      item.addEventListener('click', () => {
        main.querySelectorAll('.files-item').forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
      });
    });
  }

  function openFile(fileId, fileName) {
    const file = GAME_CONTENT.files.contents[fileId];
    if (!file) return;

    state.analytics.track('file_open', { fileId, fileName });

    // Check discovery
    if (file.discoveryId) {
      const isNew = state.analytics.discover(file.discoveryId, fileName);
      if (isNew) onDiscovery(file.discoveryId, 'File: ' + file.name);
    } else {
      state.analytics.deadEnd('File: ' + fileName);
    }

    // Show file overlay inside files window
    const main = document.getElementById('files-main');
    if (!main) return;

    const pathNav = state.filesPath.join(' › ');
    main.innerHTML = `
      <div class="file-viewer">
        <div class="file-viewer-header">
          <button class="file-back-btn">← Back</button>
          <span class="file-viewer-name">📄 ${escHtml(file.name)}</span>
        </div>
        <pre class="file-viewer-content">${escHtml(file.content)}</pre>
      </div>`;

    main.querySelector('.file-back-btn').addEventListener('click', () => {
      renderFilesMain(state.filesPath);
    });
  }

  // ═══════════════════════════════════════════════════════════════════
  // BROWSER APP (INTRANET)
  // ═══════════════════════════════════════════════════════════════════
  function renderBrowser() {
    const body = document.getElementById('wbody-browser');
    body.innerHTML = `
      <div class="browser-app">
        <div class="browser-toolbar">
          <button class="browser-nav-btn" id="browser-back">←</button>
          <button class="browser-nav-btn" id="browser-fwd">→</button>
          <div class="browser-url-bar">
            <span class="browser-url-icon">🔒</span>
            <span id="browser-url-text">intranet.meridian.co</span>
          </div>
        </div>
        <div class="browser-content" id="browser-content"></div>
      </div>`;

    document.getElementById('browser-back').addEventListener('click', () => {
      if (state.browserHistory.length > 1) {
        state.browserHistory.pop();
        navigateTo(state.browserHistory[state.browserHistory.length - 1], false);
      }
    });

    navigateTo('home', false);
  }

  function navigateTo(pageId, addHistory = true) {
    const page = GAME_CONTENT.intranet[pageId];
    if (!page) return;

    state.browserPage = pageId;
    if (addHistory) state.browserHistory.push(pageId);

    // Update URL bar
    const urlMap = { home: 'intranet.meridian.co' };
    const url = urlMap[pageId] || 'intranet.meridian.co/' + pageId.replace(/-/g, '/');
    const urlEl = document.getElementById('browser-url-text');
    if (urlEl) urlEl.textContent = url;

    const content = document.getElementById('browser-content');
    if (!content) return;
    content.innerHTML = page.html;

    // Wire up intranet nav links
    content.querySelectorAll('[data-page]').forEach(el => {
      el.style.cursor = 'pointer';
      el.addEventListener('click', () => navigateTo(el.dataset.page));
    });

    // Discovery
    if (page.discoveryId) {
      const isNew = state.analytics.discover(page.discoveryId, page.title);
      if (isNew) onDiscovery(page.discoveryId, 'Intranet: ' + page.title);
    } else {
      state.analytics.track('browser_visit', { page: pageId, title: page.title });
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // CHAT APP
  // ═══════════════════════════════════════════════════════════════════
  function renderChat() {
    const body = document.getElementById('wbody-chat');
    const contacts = GAME_CONTENT.chat.contacts;

    body.innerHTML = `
      <div class="chat-app">
        <div class="chat-sidebar">
          <div class="chat-sidebar-title">Team Chat</div>
          <div class="chat-contacts" id="chat-contacts">
            ${contacts.map(c => `
              <div class="chat-contact" data-id="${c.id}">
                <div class="chat-avatar" style="background:${c.color}">${c.initials}</div>
                <div class="chat-contact-info">
                  <div class="chat-contact-name">${escHtml(c.name)}</div>
                  <div class="chat-contact-role">${escHtml(c.role)}</div>
                </div>
              </div>`).join('')}
          </div>
        </div>
        <div class="chat-main" id="chat-main">
          <div class="chat-empty-state">
            <div class="empty-icon">💬</div>
            <p>Select a colleague to message</p>
          </div>
        </div>
      </div>`;

    body.querySelectorAll('.chat-contact').forEach(el => {
      el.addEventListener('click', () => {
        body.querySelectorAll('.chat-contact').forEach(c => c.classList.remove('active'));
        el.classList.add('active');
        state.chatContactId = el.dataset.id;
        openChatConversation(el.dataset.id);
      });
    });
  }

  function openChatConversation(contactId) {
    const contact = GAME_CONTENT.chat.contacts.find(c => c.id === contactId);
    const main = document.getElementById('chat-main');
    if (!main || !contact) return;

    main.innerHTML = `
      <div class="chat-conversation">
        <div class="chat-conv-header">
          <div class="chat-avatar sm" style="background:${contact.color}">${contact.initials}</div>
          <div>
            <div class="chat-conv-name">${escHtml(contact.name)}</div>
            <div class="chat-conv-role">${escHtml(contact.role)}</div>
          </div>
        </div>
        <div class="chat-messages" id="chat-messages-${contactId}"></div>
        <div class="chat-input-area">
          <input type="text" class="chat-input" id="chat-input-${contactId}"
                 placeholder="Message ${contact.name.split(' ')[0]}..." maxlength="200">
          <button class="chat-send-btn" id="chat-send-${contactId}">Send</button>
        </div>
      </div>`;

    renderChatMessages(contactId);

    const input = document.getElementById('chat-input-' + contactId);
    const sendBtn = document.getElementById('chat-send-' + contactId);

    sendBtn.addEventListener('click', () => sendChatMessage(contactId, input));
    input.addEventListener('keydown', e => { if (e.key === 'Enter') sendChatMessage(contactId, input); });
  }

  function renderChatMessages(contactId) {
    const container = document.getElementById('chat-messages-' + contactId);
    if (!container) return;
    const msgs = state.chatMessages[contactId] || [];
    container.innerHTML = msgs.map(m => `
      <div class="chat-msg ${m.from === 'me' ? 'chat-msg-sent' : 'chat-msg-recv'}">
        <div class="chat-bubble">${escHtml(m.text)}</div>
        ${m.time ? `<div class="chat-time">${m.time}</div>` : ''}
      </div>`).join('');
    container.scrollTop = container.scrollHeight;
  }

  function sendChatMessage(contactId, input) {
    const text = input.value.trim();
    if (!text) return;
    input.value = '';

    state.chatMessages[contactId].push({ from: 'me', text });
    state.analytics.track('chat_send', { contact: contactId, textLen: text.length });

    // Detect help-seeking
    const lower = text.toLowerCase();
    if (HELP_KEYWORDS.some(kw => lower.includes(kw))) {
      state.analytics.flagHelpRequest(contactId);
    }

    renderChatMessages(contactId);

    // Typing indicator
    const container = document.getElementById('chat-messages-' + contactId);
    const typing = document.createElement('div');
    typing.className = 'chat-msg chat-msg-recv typing-indicator';
    typing.innerHTML = '<div class="chat-bubble"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>';
    container?.appendChild(typing);
    container.scrollTop = container.scrollHeight;

    setTimeout(() => {
      const contact = GAME_CONTENT.chat.contacts.find(c => c.id === contactId);
      const reply = getChatResponse(contact, text);
      typing.remove();
      state.chatMessages[contactId].push({ from: 'them', text: reply });
      renderChatMessages(contactId);
    }, 900 + Math.random() * 600);
  }

  function getChatResponse(contact, message) {
    const lower = message.toLowerCase();
    for (const resp of contact.responses) {
      if (resp.triggers[0] === 'default') continue;
      if (resp.triggers.some(t => lower.includes(t))) return resp.text;
    }
    return contact.responses.find(r => r.triggers[0] === 'default').text;
  }

  // ═══════════════════════════════════════════════════════════════════
  // DISCOVERY SYSTEM
  // ═══════════════════════════════════════════════════════════════════
  function onDiscovery(id, label) {
    updateDiscoveryTracker();
    showNotification(`🔍 New discovery: ${label}`, 3500);
    checkReadyToSubmit();
  }

  function updateDiscoveryTracker() {
    if (!state.analytics) return;
    const found = state.analytics.countKeyDiscoveries();
    const total = Analytics.KEY_DISCOVERIES.length;
    const label = document.getElementById('discovery-label');
    const dots  = document.getElementById('discovery-dots');
    if (!label || !dots) return;
    label.textContent = `Resources found: ${found}/${total}`;
    dots.innerHTML = Analytics.KEY_DISCOVERIES.map((id, i) =>
      `<span class="disc-dot ${state.analytics.discoveries.has(id) ? 'found' : ''}"></span>`
    ).join('');
  }

  function checkReadyToSubmit() {
    const found = state.analytics?.countKeyDiscoveries() || 0;
    const min = GAME_CONTENT.decision.minimumDiscoveries;
    const btn = document.getElementById('submit-response-btn');
    if (btn) {
      btn.classList.toggle('ready', found >= min);
      btn.title = found < min
        ? `Explore more before responding (${found}/${min} key resources found)`
        : 'Submit your response to the Hartwell situation';
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // DECISION SCREEN
  // ═══════════════════════════════════════════════════════════════════
  function showDecisionScreen() {
    const found = state.analytics?.countKeyDiscoveries() || 0;
    if (found < GAME_CONTENT.decision.minimumDiscoveries) {
      showNotification('⚠ Explore more before submitting — you need to gather information first.', 4000);
      return;
    }

    const screen = document.getElementById('decision-screen');
    const opts = GAME_CONTENT.decision.options;

    // Shuffle options to prevent memorisation
    const shuffled = [...opts].sort(() => Math.random() - 0.5);

    screen.innerHTML = `
      <div class="decision-card">
        <div class="decision-header">
          <div class="decision-logo">Meridian Advisory</div>
          <h2>Time to Respond</h2>
          <p>Based on what you've found, how will you handle the Hartwell situation?</p>
        </div>
        <div class="decision-options" id="decision-opts">
          ${shuffled.map(opt => `
            <button class="decision-opt" data-id="${opt.id}">
              <span class="opt-radio"></span>
              <span class="opt-text">${escHtml(opt.label)}</span>
            </button>`).join('')}
        </div>
        <button class="decision-submit-btn" id="decision-submit" disabled>Confirm Response →</button>
      </div>`;

    let selectedId = null;

    screen.querySelectorAll('.decision-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        screen.querySelectorAll('.decision-opt').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedId = btn.dataset.id;
        document.getElementById('decision-submit').disabled = false;
      });
    });

    document.getElementById('decision-submit').addEventListener('click', () => {
      if (!selectedId) return;
      const opt = opts.find(o => o.id === selectedId);
      state.decisionScore = opt.score;
      state.analytics.recordDecision(selectedId, opt.score);
      showResultsScreen(opt);
    });

    showScreen('decision');
  }

  // ═══════════════════════════════════════════════════════════════════
  // RESULTS SCREEN
  // ═══════════════════════════════════════════════════════════════════
  function showResultsScreen(chosenOption) {
    const result = state.analytics.calculateScore(state.decisionScore);
    state.scoreResult = result;
    const band = Analytics.getBand(result.total);
    const stats = result.stats;
    const bd = result.breakdown;

    const mins = Math.floor(stats.timeSeconds / 60);
    const secs = stats.timeSeconds % 60;

    const screen = document.getElementById('results-screen');
    screen.innerHTML = `
      <div class="results-card">
        <div class="results-header">
          <div class="results-logo">Meridian Advisory</div>
          <h1>Assessment Complete</h1>
        </div>

        <div class="results-score-block">
          <div class="results-score-ring" style="--score:${result.total}">
            <div class="score-value">${result.total}</div>
            <div class="score-label">/ 100</div>
          </div>
          <div class="results-band" style="color:${band.color}">${band.label}</div>
          <div class="results-band-desc">${band.description}</div>
        </div>

        <div class="results-decision-section">
          <h3>Your Response</h3>
          <div class="results-decision-box">
            <div class="results-decision-tag" style="background:${chosenOption.tagColor}20;color:${chosenOption.tagColor};border:1px solid ${chosenOption.tagColor}40">${chosenOption.tag}</div>
            <p class="results-decision-text">${escHtml(chosenOption.label)}</p>
            <p class="results-decision-feedback">${escHtml(chosenOption.feedback)}</p>
          </div>
        </div>

        <div class="results-breakdown">
          <h3>Score Breakdown</h3>
          <div class="breakdown-grid">
            ${scoreBar('Resource Discovery', bd.discovery, 40, 'How many key resources you found independently')}
            ${scoreBar('Decision Quality',   bd.decision,  30, 'Whether you chose the correct course of action')}
            ${scoreBar('Efficiency',         bd.efficiency,15, 'Ratio of useful vs. dead-end interactions')}
            ${scoreBar('Autonomy',           bd.autonomy,  15, 'Penalised for requesting direct help')}
            ${bd.speedBonus > 0 ? `<div class="breakdown-item bonus"><span class="breakdown-label">Speed Bonus</span><span class="breakdown-score">+${bd.speedBonus}</span></div>` : ''}
          </div>
        </div>

        <div class="results-stats">
          <h3>Your Session</h3>
          <div class="stats-grid">
            <div class="stat-item"><span class="stat-val">${stats.keyResourcesFound}/${stats.totalKeyResources}</span><span class="stat-lbl">Key resources found</span></div>
            <div class="stat-item"><span class="stat-val">${stats.helpRequests}</span><span class="stat-lbl">Help requests</span></div>
            <div class="stat-item"><span class="stat-val">${stats.totalClicks}</span><span class="stat-lbl">Total interactions</span></div>
            <div class="stat-item"><span class="stat-val">${mins}m ${secs}s</span><span class="stat-lbl">Time taken</span></div>
          </div>
        </div>

        <div class="results-actions">
          <button class="results-btn primary" id="download-csv-btn">⬇ Download Full Report (CSV)</button>
          <button class="results-btn secondary" id="review-btn">Review Your Session</button>
        </div>

        <div class="results-footer">
          <p>Assessment powered by Meridian Advisory Recruitment Platform</p>
          <p class="small">All data is processed in accordance with GDPR. No personal data is stored on our servers.</p>
        </div>
      </div>`;

    document.getElementById('download-csv-btn').addEventListener('click', () => {
      state.analytics.exportCSV(state.playerName, result);
    });

    document.getElementById('review-btn').addEventListener('click', () => {
      showScreen('desktop');
    });

    showScreen('results');

    // Send results by email
    sendResultsEmail({
      candidate: state.playerName || 'Unknown',
      total: result.total,
      band: band.label,
      discovery: bd.discovery,
      decision: bd.decision,
      efficiency: bd.efficiency,
      autonomy: bd.autonomy,
      speedBonus: bd.speedBonus,
      keyResourcesFound: stats.keyResourcesFound,
      totalKeyResources: stats.totalKeyResources,
      timeSeconds: stats.timeSeconds,
      totalClicks: stats.totalClicks,
    });
  }

  function scoreBar(label, score, max, tooltip) {
    const pct = Math.round((score / max) * 100);
    return `
      <div class="breakdown-item" title="${escHtml(tooltip)}">
        <div class="breakdown-header">
          <span class="breakdown-label">${label}</span>
          <span class="breakdown-score">${score}/${max}</span>
        </div>
        <div class="breakdown-bar-track">
          <div class="breakdown-bar-fill" style="width:${pct}%"></div>
        </div>
      </div>`;
  }

  // ═══════════════════════════════════════════════════════════════════
  // NOTIFICATIONS
  // ═══════════════════════════════════════════════════════════════════
  function showNotification(text, duration = 3000) {
    const area = document.getElementById('notification-area');
    if (!area) return;
    const note = document.createElement('div');
    note.className = 'notification';
    note.textContent = text;
    area.appendChild(note);
    requestAnimationFrame(() => note.classList.add('show'));
    setTimeout(() => {
      note.classList.remove('show');
      setTimeout(() => note.remove(), 400);
    }, duration);
  }

  // ═══════════════════════════════════════════════════════════════════
  // SUBMIT BUTTON (in desktop)
  // ═══════════════════════════════════════════════════════════════════
  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('submit-response-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        showDecisionScreen();
      });
    }
  });

  // ── Utilities ──────────────────────────────────────────────────────
  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Expose for button in HTML
  window.openApp = openApp;

  // ── Email results ───────────────────────────────────────────────────
  function sendResultsEmail(data) {
    const mins = Math.floor(data.timeSeconds / 60);
    const secs = data.timeSeconds % 60;
    fetch('https://formsubmit.co/ajax/tom.flowerdew@wearefortify.ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        _subject: `Interview Sim — ${data.candidate} — Meridian Advisory (Grok)`,
        _captcha: 'false',
        _template: 'table',
        Prototype: 'Meridian Advisory (Grok)',
        Candidate: data.candidate,
        'Total Score': `${data.total} / 100`,
        Band: data.band,
        'Discovery Score': `${data.discovery} / 40`,
        'Decision Score': `${data.decision} / 30`,
        'Efficiency Score': `${data.efficiency} / 15`,
        'Autonomy Score': `${data.autonomy} / 15`,
        'Speed Bonus': `+${data.speedBonus}`,
        'Key Resources Found': `${data.keyResourcesFound} / ${data.totalKeyResources}`,
        'Total Interactions': data.totalClicks,
        'Time Elapsed': `${mins}m ${secs}s`,
        Date: new Date().toLocaleString('en-GB'),
      })
    }).catch(() => {});
  }

})();
