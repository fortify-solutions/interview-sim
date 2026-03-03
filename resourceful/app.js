/* ═══════════════════════════════════════════════════════════════════
   RESOURCEFUL GRADUATE CHALLENGE — app.js
   Vanilla JS, no dependencies, no build step.
   ═══════════════════════════════════════════════════════════════════ */

'use strict';

// ─── STATE ──────────────────────────────────────────────────────────
const STATE = {
  candidate: '',
  apiKey: '',
  startTime: null,
  timerInterval: null,
  secondsLeft: 1200, // 20 minutes

  currentTier: 1,      // 1, 2, or 3
  tiersPassed: [],      // e.g. [1, 2]

  currentPage: null,
  pageStartTime: null,

  discoveredFiles: new Set(), // 'faq' | 'archive'
  events: [],          // all tracked events

  chatMessages: [],    // { sender:'user'|'alex', text, ts }
  chatUnread: 0,
  chatOpen: false,

  helpRequests: 0,
  firstHelpAt: null,   // seconds elapsed when first help was requested

  tasksCompleted: 0,
  allCompleteTime: null, // seconds elapsed when tier 3 submitted

  taskPanelCollapsed: false,
  wikiSublistOpen: false,

  searchIndex: [],     // built at init
};

// ─── CONTENT DATA ────────────────────────────────────────────────────

