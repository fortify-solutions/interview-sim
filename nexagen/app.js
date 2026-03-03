'use strict';

// ============================================================
// INTRANET FILE DATA
// ============================================================

const FILES = {

  // ── Company Resources ──────────────────────────────────────

  'glossary': {
    name: 'Glossary & Acronyms',
    ext: 'txt',
    icon: '📄',
    path: 'Company Resources',
    render: () => `
      <div class="doc-section">
        <div class="doc-tag-info">📘 Official Reference — Knowledge Management Office</div>
        <div class="doc-text" style="color:var(--text-lo);font-size:11.5px;margin-bottom:14px;">Last Updated: 14 January 2025 · Questions: kmo@nexagen-labs.com</div>
        <p class="doc-text">This document is the official reference for all internal acronyms and terminology used across Nexagen Labs. If a term is used in internal communications, it should be defined here.</p>
      </div>

      <div class="doc-section">
        <div class="doc-heading">A – C</div>
        <div class="glossary-term">
          <div class="gt-acronym">BCF</div>
          <div class="gt-full">Bioenergetics Correction Factor</div>
          <div class="gt-def">The environmental multiplier applied when calculating MER. Current standard BCF for all Project Chimera organisms: <strong>0.847</strong>. Updated quarterly by the Bioenergetics Lab.</div>
        </div>
        <div class="glossary-term">
          <div class="gt-acronym">C-1 / C-2 / C-3</div>
          <div class="gt-full">Chimera Organism Designations</div>
          <div class="gt-def">The three extremophile organisms discovered under the Project Chimera Science Mission. C-1 = "Thermophage Alpha," C-2 = "Halophyte Prime," C-3 = "Cryo-Eater." See Research/Team Roster for assigned PIs.</div>
        </div>
      </div>

      <div class="doc-section">
        <div class="doc-heading">D – E</div>
        <div class="glossary-term">
          <div class="gt-acronym">DEPD</div>
          <div class="gt-full">Department of Extremophile & Phylogenomic Discovery</div>
          <div class="gt-def">The primary research division leading Project Chimera. Director: Dr. Sarah Chen.</div>
        </div>
        <div class="glossary-term">
          <div class="gt-acronym">EFF</div>
          <div class="gt-full">Extremophile Field Finding</div>
          <div class="gt-def">Any observational or experimental result generated from field samples collected by DEPD teams.</div>
        </div>
        <div class="glossary-term">
          <div class="gt-acronym">ERB</div>
          <div class="gt-full">Ethics Review Board</div>
          <div class="gt-def">Internal governance board. All VPAs must pass ERB review before implementation.</div>
        </div>
      </div>

      <div class="doc-section">
        <div class="doc-heading">G – M</div>
        <div class="glossary-term">
          <div class="gt-acronym">GMI</div>
          <div class="gt-full">Genome Mapping Initiative</div>
          <div class="gt-def">Active secondary research project. See Finance for budget codes.</div>
        </div>
        <div class="glossary-term">
          <div class="gt-acronym">MER</div>
          <div class="gt-full">Metabolic Efficiency Rate</div>
          <div class="gt-def">A key performance metric for Chimera organisms. MER measures the ratio of usable metabolic output energy to total input energy, corrected by the BCF. <em>See Protocols &amp; Guides for the mandatory reporting format.</em></div>
        </div>
      </div>

      <div class="doc-section">
        <div class="doc-heading">P – Z</div>
        <div class="glossary-term">
          <div class="gt-acronym">PCSM</div>
          <div class="gt-full">Project Chimera Science Mission</div>
          <div class="gt-def">The overarching research initiative under which organisms C-1, C-2, and C-3 were discovered and are currently being studied. Initiated Q2 2023. Budget managed by the Finance division.</div>
        </div>
        <div class="glossary-term">
          <div class="gt-acronym">PI</div>
          <div class="gt-full">Principal Investigator (Lead Scientist)</div>
          <div class="gt-def">The lead scientist responsible for a given organism line or project. See Research/Team Roster for current PIs.</div>
        </div>
        <div class="glossary-term">
          <div class="gt-acronym">SOP</div>
          <div class="gt-full">Standard Operating Procedure</div>
        </div>
        <div class="glossary-term">
          <div class="gt-acronym">VPA</div>
          <div class="gt-full">Validated Protocol for Analysis</div>
          <div class="gt-def">Any protocol that has passed the ERB review and is approved for use in official analyses.</div>
        </div>
      </div>
    `
  },

  'employee-handbook': {
    name: 'Employee Handbook (Excerpt)',
    ext: 'txt',
    icon: '📄',
    path: 'Company Resources',
    render: () => `
      <div class="doc-section">
        <div class="doc-text" style="color:var(--text-lo);font-size:11.5px;margin-bottom:14px;">Version 4.2 · Updated February 2024 · HR Division</div>
      </div>
      <div class="doc-section">
        <div class="doc-heading">Section 4.1 — Information Resources</div>
        <p class="doc-text">All employees have access to the company Intranet via their web portal. The Intranet is organised into the following top-level directories: Company Resources, Research, Finance, Protocols &amp; Guides, and Archive.</p>
        <p class="doc-text">If you cannot find what you need, consult the Glossary &amp; Acronyms document in Company Resources, or contact your line manager.</p>
      </div>
      <div class="doc-section">
        <div class="doc-heading">Section 4.2 — Requests &amp; Deliverables</div>
        <p class="doc-text">All deliverables submitted to senior staff should include your name, date, and the relevant project code. Responses to data requests should cite the source document.</p>
      </div>
      <div class="doc-section">
        <div class="doc-heading">Section 7 — Working Hours</div>
        <p class="doc-text">Core hours are 9:00 AM – 3:00 PM. Flexible start and end times permitted outside core hours with manager approval.</p>
      </div>
      <div class="doc-section">
        <div class="doc-heading">Section 12 — Probation</div>
        <p class="doc-text">New employees enter a 90-day probationary period. During this time, performance is evaluated on accuracy, initiative, and professionalism. Managers are encouraged to provide weekly feedback.</p>
      </div>
    `
  },

  // ── Research ───────────────────────────────────────────────

  'team-roster': {
    name: 'Team Roster',
    ext: 'xlsx',
    icon: '📊',
    path: 'Research',
    render: () => `
      <div class="doc-section">
        <div class="doc-tag-info">📊 PCSM — Active Team Roster</div>
        <div class="doc-text" style="color:var(--text-lo);font-size:11.5px;margin-bottom:14px;">Last Updated: 8 January 2025 · Maintained by DEPD Administration</div>
      </div>
      <div class="doc-section">
        <div class="doc-heading">C-Series Organisms — Lead Scientists (PIs)</div>
        <table class="doc-table">
          <thead>
            <tr>
              <th>Organism</th>
              <th>Common Name</th>
              <th>Lead Scientist (PI)</th>
              <th>Department</th>
              <th>Lab</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="code-cell">C-1</td>
              <td>Thermophage Alpha</td>
              <td><strong>Dr. Amara Osei</strong></td>
              <td>Microbiology</td>
              <td>Lab 4B</td>
              <td style="font-family:var(--mono);font-size:11px;">aosei@nxg.io</td>
            </tr>
            <tr>
              <td class="code-cell">C-2</td>
              <td>Halophyte Prime</td>
              <td><strong>Dr. Lin Wei</strong></td>
              <td>Biochemistry</td>
              <td>Lab 7A</td>
              <td style="font-family:var(--mono);font-size:11px;">lwei@nxg.io</td>
            </tr>
            <tr>
              <td class="code-cell">C-3</td>
              <td>Cryo-Eater</td>
              <td><strong>Dr. Priya Nair</strong></td>
              <td>Extremophile Research</td>
              <td>Lab 12</td>
              <td style="font-family:var(--mono);font-size:11px;">pnair@nxg.io</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="doc-section">
        <div class="doc-heading">Data Analytics</div>
        <table class="doc-table">
          <thead><tr><th>Name</th><th>Role</th><th>Email</th></tr></thead>
          <tbody>
            <tr><td><strong>Marcus Reid</strong></td><td>Senior Data Analyst</td><td style="font-family:var(--mono);font-size:11px;">m.reid@nexagen-labs.com</td></tr>
            <tr><td><em>(Your Name)</em></td><td>Junior Analyst (Probationary)</td><td>—</td></tr>
          </tbody>
        </table>
        <p class="doc-text" style="margin-top:10px;font-size:11.5px;color:var(--text-lo);">Note: B-series organisms (B-1, B-2, B-3) are managed under a separate monitoring program. Contact Marcus Reid for B-series data requests.</p>
      </div>
    `
  },

  'c3-profile': {
    name: 'Organism C-3 — Profile & Data',
    ext: 'txt',
    icon: '🔬',
    path: 'Research',
    render: () => `
      <div class="doc-section">
        <div class="doc-tag-info">🔬 Project Chimera Science Mission — Organism File</div>
        <div class="doc-kv">
          <span class="doc-kv-key">Designation</span><span class="doc-kv-val">C-3 ("Cryo-Eater")</span>
          <span class="doc-kv-key">Lead Scientist</span><span class="doc-kv-val">Dr. Priya Nair · Lab 12</span>
          <span class="doc-kv-key">Last Updated</span><span class="doc-kv-val">20 December 2024</span>
        </div>
      </div>
      <div class="doc-section">
        <div class="doc-heading">Classification</div>
        <div class="doc-kv">
          <span class="doc-kv-key">Kingdom</span><span class="doc-kv-val">Bacteria</span>
          <span class="doc-kv-key">Phylum</span><span class="doc-kv-val">Proteobacteria (tentative)</span>
          <span class="doc-kv-key">Discovered</span><span class="doc-kv-val">McMurdo Dry Valleys, Antarctica, June 2023</span>
          <span class="doc-kv-key">Growth temp.</span><span class="doc-kv-val">−15°C to +4°C</span>
          <span class="doc-kv-key">pH tolerance</span><span class="doc-kv-val">5.5 – 8.0</span>
          <span class="doc-kv-key">Generation time</span><span class="doc-kv-val">~22 hours (optimal)</span>
        </div>
      </div>
      <div class="doc-section">
        <div class="doc-heading">Metabolic Data (Q4 2024)</div>
        <div class="doc-text" style="font-size:11.5px;color:var(--text-lo);margin-bottom:10px;">Bioenergetics Lab — Batch Analysis #4, December 2024</div>
        <div class="doc-kv">
          <span class="doc-kv-key">Sample size (n)</span><span class="doc-kv-val">24</span>
          <span class="doc-kv-key">BCF applied</span><span class="doc-kv-val">0.847 (standard, per SOP-MET-007)</span>
          <span class="doc-kv-key">Calculated MER</span><span class="doc-kv-val">2.84691</span>
          <span class="doc-kv-key">Std. Deviation</span><span class="doc-kv-val">0.02341</span>
          <span class="doc-kv-key">Sample size</span><span class="doc-kv-val">n = 24</span>
        </div>
        <div class="doc-code-block" style="margin-top:10px;">
          <code><span class="code-comment">// Raw MER output — pre-formatting
// For mandatory reporting format, see Protocols & Guides</span>
MER_raw   = 2.84691
SD_raw    = 0.02341
n         = 24</code>
        </div>
      </div>
      <div class="doc-section">
        <div class="doc-heading">Growth Rate Data (Q4 2024)</div>
        <div class="doc-text" style="font-size:11.5px;color:var(--text-lo);margin-bottom:10px;">Period: October – December 2024 · Method: Optical density (OD600)</div>
        <div class="doc-kv">
          <span class="doc-kv-key">Avg. daily growth</span><span class="doc-kv-val">+3.7%</span>
          <span class="doc-kv-key">Std. Deviation</span><span class="doc-kv-val">±0.4%</span>
          <span class="doc-kv-key">Observations (n)</span><span class="doc-kv-val">18</span>
        </div>
      </div>
      <div class="doc-section">
        <div class="doc-heading">Notes</div>
        <p class="doc-text">C-3 exhibits anomalously high cold-tolerance compared to other known psychrophilic bacteria. Full paper currently in preparation (target submission: Q2 2025). Contact Dr. Nair for access to raw sequence data.</p>
      </div>
    `
  },

  'c1-profile': {
    name: 'Organism C-1 — Profile',
    ext: 'txt',
    icon: '🔬',
    path: 'Research',
    render: () => `
      <div class="doc-section">
        <div class="doc-tag-info">🔬 Project Chimera Science Mission — Organism File</div>
        <div class="doc-kv">
          <span class="doc-kv-key">Designation</span><span class="doc-kv-val">C-1 ("Thermophage Alpha")</span>
          <span class="doc-kv-key">Lead Scientist</span><span class="doc-kv-val">Dr. Amara Osei · Lab 4B</span>
          <span class="doc-kv-key">Last Updated</span><span class="doc-kv-val">3 November 2024</span>
        </div>
      </div>
      <div class="doc-section">
        <div class="doc-heading">Classification</div>
        <div class="doc-kv">
          <span class="doc-kv-key">Kingdom</span><span class="doc-kv-val">Archaea</span>
          <span class="doc-kv-key">Discovered</span><span class="doc-kv-val">Yellowstone thermal vent, March 2023</span>
          <span class="doc-kv-key">Growth temp.</span><span class="doc-kv-val">70°C – 95°C</span>
          <span class="doc-kv-key">pH tolerance</span><span class="doc-kv-val">2.0 – 4.5 (highly acidic)</span>
        </div>
      </div>
      <div class="doc-section">
        <div class="doc-heading">Status</div>
        <p class="doc-text">C-1 analysis is ongoing. Q4 2024 metabolic data collection in progress. Preliminary results expected Q1 2025. Contact Dr. Osei for latest updates.</p>
      </div>
    `
  },

  'b2-q3-data': {
    name: 'Organism B-2 — Q3 Growth Data',
    ext: 'txt',
    icon: '📊',
    path: 'Research',
    render: () => `
      <div class="doc-section">
        <div class="doc-tag-alert">⚠ NOTE: This report covers Q3 2024 (July – September) only. Q4 2024 data collection is ongoing. Updated report expected late January 2025.</div>
        <div class="doc-kv">
          <span class="doc-kv-key">Designation</span><span class="doc-kv-val">B-2 ("Sulfur Phantom")</span>
          <span class="doc-kv-key">Data Contact</span><span class="doc-kv-val">Marcus Reid · m.reid@nexagen-labs.com</span>
          <span class="doc-kv-key">Report Generated</span><span class="doc-kv-val">4 October 2024</span>
        </div>
      </div>
      <div class="doc-section">
        <div class="doc-heading">Organism Details</div>
        <div class="doc-kv">
          <span class="doc-kv-key">Environment</span><span class="doc-kv-val">Deep hydrothermal vent, Pacific Ocean</span>
          <span class="doc-kv-key">Monitor</span><span class="doc-kv-val">Marcus Reid (B-series program)</span>
          <span class="doc-kv-key">Classification</span><span class="doc-kv-val">Sulphur-oxidising chemolithotroph (provisional)</span>
        </div>
      </div>
      <div class="doc-section">
        <div class="doc-heading">Growth Rate Data — Q3 2024</div>
        <div class="doc-text" style="font-size:11.5px;color:var(--text-lo);margin-bottom:10px;">Period: July – September 2024 · Method: Fluorescence-based cell count</div>
        <div class="doc-kv">
          <span class="doc-kv-key">Avg. daily growth</span><span class="doc-kv-val">+2.1%</span>
          <span class="doc-kv-key">Std. Deviation</span><span class="doc-kv-val">±0.3%</span>
          <span class="doc-kv-key">Observations (n)</span><span class="doc-kv-val">15</span>
        </div>
        <p class="doc-text" style="margin-top:10px;font-size:11.5px;">Data quality note: Q3 collection was affected by a sensor malfunction in August. The 15 valid observations used here have been independently validated. Q4 data collection uses upgraded sensors.</p>
      </div>
      <div class="doc-section">
        <div class="doc-heading">Q4 2024 Status</div>
        <p class="doc-text" style="color:var(--amber);">Q4 growth data for B-2 has not yet been collected or processed. Do not extrapolate from Q3 values. Contact Marcus Reid when the updated dataset is needed.</p>
      </div>
    `
  },

  // ── Research / Archive ─────────────────────────────────────

  'b2-q1-data': {
    name: 'B-2 Q1 Preliminary Data (Archived)',
    ext: 'txt',
    icon: '📦',
    path: 'Research › Archive',
    render: () => `
      <div class="doc-section">
        <div class="doc-tag-warn">⚠ ARCHIVED — Preliminary data. Do not use for formal analysis.</div>
        <p class="doc-text">This is early preliminary data from Q1 2024 collection. Sensor calibration was incomplete during this period; values should be treated as indicative only.</p>
      </div>
      <div class="doc-section">
        <div class="doc-heading">B-2 Q1 2024 (Preliminary)</div>
        <div class="doc-kv">
          <span class="doc-kv-key">Avg. daily growth</span><span class="doc-kv-val">+1.3% <em>(preliminary)</em></span>
          <span class="doc-kv-key">Observations (n)</span><span class="doc-kv-val">6 (insufficient)</span>
        </div>
        <p class="doc-text" style="margin-top:10px;font-size:11.5px;color:var(--text-lo);">For current data, see the Q3 2024 report in the main Research folder.</p>
      </div>
    `
  },

  'project-phoenix': {
    name: 'Project Phoenix — Final Report',
    ext: 'txt',
    icon: '📦',
    path: 'Research › Archive',
    render: () => `
      <div class="doc-section">
        <div class="doc-tag-warn">⚠ ARCHIVED — Project closed FY2022</div>
        <p class="doc-text">Project Phoenix was a precursor initiative to Project Chimera, focused on preliminary extremophile screening in terrestrial thermal environments. The project was closed in FY2022 after the discovery of the Chimera organisms rendered its objectives redundant.</p>
        <p class="doc-text" style="color:var(--text-lo);">All active work is now conducted under PCSM (Project Chimera Science Mission).</p>
        <p class="doc-text" style="font-size:11.5px;color:var(--text-lo);">For full archived data, contact: archives@nexagen-labs.com</p>
      </div>
    `
  },

  // ── Finance ────────────────────────────────────────────────

  'budget-codes-2024': {
    name: 'Budget Codes — FY2024',
    ext: 'xlsx',
    icon: '📊',
    path: 'Finance',
    render: () => `
      <div class="doc-section">
        <div class="doc-tag-info">✅ CURRENT — Active Budget Codes (FY2024)</div>
        <div class="doc-text" style="color:var(--text-lo);font-size:11.5px;margin-bottom:14px;">Finance Division · Raj Patel, Budget Manager · Last Updated: 1 October 2024</div>
      </div>
      <div class="doc-section">
        <div class="doc-heading">Active Projects</div>
        <table class="doc-table">
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Project Code</th>
              <th>Budget Code</th>
              <th>Allocated</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Project Chimera Science Mission</td>
              <td class="code-cell">PCSM</td>
              <td class="code-cell">BC-9947-CHM</td>
              <td>$4,200,000</td>
              <td class="status-active">Active</td>
            </tr>
            <tr>
              <td>Genome Mapping Initiative</td>
              <td class="code-cell">GMI</td>
              <td class="code-cell">BC-7734-GMI</td>
              <td>$1,800,000</td>
              <td class="status-active">Active</td>
            </tr>
            <tr>
              <td>Hydrothermal Field Survey</td>
              <td class="code-cell">HFS</td>
              <td class="code-cell">BC-6612-HFS</td>
              <td>$950,000</td>
              <td class="status-active">Active</td>
            </tr>
            <tr>
              <td>Deep Metagenomics Study</td>
              <td class="code-cell">DMS</td>
              <td class="code-cell">BC-5501-DMS</td>
              <td>$2,100,000</td>
              <td class="status-active">Active</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="doc-section">
        <p class="doc-text" style="font-size:11.5px;color:var(--text-lo);">For budget inquiries or amendments: finance@nexagen-labs.com · Ext. 2240</p>
      </div>
    `
  },

  'budget-codes-2021': {
    name: 'Budget Codes — FY2021',
    ext: 'xlsx',
    icon: '📦',
    path: 'Finance',
    outdated: true,
    render: () => `
      <div class="doc-section">
        <div class="doc-tag-warn">⚠ ARCHIVED — DO NOT USE FOR CURRENT SUBMISSIONS</div>
        <p class="doc-text">This document is for historical reference only. All codes listed below are closed. For current budget codes, see <strong>Finance / Budget Codes — FY2024</strong>.</p>
      </div>
      <div class="doc-section">
        <div class="doc-heading">Closed Projects (FY2021)</div>
        <table class="doc-table">
          <thead>
            <tr><th>Project Name</th><th>Project Code</th><th>Budget Code</th><th>Status</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Chimera Discovery Initiative</td>
              <td class="code-cell">CDI</td>
              <td class="code-cell">BC-4412-CDI</td>
              <td class="status-closed">CLOSED</td>
            </tr>
            <tr>
              <td>Polar Microbiome Survey</td>
              <td class="code-cell">PMS</td>
              <td class="code-cell">BC-3301-PMS</td>
              <td class="status-closed">CLOSED</td>
            </tr>
            <tr>
              <td>Early Genome Mapping</td>
              <td class="code-cell">EGM</td>
              <td class="code-cell">BC-2219-EGM</td>
              <td class="status-closed">CLOSED</td>
            </tr>
          </tbody>
        </table>
      </div>
    `
  },

  'expense-policy': {
    name: 'Expense Reimbursement Policy',
    ext: 'txt',
    icon: '📄',
    path: 'Finance',
    render: () => `
      <div class="doc-section">
        <div class="doc-text" style="color:var(--text-lo);font-size:11.5px;margin-bottom:14px;">HR Division · Last Updated: September 2023</div>
      </div>
      <div class="doc-section">
        <div class="doc-heading">Section 1: Eligible Expenses</div>
        <p class="doc-text">Travel, accommodation, and conference registration fees are reimbursable when pre-approved by your line manager. Lab consumables must be ordered through the procurement portal and are not subject to reimbursement.</p>
      </div>
      <div class="doc-section">
        <div class="doc-heading">Section 2: Submission Deadlines</div>
        <p class="doc-text">Expense claims must be submitted within 30 days of the expense date. Late claims require VP approval and may be declined.</p>
      </div>
      <div class="doc-section">
        <div class="doc-heading">Section 3: Process</div>
        <p class="doc-text">Submit all claims via the Finance portal with supporting receipts. Claims over $500 require a second approver. Standard reimbursement processing time: 10–15 business days.</p>
      </div>
    `
  },

  // ── Protocols & Guides ─────────────────────────────────────

  'guide-mer': {
    name: 'GUIDE — MER Calculation & Reporting',
    ext: 'txt',
    icon: '📋',
    path: 'Protocols & Guides',
    render: () => `
      <div class="doc-section">
        <div class="doc-tag-info">📋 MANDATORY PROTOCOL — All DEPD Staff</div>
        <div class="doc-kv">
          <span class="doc-kv-key">Protocol ID</span><span class="doc-kv-val">PRO-MET-008</span>
          <span class="doc-kv-key">Version</span><span class="doc-kv-val">3.2</span>
          <span class="doc-kv-key">Effective</span><span class="doc-kv-val">1 March 2024</span>
          <span class="doc-kv-key">Approved by</span><span class="doc-kv-val">Dr. Yuki Tanaka (CSO) · ERB-2024-41</span>
        </div>
      </div>

      <div class="doc-section">
        <div class="doc-heading">1. Purpose</div>
        <p class="doc-text">This protocol establishes the <strong>mandatory format</strong> for reporting Metabolic Efficiency Rate (MER) values in all internal and external communications, presentations, and data submissions. Inconsistent reporting has caused errors in past publications. ALL staff must adhere to this protocol.</p>
      </div>

      <div class="doc-section">
        <div class="doc-heading">2. Background</div>
        <div class="doc-code-block">
          <code>MER = (Output Energy) / (Input Energy × BCF)

BCF = Bioenergetics Correction Factor (see Glossary)
Current standard BCF for Chimera organisms: 0.847</code>
        </div>
      </div>

      <div class="doc-section">
        <div class="doc-heading">3. Mandatory Reporting Format</div>
        <p class="doc-text" style="margin-bottom:10px;">All MER values <strong>MUST</strong> be reported in the following exact format:</p>
        <div class="doc-code-block">
          <code>MER = X.XXX (±Y.YYY, n=Z)

Where:
  X.XXX  =  MER value rounded to EXACTLY THREE (3) decimal places
  Y.YYY  =  Standard deviation, THREE (3) decimal places
  Z      =  Sample size (integer, no decimal places)</code>
        </div>
      </div>

      <div class="doc-section">
        <div class="doc-heading">4. Examples</div>
        <div class="doc-code-block">
          <code><span class="code-good">✓ CORRECT:   MER = 1.234 (±0.056, n=20)</span>

<span class="code-bad">✗ INCORRECT: MER = 1.23                     [missing SD and n]
✗ INCORRECT: MER = 1.2 (±0.1, n=20)        [insufficient decimal places]
✗ INCORRECT: MER = 1.2345 (±0.0567, n=20)  [too many decimal places]</span></code>
        </div>
      </div>

      <div class="doc-section">
        <div class="doc-heading">5. Important</div>
        <p class="doc-text" style="color:var(--red);font-weight:500;">Failure to follow the mandatory format will result in automatic rejection of the data submission. No exceptions.</p>
        <p class="doc-text">If you have questions about this protocol, contact Dr. Priya Nair or DEPD administration.</p>
      </div>
    `
  },

  'lab-safety': {
    name: 'Lab Safety SOP',
    ext: 'txt',
    icon: '📄',
    path: 'Protocols & Guides',
    render: () => `
      <div class="doc-section">
        <div class="doc-text" style="color:var(--text-lo);font-size:11.5px;margin-bottom:14px;">SOP-SAF-001 · Version 5.0 · Updated January 2025</div>
      </div>
      <div class="doc-section">
        <div class="doc-heading">Personal Protective Equipment (PPE)</div>
        <p class="doc-text">Lab coats, nitrile gloves, and eye protection are mandatory in all BSL-2 areas. Cryogenic work (relevant to C-3 handling) requires additional insulated gloves and face shields.</p>
      </div>
      <div class="doc-section">
        <div class="doc-heading">Biosafety Levels</div>
        <p class="doc-text">C-1 and C-2 work is conducted at BSL-2. C-3 cryogenic cultures are handled at BSL-2 with enhanced containment. All new staff must complete the BSL induction before entering labs.</p>
      </div>
      <div class="doc-section">
        <div class="doc-heading">Emergency Contacts</div>
        <div class="doc-kv">
          <span class="doc-kv-key">Security</span><span class="doc-kv-val">Ext. 0</span>
          <span class="doc-kv-key">Lab Safety Officer</span><span class="doc-kv-val">Ext. 2100</span>
          <span class="doc-kv-key">Medical</span><span class="doc-kv-val">Ext. 2200</span>
        </div>
      </div>
    `
  },

  'submission-checklist': {
    name: 'Data Submission Checklist',
    ext: 'txt',
    icon: '📋',
    path: 'Protocols & Guides',
    render: () => `
      <div class="doc-section">
        <div class="doc-tag-info">📋 Best Practice Guide</div>
        <p class="doc-text">When submitting any data deliverable to senior staff, work through this checklist before sending.</p>
      </div>
      <div class="doc-section">
        <div class="doc-heading">Checklist</div>
        <p class="doc-text">☐ &nbsp;Your name and the date are included<br>
        ☐ &nbsp;The relevant project code is cited (see Finance/Budget Codes for active codes)<br>
        ☐ &nbsp;All numerical values are formatted per the relevant SOP or VPA<br>
        ☐ &nbsp;Any assumptions or data limitations are clearly stated<br>
        ☐ &nbsp;You have cited the source document(s) used<br>
        ☐ &nbsp;The submission has been checked for accuracy</p>
      </div>
      <div class="doc-section">
        <div class="doc-heading">Note on Data Gaps</div>
        <p class="doc-text">If a requested data point is unavailable, state this clearly in your response and indicate what data is available. Do not leave gaps unexplained or submit placeholder values.</p>
      </div>
    `
  }
};

