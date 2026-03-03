// content.js — All game content for "Day One at Meridian"

const GAME_CONTENT = {
  company: {
    name: "Meridian Advisory",
    domain: "meridian.co",
  },

  emails: [
    {
      id: "email-001",
      fromName: "Sarah Chen",
      fromEmail: "s.chen@meridian.co",
      subject: "Welcome! + Quick one for today",
      time: "8:47 AM",
      isUnread: true,
      folder: "inbox",
      isKey: false,
      body: `Hi there,

Welcome to Meridian! We're really glad to have you on board.

Quick one for your first day — could you take a look at the Hartwell situation and get me a draft response before end of day? Everything you need should be in the system.

Give me a shout if you need anything (I'm in meetings most of the day but will check messages when I can).

Cheers,
Sarah`
    },
    {
      id: "email-002",
      fromName: "Jake Morrow",
      fromEmail: "j.morrow@meridian.co",
      subject: "Welcome to the team 🎉",
      time: "8:30 AM",
      isUnread: true,
      folder: "inbox",
      isKey: false,
      body: `Hey,

Welcome!! Great to have you here. Things are a bit hectic at the moment (when are they not, honestly) but we'll find time to grab a coffee soon.

Heads up — things are a bit wild on the Hartwell account right now. You'll probably hear more about it.

Anyway, chat soon!
Jake`
    },
    {
      id: "email-003",
      fromName: "IT Support",
      fromEmail: "it@meridian.co",
      subject: "Your Meridian accounts are ready",
      time: "8:00 AM",
      isUnread: false,
      folder: "inbox",
      isKey: false,
      body: `Hi,

Your accounts have been set up and are ready to use.

You can access the company intranet from the Intranet icon on your desktop.

Files are available via the Files icon. Your shared drive is already mounted.

If you have any issues, contact IT Support: it@meridian.co

IT Support Team
Meridian Advisory`
    },
    {
      id: "email-004",
      fromName: "James Whitfield (Hartwell Corp)",
      fromEmail: "j.whitfield@hartwellcorp.com",
      subject: "RE: RE: RE: URGENT — SLA Breach — Account #HW-2847",
      time: "3 days ago",
      isUnread: false,
      folder: "inbox",
      isKey: true,
      discoveryId: "disc-hartwell-complaint",
      body: `To Whom It May Concern,

I have now followed up three times regarding incident #HW-2847 (reporting discrepancy, raised 24 Feb). Per Clause 4.2 of our Service Level Agreement, Meridian is in breach of the 48-hour response commitment.

This is unacceptable. Hartwell Corporation expects a formal written response with a remediation plan by close of business this Friday.

Failure to respond appropriately will result in escalation to our legal team and review of the contract.

James Whitfield
Director of Operations
Hartwell Corporation`
    },
    {
      id: "email-005",
      fromName: "Maria Rodriguez",
      fromEmail: "m.rodriguez@meridian.co",
      subject: "FWD: Hartwell — needs attention urgently",
      time: "4 days ago",
      isUnread: false,
      folder: "inbox",
      isKey: true,
      discoveryId: "disc-hartwell-sla-hint",
      body: `Hi team,

FYI — the Hartwell complaint is escalating and someone needs to pick this up urgently.

Whoever handles it — the client contract is in the shared drive under Clients > Hartwell. Make sure you check Clause 4.2 (response time requirements) before drafting anything. This isn't a standard response situation.

The contact is James Whitfield (j.whitfield@hartwellcorp.com).

— Maria

------- Forwarded Message -------
From: James Whitfield <j.whitfield@hartwellcorp.com>
Subject: URGENT — SLA Breach — Account #HW-2847

To Whom It May Concern, this is the third time I am writing about this issue...`
    },
    {
      id: "email-006",
      fromName: "Sarah Chen",
      fromEmail: "s.chen@meridian.co",
      subject: "Hartwell — holding until new hire starts",
      time: "5 days ago",
      isUnread: false,
      folder: "inbox",
      isKey: false,
      body: `Team,

I've asked James to give us until end of this week. Let's handle this properly once our new analyst is up to speed — I'll brief them on day one.

Sarah`
    }
  ],

  files: {
    tree: {
      "Clients": {
        "Hartwell": {
          "Hartwell_Contract_SLA_2024.txt": "file-contract",
          "Issue_Log_HW-2847.txt": "file-issuelog",
          "Client_Response_Template.txt": "file-basic-template"
        },
        "Brennan_Industries": {
          "Annual_Review_2024.txt": "file-brennan"
        },
        "Okafor_Group": {
          "Project_Scope_2025.txt": "file-okafor"
        }
      },
      "Templates": {
        "Level2_Escalation_Template.txt": "file-escalation-template"
      },
      "Company": {
        "Employee_Handbook.txt": "file-handbook",
        "Org_Chart.txt": "file-orgchart"
      }
    },

    contents: {
      "file-contract": {
        name: "Hartwell_Contract_SLA_2024.txt",
        isKey: true,
        discoveryId: "disc-contract",
        content: `MERIDIAN ADVISORY SERVICES
SERVICE LEVEL AGREEMENT
═══════════════════════════════════════

Client:           Hartwell Corporation
Account Number:   #HW-2847
Effective Date:   1 January 2024
Contract Period:  12 months

───────────────────────────────────────
SECTION 4 — SERVICE STANDARDS
───────────────────────────────────────

CLAUSE 4.1 — GENERAL RESPONSE TIMES
Standard queries will receive a response within 5 business days.

CLAUSE 4.2 — INCIDENT RESPONSE (TIER 1)
All Tier-1 incidents must receive a FORMAL WRITTEN RESPONSE
within 48 hours of initial report.

Failure to meet this deadline constitutes an SLA breach and
triggers the following mandatory requirements:

  (a) Written acknowledgment from a Senior Analyst or above
  (b) Formal remediation plan submitted within 5 business days
  (c) Immediate escalation to Client Success Legal Team
      Contact: legal@meridian.co
  (d) Response must use the approved Level 2 Escalation Template

CLAUSE 4.3 — REPEATED BREACHES
Three or more SLA breaches within a 90-day period entitles the
client to request a contract review and/or penalty clauses.

───────────────────────────────────────
SECTION 7 — KEY CONTACTS
───────────────────────────────────────

Client Contact:   James Whitfield, Director of Operations
Client Email:     j.whitfield@hartwellcorp.com
Account Manager:  Sarah Chen (s.chen@meridian.co)
Legal (Meridian): legal@meridian.co`
      },

      "file-issuelog": {
        name: "Issue_Log_HW-2847.txt",
        isKey: true,
        discoveryId: "disc-issuelog",
        content: `HARTWELL ACCOUNT #HW-2847 — INCIDENT LOG
Last Updated: 25 Feb 2025
═══════════════════════════════════════

INCIDENT #1
  Date Raised:    12 Feb 2025
  Type:           Data export delay
  Status:         ✓ RESOLVED (15 Feb)
  Response Time:  72 hrs [SLA BREACHED — waived by client]

INCIDENT #2
  Date Raised:    19 Feb 2025
  Type:           Client portal access issue
  Status:         ✓ RESOLVED (21 Feb)
  Response Time:  48 hrs [SLA MET]

INCIDENT #3
  Date Raised:    24 Feb 2025
  Type:           Reporting discrepancy in Q4 export
  Status:         ⚠  OPEN — UNRESOLVED
  Response Time:  5+ days and counting [SLA BREACHED ×2]
  Assigned To:    [UNASSIGNED]
  Client Emails:  3 received, 0 sent

─────────────────────────────────────
NOTES:
Client is frustrated. Third breach in 6 weeks.
Per contract Clause 4.2, Level 2 escalation is required.
Use Level2_Escalation_Template.txt (Templates folder).
Loop in legal@meridian.co per contract requirements.`
      },

      "file-basic-template": {
        name: "Client_Response_Template.txt",
        isKey: false,
        discoveryId: "disc-basic-template",
        content: `STANDARD CLIENT RESPONSE TEMPLATE
(For general inquiries — NOT for SLA breaches)
═══════════════════════════════════════

Dear [Client Name],

Thank you for reaching out to Meridian Advisory.

We are currently reviewing your inquiry and will respond within
our standard timeframes as outlined in your service agreement.

Kind regards,
[Your Name]
Meridian Advisory

───────────────────────────────────────
⚠ NOTE: This template is for standard communications only.
For SLA breach situations (Clause 4.2), you MUST use the
Level 2 Escalation Template found in the Templates folder.`
      },

      "file-escalation-template": {
        name: "Level2_Escalation_Template.txt",
        isKey: true,
        discoveryId: "disc-escalation-template",
        content: `LEVEL 2 ESCALATION — FORMAL SLA BREACH RESPONSE
For use when Clause 4.2 is triggered
═══════════════════════════════════════

REQUIRED ACTIONS BEFORE SENDING:
  □ CC: legal@meridian.co
  □ Obtain sign-off from Senior Analyst or Manager
  □ Attach: Remediation Plan (steps to prevent recurrence)

───────────────────────────────────────
TEMPLATE:
───────────────────────────────────────

Dear [Client Contact Name],

On behalf of Meridian Advisory, I am writing in formal response
to incident #[INCIDENT NUMBER] raised on [DATE].

We sincerely apologise for the delay in responding, which fell
outside our contractual SLA commitments under Clause 4.2.

We take full responsibility for this breach and are committed
to the following remediation steps:

  1. [Immediate action to address the reported issue]
  2. [Process change to prevent recurrence]
  3. [Timeline for resolution: by DATE]

Please find our formal remediation plan attached.

This response has been reviewed and approved by [Senior Analyst].

Kind regards,
[Your Name]
[Your Title]
Meridian Advisory

CC: legal@meridian.co`
      },

      "file-brennan": {
        name: "Annual_Review_2024.txt",
        isKey: false,
        content: `BRENNAN INDUSTRIES — ANNUAL REVIEW 2024
═══════════════════════════════════════

Account Status: Active
Contract Renewal: March 2025

Q1 Performance: Strong — all SLAs met
Q2 Performance: Strong — all SLAs met
Q3 Performance: On track
Q4 Performance: Review pending

Overall: Client satisfaction score 8.7/10
No open incidents.`
      },

      "file-okafor": {
        name: "Project_Scope_2025.txt",
        isKey: false,
        content: `OKAFOR GROUP — PROJECT SCOPE 2025
═══════════════════════════════════════

Project: Digital Transformation Advisory
Start Date: February 2025
Duration: 6 months

Phase 1: Discovery & Assessment (Feb–Mar)
Phase 2: Strategy Development (Apr)
Phase 3: Implementation Support (May–Jul)

Status: Phase 1 in progress
No open incidents.`
      },

      "file-handbook": {
        name: "Employee_Handbook.txt",
        isKey: false,
        content: `MERIDIAN ADVISORY — EMPLOYEE HANDBOOK
Version 3.2, Updated January 2025
═══════════════════════════════════════

WELCOME TO MERIDIAN
...

SECTION 12 — CLIENT MANAGEMENT
All client escalations must follow the documented process.

For Level 2 escalations (SLA breaches), always use the
correct template and involve legal. See the Intranet under
Processes > Client Management for full details.

SECTION 5 — WORKING HOURS
Standard hours are 9am–5:30pm. Flexible arrangements available.

SECTION 8 — EXPENSES
Submit all expenses within 30 days via the HR portal.

...`
      },

      "file-orgchart": {
        name: "Org_Chart.txt",
        isKey: false,
        content: `MERIDIAN ADVISORY — ORG CHART
═══════════════════════════════════════

CEO: David Park
  │
  ├── Head of Client Success: Amanda Osei
  │     ├── Senior Analyst: Sarah Chen  ← your manager
  │     │     └── Analyst: [You]  ← new hire
  │     ├── Senior Analyst: Maria Rodriguez
  │     └── Analyst: Jake Morrow
  │
  ├── Legal Counsel: Tom Fitzgerald
  │     Contact: legal@meridian.co
  │
  └── IT & Operations: Dev Patel
        Contact: it@meridian.co`
      }
    }
  },

  intranet: {
    "home": {
      title: "Meridian Intranet — Home",
      isKey: false,
      html: `
        <div class="intranet-page">
          <h2>Welcome to the Meridian Intranet</h2>
          <p class="intranet-subtitle">Your central hub for company resources, processes, and news.</p>
          <div class="intranet-cards">
            <button class="intranet-card" data-page="processes">
              <span class="card-icon">📋</span>
              <span class="card-title">Processes &amp; Guides</span>
            </button>
            <button class="intranet-card" data-page="directory">
              <span class="card-icon">👥</span>
              <span class="card-title">Staff Directory</span>
            </button>
            <button class="intranet-card" data-page="news">
              <span class="card-icon">📰</span>
              <span class="card-title">Company News</span>
            </button>
            <button class="intranet-card" data-page="it-help">
              <span class="card-icon">💻</span>
              <span class="card-title">IT Help</span>
            </button>
          </div>
          <hr>
          <h3>Recent Updates</h3>
          <ul class="intranet-news-list">
            <li><strong>Today:</strong> New analyst joining the Client Success team. Welcome!</li>
            <li><strong>Last week:</strong> Q1 all-hands meeting scheduled — Friday at 3pm.</li>
            <li><strong>Feb:</strong> Updated client escalation process now live on intranet.</li>
          </ul>
        </div>`
    },
    "processes": {
      title: "Processes & Guides",
      isKey: false,
      html: `
        <div class="intranet-page">
          <nav class="intranet-breadcrumb"><button data-page="home">Home</button> › Processes</nav>
          <h2>Processes &amp; Guides</h2>
          <ul class="intranet-link-list">
            <li><button class="intranet-link" data-page="process-onboarding">📄 New Employee Onboarding</button></li>
            <li><button class="intranet-link" data-page="process-client-mgmt">📄 Client Management &amp; Escalations</button></li>
            <li><button class="intranet-link" data-page="process-expenses">📄 Expense Claims</button></li>
            <li><button class="intranet-link" data-page="process-leave">📄 Annual Leave Requests</button></li>
          </ul>
        </div>`
    },
    "process-client-mgmt": {
      title: "Client Management & Escalations",
      isKey: true,
      discoveryId: "disc-intranet-process",
      html: `
        <div class="intranet-page">
          <nav class="intranet-breadcrumb"><button data-page="home">Home</button> › <button data-page="processes">Processes</button> › Client Management</nav>
          <h2>Client Management &amp; Escalation Process</h2>

          <h3>Level 1 Escalation (Standard)</h3>
          <p>For general complaints or missed standard response times. Respond using the <strong>Standard Client Response Template</strong> within 5 business days.</p>

          <h3 class="warning-heading">⚠ Level 2 Escalation (SLA Breach)</h3>
          <p>Triggered when a Tier-1 SLA commitment (e.g., <strong>Clause 4.2</strong>) has been breached.</p>
          <p><strong>Required steps — all mandatory:</strong></p>
          <ol class="process-steps">
            <li>Notify <strong>legal@meridian.co</strong> immediately</li>
            <li>Use the <strong>Level 2 Escalation Template</strong> (Files → Templates folder)</li>
            <li>Obtain sign-off from your line manager before sending</li>
            <li>Respond to client within 24 hours of identifying the breach</li>
            <li>Submit a remediation plan within 5 business days</li>
          </ol>
          <p class="intranet-warning">Failure to follow this process may have contractual and legal consequences for Meridian.</p>

          <h3>Key Contacts</h3>
          <ul>
            <li>Legal Team: <strong>legal@meridian.co</strong> (Tom Fitzgerald)</li>
            <li>Head of Client Success: Amanda Osei</li>
          </ul>
        </div>`
    },
    "directory": {
      title: "Staff Directory",
      isKey: false,
      html: `
        <div class="intranet-page">
          <nav class="intranet-breadcrumb"><button data-page="home">Home</button> › Directory</nav>
          <h2>Staff Directory</h2>
          <table class="intranet-table">
            <thead><tr><th>Name</th><th>Role</th><th>Email</th></tr></thead>
            <tbody>
              <tr><td>David Park</td><td>CEO</td><td>d.park@meridian.co</td></tr>
              <tr><td>Amanda Osei</td><td>Head of Client Success</td><td>a.osei@meridian.co</td></tr>
              <tr><td>Sarah Chen</td><td>Senior Analyst</td><td>s.chen@meridian.co</td></tr>
              <tr><td>Maria Rodriguez</td><td>Senior Analyst</td><td>m.rodriguez@meridian.co</td></tr>
              <tr><td>Jake Morrow</td><td>Analyst</td><td>j.morrow@meridian.co</td></tr>
              <tr><td>Tom Fitzgerald</td><td>Legal Counsel</td><td>legal@meridian.co</td></tr>
              <tr><td>Dev Patel</td><td>IT &amp; Operations</td><td>it@meridian.co</td></tr>
            </tbody>
          </table>
        </div>`
    },
    "news": {
      title: "Company News",
      isKey: false,
      html: `
        <div class="intranet-page">
          <nav class="intranet-breadcrumb"><button data-page="home">Home</button> › News</nav>
          <h2>Company News</h2>
          <article class="news-item">
            <h4>March 2025 — Meridian wins Best Advisory Firm (Regional)</h4>
            <p>We're thrilled to announce Meridian took home the award at this year's regional business awards ceremony.</p>
          </article>
          <article class="news-item">
            <h4>February 2025 — New client portal launched</h4>
            <p>Our revamped client portal is live. All clients have been notified with login instructions.</p>
          </article>
          <article class="news-item">
            <h4>January 2025 — Q4 results published</h4>
            <p>Strong performance across all teams. Full report available on request from your manager.</p>
          </article>
        </div>`
    },
    "it-help": {
      title: "IT Help",
      isKey: false,
      html: `
        <div class="intranet-page">
          <nav class="intranet-breadcrumb"><button data-page="home">Home</button> › IT Help</nav>
          <h2>IT Help &amp; Support</h2>
          <p>Contact: <strong>it@meridian.co</strong> or raise a ticket below.</p>
          <h3>Common Issues</h3>
          <ul>
            <li>Password reset: contact IT directly</li>
            <li>Software requests: raise a ticket</li>
            <li>VPN issues: see VPN setup guide</li>
            <li>New equipment: request via IT portal</li>
          </ul>
        </div>`
    },
    "process-onboarding": {
      title: "New Employee Onboarding",
      isKey: false,
      html: `
        <div class="intranet-page">
          <nav class="intranet-breadcrumb"><button data-page="home">Home</button> › <button data-page="processes">Processes</button> › Onboarding</nav>
          <h2>New Employee Onboarding</h2>
          <p>Your first week checklist:</p>
          <ul>
            <li>Set up your accounts (IT sends details on day 1)</li>
            <li>Familiarise yourself with the intranet and shared drive</li>
            <li>Read the Employee Handbook (Files → Company)</li>
            <li>Meet your team and line manager</li>
            <li>Complete compliance training by end of week 1</li>
          </ul>
        </div>`
    },
    "process-expenses": {
      title: "Expense Claims",
      isKey: false,
      html: `
        <div class="intranet-page">
          <nav class="intranet-breadcrumb"><button data-page="home">Home</button> › <button data-page="processes">Processes</button> › Expenses</nav>
          <h2>Expense Claims</h2>
          <p>Submit all expenses within 30 days via the HR portal.</p>
          <p>Mileage: 45p per mile. Meals: up to £30/day when travelling.</p>
        </div>`
    },
    "process-leave": {
      title: "Annual Leave",
      isKey: false,
      html: `
        <div class="intranet-page">
          <nav class="intranet-breadcrumb"><button data-page="home">Home</button> › <button data-page="processes">Processes</button> › Leave</nav>
          <h2>Annual Leave</h2>
          <p>Submit requests at least 2 weeks in advance via the HR portal.</p>
          <p>Entitlement: 25 days per year, plus bank holidays.</p>
        </div>`
    }
  },

  chat: {
    contacts: [
      {
        id: "sarah",
        name: "Sarah Chen",
        role: "Senior Analyst (your manager)",
        initials: "SC",
        color: "#4F46E5",
        initialMessages: [
          { from: "them", text: "Morning! Really glad you're starting today. Settle in and get stuck into the Hartwell thing when you're ready — I'll check in later.", time: "8:48 AM" }
        ],
        responses: [
          { triggers: ["hartwell", "what is", "what's"], text: "Everything should be in the system — check the emails and the shared files. You'll find what you need 👍" },
          { triggers: ["help", "confused", "don't know", "dont know", "what do i do", "what should"], text: "I'm in back-to-back meetings today, sorry! All the info is there — check the emails and the files/intranet. You've got this." },
          { triggers: ["sla", "clause", "contract"], text: "Yes, it's definitely an SLA situation. Check the contract file and the intranet for the right process." },
          { triggers: ["legal", "tom", "escalate"], text: "Yep, legal need to be looped in for anything like this. Check the process docs on the intranet." },
          { triggers: ["template", "draft", "respond"], text: "There's a specific template for this situation — it's not the standard one. Have a look in the Templates folder." },
          { triggers: ["default"], text: "Busy morning over here! Check the system — everything you need should be there." }
        ]
      },
      {
        id: "jake",
        name: "Jake Morrow",
        role: "Analyst",
        initials: "JM",
        color: "#059669",
        initialMessages: [
          { from: "them", text: "Hey! Welcome 👋 Let me know if you need anything. Heads up — Hartwell situation is a bit of a mess rn lol", time: "8:33 AM" }
        ],
        responses: [
          { triggers: ["hartwell", "what is", "what happened"], text: "Oh yeah that's been sitting there for days. Basically they raised a ticket that nobody picked up and now they're fuming. Check the email chain and the issue log in the files." },
          { triggers: ["sla", "clause 4", "breach"], text: "Yeah it's a Clause 4.2 situation — means Level 2 escalation. Don't just send a normal reply, there's a whole process. Intranet should have the details." },
          { triggers: ["legal"], text: "Yeah legal definitely need to be CC'd. Tom Fitzgerald handles that. legal@meridian.co I think." },
          { triggers: ["template"], text: "There's a Level 2 escalation template somewhere in the Templates folder. Use that, not the standard client one." },
          { triggers: ["help", "confused", "what do i do"], text: "Honestly just dig around the system — emails, files, intranet. It's all there, just scattered. That's kind of how it always is here haha." },
          { triggers: ["default"], text: "Haha rough first day right? You'll figure it out. Just dig around the system and piece it together 🕵️" }
        ]
      }
    ]
  },

  decision: {
    minimumDiscoveries: 3,
    options: [
      {
        id: "opt-a",
        label: "Reply directly to James Whitfield with an apology and a promise to look into it.",
        score: 15,
        tag: "Incomplete",
        tagColor: "#D97706",
        feedback: "You identified who to contact, but missed the required Level 2 escalation process. Sending a personal apology without following Clause 4.2 procedures could have contractual implications for Meridian. A well-meaning but incomplete response."
      },
      {
        id: "opt-b",
        label: "Email Sarah asking her to handle it — you're new and this seems above your level.",
        score: 0,
        tag: "Not Self-Reliant",
        tagColor: "#DC2626",
        feedback: "Escalating to your manager without attempting to solve the problem independently is the lowest-scoring approach. All the information needed was available in the system. This is precisely the behaviour this assessment is designed to screen out."
      },
      {
        id: "opt-c",
        label: "Notify legal@meridian.co, draft a formal SLA breach response using the Level 2 Escalation Template, and request Sarah's sign-off before sending.",
        score: 100,
        tag: "Optimal",
        tagColor: "#059669",
        feedback: "Excellent. You independently identified the SLA breach, located the correct escalation process, involved legal as contractually required, used the right template, and appropriately flagged for manager approval before sending. This is exactly the self-directed, process-aware problem-solving we look for."
      },
      {
        id: "opt-d",
        label: "Call James Whitfield to discuss the situation before committing to anything in writing.",
        score: 25,
        tag: "Partial",
        tagColor: "#D97706",
        feedback: "Shows client focus and initiative. However, the contract specifies a formal written response, and calling without following the documented escalation process first could make the situation worse. Good instinct, but the process matters here."
      }
    ]
  }
};