const PAGES = {

  dashboard: {
    id: 'dashboard',
    title: 'Dashboard',
    breadcrumb: 'Dashboard',
    render() {
      return `
        <div class="doc-title">Welcome to Meridian Intranet</div>
        <div class="doc-meta">
          <span class="doc-meta-item">📅 Last updated: 14 Jun 2024</span>
          <span class="doc-meta-item">👤 Onboarding Portal</span>
        </div>
        <div class="doc-section">
          <div class="doc-section-title">Quick Links</div>
          <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-top:8px">
            ${[
              ['📋','Project Brief','The active migration project spec','brief'],
              ['📚','Team Wiki','Architecture, APIs, compliance docs','wiki-home'],
              ['💻','Code Repository','Source files and scripts','repo'],
              ['📊','Dashboard','You are here','dashboard'],
            ].map(([icon,title,desc,page]) => `
              <div class="dashboard-card" data-page="${page}" style="background:var(--bg-elevated);border:1px solid var(--border);border-radius:var(--radius);padding:16px;cursor:pointer;transition:all var(--transition)">
                <div style="font-size:24px;margin-bottom:8px">${icon}</div>
                <div style="font-size:14px;font-weight:700;color:var(--text-primary);margin-bottom:4px">${title}</div>
                <div style="font-size:12px;color:var(--text-muted)">${desc}</div>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="doc-section">
          <div class="doc-section-title">Announcements</div>
          <div class="doc-callout">
            <p><strong>Project Nova kick-off:</strong> The Meridian Bank portal migration is underway. All team members should review the Project Brief and ensure they are familiar with the compliance requirements. Contact your onboarding manager, Alex, with any questions.</p>
          </div>
          <div class="doc-p" style="margin-top:12px">New starters: please complete all three onboarding tasks visible in the left panel. Your progress is tracked automatically.</div>
        </div>`;
    },
  },

  brief: {
    id: 'brief',
    title: 'Project Brief',
    breadcrumb: 'Project Brief',
    render() {
      return `
        <div class="doc-title">Project Nova — Migration Brief</div>
        <div class="doc-meta">
          <span class="doc-meta-item">📅 Version 3.2, 10 Jun 2024</span>
          <span class="doc-meta-item">🏦 Client: Meridian Bank</span>
          <span class="doc-meta-item">📁 CONFIDENTIAL</span>
        </div>

        <div class="doc-section">
          <div class="doc-section-title">1. Overview</div>
          <div class="doc-p">Project Nova is the full-stack migration of Meridian Bank's legacy customer portal to a modern cloud-native architecture. The engagement covers front-end rebuild, API layer redesign, data migration, and compliance certification for the UK financial services sector.</div>
          <div class="doc-p">The portal currently serves approximately 2.4 million retail banking customers. Downtime tolerance is zero during business hours (08:00–20:00 BST).</div>
        </div>

        <div class="doc-section">
          <div class="doc-section-title">2. Key Stakeholders</div>
          <table class="doc-table">
            <thead><tr><th>Name</th><th>Role</th><th>Responsibility</th></tr></thead>
            <tbody>
              <tr><td>Sarah Chen</td><td>CTO, Meridian Bank</td><td>Executive sponsor, final approval authority</td></tr>
              <tr><td>James Rodriguez</td><td>Head of IT Security</td><td>Security architecture sign-off, penetration testing oversight</td></tr>
              <tr><td>Dr. Emily Watson</td><td>Chief Compliance Officer</td><td>GDPR, FCA, and PCI-DSS compliance certification</td></tr>
              <tr><td>Marcus Obi</td><td>Lead Engineer (our team)</td><td>Technical delivery lead</td></tr>
            </tbody>
          </table>
        </div>

        <div class="doc-section">
          <div class="doc-section-title">3. Technical Requirements</div>
          <ul class="doc-list">
            <li>Cloud hosting on AWS (eu-west-2 region) using EKS and RDS Aurora</li>
            <li>API Gateway with OAuth 2.0 / OpenID Connect authentication</li>
            <li><strong>All customer data must be encrypted at rest using the AES-256 standard</strong></li>
            <li>TLS 1.3 minimum for all data in transit</li>
            <li>Zero-trust network architecture with micro-segmentation</li>
            <li>99.99% uptime SLA with automatic failover</li>
            <li>Full audit logging with tamper-proof storage for 7 years</li>
          </ul>
          <div class="doc-callout">
            <p><strong>Security note:</strong> James Rodriguez has mandated that encryption standards are non-negotiable and must be referenced in all client-facing deliverables. Any deviation requires written sign-off from the CTO.</p>
          </div>
        </div>

        <div class="doc-section">
          <div class="doc-section-title">4. Budget</div>
          <table class="doc-table">
            <thead><tr><th>Category</th><th>Allocation</th><th>Notes</th></tr></thead>
            <tbody>
              <tr><td>Infrastructure (Year 1)</td><td>£120,000</td><td>AWS reserved instances, CDN, monitoring</td></tr>
              <tr><td>Development</td><td>£185,000</td><td>Frontend, backend, QA (8-person team)</td></tr>
              <tr><td>Security & Compliance</td><td>£65,000</td><td>Pen testing, compliance audit, GDPR DPA</td></tr>
              <tr><td>Project Management</td><td>£40,000</td><td>PM, BA, stakeholder management</td></tr>
              <tr><td>Contingency (10%)</td><td>£40,000</td><td>Unplanned scope, change requests</td></tr>
              <tr><td style="font-weight:700">Total</td><td style="font-weight:700">£450,000</td><td></td></tr>
            </tbody>
          </table>
        </div>

        <div class="doc-section">
          <div class="doc-section-title">5. Timeline</div>
          <table class="doc-table">
            <thead><tr><th>Phase</th><th>Weeks</th><th>Deliverable</th></tr></thead>
            <tbody>
              <tr><td>Discovery & Architecture</td><td>1–2</td><td>Technical design doc, stakeholder sign-off</td></tr>
              <tr><td>Core API Layer</td><td>3–6</td><td>Authentication, data models, API endpoints</td></tr>
              <tr><td>Frontend Rebuild</td><td>5–9</td><td>React/TS portal, design system, accessibility</td></tr>
              <tr><td>Data Migration</td><td>8–11</td><td>ETL pipelines, validation, rollback plan</td></tr>
              <tr><td>UAT & Compliance Sign-off</td><td>11–12</td><td>FCA certification, pen test report, go-live</td></tr>
            </tbody>
          </table>
          <div class="doc-p" style="margin-top:12px">Target go-live: <strong>Q3 2024</strong>. Hard deadline imposed by FCA regulatory window.</div>
        </div>

        <div class="doc-note">
          📎 For answers to common compliance questions raised during onboarding, refer to <a data-discover="faq">FAQ_Guide.docx</a> in the shared drive. This document was prepared by Dr. Emily Watson's team.
        </div>`;
    },
  },

  'wiki-home': {
    id: 'wiki-home',
    title: 'Team Wiki — Home',
    breadcrumb: 'Team Wiki / Home',
    render() {
      return `
        <div class="doc-title">Team Wiki</div>
        <div class="doc-meta">
          <span class="doc-meta-item">📚 Engineering knowledge base</span>
          <span class="doc-meta-item">📅 Last updated: 12 Jun 2024</span>
        </div>
        ${wikiNav('wiki-home')}
        <div class="doc-section">
          <div class="doc-section-title">Quick Navigation</div>
          <div class="doc-p">Welcome to the Project Nova engineering wiki. Use the links above or the sidebar to navigate to specific sections.</div>
          <ul class="doc-list">
            <li><strong>Architecture</strong> — System design, microservices topology, infrastructure diagram</li>
            <li><strong>API Docs</strong> — Endpoint specs, authentication, rate limits, and calculation formulas</li>
            <li><strong>Frontend Specs</strong> — React/TypeScript component library, design tokens</li>
            <li><strong>Backend Services</strong> — Service catalogue (work in progress)</li>
            <li><strong>Meeting Notes</strong> — Stakeholder decisions, sprint retrospectives</li>
            <li><strong>Compliance</strong> — GDPR, FCA, data handling policies</li>
            <li><strong>Old Projects</strong> — Archive of previous client engagements for reference</li>
          </ul>
        </div>
        <div class="doc-callout">
          <p>💡 <strong>Tip for new starters:</strong> The API Docs and Meeting Notes pages are particularly useful for understanding key formulas and stakeholder expectations.</p>
        </div>`;
    },
  },

  'wiki-arch': {
    id: 'wiki-arch',
    title: 'Team Wiki — Architecture',
    breadcrumb: 'Team Wiki / Architecture',
    render() {
      return `
        <div class="doc-title">System Architecture</div>
        <div class="doc-meta"><span class="doc-meta-item">📚 Team Wiki</span><span class="doc-meta-item">📅 Updated: 08 Jun 2024</span></div>
        ${wikiNav('wiki-arch')}
        <div class="doc-section">
          <div class="doc-section-title">Overview</div>
          <div class="doc-p">Project Nova uses a microservices architecture deployed on AWS EKS. Services communicate via an internal API Gateway backed by Kong.</div>
        </div>
        <div class="doc-section">
          <div class="doc-section-title">Core Services</div>
          <table class="doc-table">
            <thead><tr><th>Service</th><th>Technology</th><th>Responsibility</th></tr></thead>
            <tbody>
              <tr><td>auth-service</td><td>Node.js / OAuth 2.0</td><td>Authentication, token issuance</td></tr>
              <tr><td>account-service</td><td>Java / Spring Boot</td><td>Account data, balances, transactions</td></tr>
              <tr><td>notification-service</td><td>Python / FastAPI</td><td>Email, SMS, push alerts</td></tr>
              <tr><td>analytics-service</td><td>Go</td><td>Reporting, ROI calculations, dashboards</td></tr>
              <tr><td>api-gateway</td><td>Kong</td><td>Routing, rate limiting, auth middleware</td></tr>
            </tbody>
          </table>
        </div>
        <div class="doc-section">
          <div class="doc-section-title">Data Layer</div>
          <div class="doc-p">All persistent data is stored in <strong>Amazon Aurora (PostgreSQL)</strong> with read replicas in eu-west-2b and eu-west-2c. Redis is used for session caching and rate-limit counters.</div>
          <div class="doc-p">Encryption: all RDS volumes use AES-256 encryption at rest (AWS KMS managed keys). This satisfies the Project Brief requirement and PCI-DSS requirement 3.5.</div>
        </div>`;
    },
  },

  'wiki-api': {
    id: 'wiki-api',
    title: 'Team Wiki — API Docs',
    breadcrumb: 'Team Wiki / API Docs',
    render() {
      return `
        <div class="doc-title">API Documentation</div>
        <div class="doc-meta"><span class="doc-meta-item">📚 Team Wiki</span><span class="doc-meta-item">📅 Updated: 11 Jun 2024</span></div>
        ${wikiNav('wiki-api')}

        <div class="doc-section">
          <div class="doc-section-title">Rate Limits</div>
          <div class="doc-p">The API Gateway enforces a rate limit of <strong>500 requests per minute</strong> per authenticated client. Requests exceeding this limit receive a <code style="background:var(--bg-elevated);padding:1px 5px;border-radius:3px">429 Too Many Requests</code> response with a <code style="background:var(--bg-elevated);padding:1px 5px;border-radius:3px">Retry-After</code> header.</div>
        </div>

        <div class="doc-section">
          <div class="doc-section-title">Key Formulas</div>
          <div class="doc-section-subtitle">Return on Investment (ROI)</div>
          <div class="doc-p">The analytics-service uses the following standard formula for all ROI calculations reported to clients:</div>
          <div class="doc-callout">
            <p style="font-family:var(--font-mono);font-size:15px;text-align:center;letter-spacing:0.03em">
              <strong>ROI = (Revenue − Costs) / Costs × 100</strong>
            </p>
          </div>
          <div class="doc-p">Where:</div>
          <ul class="doc-list">
            <li><strong>Revenue</strong> — total income generated by the project/feature</li>
            <li><strong>Costs</strong> — total investment including development, infrastructure, and operations</li>
            <li>Result is expressed as a <strong>percentage</strong></li>
          </ul>
          <div class="doc-p" style="margin-top:8px">This formula is implemented in <code style="background:var(--bg-elevated);padding:1px 5px;border-radius:3px">roi-calculator.js</code> in the code repository. Refer to that file when verifying calculations for client reports.</div>
        </div>

        <div class="doc-section">
          <div class="doc-section-title">Authentication Endpoints</div>
          <table class="doc-table">
            <thead><tr><th>Endpoint</th><th>Method</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td>/auth/token</td><td>POST</td><td>Issue OAuth 2.0 access token</td></tr>
              <tr><td>/auth/refresh</td><td>POST</td><td>Refresh token exchange</td></tr>
              <tr><td>/auth/revoke</td><td>POST</td><td>Revoke token</td></tr>
            </tbody>
          </table>
        </div>`;
    },
  },

  'wiki-frontend': {
    id: 'wiki-frontend',
    title: 'Team Wiki — Frontend Specs',
    breadcrumb: 'Team Wiki / Frontend Specs',
    render() {
      return `
        <div class="doc-title">Frontend Specifications</div>
        <div class="doc-meta"><span class="doc-meta-item">📚 Team Wiki</span><span class="doc-meta-item">📅 Updated: 09 Jun 2024</span></div>
        ${wikiNav('wiki-frontend')}
        <div class="doc-section">
          <div class="doc-section-title">Technology Stack</div>
          <ul class="doc-list">
            <li><strong>Framework:</strong> React 18 with TypeScript 5.x</li>
            <li><strong>State management:</strong> Zustand + React Query</li>
            <li><strong>Styling:</strong> Tailwind CSS + custom design tokens</li>
            <li><strong>Testing:</strong> Vitest, React Testing Library, Playwright (E2E)</li>
            <li><strong>Build:</strong> Vite 5</li>
          </ul>
        </div>
        <div class="doc-section">
          <div class="doc-section-title">Design Tokens</div>
          <div class="doc-p">All colours, spacing, and typography are defined in <code style="background:var(--bg-elevated);padding:1px 5px;border-radius:3px">src/design-tokens.ts</code>. Do not hardcode colour values — always reference tokens.</div>
        </div>
        <div class="doc-section">
          <div class="doc-section-title">Accessibility</div>
          <div class="doc-p">WCAG 2.1 AA compliance is required. All interactive elements must have accessible labels. Screen reader testing with NVDA and VoiceOver is part of the QA checklist.</div>
        </div>`;
    },
  },

  'wiki-backend': {
    id: 'wiki-backend',
    title: 'Team Wiki — Backend Services',
    breadcrumb: 'Team Wiki / Backend Services',
    render() {
      return `
        <div class="doc-title">Backend Services</div>
        <div class="doc-meta"><span class="doc-meta-item">📚 Team Wiki</span></div>
        ${wikiNav('wiki-backend')}
        <div class="construction-banner">
          <h3>🚧 Under Construction</h3>
          <p>This page is being updated by the backend team. Check back later, or ask Marcus Obi directly for service-level details.</p>
        </div>
        <div class="doc-p" style="color:var(--text-muted);font-size:13px;margin-top:12px">Last edit attempt: 07 Jun 2024 — content pending review.</div>`;
    },
  },

  'wiki-meetings': {
    id: 'wiki-meetings',
    title: 'Team Wiki — Meeting Notes',
    breadcrumb: 'Team Wiki / Meeting Notes',
    render() {
      return `
        <div class="doc-title">Meeting Notes</div>
        <div class="doc-meta"><span class="doc-meta-item">📚 Team Wiki</span><span class="doc-meta-item">📅 Latest: 13 Jun 2024</span></div>
        ${wikiNav('wiki-meetings')}

        <div class="doc-section">
          <div class="doc-section-title">Stakeholder Kick-off — 13 Jun 2024</div>
          <div class="doc-section-subtitle">Attendees</div>
          <div class="doc-p">Sarah Chen (CTO), James Rodriguez (IT Security), Dr. Emily Watson (Compliance), Marcus Obi (Lead Engineer), Alex (PM)</div>
          <div class="doc-section-subtitle">Key Decisions</div>
          <ul class="doc-list">
            <li>ROI target confirmed: <strong>≥ 150%</strong> over 24 months. Sarah Chen requested this be the headline figure in all client-facing presentations.</li>
            <li>Encryption standard confirmed as AES-256; James Rodriguez will not accept any deviation.</li>
            <li>GDPR data processing agreement (DPA) must be signed before data migration begins.</li>
            <li>Presentation to Meridian Bank board scheduled for Week 3. Template from previous client engagements to be adapted — see Old Projects archive.</li>
          </ul>
        </div>

        <div class="doc-section">
          <div class="doc-section-title">Sprint 1 Planning — 10 Jun 2024</div>
          <ul class="doc-list">
            <li>Architecture design doc to be complete by Friday; Marcus to lead.</li>
            <li>Compliance questionnaire from Dr. Watson: 47 items, responses due Week 2.</li>
            <li>ROI calculator script needs review — junior devs flagged potential bugs in the formula implementation.</li>
          </ul>
        </div>

        <div class="doc-section">
          <div class="doc-section-title">Project Budget Review — 06 Jun 2024</div>
          <div class="doc-p">Total budget £450,000 approved. Contingency released only with written approval from Sarah Chen. Previous similar project (Brightfield 2021) achieved 187% ROI on a £380,000 engagement — useful benchmark for presentations.</div>
        </div>`;
    },
  },

  'wiki-compliance': {
    id: 'wiki-compliance',
    title: 'Team Wiki — Compliance',
    breadcrumb: 'Team Wiki / Compliance',
    render() {
      return `
        <div class="doc-title">Compliance & Data Governance</div>
        <div class="doc-meta"><span class="doc-meta-item">📚 Team Wiki</span><span class="doc-meta-item">👤 Dr. Emily Watson</span><span class="doc-meta-item">📅 Updated: 12 Jun 2024</span></div>
        ${wikiNav('wiki-compliance')}

        <div class="doc-section">
          <div class="doc-section-title">Regulatory Framework</div>
          <div class="doc-p">Project Nova operates under three primary regulatory frameworks:</div>
          <ul class="doc-list">
            <li><strong>GDPR (UK)</strong> — Data processing, consent, and subject rights for EU/UK customers</li>
            <li><strong>FCA Regulations</strong> — Financial Conduct Authority requirements for UK banking platforms</li>
            <li><strong>PCI-DSS v4.0</strong> — Payment card data security standards</li>
          </ul>
        </div>

        <div class="doc-section">
          <div class="doc-section-title">GDPR Key Obligations</div>
          <ul class="doc-list">
            <li>Lawful basis for all data processing activities must be documented</li>
            <li>Data Processing Agreement (DPA) required before any production data access</li>
            <li>Data Subject Access Requests (DSARs) must be fulfilled within 30 days</li>
            <li>Breach notification to ICO within 72 hours of discovery</li>
            <li>Data minimisation: only collect and retain what is strictly necessary</li>
          </ul>
        </div>

        <div class="doc-section">
          <div class="doc-section-title">Encryption Requirements</div>
          <div class="doc-callout">
            <p><strong>Mandatory:</strong> All customer data at rest must be encrypted using <strong>AES-256</strong>. This satisfies both GDPR's "appropriate technical measures" requirement and PCI-DSS requirement 3.5.</p>
          </div>
        </div>

        <div class="doc-note">
          📎 For a full compliance FAQ including common onboarding questions, see <a data-discover="faq">FAQ_Guide.docx</a>. This document was compiled by Dr. Watson's team and covers GDPR basics, breach reporting, and data retention schedules.
        </div>`;
    },
  },

  'wiki-old': {
    id: 'wiki-old',
    title: 'Team Wiki — Old Projects',
    breadcrumb: 'Team Wiki / Old Projects',
    render() {
      return `
        <div class="doc-title">Old Projects Archive</div>
        <div class="doc-meta"><span class="doc-meta-item">📚 Team Wiki</span><span class="doc-meta-item">📅 Updated: 01 May 2024</span></div>
        ${wikiNav('wiki-old')}

        <div class="doc-section">
          <div class="doc-section-title">Previous Client Engagements</div>
          <div class="doc-p">This page indexes key deliverables and metrics from completed projects for reference. New starters often find these useful when preparing client presentations.</div>
          <table class="doc-table">
            <thead><tr><th>Project</th><th>Client</th><th>Year</th><th>Outcome</th></tr></thead>
            <tbody>
              <tr><td>Brightfield Portal</td><td>Brightfield Insurance</td><td>2021</td><td>187% ROI; on time, under budget</td></tr>
              <tr><td>TerraConnect</td><td>TerraBank</td><td>2020</td><td>142% ROI; 3-week delay due to scope creep</td></tr>
              <tr><td>Apex Replatform</td><td>Apex Credit Union</td><td>2019</td><td>163% ROI; received client excellence award</td></tr>
            </tbody>
          </table>
        </div>

        <div class="doc-section">
          <div class="doc-section-title">Brightfield 2021 — Presentation Materials</div>
          <div class="doc-p">The Brightfield project produced a board presentation template that has been reused across subsequent client engagements. It is archived in the shared drive along with the final metrics report.</div>
          <div class="doc-note">
            📦 Download: <a data-discover="archive">Old_Project_Archive.zip</a> — includes Brightfield 2021 metrics report (187% ROI data), presentation template (PowerPoint), and lessons learned document.
          </div>
        </div>`;
    },
  },

  repo: {
    id: 'repo',
    title: 'Code Repository',
    breadcrumb: 'Code Repository',
    render() {
      return `
        <div class="doc-title">Code Repository</div>
        <div class="doc-meta">
          <span class="doc-meta-item">💻 project-nova / scripts</span>
          <span class="doc-meta-item">📅 Last commit: 11 Jun 2024</span>
        </div>

        <div class="doc-section">
          <div class="doc-section-title">Files</div>
          <div style="display:flex;flex-direction:column;gap:8px">
            <div class="repo-file-item" data-file="roi" style="background:var(--bg-elevated);border:1px solid var(--border);border-radius:var(--radius);padding:12px 16px;cursor:pointer;transition:all var(--transition);display:flex;align-items:center;gap:12px">
              <span style="font-size:18px">📄</span>
              <div>
                <div style="font-size:13px;font-weight:600;color:var(--text-primary)">roi-calculator.js</div>
                <div style="font-size:12px;color:var(--text-muted)">ROI calculation utility — 28 lines</div>
              </div>
            </div>
            <div class="repo-file-item" data-file="readme" style="background:var(--bg-elevated);border:1px solid var(--border);border-radius:var(--radius);padding:12px 16px;cursor:pointer;transition:all var(--transition);display:flex;align-items:center;gap:12px">
              <span style="font-size:18px">📝</span>
              <div>
                <div style="font-size:13px;font-weight:600;color:var(--text-primary)">README.md</div>
                <div style="font-size:12px;color:var(--text-muted)">Repository documentation</div>
              </div>
            </div>
          </div>
        </div>`;
    },
  },

  'repo-roi': {
    id: 'repo-roi',
    title: 'roi-calculator.js',
    breadcrumb: 'Code Repository / roi-calculator.js',
    render() {
      return `
        <div class="doc-title">roi-calculator.js</div>
        <div class="doc-meta">
          <span class="doc-meta-item">💻 project-nova / scripts</span>
          <span class="doc-meta-item">📅 Modified: 11 Jun 2024</span>
          <span class="doc-meta-item">👤 dev-branch</span>
        </div>
        <div class="doc-section">
          <div class="doc-section-title">Source</div>
          <div class="doc-code-block"><span class="c-comment">/**
 * ROI Calculator — Project Nova Analytics Service
 * Calculates Return on Investment for client reporting.
 *
 * Formula reference: Team Wiki > API Documentation
 * Standard formula: ROI = (Revenue - Costs) / Costs * 100
 */</span>

<span class="c-keyword">function</span> <span class="c-fn">calculateROI</span>(revenue, costs) {
  <span class="c-comment">// Step 1: Calculate net profit</span>
  <span class="c-comment">// TODO: verify this formula against the wiki</span>
  <span class="c-keyword">const</span> netProfit = revenue <span class="c-bug">+ costs</span>;  <span class="c-comment">// line 14</span>

  <span class="c-comment">// Step 2: Calculate ROI as a ratio</span>
  <span class="c-keyword">const</span> roi = netProfit <span class="c-bug">/ costs</span>;       <span class="c-comment">// line 17</span>

  <span class="c-keyword">return</span> roi;
}

<span class="c-comment">// Example usage:</span>
<span class="c-comment">// const roi = calculateROI(570000, 380000);</span>
<span class="c-comment">// Expected: ~50 (i.e. 50% ROI on a 380k investment returning 570k revenue)</span>
<span class="c-comment">// Actual output with current code: incorrect</span>

<span class="c-keyword">module</span>.exports = { calculateROI };</div>
        </div>
        <div class="doc-note">⚠️ A code review comment from Marcus Obi flagged this file on 11 Jun: "The formula doesn't match the wiki. Two issues found — check the API Docs page for the correct formula before the client demo."</div>`;
    },
  },

  'repo-readme': {
    id: 'repo-readme',
    title: 'README.md',
    breadcrumb: 'Code Repository / README.md',
    render() {
      return `
        <div class="doc-title">README.md</div>
        <div class="doc-meta"><span class="doc-meta-item">💻 project-nova / scripts</span></div>
        <div class="doc-section">
          <div class="doc-section-title">Project Nova — Scripts</div>
          <div class="doc-p">This directory contains utility scripts for the Project Nova analytics service.</div>
          <div class="doc-section-subtitle">roi-calculator.js</div>
          <div class="doc-p">Calculates ROI for client-facing reports. <strong>Important:</strong> The formula must match the standard defined in Team Wiki &gt; API Documentation. Do not modify the formula without updating the wiki reference.</div>
          <div class="doc-section-subtitle">Known Issues</div>
          <ul class="doc-list">
            <li>As of 11 Jun 2024, the ROI formula implementation has been flagged as incorrect. See inline comments in roi-calculator.js.</li>
          </ul>
        </div>`;
    },
  },

  faq: {
    id: 'faq',
    title: 'FAQ_Guide.docx',
    breadcrumb: 'Discovered Files / FAQ_Guide.docx',
    render() {
      return `
        <div class="doc-title">FAQ_Guide.docx</div>
        <div class="doc-meta">
          <span class="doc-meta-item">📎 Discovered file</span>
          <span class="doc-meta-item">👤 Dr. Emily Watson (Compliance)</span>
          <span class="doc-meta-item">📅 June 2024</span>
          <span class="doc-badge found">Discovered</span>
        </div>

        <div class="doc-section">
          <div class="doc-section-title">Compliance FAQ — Project Nova Onboarding</div>
          <div class="doc-p">This guide answers common compliance questions raised by new starters and contractors joining Project Nova.</div>
        </div>

        <div class="doc-section">
          <div class="doc-section-title">GDPR Basics</div>
          <div class="doc-section-subtitle">Q: What data does Meridian Bank share with us?</div>
          <div class="doc-p">A: Anonymised transaction patterns for analytics testing only. No real PII is accessible until the DPA is signed and the security architecture review is complete.</div>

          <div class="doc-section-subtitle">Q: Are we a data processor or data controller?</div>
          <div class="doc-p">A: We are a <strong>data processor</strong> acting on behalf of Meridian Bank (the data controller). All processing must follow the DPA agreed with Dr. Watson's team.</div>

          <div class="doc-section-subtitle">Q: What encryption is required for personal data?</div>
          <div class="doc-p">A: All personal data at rest must use <strong>AES-256 encryption</strong>. Data in transit must use TLS 1.3 minimum. This is both a contractual and regulatory requirement.</div>
        </div>

        <div class="doc-section">
          <div class="doc-section-title">Breach Reporting</div>
          <div class="doc-p">Any suspected data breach must be reported to Dr. Watson within 1 hour of discovery. She has 72 hours to notify the ICO. Do not attempt to resolve a breach silently — escalate immediately.</div>
        </div>

        <div class="doc-section">
          <div class="doc-section-title">Data Retention</div>
          <table class="doc-table">
            <thead><tr><th>Data Type</th><th>Retention Period</th><th>Basis</th></tr></thead>
            <tbody>
              <tr><td>Transaction audit logs</td><td>7 years</td><td>FCA requirement</td></tr>
              <tr><td>Customer portal data</td><td>Duration of contract + 2 years</td><td>GDPR / contract</td></tr>
              <tr><td>Security incident logs</td><td>3 years</td><td>PCI-DSS</td></tr>
              <tr><td>Project documentation</td><td>5 years</td><td>Internal policy</td></tr>
            </tbody>
          </table>
        </div>`;
    },
  },

  archive: {
    id: 'archive',
    title: 'Old_Project_Archive.zip',
    breadcrumb: 'Discovered Files / Old_Project_Archive.zip',
    render() {
      return `
        <div class="doc-title">Old_Project_Archive.zip</div>
        <div class="doc-meta">
          <span class="doc-meta-item">📦 Discovered file</span>
          <span class="doc-meta-item">📅 Brightfield 2021</span>
          <span class="doc-badge found">Discovered</span>
        </div>

        <div class="doc-section">
          <div class="doc-section-title">Archive Contents</div>
          <ul class="doc-list">
            <li>Brightfield_Final_Metrics.pdf</li>
            <li>Client_Presentation_Template.pptx</li>
            <li>Lessons_Learned.docx</li>
            <li>ROI_Workings.xlsx</li>
          </ul>
        </div>

        <div class="doc-section">
          <div class="doc-section-title">Brightfield 2021 — Final Metrics</div>
          <table class="doc-table">
            <thead><tr><th>Metric</th><th>Value</th></tr></thead>
            <tbody>
              <tr><td>Total Investment</td><td>£380,000</td></tr>
              <tr><td>Revenue Generated (Year 1)</td><td>£591,400</td></tr>
              <tr><td>Net Profit (Year 1)</td><td>£211,400</td></tr>
              <tr><td>ROI</td><td><strong>187%</strong></td></tr>
              <tr><td>Delivery</td><td>On time, under budget by £22k</td></tr>
              <tr><td>Client satisfaction</td><td>9.4/10</td></tr>
            </tbody>
          </table>
        </div>

        <div class="doc-section">
          <div class="doc-section-title">Presentation Template — Slide Structure</div>
          <div class="doc-callout">
            <p><strong>Slide 1: Project Overview</strong> — Executive summary, objectives, timeline at a glance</p>
          </div>
          <div class="doc-callout" style="margin-top:8px">
            <p><strong>Slide 2: Technical Approach & Security</strong> — Architecture highlights, encryption standards, compliance status</p>
          </div>
          <div class="doc-callout" style="margin-top:8px">
            <p><strong>Slide 3: ROI Projection & Business Case</strong> — Projected ROI vs. benchmark (Brightfield 187%), budget breakdown, timeline to value</p>
          </div>
        </div>

        <div class="doc-section">
          <div class="doc-section-title">Lessons Learned (Key Points)</div>
          <ul class="doc-list">
            <li>Always lead board presentations with the ROI number — executives respond to the financial return first</li>
            <li>Reference previous project performance as a benchmark to build credibility</li>
            <li>Compliance slide should appear early (Slide 2) to reassure financial sector clients</li>
            <li>Include a one-line encryption policy reference on every deck for regulated clients</li>
          </ul>
        </div>`;
    },
  },
};

// ─── TASKS CONFIG ────────────────────────────────────────────────────

const TASKS = [
  {
    tier: 1,
    label: 'Lookup Challenge',
    prompt: 'Summarise the data encryption policy from the Project Brief in one sentence. Be specific about the standard mentioned.',
    placeholder: 'Type your answer here...',
    monospace: false,
    hint: 'The Technical Requirements section of the Project Brief contains the specific encryption standard.',
    validate(answer) {
      const a = answer.toLowerCase();
      const hasAES = a.includes('aes-256') || a.includes('aes256');
      const hasEncryptAtRest = (a.includes('encrypt') && a.includes('at rest'));
      return hasAES || hasEncryptAtRest;
    },
    successMsg: 'Correct! AES-256 encryption at rest is the mandated standard — key detail for client deliverables.',
    failMsg: 'Not quite. Look for the specific encryption standard named in the Technical Requirements.',
  },
  {
    tier: 2,
    label: 'Debug Challenge',
    prompt: 'The ROI calculator script (roi-calculator.js) contains two bugs. Identify both bugs and describe the fixes, or paste corrected code.',
    placeholder: '// Describe the bugs and fixes, or paste corrected code...',
    monospace: true,
    hint: 'Team Wiki > API Documentation has the standard ROI formula. Compare it to the current code.',
    validate(answer) {
      const a = answer.toLowerCase();
      // Must address the subtraction fix AND the ×100 percentage fix
      const fixesSubtraction = a.includes('revenue - costs') || a.includes('revenue-costs') ||
        a.includes('subtract') || a.includes('minus') || (a.includes('- costs') && !a.includes('+ costs'));
      const fixesPercent = a.includes('* 100') || a.includes('*100') || a.includes('× 100') ||
        a.includes('multiply') || a.includes('percent') || a.includes('× 100') || a.includes('x 100');
      return fixesSubtraction && fixesPercent;
    },
    successMsg: 'Both bugs fixed! Line 14 should use subtraction (revenue − costs) and line 17 needs ×100 to produce a percentage.',
    failMsg: 'Not fully correct. There are two bugs — check both the arithmetic operator and the percentage conversion.',
  },
  {
    tier: 3,
    label: 'Synthesis Challenge',
    prompt: 'Draft a 3-slide presentation outline for Meridian Bank that draws on at least 3 different workspace sources. Include a heading for each slide and cite each source you used.',
    placeholder: 'Slide 1: ...\nSource: ...\n\nSlide 2: ...\nSource: ...\n\nSlide 3: ...\nSource: ...',
    monospace: false,
    hint: 'The Old_Project_Archive has a presentation template from previous client briefings. Combine data from the Brief, Meeting Notes, and other sources for maximum impact.',
    validate(answer) {
      const a = answer.toLowerCase();
      // Need ≥3 slide headings
      const slideCount = (a.match(/slide\s*[1-9]/g) || []).length;
      // Need ≥3 source citations from known docs
      const knownSources = [
        'project brief', 'meeting notes', 'old project archive', 'archive',
        'wiki', 'api docs', 'compliance', 'faq', 'faq_guide',
        'roi formula', 'brightfield',
      ];
      const citationCount = knownSources.filter(s => a.includes(s)).length;
      return slideCount >= 3 && citationCount >= 3;
    },
    successMsg: 'Excellent synthesis! You pulled together multiple sources and structured a coherent presentation outline.',
    failMsg: 'Make sure you have at least 3 slide headings (Slide 1, Slide 2, Slide 3) and cite at least 3 specific workspace sources.',
  },
];

// ─── NPC SCRIPTED RESPONSES ──────────────────────────────────────────

const ALEX_SCRIPTS = {
  welcome: [
    "Hi {name}! I'm Alex, your onboarding manager. You have 20 minutes to complete three tasks using the workspace on your left. Explore the files, wiki, and repository — everything you need is in there. Good luck! 👋",
  ],
  tier1Complete: [
    "Nice work on Task 1! The encryption requirement is one of the key non-negotiables for this project.",
    "Great — you found the encryption standard quickly. On to Task 2!",
  ],
  tier2Complete: [
    "Good debugging! Those formula issues would have caused incorrect ROI figures in client reports.",
    "Task 2 done — the wiki formula reference is there exactly for this reason.",
  ],
  tier3Complete: [
    "Excellent! You've pulled together information from across the workspace for a coherent presentation. That's exactly the kind of synthesis skill we value.",
    "All three tasks complete — great work. Your Self-Reliance Index will be calculated now.",
  ],
  afterHelp1: [
    "Happy to nudge you in the right direction. Have you explored all the relevant sections of the workspace yet?",
    "Good question. Sometimes the answer isn't where you'd expect — try browsing different sections.",
  ],
  afterHelp2Plus: [
    "Have you checked all the available resources? The workspace has more information than might be obvious at first glance.",
    "Before I give more guidance — have you looked at all the sections of the wiki, not just the obvious ones?",
  ],
  onBugs: [
    "The wiki might have the formula you need. Have you checked the API Documentation section?",
    "Formula questions are usually answered in the technical docs. Worth checking the wiki carefully.",
  ],
  onSlides: [
    "What sources have you already looked at? A strong presentation usually draws on multiple documents.",
    "Think about what a client would want to see — business case, technical credibility, and compliance reassurance.",
  ],
  onEncryption: [
    "The Project Brief has specific technical requirements. Worth reading through those carefully.",
  ],
  genericPositive: [
    "You're making good progress — keep exploring.",
    "Good thinking. The workspace has all the information you need.",
    "Keep at it — you're on the right track.",
  ],
  unknown: [
    "Interesting question. I'd suggest looking through the workspace files — the answer is likely in there.",
    "I can't give direct answers, but all the information you need is accessible in the workspace.",
    "Have a browse through the available documents — you might find what you're looking for.",
  ],
};

function pickScript(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getAlexResponse(userMessage) {
  const msg = userMessage.toLowerCase();
  const tier = STATE.currentTier;
  const helpCount = STATE.helpRequests;

  if (msg.includes('bug') || msg.includes('formula') || msg.includes('roi') || msg.includes('calculator')) {
    return pickScript(ALEX_SCRIPTS.onBugs);
  }
  if (msg.includes('slide') || msg.includes('presentation') || msg.includes('outline')) {
    return pickScript(ALEX_SCRIPTS.onSlides);
  }
  if (msg.includes('encrypt') || msg.includes('aes') || msg.includes('security')) {
    return pickScript(ALEX_SCRIPTS.onEncryption);
  }
  if (msg.includes('help') || msg.includes('hint') || msg.includes('stuck') || msg.includes('confused')) {
    if (helpCount >= 2) return pickScript(ALEX_SCRIPTS.afterHelp2Plus);
    return pickScript(ALEX_SCRIPTS.afterHelp1);
  }
  if (msg.includes('good') || msg.includes('thanks') || msg.includes('thank') || msg.includes('great')) {
    return pickScript(ALEX_SCRIPTS.genericPositive);
  }
  return pickScript(ALEX_SCRIPTS.unknown);
}

// ─── SEARCH INDEX ────────────────────────────────────────────────────

function buildSearchIndex() {
  const entries = [
    { source: 'Project Brief', title: 'Overview — Project Nova', pageId: 'brief',
      text: 'Project Nova is the full-stack migration of Meridian Bank legacy customer portal cloud-native architecture 2.4 million retail banking customers.' },
    { source: 'Project Brief', title: 'Technical Requirements — Encryption', pageId: 'brief',
      text: 'All customer data must be encrypted at rest using the AES-256 standard. TLS 1.3 minimum for all data in transit. Zero-trust network architecture.' },
    { source: 'Project Brief', title: 'Stakeholders', pageId: 'brief',
      text: 'Sarah Chen CTO James Rodriguez IT Security Dr Emily Watson Chief Compliance Officer Marcus Obi Lead Engineer.' },
    { source: 'Project Brief', title: 'Budget £450,000', pageId: 'brief',
      text: 'Budget £450,000 breakdown: Infrastructure £120,000 Development £185,000 Security Compliance £65,000 Project Management £40,000 Contingency £40,000.' },
    { source: 'Project Brief', title: 'Timeline — 12 weeks Q3', pageId: 'brief',
      text: 'Timeline 12 weeks Q3 2024. Discovery Architecture API Layer Frontend Rebuild Data Migration UAT Compliance Sign-off.' },
    { source: 'Team Wiki', title: 'Architecture — Microservices', pageId: 'wiki-arch',
      text: 'Microservices architecture EKS Kong API Gateway auth-service account-service notification-service analytics-service AES-256 encryption Amazon Aurora PostgreSQL Redis.' },
    { source: 'Team Wiki', title: 'API Docs — ROI Formula', pageId: 'wiki-api',
      text: 'ROI formula: Revenue minus Costs divided by Costs times 100. Rate limit 500 requests per minute. Return on Investment standard formula percentage.' },
    { source: 'Team Wiki', title: 'Frontend Specs — React TypeScript', pageId: 'wiki-frontend',
      text: 'React 18 TypeScript 5 Zustand React Query Tailwind CSS Vite 5 WCAG 2.1 AA accessibility.' },
    { source: 'Team Wiki', title: 'Meeting Notes — ROI Target 150%', pageId: 'wiki-meetings',
      text: 'ROI target 150% over 24 months. Sarah Chen requested headline figure presentations. Brightfield 2021 achieved 187% ROI £380,000 engagement. ROI calculator script bugs.' },
    { source: 'Team Wiki', title: 'Compliance — GDPR FCA', pageId: 'wiki-compliance',
      text: 'GDPR FCA PCI-DSS compliance. AES-256 encryption at rest personal data. Data Processing Agreement DPA. Breach notification ICO 72 hours. FAQ_Guide.docx compliance questions.' },
    { source: 'Team Wiki', title: 'Old Projects — Brightfield 187% ROI', pageId: 'wiki-old',
      text: 'Brightfield Insurance 2021 187% ROI on time under budget. TerraBank 142% ROI. Apex Credit Union 163% ROI. Old_Project_Archive.zip presentation template metrics.' },
    { source: 'Code Repository', title: 'roi-calculator.js — Bugs', pageId: 'repo-roi',
      text: 'ROI calculator function calculateROI revenue costs netProfit. Line 14 revenue plus costs should be revenue minus costs. Line 17 missing multiply 100 percentage formula.' },
    { source: 'Code Repository', title: 'README.md', pageId: 'repo-readme',
      text: 'README project nova scripts roi-calculator.js formula must match Team Wiki API Documentation. Known issues ROI formula incorrect.' },
  ];
  return entries;
}

// ─── EVENT TRACKING ──────────────────────────────────────────────────

function track(type, data) {
  STATE.events.push({ type, ts: Date.now(), elapsed: elapsedSeconds(), ...data });
}

function elapsedSeconds() {
  if (!STATE.startTime) return 0;
  return Math.round((Date.now() - STATE.startTime) / 1000);
}

// ─── TIMER ───────────────────────────────────────────────────────────

function startTimer() {
  STATE.timerInterval = setInterval(() => {
    STATE.secondsLeft--;
    renderTimer();
    if (STATE.secondsLeft <= 0) {
      clearInterval(STATE.timerInterval);
      endSimulation();
    }
  }, 1000);
}

function renderTimer() {
  const el = document.getElementById('timer-value');
  const display = document.getElementById('timer-display');
  const m = Math.floor(STATE.secondsLeft / 60);
  const s = STATE.secondsLeft % 60;
  el.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  display.className = 'timer-display';
  if (STATE.secondsLeft <= 120) display.classList.add('critical');
  else if (STATE.secondsLeft <= 300) display.classList.add('warning');
}

// ─── PAGE NAVIGATION ─────────────────────────────────────────────────

function navigateTo(pageId) {
  // Record previous page duration
  if (STATE.currentPage && STATE.pageStartTime) {
    const dur = Math.round((Date.now() - STATE.pageStartTime) / 1000);
    track('pageview', { page: STATE.currentPage, duration: dur });
  }

  STATE.currentPage = pageId;
  STATE.pageStartTime = Date.now();

  // Update document viewer
  const page = PAGES[pageId];
  if (!page) return;

  document.getElementById('doc-breadcrumb').textContent = page.breadcrumb;
  const content = document.getElementById('doc-content');
  content.innerHTML = page.render();

  // Bind interactive elements inside rendered content
  bindDocumentInteractions(content, pageId);

  // Update sidebar active states
  updateSidebarActive(pageId);

  // Discovery triggers
  handleDiscoveryTriggers(pageId);

  // Close search results
  hideSearchResults();
}

function bindDocumentInteractions(content, pageId) {
  // Dashboard cards
  content.querySelectorAll('[data-page]').forEach(el => {
    el.addEventListener('click', () => navigateTo(el.dataset.page));
    el.addEventListener('mouseenter', () => el.style.borderColor = 'var(--border-light)');
    el.addEventListener('mouseleave', () => el.style.borderColor = 'var(--border)');
  });

  // Repo file items
  content.querySelectorAll('[data-file]').forEach(el => {
    el.addEventListener('click', () => navigateTo(`repo-${el.dataset.file}`));
    el.addEventListener('mouseenter', () => el.style.borderColor = 'var(--border-light)');
    el.addEventListener('mouseleave', () => el.style.borderColor = 'var(--border)');
  });

  // Wiki nav links
  content.querySelectorAll('.wiki-nav-link').forEach(el => {
    el.addEventListener('click', () => navigateTo(el.dataset.page));
  });

  // Discover file links
  content.querySelectorAll('[data-discover]').forEach(el => {
    el.addEventListener('click', () => triggerDiscovery(el.dataset.discover));
  });
}

function updateSidebarActive(pageId) {
  // Clear all active
  document.querySelectorAll('.sidebar-item, .sidebar-subitem, .discovered-item').forEach(el => {
    el.classList.remove('active');
  });

  // Match main items
  document.querySelectorAll('.sidebar-item[data-page]').forEach(el => {
    if (el.dataset.page === pageId) el.classList.add('active');
    // If visiting a wiki subpage, highlight the wiki parent too
    if (pageId && pageId.startsWith('wiki-') && el.dataset.page === 'wiki-home') {
      el.classList.add('active');
      el.classList.add('open');
    }
  });

  // Match sub items
  document.querySelectorAll('.sidebar-subitem[data-page]').forEach(el => {
    if (el.dataset.page === pageId) el.classList.add('active');
  });

  // Match discovered items
  document.querySelectorAll('.discovered-item[data-page]').forEach(el => {
    if (el.dataset.page === pageId) el.classList.add('active');
  });
}

// ─── DISCOVERY ───────────────────────────────────────────────────────

function handleDiscoveryTriggers(pageId) {
  if ((pageId === 'brief' || pageId === 'wiki-compliance') && !STATE.discoveredFiles.has('faq')) {
    setTimeout(() => triggerDiscovery('faq'), 1500);
  }
  if (pageId === 'wiki-old' && !STATE.discoveredFiles.has('archive')) {
    setTimeout(() => triggerDiscovery('archive'), 1000);
  }
}

function triggerDiscovery(fileId) {
  if (STATE.discoveredFiles.has(fileId)) return;
  STATE.discoveredFiles.add(fileId);
  track('discovery', { file: fileId });

  const names = { faq: 'FAQ_Guide.docx', archive: 'Old_Project_Archive.zip' };
  const name = names[fileId];

  // Add to discovered sidebar section
  const section = document.getElementById('discovered-section');
  const list = document.getElementById('discovered-list');
  section.style.display = '';
  const li = document.createElement('li');
  li.className = 'discovered-item';
  li.dataset.page = fileId;
  li.innerHTML = `<span class="file-icon">📎</span> ${name}`;
  li.addEventListener('click', () => navigateTo(fileId));
  list.appendChild(li);

  // Add to search index
  if (fileId === 'faq') {
    STATE.searchIndex.push(
      { source: 'FAQ_Guide.docx', title: 'GDPR Compliance FAQ', pageId: 'faq',
        text: 'GDPR compliance FAQ guide. Data processor controller. AES-256 encryption personal data at rest. DPA data processing agreement. Breach reporting ICO 72 hours. Retention schedule.' },
      { source: 'FAQ_Guide.docx', title: 'Data Retention Schedule', pageId: 'faq',
        text: 'Transaction audit logs 7 years FCA. Customer portal data contract plus 2 years. Security incident logs 3 years PCI-DSS.' }
    );
  }
  if (fileId === 'archive') {
    STATE.searchIndex.push(
      { source: 'Old_Project_Archive.zip', title: 'Brightfield 2021 — 187% ROI', pageId: 'archive',
        text: 'Brightfield Insurance 2021 187% ROI investment £380,000 revenue £591,400 net profit £211,400. Presentation template slides client board.' },
      { source: 'Old_Project_Archive.zip', title: 'Presentation Template — 3 Slides', pageId: 'archive',
        text: 'Slide 1 Project Overview executive summary. Slide 2 Technical Approach Security encryption compliance. Slide 3 ROI Projection Business Case benchmark Brightfield.' }
    );
  }

  showDiscoveryToast(name, fileId);

  // Alex message
  setTimeout(() => {
    addAlexMessage(`You've found a new file: **${name}**. It might come in handy — worth taking a look.`);
  }, 800);
}