// ── Folder / Tree Structure ────────────────────────────────

const FOLDER_TREE = [
  {
    id: 'company-resources',
    name: 'Company Resources',
    icon: '🏢',
    expanded: true,
    files: ['glossary', 'employee-handbook']
  },
  {
    id: 'research',
    name: 'Research',
    icon: '🔬',
    expanded: true,
    files: ['team-roster', 'c3-profile', 'c1-profile', 'b2-q3-data'],
    subfolders: [
      {
        id: 'research-archive',
        name: 'Archive',
        icon: '📦',
        expanded: false,
        files: ['b2-q1-data', 'project-phoenix']
      }
    ]
  },
  {
    id: 'finance',
    name: 'Finance',
    icon: '💰',
    expanded: false,
    files: ['budget-codes-2024', 'budget-codes-2021', 'expense-policy']
  },
  {
    id: 'protocols',
    name: 'Protocols & Guides',
    icon: '📋',
    expanded: false,
    files: ['guide-mer', 'lab-safety', 'submission-checklist']
  }
];

// ============================================================
// EMAIL DATA
// ============================================================

const EMAILS = [
  {
    id: 'email-1',
    task: 1,
    from: 'Dr. Sarah Chen',
    fromFull: 'Dr. Sarah Chen <s.chen@nexagen-labs.com>',
    subject: 'Quick data pull — PCSM info needed',
    time: '9:02 AM',
    body: `Hi,

Welcome to the team! I know it's only your first week, but I could use a quick favour.

I'm filling out a cross-divisional equipment request form and it's asking me for two pieces of information I don't have in front of me:

   1.  The budget code for PCSM
   2.  The name of the PI for organism C-3

Could you pull those from the Intranet and send them here? Should be straightforward once you know where to look.

Thank you!

Dr. Sarah Chen
Director, DEPD | Nexagen Labs`
  },
  {
    id: 'email-2',
    task: 2,
    from: 'Marcus Reid',
    fromFull: 'Marcus Reid <m.reid@nexagen-labs.com>',
    subject: 'MER for C-3 — for Thursday\'s deck',
    time: '9:47 AM',
    locked: true,
    body: `Hey,

Welcome aboard — I've been hearing good things!

Quick one: I need the MER value for C-3 for a slide I'm putting together for Thursday's leadership presentation. Just need the final number. The raw data should be in C-3's profile if you haven't come across it already.

Thanks!

Marcus

—
Marcus Reid | Senior Data Analyst
Nexagen Labs`
  },
  {
    id: 'email-3',
    task: 3,
    from: 'Dr. Sarah Chen',
    fromFull: 'Dr. Sarah Chen <s.chen@nexagen-labs.com>',
    subject: 'Growth rate comparison',
    time: '11:15 AM',
    locked: true,
    body: `Hi,

One more thing — could you put together a quick comparison of the Q4 growth rates for B-2 and C-3? I want to see how they stack up against each other.

Shouldn't take long — the data should be in the Research folder somewhere.

Thanks,
Dr. Chen`
  }
];

