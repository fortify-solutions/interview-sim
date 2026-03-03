// analytics.js — Event tracking, scoring, and CSV export

class Analytics {
  constructor() {
    this.startTime = Date.now();
    this.events = [];
    this.discoveries = new Set();
    this.helpRequests = 0;
    this.deadEndClicks = 0;
    this.totalClicks = 0;
    this.appOpens = {};
    this.firstDiscoveryTime = null;
  }

  // Core event tracking
  track(type, data = {}) {
    const event = {
      type,
      elapsed: Date.now() - this.startTime,
      ...data
    };
    this.events.push(event);
    this.totalClicks++;
    return event;
  }

  // Record a key discovery (returns true if new)
  discover(discoveryId, label) {
    if (this.discoveries.has(discoveryId)) return false;
    this.discoveries.add(discoveryId);
    if (!this.firstDiscoveryTime) {
      this.firstDiscoveryTime = Date.now() - this.startTime;
    }
    this.track('discovery', { id: discoveryId, label });
    return true;
  }

  // Track app opens
  openApp(appId) {
    this.appOpens[appId] = (this.appOpens[appId] || 0) + 1;
    this.track('app_open', { app: appId });
  }

  // Track dead-end clicks (irrelevant resources)
  deadEnd(label) {
    this.deadEndClicks++;
    this.track('dead_end', { label });
  }

  // Track help-seeking behaviour in chat
  flagHelpRequest(contactId) {
    this.helpRequests++;
    this.track('help_request', { contact: contactId });
  }

  // Track final decision
  recordDecision(optionId, score) {
    this.track('decision', { optionId, score });
  }

  // Key resources required for full discovery score
  static KEY_DISCOVERIES = [
    'disc-hartwell-complaint',
    'disc-hartwell-sla-hint',
    'disc-contract',
    'disc-issuelog',
    'disc-intranet-process'
  ];

  countKeyDiscoveries() {
    return Analytics.KEY_DISCOVERIES.filter(d => this.discoveries.has(d)).length;
  }

  // ── Score Calculation ────────────────────────────────────────────
  //
  //  Resource Discovery  40 pts  – % of 5 key resources found
  //  Decision Quality    30 pts  – based on chosen option score
  //  Efficiency          15 pts  – productive vs dead-end clicks
  //  Autonomy            15 pts  – penalise help requests
  //  Speed Bonus         +5 pts  – fast first discovery
  //
  calculateScore(decisionOptionScore) {
    const keyFound = this.countKeyDiscoveries();
    const total = Analytics.KEY_DISCOVERIES.length;

    // Discovery (40 pts)
    const discoveryScore = Math.round((keyFound / total) * 40);

    // Decision (30 pts)
    const decisionScore = Math.round((decisionOptionScore / 100) * 30);

    // Efficiency (15 pts) — ratio of non-dead-end clicks
    let efficiencyScore;
    if (this.totalClicks <= 0) {
      efficiencyScore = 15;
    } else {
      const efficiencyRatio = Math.max(0, 1 - (this.deadEndClicks / Math.max(this.totalClicks, 1)));
      efficiencyScore = Math.round(efficiencyRatio * 15);
    }

    // Autonomy (15 pts) — lose 5 per help request, floor 0
    const autonomyScore = Math.max(0, 15 - this.helpRequests * 5);

    // Speed bonus (0–5 pts)
    let speedBonus = 0;
    if (this.firstDiscoveryTime !== null) {
      if (this.firstDiscoveryTime < 45000) speedBonus = 5;       // < 45s
      else if (this.firstDiscoveryTime < 90000) speedBonus = 3;  // < 90s
      else if (this.firstDiscoveryTime < 180000) speedBonus = 1; // < 3min
    }

    const finalScore = Math.min(100, discoveryScore + decisionScore + efficiencyScore + autonomyScore + speedBonus);

    return {
      total: finalScore,
      breakdown: {
        discovery: discoveryScore,
        decision: decisionScore,
        efficiency: efficiencyScore,
        autonomy: autonomyScore,
        speedBonus
      },
      stats: {
        keyResourcesFound: keyFound,
        totalKeyResources: total,
        helpRequests: this.helpRequests,
        totalClicks: this.totalClicks,
        deadEndClicks: this.deadEndClicks,
        timeSeconds: Math.round((Date.now() - this.startTime) / 1000),
        firstDiscoveryMs: this.firstDiscoveryTime
      }
    };
  }

  // ── Band Classification ──────────────────────────────────────────
  static getBand(score) {
    if (score >= 85) return { label: "Exceptional", color: "#059669", description: "Outstanding self-reliance. Recommend advancing to next stage." };
    if (score >= 65) return { label: "Strong",      color: "#2563EB", description: "Good autonomous problem-solving. Consider for next stage." };
    if (score >= 45) return { label: "Moderate",    color: "#D97706", description: "Some self-direction shown. May need further assessment." };
    return               { label: "Low",           color: "#DC2626", description: "Struggled to work independently. Not recommended to advance." };
  }

  // ── CSV Export ───────────────────────────────────────────────────
  exportCSV(playerName, scoreResult) {
    const { total, breakdown, stats } = scoreResult;
    const band = Analytics.getBand(total);
    const elapsedMin = Math.floor(stats.timeSeconds / 60);
    const elapsedSec = stats.timeSeconds % 60;
    const timeStr = `${elapsedMin}m ${elapsedSec}s`;

    const rows = [
      ['MERIDIAN ADVISORY — CANDIDATE ASSESSMENT RESULTS', ''],
      ['', ''],
      ['Candidate Name', playerName],
      ['Assessment Date', new Date().toLocaleDateString('en-GB')],
      ['', ''],
      ['SCORES', ''],
      ['Total Score', total + '/100'],
      ['Band', band.label],
      ['Recommendation', band.description],
      ['', ''],
      ['SCORE BREAKDOWN', ''],
      ['Resource Discovery', breakdown.discovery + '/40'],
      ['Decision Quality', breakdown.decision + '/30'],
      ['Efficiency', breakdown.efficiency + '/15'],
      ['Autonomy', breakdown.autonomy + '/15'],
      ['Speed Bonus', '+' + breakdown.speedBonus],
      ['', ''],
      ['BEHAVIOURAL STATS', ''],
      ['Key Resources Found', `${stats.keyResourcesFound} / ${stats.totalKeyResources}`],
      ['Help Requests', stats.helpRequests],
      ['Total Interactions', stats.totalClicks],
      ['Dead-end Clicks', stats.deadEndClicks],
      ['Time Spent', timeStr],
      ['', ''],
      ['EVENT LOG', ''],
      ...this.events.map((e, i) => {
        const t = (e.elapsed / 1000).toFixed(1) + 's';
        const detail = e.label || e.id || e.app || e.optionId || e.contact || '';
        return [`Event ${i + 1}`, `[${t}] ${e.type}${detail ? ' — ' + detail : ''}`];
      })
    ];

    const csv = rows.map(r =>
      r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')
    ).join('\r\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meridian-assessment-${playerName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