function showDiscoveryToast(name, fileId) {
  const toast = document.createElement('div');
  toast.className = 'discovery-toast';
  toast.innerHTML = `
    <div class="discovery-toast-title">📎 File Discovered</div>
    <div class="discovery-toast-body">${name} — click "Discovered Files" in the sidebar to open it.</div>`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4200);
}

// ─── SEARCH ──────────────────────────────────────────────────────────

function doSearch(query) {
  if (!query.trim()) { hideSearchResults(); return; }
  track('search', { query, time: elapsedSeconds() });

  const q = query.toLowerCase();
  const results = STATE.searchIndex.filter(entry =>
    entry.title.toLowerCase().includes(q) ||
    entry.text.toLowerCase().includes(q) ||
    entry.source.toLowerCase().includes(q)
  ).slice(0, 8);

  track('searchResults', { query, count: results.length });
  renderSearchResults(results, query);
}

function renderSearchResults(results, query) {
  const container = document.getElementById('search-results');
  container.innerHTML = '';
  if (!results.length) {
    container.innerHTML = `<div class="search-no-results">No results for "<strong>${escapeHtml(query)}</strong>"</div>`;
    container.classList.remove('hidden');
    return;
  }

  results.forEach(r => {
    const snippet = highlightSnippet(r.text, query);
    const div = document.createElement('div');
    div.className = 'search-result-item';
    div.innerHTML = `
      <div class="search-result-source">${escapeHtml(r.source)}</div>
      <div class="search-result-title">${escapeHtml(r.title)}</div>
      <div class="search-result-snippet">${snippet}</div>`;
    div.addEventListener('click', () => {
      track('searchClick', { query, pageId: r.pageId });
      navigateTo(r.pageId);
      document.getElementById('search-input').value = '';
      hideSearchResults();
    });
    container.appendChild(div);
  });

  container.classList.remove('hidden');
}