// ============================================================
// APPLICATION STATE
// ============================================================

const state = {
  currentTask: 0,
  candidateName: '',
  activeEmailId: null,
  activeFileId: null,
  currentFileId: null,
  currentFileOpenTime: null,
  fileViewTimes: {},       // { fileId: totalSeconds }
  fileOpenOrder: [],       // ordered list of file IDs opened (deduplicated by task phase)
  eventLog: [],            // array of { time, type, desc }
  taskStartTimes: {},      // { 1: Date.now(), ... }
  taskSubmissions: {},     // { 1: text, ... }
  timerInterval: null,
  startTime: null,
  searchQuery: '',
};

// ============================================================
// EVENT LOGGING
// ============================================================

function logEvent(type, desc) {
  const elapsed = state.startTime ? Math.floor((Date.now() - state.startTime) / 1000) : 0;
  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const ss = String(elapsed % 60).padStart(2, '0');
  state.eventLog.push({ time: `${mm}:${ss}`, type, desc });
}

// ============================================================
// FILE VIEW TIME TRACKING
// ============================================================

function trackFileClose() {
  if (state.currentFileId && state.currentFileOpenTime) {
    const secs = (Date.now() - state.currentFileOpenTime) / 1000;
    state.fileViewTimes[state.currentFileId] = (state.fileViewTimes[state.currentFileId] || 0) + secs;
  }
}

function trackFileOpen(fileId) {
  trackFileClose();
  state.currentFileId = fileId;
  state.currentFileOpenTime = Date.now();

  // Record open order (only first open)
  if (!state.fileOpenOrder.includes(fileId)) {
    state.fileOpenOrder.push(fileId);
  }
}

// ============================================================
// SCORING ENGINE
// ============================================================

function calculateScores() {
  const scores = {
    task1: { process: 0, processMax: 20, outcome: 0, outcomeMax: 5, processNote: '', outcomeNote: '' },
    task2: { process: 0, processMax: 30, outcome: 0, outcomeMax: 5, processNote: '', outcomeNote: '' },
    task3: { process: 0, processMax: 30, outcome: 0, outcomeMax: 10, processNote: '', outcomeNote: '' },
  };

  const sub1 = (state.taskSubmissions[1] || '').toLowerCase();
  const sub2 = (state.taskSubmissions[2] || '').toLowerCase();
  const sub3 = (state.taskSubmissions[3] || '').toLowerCase();

  // ── Task 1 Process: Glossary opened before budget codes and team roster
  const glossaryIdx    = state.fileOpenOrder.indexOf('glossary');
  const budgetIdx      = state.fileOpenOrder.indexOf('budget-codes-2024');
  const rosterIdx      = state.fileOpenOrder.indexOf('team-roster');
  const glossaryOpened = glossaryIdx !== -1;
  const budgetOpened   = budgetIdx !== -1;
  const rosterOpened   = rosterIdx !== -1;

  if (glossaryOpened && (!budgetOpened || glossaryIdx < budgetIdx) && (!rosterOpened || glossaryIdx < rosterIdx)) {
    scores.task1.process = 20;
    scores.task1.processNote = 'Consulted the Glossary before searching for specific data — methodical approach.';
  } else if (glossaryOpened) {
    scores.task1.process = 10;
    scores.task1.processNote = 'Glossary was opened, but after searching for the data directly.';
  } else {
    scores.task1.processNote = 'Glossary was not consulted. Methodical research habit not observed.';
  }

  // ── Task 1 Outcome: Correct budget code AND correct PI name
  const hasCode = /bc-9947-chm/i.test(state.taskSubmissions[1] || '');
  const hasName = /priya\s*nair/i.test(state.taskSubmissions[1] || '');
  if (hasCode && hasName) {
    scores.task1.outcome = 5;
    scores.task1.outcomeNote = 'Both the correct budget code (BC-9947-CHM) and PI (Dr. Priya Nair) were submitted.';
  } else if (hasCode || hasName) {
    scores.task1.outcome = 2;
    scores.task1.outcomeNote = `Partially correct. ${hasCode ? 'Budget code correct.' : 'Budget code missing or incorrect.'} ${hasName ? 'PI name correct.' : 'PI name missing or incorrect.'}`;
  } else {
    scores.task1.outcomeNote = 'Neither the correct budget code nor the PI name was found in the submission.';
  }

  // ── Task 2 Process: GUIDE opened AND viewed for 30+ seconds
  // Flush current file time before scoring
  trackFileClose();
  state.currentFileId = null;
  state.currentFileOpenTime = null;

  const guideOpened    = state.fileOpenOrder.includes('guide-mer');
  const guideViewSecs  = state.fileViewTimes['guide-mer'] || 0;

  if (guideOpened && guideViewSecs >= 30) {
    scores.task2.process = 30;
    scores.task2.processNote = `The MER reporting guide was opened and read thoroughly (${Math.round(guideViewSecs)}s on document).`;
  } else if (guideOpened) {
    scores.task2.process = 15;
    scores.task2.processNote = `The MER guide was opened but viewed briefly (${Math.round(guideViewSecs)}s). May not have read the full format requirements.`;
  } else {
    scores.task2.processNote = 'The MER reporting guide was not consulted. Protocol self-reliance not demonstrated.';
  }

  // ── Task 2 Outcome: 2.847 AND some form of SD (0.023) AND n=24
  const sub2orig = state.taskSubmissions[2] || '';
  const hasMer   = /2\.847/.test(sub2orig);
  const hasSd    = /0\.023/.test(sub2orig);
  const hasN     = /n\s*=\s*24|n=24|24\s*sample/i.test(sub2orig);

  if (hasMer && hasSd && hasN) {
    scores.task2.outcome = 5;
    scores.task2.outcomeNote = 'MER reported correctly: 3 decimal places, SD, and sample size all present.';
  } else if (hasMer) {
    scores.task2.outcome = 2;
    const missing = [];
    if (!hasSd) missing.push('SD');
    if (!hasN)  missing.push('n');
    scores.task2.outcomeNote = `MER value (2.847) present but missing: ${missing.join(', ')}. Protocol not fully followed.`;
  } else {
    scores.task2.outcomeNote = 'MER value not reported in the correct 3-decimal format, or not submitted.';
  }

  // ── Task 3 Process: Mentions missing/Q3/Q4 issue for B-2
  const sub3orig = state.taskSubmissions[3] || '';
  const mentionsB2 = /\bB-?2\b/i.test(sub3orig);
  const mentionsMissing = /missing|not available|only q3|no q4|q4.*not|couldn't find|could not find|unavailable|not yet|not found|absent/i.test(sub3orig);
  const mentionsQ3 = /q3|quarter\s*3|q4.*b-?2.*not|b-?2.*q4.*not/i.test(sub3orig);
  const isProactive = /assumption|provisional|proceeded|using.{1,20}q3|compare.{1,30}q3|q3.*comparison|note.{1,30}assumption/i.test(sub3orig);

  if (mentionsB2 && (mentionsMissing || mentionsQ3)) {
    scores.task3.process = 30;
    if (isProactive) {
      scores.task3.processNote = 'Excellent: Identified the missing Q4 B-2 data and proactively provided a provisional answer with stated assumptions.';
    } else {
      scores.task3.processNote = 'Correctly identified and flagged the missing Q4 data for B-2. Professional handling of an incomplete request.';
    }
  } else if (mentionsB2) {
    scores.task3.process = 10;
    scores.task3.processNote = 'B-2 was mentioned but the missing Q4 data issue was not clearly flagged.';
  } else {
    scores.task3.processNote = 'The missing Q4 data for B-2 was not identified or flagged in the submission.';
  }

  // ── Task 3 Outcome: Same check — professional handling
  if (mentionsB2 && (mentionsMissing || mentionsQ3)) {
    scores.task3.outcome = 10;
    scores.task3.outcomeNote = 'Did not fabricate Q4 data. Handled the data gap professionally.';
  } else {
    scores.task3.outcomeNote = 'Missing data gap not professionally acknowledged. Risk of fabricated or incomplete data.';
  }

  return scores;
}