function highlightSnippet(text, query) {
  const q = query.toLowerCase();
  const idx = text.toLowerCase().indexOf(q);
  let snippet = text.length > 120 ? text.substring(0, 120) + '…' : text;
  if (idx !== -1) {
    const start = Math.max(0, idx - 30);
    const end = Math.min(text.length, idx + query.length + 60);
    snippet = (start > 0 ? '…' : '') + text.substring(start, end) + (end < text.length ? '…' : '');
  }
  return escapeHtml(snippet).replace(new RegExp(escapeRegex(escapeHtml(query)), 'gi'), m => `<em>${m}</em>`);
}

function hideSearchResults() {
  document.getElementById('search-results').classList.add('hidden');
}

// ─── TASKS ───────────────────────────────────────────────────────────

function renderCurrentTask() {
  const task = TASKS[STATE.currentTier - 1];
  document.getElementById('task-panel-badge').className = `task-badge tier-${task.tier}`;
  document.getElementById('task-panel-badge').textContent = `T${task.tier}`;
  document.getElementById('task-panel-label').textContent = task.label;
  document.getElementById('task-prompt').textContent = task.prompt;

  const textarea = document.getElementById('task-answer');
  textarea.value = '';
  textarea.placeholder = task.placeholder;
  textarea.className = `task-textarea${task.monospace ? ' monospace' : ''}`;

  document.getElementById('task-feedback').className = 'task-feedback hidden';
  document.getElementById('task-feedback').textContent = '';
}