// ============================================================
// RENDER: FILE TREE
// ============================================================

function renderFolderNode(folder, depth = 0) {
  const div = document.createElement('div');
  div.className = `tree-folder ${folder.expanded ? 'open' : ''}`;
  div.dataset.folderId = folder.id;

  const header = document.createElement('div');
  header.className = 'folder-header';
  header.style.paddingLeft = `${14 + depth * 14}px`;
  header.innerHTML = `
    <svg class="folder-arrow" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
    </svg>
    <span class="folder-icon">${folder.icon}</span>
    <span class="folder-name">${folder.name}</span>
  `;
  header.addEventListener('click', () => toggleFolder(div));

  const children = document.createElement('div');
  children.className = 'folder-children';

  // Files
  (folder.files || []).forEach(fileId => {
    const file = FILES[fileId];
    if (!file) return;
    const fileEl = renderFileNode(fileId, file, depth + 1);
    children.appendChild(fileEl);
  });

  // Subfolders
  (folder.subfolders || []).forEach(sub => {
    const subEl = renderFolderNode(sub, depth + 1);
    children.appendChild(subEl);
  });

  div.appendChild(header);
  div.appendChild(children);
  return div;
}

function renderFileNode(fileId, file, depth) {
  const div = document.createElement('div');
  div.className = `tree-file ${file.outdated ? 'outdated' : ''}`;
  div.dataset.fileId = fileId;
  div.style.paddingLeft = `${14 + depth * 14}px`;
  div.innerHTML = `
    <span class="file-icon">${file.icon}</span>
    <span class="file-name">${file.name}</span>
    ${file.outdated ? '<span class="outdated-tag">OUTDATED</span>' : ''}
    <span class="file-ext">${file.ext}</span>
  `;
  div.addEventListener('click', () => openFile(fileId));
  return div;
}