function submitTask() {
  const task = TASKS[STATE.currentTier - 1];
  const answer = document.getElementById('task-answer').value.trim();

  if (!answer) {
    showTaskFeedback('hint', '⚠️ Please enter an answer before submitting.');
    return;
  }

  const passed = task.validate(answer);
  track('taskSubmit', { tier: STATE.currentTier, passed, answer: answer.substring(0, 200) });

  if (passed) {
    showTaskFeedback('success', '✓ ' + task.successMsg);
    STATE.tiersPassed.push(STATE.currentTier);
    STATE.tasksCompleted++;

    // Alex message
    const scripts = {
      1: ALEX_SCRIPTS.tier1Complete,
      2: ALEX_SCRIPTS.tier2Complete,
      3: ALEX_SCRIPTS.tier3Complete,
    };
    setTimeout(() => addAlexMessage(pickScript(scripts[STATE.currentTier])), 800);

    // Mark sidebar task as completed
    const navItem = document.querySelector(`.task-nav-item[data-tier="${STATE.currentTier}"]`);
    if (navItem) {
      navItem.classList.remove('active', 'locked');
      navItem.classList.add('completed');
    }

    if (STATE.currentTier < 3) {
      STATE.currentTier++;
      const nextNavItem = document.querySelector(`.task-nav-item[data-tier="${STATE.currentTier}"]`);
      if (nextNavItem) {
        nextNavItem.classList.remove('locked');
        nextNavItem.classList.add('active');
      }
      setTimeout(() => renderCurrentTask(), 1400);
    } else {
      // All done
      STATE.allCompleteTime = elapsedSeconds();
      setTimeout(() => endSimulation(), 2000);
    }
  } else {
    showTaskFeedback('error', '✗ ' + task.failMsg);
  }
}