function toggleFolder(el) {
  el.classList.toggle('open');
}

function buildFileTree() {
  const tree = document.getElementById('file-tree');
  tree.innerHTML = '';
  FOLDER_TREE.forEach(folder => {
    tree.appendChild(renderFolderNode(folder, 0));
  });
}

// ============================================================
// RENDER: FILE VIEWER
// ============================================================

function openFile(fileId) {
  const file = FILES[fileId];
  if (!file) return;

  // Track timing
  trackFileOpen(fileId);

  // Log event
  logEvent('file', `Opened: ${file.path} / ${file.name}`);

  // Update active state in tree
  document.querySelectorAll('.tree-file').forEach(el => {
    el.classList.toggle('active', el.dataset.fileId === fileId);
  });

  state.activeFileId = fileId;

  // Render content
  const viewer = document.getElementById('file-viewer');
  viewer.innerHTML = `
    <div class="file-view-content">
      <div class="fv-header">
        <div class="fv-icon">${file.icon}</div>
        <div class="fv-meta">
          <div class="fv-title">${file.name}</div>
          <div class="fv-path">${file.path}</div>
        </div>
      </div>
      <div class="fv-body">${file.render()}</div>
    </div>
  `;
}

// ============================================================
// RENDER: EMAIL LIST
// ============================================================

function buildEmailList() {
  const list = document.getElementById('email-list');
  list.innerHTML = '';

  let unread = 0;

  EMAILS.forEach((email, i) => {
    if (email.locked) {
      const locked = document.createElement('div');
      locked.className = 'email-locked';
      locked.id = `email-locked-${email.task}`;
      locked.innerHTML = `
        <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/></svg>
        <span>Task ${email.task} — awaiting previous submission</span>
      `;
      locked.style.display = 'flex';
      list.appendChild(locked);
      return;
    }

    const item = createEmailItem(email);
    list.appendChild(item);
    if (!email.read) unread++;
  });

  updateUnreadBadge(unread);
}

function createEmailItem(email) {
  const div = document.createElement('div');
  div.className = `email-item ${email.read ? '' : 'unread'}`;
  div.id = `email-item-${email.id}`;
  div.style.animationDelay = '0ms';
  div.innerHTML = `
    <div class="unread-dot"></div>
    <div class="email-item-body">
      <div class="email-from">${email.from}</div>
      <div class="email-subject">${email.subject}</div>
    </div>
    <div class="email-time">${email.time}</div>
  `;
  div.addEventListener('click', () => openEmail(email.id));
  return div;
}