function showTaskFeedback(type, msg) {
  const el = document.getElementById('task-feedback');
  el.className = `task-feedback ${type}`;
  el.textContent = msg;
}

function requestHint() {
  const task = TASKS[STATE.currentTier - 1];
  STATE.helpRequests++;
  if (STATE.firstHelpAt === null) STATE.firstHelpAt = elapsedSeconds();
  track('helpRequest', { tier: STATE.currentTier, count: STATE.helpRequests });

  showTaskFeedback('hint', '💡 Hint: ' + task.hint);

  // Alex reacts to help requests
  const alexMsg = STATE.helpRequests >= 2
    ? pickScript(ALEX_SCRIPTS.afterHelp2Plus)
    : pickScript(ALEX_SCRIPTS.afterHelp1);
  setTimeout(() => addAlexMessage(alexMsg), 600);
}

// ─── CHAT ────────────────────────────────────────────────────────────

function addAlexMessage(text) {
  const msg = { sender: 'alex', text, ts: Date.now() };
  STATE.chatMessages.push(msg);
  track('chatMessage', { sender: 'alex', text });
  appendChatMessage(msg);

  if (!STATE.chatOpen) {
    STATE.chatUnread++;
    updateChatUnread();
  }
}

function appendChatMessage(msg) {
  const container = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = `chat-message ${msg.sender}`;
  const time = new Date(msg.ts).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  div.innerHTML = `<div class="chat-bubble">${escapeHtml(msg.text)}</div><div class="chat-time">${time}</div>`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function updateChatUnread() {
  const badge = document.getElementById('chat-unread');
  if (STATE.chatUnread > 0) {
    badge.textContent = STATE.chatUnread;
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
}

async function sendChatMessage() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';

  const userMsg = { sender: 'user', text, ts: Date.now() };
  STATE.chatMessages.push(userMsg);
  track('chatMessage', { sender: 'user', text });
  appendChatMessage(userMsg);

  // Check help keywords to count as help request
  if (/\b(help|hint|stuck|how|where|what|confused|don'?t know)\b/i.test(text)) {
    STATE.helpRequests++;
    if (STATE.firstHelpAt === null) STATE.firstHelpAt = elapsedSeconds();
    track('helpRequest', { tier: STATE.currentTier, count: STATE.helpRequests, source: 'chat' });
  }

  // Try Claude API first, fall back to scripted
  const apiKey = STATE.apiKey || localStorage.getItem('rgc_apikey') || '';
  if (apiKey) {
    try {
      const reply = await callClaudeAPI(apiKey, text);
      addAlexMessage(reply);
      return;
    } catch (e) {
      // fall through to scripted
    }
  }

  // Scripted
  setTimeout(() => {
    const reply = getAlexResponse(text);
    addAlexMessage(reply);
  }, 600 + Math.random() * 400);
}

async function callClaudeAPI(apiKey, userMessage) {
  const elapsed = elapsedSeconds();
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;

  const systemPrompt = `You are Alex, a busy onboarding manager at a consulting firm. A new graduate hire is completing a 20-minute workspace assessment called the Resourceful Graduate Challenge. Your role is to guide them, but NOT give direct answers.

Current context:
- Candidate: ${STATE.candidate}
- Time elapsed: ${mins}m ${secs}s of 20 minutes
- Current task tier: ${STATE.currentTier} of 3
- Tasks passed: ${STATE.tiersPassed.join(', ') || 'none yet'}
- Help requests so far: ${STATE.helpRequests}

Workspace contains: Project Brief (with AES-256 encryption requirement), Team Wiki (API Docs has ROI formula), Code Repository (roi-calculator.js has 2 bugs), and discoverable files.

Style: professional, concise, slightly busy. Give guiding QUESTIONS, not answers. Max 2 sentences. Encourage self-reliance.`;

  const messages = STATE.chatMessages.slice(-6).map(m => ({
    role: m.sender === 'user' ? 'user' : 'assistant',
    content: m.text,
  }));
  // Ensure last message is user
  if (messages.length === 0 || messages[messages.length - 1].role !== 'user') {
    messages.push({ role: 'user', content: userMessage });
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-calls': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 150,
      system: systemPrompt,
      messages,
    }),
  });

  if (!response.ok) throw new Error(`API error ${response.status}`);
  const data = await response.json();
  return data.content[0].text;
}

// ─── SCORING ─────────────────────────────────────────────────────────

function calculateScores() {
  // ── Exploratory Score ──────────────────────────────────────────────
  const uniquePages = new Set(
    STATE.events.filter(e => e.type === 'pageview').map(e => e.page)
  ).size;
  const exploratoryFromPages = Math.min(uniquePages / 10, 1) * 50;
  const discoveredCount = STATE.discoveredFiles.size;
  const exploratoryFromDiscovery = (discoveredCount / 2) * 50;
  const exploratory = Math.round(exploratoryFromPages + exploratoryFromDiscovery);

  // ── Persistence Score ──────────────────────────────────────────────
  let persistence = 0;
  if (STATE.firstHelpAt === null) {
    // Never asked for help → full score
    persistence = 100;
  } else {
    // Map first help time (0–1200 seconds) linearly to 0–100
    persistence = Math.round((STATE.firstHelpAt / 1200) * 100);
  }
  // Penalty for additional help requests
  const extraHelp = Math.max(0, STATE.helpRequests - 1);
  persistence = Math.max(0, persistence - extraHelp * 15);

  // ── Efficiency Score ───────────────────────────────────────────────
  const totalElapsed = elapsedSeconds();
  const tasksCompleted = STATE.tasksCompleted;
  let efficiency = 0;
  if (tasksCompleted > 0) {
    // Full score = 3 tasks in ≤15 min (900s), pro-rated beyond
    const targetTime = 900;
    const taskFraction = tasksCompleted / 3;
    const timeFraction = Math.min(targetTime / Math.max(totalElapsed, 1), 1);
    efficiency = Math.round(taskFraction * timeFraction * 100);
  }

  // ── Composite ─────────────────────────────────────────────────────
  const composite = Math.round(0.4 * exploratory + 0.3 * persistence + 0.3 * efficiency);

  return { exploratory, persistence, efficiency, composite };
}

function getSRITier(score) {
  if (score >= 85) return { label: 'Exceptional', colour: '#34d399' };
  if (score >= 70) return { label: 'Strong', colour: '#60a5fa' };
  if (score >= 55) return { label: 'Developing', colour: '#a78bfa' };
  if (score >= 40) return { label: 'Needs Guidance', colour: '#fbbf24' };
  return { label: 'Early Stage', colour: '#f87171' };
}

// ─── END SIMULATION ──────────────────────────────────────────────────

function endSimulation() {
  clearInterval(STATE.timerInterval);

  // Record final page view
  if (STATE.currentPage && STATE.pageStartTime) {
    const dur = Math.round((Date.now() - STATE.pageStartTime) / 1000);
    track('pageview', { page: STATE.currentPage, duration: dur });
  }

  const scores = calculateScores();
  renderScoreScreen(scores);
  showScreen('score');
  sendResultsEmail(scores);
}

// ─── SCORE SCREEN ────────────────────────────────────────────────────

function renderScoreScreen(scores) {
  document.getElementById('score-candidate-name').textContent = STATE.candidate;

  const tier = getSRITier(scores.composite);

  // Animate after a tick
  requestAnimationFrame(() => {
    setTimeout(() => {
      document.getElementById('sri-value').textContent = scores.composite;
      document.getElementById('sri-value').style.color = tier.colour;
      document.getElementById('sri-tier').textContent = tier.label;
      document.getElementById('sri-tier').style.color = tier.colour;
      document.getElementById('sri-bar').style.width = `${scores.composite}%`;
      document.getElementById('sri-bar').style.background = tier.colour;

      document.getElementById('score-exploratory').textContent = scores.exploratory;
      document.getElementById('score-persistence').textContent = scores.persistence;
      document.getElementById('score-efficiency').textContent = scores.efficiency;
      document.getElementById('bar-exploratory').style.width = `${scores.exploratory}%`;
      document.getElementById('bar-persistence').style.width = `${scores.persistence}%`;
      document.getElementById('bar-efficiency').style.width = `${scores.efficiency}%`;
    }, 200);
  });

  // Stats
  const elapsed = elapsedSeconds();
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const uniquePages = new Set(
    STATE.events.filter(e => e.type === 'pageview').map(e => e.page)
  ).size;
  const totalSearches = STATE.events.filter(e => e.type === 'search').length;
  const totalClicks = STATE.events.filter(e => e.type === 'click').length;

  const statsData = [
    ['Time elapsed', `${mins}m ${secs}s`],
    ['Tasks completed', `${STATE.tasksCompleted} / 3`],
    ['Pages visited', String(uniquePages)],
    ['Files discovered', `${STATE.discoveredFiles.size} / 2`],
    ['Searches performed', String(totalSearches)],
    ['Help requests', String(STATE.helpRequests)],
    ['Chat messages sent', String(STATE.chatMessages.filter(m => m.sender === 'user').length)],
  ];

  document.getElementById('score-stats-grid').innerHTML = statsData.map(([label, val]) =>
    `<div class="stat-row"><span class="stat-label">${label}</span><span class="stat-value">${val}</span></div>`
  ).join('');

  // Activity log
  const logEl = document.getElementById('activity-log');
  const logEvents = STATE.events.filter(e => [
    'pageview','discovery','taskSubmit','helpRequest','search'
  ].includes(e.type));

  logEl.innerHTML = logEvents.map(e => {
    const t = formatElapsed(e.elapsed);
    let text = '';
    if (e.type === 'pageview') text = `Viewed <strong>${PAGES[e.page]?.title || e.page}</strong> (${e.duration}s)`;
    if (e.type === 'discovery') text = `Discovered <strong>${e.file === 'faq' ? 'FAQ_Guide.docx' : 'Old_Project_Archive.zip'}</strong>`;
    if (e.type === 'taskSubmit') text = `Task ${e.tier} submitted — <strong>${e.passed ? 'passed ✓' : 'failed ✗'}</strong>`;
    if (e.type === 'helpRequest') text = `Requested hint for Task ${e.tier}`;
    if (e.type === 'search') text = `Searched: "<strong>${escapeHtml(e.query)}</strong>"`;
    return `<div class="log-entry"><span class="log-time">${t}</span><span class="log-text">${text}</span></div>`;
  }).join('');
}

function formatElapsed(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

// ─── SCREEN MANAGEMENT ───────────────────────────────────────────────

function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
    s.classList.add('hidden');
  });
  const target = document.getElementById(`screen-${name}`);
  target.classList.remove('hidden');
  target.classList.add('active');
}

// ─── WIKI NAV HELPER ─────────────────────────────────────────────────