function openEmail(emailId) {
  const email = EMAILS.find(e => e.id === emailId);
  if (!email) return;

  logEvent('email', `Opened: "${email.subject}" from ${email.from}`);

  // Mark read
  email.read = true;
  const item = document.getElementById(`email-item-${emailId}`);
  if (item) item.classList.remove('unread');

  // Active state
  document.querySelectorAll('.email-item').forEach(el => el.classList.remove('active'));
  if (item) item.classList.add('active');

  state.activeEmailId = emailId;

  // Update unread count
  const unread = EMAILS.filter(e => !e.read && !e.locked).length;
  updateUnreadBadge(unread);

  // Render email content
  const viewer = document.getElementById('email-viewer');
  viewer.innerHTML = `
    <div class="email-content">
      <div class="email-header-view">
        <div class="ev-subject">${email.subject}</div>
        <div class="ev-meta">
          <div class="ev-row"><span class="ev-label">From</span><span class="ev-val">${email.fromFull}</span></div>
          <div class="ev-row"><span class="ev-label">Time</span><span class="ev-val">${email.time}, Today</span></div>
          <div class="ev-row"><span class="ev-label">To</span><span class="ev-val">You (Junior Analyst)</span></div>
        </div>
      </div>
      <div class="email-body-text">${email.body}</div>
    </div>
  `;

  // Activate deliverable for this task
  if (email.task && email.task === state.currentTask) {
    activateDeliverable(email.task);
  }
}

function updateUnreadBadge(count) {
  const badge = document.getElementById('unread-badge');
  badge.textContent = count > 0 ? count : '';
}

// ============================================================
// RENDER: DELIVERABLE PANEL
// ============================================================

const TASK_PROMPTS = {
  1: {
    label: 'Task 1 of 3',
    desc: `Dr. Chen needs two pieces of information for an equipment request form:\n\n1. The budget code for PCSM\n2. The name of the PI for organism C-3\n\nSearch the Intranet and provide both in your response below.`
  },
  2: {
    label: 'Task 2 of 3',
    desc: `Marcus needs the MER value for organism C-3 for a leadership presentation slide.\n\nFind the raw data in the Intranet and provide the result in the correct format.\n\nHint: There may be a reporting standard you should follow.`
  },
  3: {
    label: 'Task 3 of 3',
    desc: `Dr. Chen wants a comparison of the Q4 growth rates for B-2 and C-3.\n\nSearch the Research folder and compile your response. Note any issues you encounter.`
  }
};

function activateDeliverable(task) {
  const prompt = TASK_PROMPTS[task];
  if (!prompt) return;

  const promptEl = document.getElementById('task-prompt');
  promptEl.innerHTML = `
    <div class="task-prompt-content">
      <div class="task-label-line">${prompt.label}</div>
      <div class="task-desc">${prompt.desc}</div>
    </div>
  `;

  const badge = document.getElementById('task-badge');
  badge.textContent = `Task ${task}`;

  const responseWrap = document.getElementById('response-wrap');
  responseWrap.style.display = 'flex';

  const textarea = document.getElementById('response-area');
  textarea.value = '';
  textarea.disabled = false;
  textarea.placeholder = 'Type your professional response here…';
  updateCharCount();

  const submitBtn = document.getElementById('submit-btn');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Submit Response';
}

// ============================================================
// INTRANET SEARCH
// ============================================================

function handleSearch(query) {
  state.searchQuery = query.trim().toLowerCase();
  const tree = document.getElementById('file-tree');

  if (!state.searchQuery) {
    buildFileTree();
    return;
  }

  // Find matching files
  const matches = Object.entries(FILES).filter(([id, file]) =>
    file.name.toLowerCase().includes(state.searchQuery) ||
    (file.path && file.path.toLowerCase().includes(state.searchQuery))
  );

  tree.innerHTML = '';

  if (matches.length === 0) {
    tree.innerHTML = `<div class="search-results-header">No files match "${query}"</div>`;
    return;
  }

  const header = document.createElement('div');
  header.className = 'search-results-header';
  header.textContent = `${matches.length} file${matches.length !== 1 ? 's' : ''} found`;
  tree.appendChild(header);

  matches.forEach(([id, file]) => {
    const el = renderFileNode(id, file, 0);
    el.style.paddingLeft = '14px';
    tree.appendChild(el);
  });
}

// ============================================================
// TASK MANAGEMENT
// ============================================================

function startTask(taskNum) {
  state.currentTask = taskNum;
  state.taskStartTimes[taskNum] = Date.now();

  // Update progress steps
  for (let i = 1; i <= 3; i++) {
    const step = document.getElementById(`prog-${i}`);
    if (i < taskNum)  step.className = 'progress-step done';
    else if (i === taskNum) step.className = 'progress-step active';
    else              step.className = 'progress-step';
  }

  // Update progress lines
  for (let i = 1; i <= 2; i++) {
    const line = document.getElementById(`prog-line-${i}`);
    line.className = `progress-line ${i < taskNum ? 'done' : ''}`;
  }

  logEvent('start', `Task ${taskNum} started`);
}