function wikiNav(activePage) {
  const pages = [
    ['wiki-home', 'Home'],
    ['wiki-arch', 'Architecture'],
    ['wiki-api', 'API Docs'],
    ['wiki-frontend', 'Frontend'],
    ['wiki-backend', 'Backend'],
    ['wiki-meetings', 'Meetings'],
    ['wiki-compliance', 'Compliance'],
    ['wiki-old', 'Old Projects'],
  ];
  return `<div class="wiki-nav">${pages.map(([id, label]) =>
    `<div class="wiki-nav-link${id === activePage ? ' active' : ''}" data-page="${id}">${label}</div>`
  ).join('')}</div>`;
}

// ─── UTILITIES ───────────────────────────────────────────────────────

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ─── INIT ────────────────────────────────────────────────────────────

function init() {
  // Load saved API key
  STATE.apiKey = localStorage.getItem('rgc_apikey') || '';
  if (STATE.apiKey) {
    document.getElementById('input-apikey').value = STATE.apiKey;
    document.getElementById('modal-apikey').value = STATE.apiKey;
    document.getElementById('apikey-status').textContent = 'Key loaded ✓';
  }

  // Build search index
  STATE.searchIndex = buildSearchIndex();

  // ── Start Screen ────────────────────────────────────────────────
  document.getElementById('btn-show-settings').addEventListener('click', () => {
    document.getElementById('settings-panel').classList.toggle('hidden');
  });

  document.getElementById('btn-save-apikey').addEventListener('click', () => {
    const key = document.getElementById('input-apikey').value.trim();
    localStorage.setItem('rgc_apikey', key);
    STATE.apiKey = key;
    document.getElementById('apikey-status').textContent = key ? 'Key saved ✓' : 'Key cleared';
    document.getElementById('modal-apikey').value = key;
  });

  document.getElementById('btn-start').addEventListener('click', startSimulation);
  document.getElementById('input-name').addEventListener('keydown', e => {
    if (e.key === 'Enter') startSimulation();
  });

  // ── Workspace: Sidebar navigation ───────────────────────────────
  document.querySelectorAll('.sidebar-item[data-page]').forEach(el => {
    el.addEventListener('click', () => {
      const pageId = el.dataset.page;
      if (pageId === 'wiki-home') {
        el.classList.toggle('open');
      }
      navigateTo(pageId);
      track('click', { element: 'sidebar-item', page: pageId });
    });
  });

  document.querySelectorAll('.sidebar-subitem[data-page]').forEach(el => {
    el.addEventListener('click', e => {
      e.stopPropagation();
      navigateTo(el.dataset.page);
      track('click', { element: 'sidebar-subitem', page: el.dataset.page });
    });
  });

  // ── Task panel nav items ─────────────────────────────────────────
  document.querySelectorAll('.task-nav-item[data-tier]').forEach(el => {
    el.addEventListener('click', () => {
      const tier = parseInt(el.dataset.tier);
      if (el.classList.contains('locked')) return;
      if (STATE.tiersPassed.includes(tier)) return;
      STATE.currentTier = tier;
      renderCurrentTask();
    });
  });

  // ── Task panel toggle ────────────────────────────────────────────
  document.getElementById('task-panel-toggle').addEventListener('click', () => {
    const panel = document.getElementById('task-panel');
    panel.classList.toggle('collapsed');
    STATE.taskPanelCollapsed = panel.classList.contains('collapsed');
  });

  // ── Task actions ─────────────────────────────────────────────────
  document.getElementById('btn-submit-task').addEventListener('click', submitTask);
  document.getElementById('task-answer').addEventListener('keydown', e => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) submitTask();
  });
  document.getElementById('btn-hint').addEventListener('click', requestHint);

  // ── Search ───────────────────────────────────────────────────────
  const searchInput = document.getElementById('search-input');
  let searchTimeout;
  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => doSearch(searchInput.value), 250);
  });
  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') doSearch(searchInput.value);
    if (e.key === 'Escape') hideSearchResults();
  });
  document.getElementById('btn-search').addEventListener('click', () => doSearch(searchInput.value));
  document.addEventListener('click', e => {
    if (!e.target.closest('.header-search') && !e.target.closest('.search-results')) {
      hideSearchResults();
    }
  });

  // ── Chat widget ──────────────────────────────────────────────────
  document.getElementById('chat-toggle').addEventListener('click', () => {
    const widget = document.getElementById('chat-widget');
    const body = document.getElementById('chat-body');
    if (STATE.chatOpen) {
      widget.classList.remove('open');
      body.classList.add('hidden');
      STATE.chatOpen = false;
    } else {
      widget.classList.add('open');
      body.classList.remove('hidden');
      STATE.chatOpen = true;
      STATE.chatUnread = 0;
      updateChatUnread();
      // Scroll to bottom
      const msgs = document.getElementById('chat-messages');
      msgs.scrollTop = msgs.scrollHeight;
    }
  });

  document.getElementById('btn-send-chat').addEventListener('click', sendChatMessage);
  document.getElementById('chat-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') sendChatMessage();
  });

  // ── Settings modal ───────────────────────────────────────────────
  document.getElementById('btn-workspace-settings').addEventListener('click', () => {
    document.getElementById('settings-modal').classList.remove('hidden');
    document.getElementById('modal-apikey').value = STATE.apiKey || localStorage.getItem('rgc_apikey') || '';
  });
  document.getElementById('btn-close-settings').addEventListener('click', () => {
    document.getElementById('settings-modal').classList.add('hidden');
  });
  document.getElementById('settings-modal').addEventListener('click', e => {
    if (e.target === e.currentTarget) e.currentTarget.classList.add('hidden');
  });
  document.getElementById('btn-modal-save-apikey').addEventListener('click', () => {
    const key = document.getElementById('modal-apikey').value.trim();
    localStorage.setItem('rgc_apikey', key);
    STATE.apiKey = key;
    document.getElementById('modal-apikey-status').textContent = key ? 'Key saved ✓' : 'Key cleared';
    document.getElementById('input-apikey').value = key;
    setTimeout(() => document.getElementById('settings-modal').classList.add('hidden'), 800);
  });

  // ── Score screen restart ─────────────────────────────────────────
  document.getElementById('btn-restart').addEventListener('click', () => {
    // Reset state
    clearInterval(STATE.timerInterval);
    Object.assign(STATE, {
      candidate: '', apiKey: localStorage.getItem('rgc_apikey') || '',
      startTime: null, timerInterval: null, secondsLeft: 1200,
      currentTier: 1, tiersPassed: [],
      currentPage: null, pageStartTime: null,
      discoveredFiles: new Set(),
      events: [],
      chatMessages: [],
      chatUnread: 0, chatOpen: false,
      helpRequests: 0, firstHelpAt: null,
      tasksCompleted: 0, allCompleteTime: null,
      taskPanelCollapsed: false,
      searchIndex: buildSearchIndex(),
    });

    // Reset UI
    document.getElementById('input-name').value = '';
    document.getElementById('chat-messages').innerHTML = '';
    document.getElementById('discovered-section').style.display = 'none';
    document.getElementById('discovered-list').innerHTML = '';
    document.querySelectorAll('.task-nav-item').forEach((el, i) => {
      el.className = `task-nav-item${i === 0 ? ' active' : ' locked'}`;
    });
    document.getElementById('timer-value').textContent = '20:00';
    document.getElementById('timer-display').className = 'timer-display';
    document.getElementById('chat-body').classList.add('hidden');
    document.getElementById('chat-widget').classList.remove('open');

    showScreen('start');
  });
}

// ─── START SIMULATION ────────────────────────────────────────────────

function startSimulation() {
  const name = document.getElementById('input-name').value.trim();
  if (!name) {
    document.getElementById('input-name').focus();
    document.getElementById('input-name').style.borderColor = 'var(--red)';
    setTimeout(() => document.getElementById('input-name').style.borderColor = '', 1500);
    return;
  }

  STATE.candidate = name;
  STATE.startTime = Date.now();
  STATE.apiKey = localStorage.getItem('rgc_apikey') || '';

  showScreen('workspace');

  // Render initial task
  renderCurrentTask();

  // Navigate to dashboard
  navigateTo('dashboard');

  // Start timer
  startTimer();

  // Welcome message from Alex
  setTimeout(() => {
    addAlexMessage(
      ALEX_SCRIPTS.welcome[0].replace('{name}', name.split(' ')[0])
    );
    // Open chat briefly to show welcome
    document.getElementById('chat-widget').classList.add('open');
    document.getElementById('chat-body').classList.remove('hidden');
    STATE.chatOpen = true;
  }, 1000);

  track('sessionStart', { candidate: name });
}

// ─── EMAIL RESULTS ────────────────────────────────────────────────────

function sendResultsEmail(scores) {
  const elapsed = elapsedSeconds();
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const tier = getSRITier(scores.composite);
  fetch('https://formsubmit.co/ajax/tom.flowerdew@wearefortify.ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      _subject: `Interview Sim — ${STATE.candidate} — Resourceful Graduate (O4)`,
      _captcha: 'false',
      _template: 'table',
      Prototype: 'Resourceful Graduate Challenge (O4)',
      Candidate: STATE.candidate || 'Unknown',
      'SRI Score': `${scores.composite} / 100`,
      Tier: tier.label,
      'Exploratory Score': `${scores.exploratory} / 100`,
      'Persistence Score': `${scores.persistence} / 100`,
      'Efficiency Score': `${scores.efficiency} / 100`,
      'Tasks Completed': `${STATE.tasksCompleted} / 3`,
      'Help Requests': String(STATE.helpRequests),
      'Time Elapsed': `${mins}m ${secs}s`,
      Date: new Date().toLocaleString('en-GB'),
    })
  }).catch(() => {});
}

// ─── BOOT ────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', init);