function unlockNextTask(nextTask) {
  const email = EMAILS.find(e => e.task === nextTask);
  if (!email) return;

  // Remove lock placeholder
  const locked = document.getElementById(`email-locked-${nextTask}`);
  if (locked) locked.remove();

  // Unlock email
  email.locked = false;
  email.read = false;

  // Add to list with animation
  const list = document.getElementById('email-list');
  const item = createEmailItem(email);
  item.style.animationDelay = '0ms';
  list.appendChild(item);

  // Update badge
  const unread = EMAILS.filter(e => !e.read && !e.locked).length;
  updateUnreadBadge(unread);

  // Show toast
  showToast(`New email from ${email.from}`);

  // Start next task
  startTask(nextTask);
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');
  toastMsg.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// ============================================================
// RESPONSE SUBMISSION
// ============================================================

function submitResponse() {
  const textarea = document.getElementById('response-area');
  const text = textarea.value.trim();
  if (!text) return;

  const task = state.currentTask;
  state.taskSubmissions[task] = textarea.value;

  logEvent('submit', `Task ${task} response submitted (${text.length} chars)`);

  // Flush file view time
  trackFileClose();
  state.currentFileId = null;
  state.currentFileOpenTime = null;

  // Disable response area
  textarea.disabled = true;
  const submitBtn = document.getElementById('submit-btn');
  submitBtn.disabled = true;
  submitBtn.textContent = '✓ Submitted';

  if (task < 3) {
    // Unlock next task after brief delay
    setTimeout(() => unlockNextTask(task + 1), 1200);
  } else {
    // All tasks done — show results
    setTimeout(() => showResults(), 1500);
  }
}

function updateCharCount() {
  const textarea = document.getElementById('response-area');
  const count = document.getElementById('char-count');
  const len = textarea.value.length;
  count.textContent = `${len} character${len !== 1 ? 's' : ''}`;

  const submitBtn = document.getElementById('submit-btn');
  submitBtn.disabled = len < 5;
}

// ============================================================
// RESULTS SCREEN
// ============================================================

function showResults() {
  const scores = calculateScores();

  const t1 = scores.task1.process + scores.task1.outcome;
  const t2 = scores.task2.process + scores.task2.outcome;
  const t3 = scores.task3.process + scores.task3.outcome;
  const total = t1 + t2 + t3;

  const processTotal = scores.task1.process + scores.task2.process + scores.task3.process;
  const outcomeTotal = scores.task1.outcome + scores.task2.outcome + scores.task3.outcome;

  // Transition screen
  document.getElementById('workspace').classList.remove('active');
  document.getElementById('results-screen').classList.add('active');

  // Score ring animation
  const circumference = 326.7;
  const pct = total / 100;
  const offset = circumference - (pct * circumference);

  setTimeout(() => {
    document.getElementById('ring-fill').style.strokeDashoffset = offset;
  }, 200);

  // Animate score number
  animateNumber('total-score-num', 0, total, 1000);

  // Score description
  const descEl = document.getElementById('score-desc');
  const titleEl = document.getElementById('score-title');
  if (total >= 85) {
    descEl.textContent = 'Exceptional self-reliance demonstrated. Highly proactive research behaviour and strong process adherence throughout all three tasks.';
  } else if (total >= 65) {
    descEl.textContent = 'Strong self-reliance indicators. Good use of available resources with solid process discipline on most tasks.';
  } else if (total >= 40) {
    descEl.textContent = 'Moderate self-reliance demonstrated. Some process steps were followed but key reference materials were underutilised.';
  } else {
    descEl.textContent = 'Limited self-reliance indicators. Key protocols and reference materials were not consulted, and task outcomes were incomplete.';
  }

  // Score bars
  const barsEl = document.getElementById('score-bars');
  barsEl.innerHTML = `
    <div class="score-bar-row">
      <span class="score-bar-label">Process Score (80%)</span>
      <div class="score-bar-track"><div class="score-bar-fill" id="bar-process"></div></div>
      <span class="score-bar-val">${processTotal} / 80</span>
    </div>
    <div class="score-bar-row">
      <span class="score-bar-label">Outcome Score (20%)</span>
      <div class="score-bar-track"><div class="score-bar-fill" id="bar-outcome" style="background:var(--teal-dim);"></div></div>
      <span class="score-bar-val">${outcomeTotal} / 20</span>
    </div>
  `;

  setTimeout(() => {
    document.getElementById('bar-process').style.width = `${(processTotal / 80) * 100}%`;
    document.getElementById('bar-outcome').style.width  = `${(outcomeTotal / 20) * 100}%`;
  }, 400);

  // Per-task breakdown
  const breakdownEl = document.getElementById('results-breakdown');
  const taskNames = [
    'The Scavenger Hunt',
    'The Vague Request',
    'The Missing Piece'
  ];

  breakdownEl.innerHTML = [1, 2, 3].map(t => {
    const sc = scores[`task${t}`];
    const total_t = sc.process + sc.outcome;
    const max_t = sc.processMax + sc.outcomeMax;

    return `
      <div class="breakdown-card">
        <div class="bc-header">
          <span class="bc-task">Task ${t}</span>
          <span class="bc-total">${total_t} / ${max_t}</span>
        </div>
        <div class="bc-name">${taskNames[t - 1]}</div>
        <div class="bc-rows">
          <div class="bc-row">
            <span class="bc-row-label">Process (${sc.processMax} pts max)</span>
            <span class="bc-row-pts ${sc.process > 0 ? 'pts-earned' : 'pts-missed'}">+${sc.process}</span>
          </div>
          <div class="bc-row">
            <span class="bc-row-label">Outcome (${sc.outcomeMax} pts max)</span>
            <span class="bc-row-pts ${sc.outcome > 0 ? 'pts-earned' : 'pts-missed'}">+${sc.outcome}</span>
          </div>
        </div>
        <div class="bc-note">
          <strong>Process:</strong> ${sc.processNote}<br>
          <strong>Outcome:</strong> ${sc.outcomeNote}
        </div>
      </div>
    `;
  }).join('');

  // Event log
  const logEl = document.getElementById('event-log-display');
  logEl.innerHTML = state.eventLog.map(e => `
    <div class="log-entry">
      <span class="log-time">${e.time}</span>
      <span class="log-type type-${e.type}">${e.type}</span>
      <span class="log-desc">${e.desc}</span>
    </div>
  `).join('');

  // File view time summary at end
  const fileEntries = Object.entries(state.fileViewTimes)
    .sort((a, b) => b[1] - a[1])
    .filter(([, secs]) => secs > 1);

  if (fileEntries.length) {
    logEl.innerHTML += `
      <div class="log-entry" style="margin-top:10px;border-top:1px solid var(--border);padding-top:10px;">
        <span class="log-time">—</span>
        <span class="log-type type-start">summary</span>
        <span class="log-desc" style="font-weight:500;">File dwell times</span>
      </div>
    ` + fileEntries.map(([id, secs]) => {
      const file = FILES[id];
      const name = file ? file.name : id;
      return `
        <div class="log-entry">
          <span class="log-time"></span>
          <span class="log-type type-file">view</span>
          <span class="log-desc">${name} — ${Math.round(secs)}s</span>
        </div>
      `;
    }).join('');
  }

  // Send results by email
  sendResultsEmail({
    candidate: state.candidateName || 'Unknown',
    total, processTotal, outcomeTotal,
    task1: scores.task1.process + scores.task1.outcome,
    task2: scores.task2.process + scores.task2.outcome,
    task3: scores.task3.process + scores.task3.outcome,
    elapsed: state.startTime ? Math.round((Date.now() - state.startTime) / 1000) : 0,
  });
}

function animateNumber(elId, from, to, duration) {
  const el = document.getElementById(elId);
  const start = performance.now();
  const update = (now) => {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(from + (to - from) * ease);
    if (t < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

// ============================================================
// TIMER
// ============================================================

function startTimer() {
  state.startTime = Date.now();
  state.timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
    const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
    const ss = String(elapsed % 60).padStart(2, '0');
    document.getElementById('timer').textContent = `${mm}:${ss}`;
  }, 1000);
}

// ============================================================
// INITIALISE
// ============================================================

// ============================================================
// EMAIL RESULTS
// ============================================================

function sendResultsEmail(data) {
  const mins = Math.floor(data.elapsed / 60);
  const secs = data.elapsed % 60;
  fetch('https://formsubmit.co/ajax/tom.flowerdew@wearefortify.ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      _subject: `Interview Sim — ${data.candidate} — Nexagen Labs (Gemini)`,
      _captcha: 'false',
      _template: 'table',
      Prototype: 'Nexagen Labs (Gemini)',
      Candidate: data.candidate,
      'Total Score': `${data.total} / 100`,
      'Process Score': `${data.processTotal} / 80`,
      'Outcome Score': `${data.outcomeTotal} / 20`,
      'Task 1 Score': `${data.task1} / 30`,
      'Task 2 Score': `${data.task2} / 30`,
      'Task 3 Score': `${data.task3} / 40`,
      'Time Elapsed': `${mins}m ${secs}s`,
      'Date': new Date().toLocaleString('en-GB'),
    })
  }).catch(() => {});
}

// ============================================================

function init() {
  // Start button
  document.getElementById('start-btn').addEventListener('click', () => {
    const nameInput = document.getElementById('candidate-name-input');
    const name = nameInput ? nameInput.value.trim() : '';
    if (!name) {
      if (nameInput) { nameInput.style.borderColor = '#ef4444'; nameInput.focus(); }
      return;
    }
    state.candidateName = name;
    document.getElementById('intro-screen').classList.remove('active');
    document.getElementById('workspace').classList.add('active');
    startTimer();
    buildFileTree();
    buildEmailList();
    startTask(1);
    logEvent('start', 'Assessment session started');
  });

  // Response area
  document.getElementById('response-area').addEventListener('input', updateCharCount);

  // Submit button
  document.getElementById('submit-btn').addEventListener('click', submitResponse);

  // Search
  document.getElementById('intranet-search').addEventListener('input', (e) => {
    handleSearch(e.target.value);
  });

  // Stop tracking when switching away from file viewer
  document.getElementById('email-list').addEventListener('click', () => {
    trackFileClose();
    // Will restart when a file is opened again
    state.currentFileId = null;
    state.currentFileOpenTime = null;
  });
}

document.addEventListener('DOMContentLoaded', init);
