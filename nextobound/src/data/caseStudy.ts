/**
 * Dummy case study: "Nimbus Analytics" — B2B revenue intelligence for mid-market SaaS.
 * All numbers are synthetic for dashboard demonstration.
 */

export const CASE_STUDY = {
  company: "Nimbus Analytics",
  tagline: "Revenue intelligence for mid-market SaaS (Series B, ~$12M ARR)",
  periodLabel: "Q1 2026 pipeline snapshot",
  narrative:
    "Nimbus runs paid social on LinkedIn and Google, plus webinars and content. Leadership wants one view that ties ad spend to closed revenue and surfaces where budget should move.",
} as const;

export type ChannelKey = "all" | "linkedin" | "google";
export type AudienceKey = "all" | "icp" | "non_icp";
export type PeriodKey = "this_month" | "last_month";

export type FunnelStageKey =
  | "impressions"
  | "clicks"
  | "leads"
  | "mql"
  | "sql"
  | "opportunities"
  | "closed_won";

export const STAGE_LABELS: Record<FunnelStageKey, string> = {
  impressions: "Impressions",
  clicks: "Clicks",
  leads: "Leads",
  mql: "MQL",
  sql: "SQL",
  opportunities: "Opportunities",
  closed_won: "Closed Won",
};

/** Base funnel counts (this month, all channels, all audiences). */
const BASE_FUNNEL: Record<FunnelStageKey, number> = {
  impressions: 2_420_000,
  clicks: 48_600,
  leads: 9_200,
  mql: 3_100,
  sql: 1_240,
  opportunities: 410,
  closed_won: 118,
};

/** Multipliers applied to funnel stages when filtering (synthetic splits). */
const CHANNEL_FUNNEL: Record<
  Exclude<ChannelKey, "all">,
  Partial<Record<FunnelStageKey, number>>
> = {
  linkedin: {
    impressions: 0.38,
    clicks: 0.22,
    leads: 0.18,
    mql: 0.24,
    sql: 0.28,
    opportunities: 0.35,
    closed_won: 0.42,
  },
  google: {
    impressions: 0.55,
    clicks: 0.68,
    leads: 0.72,
    mql: 0.58,
    sql: 0.52,
    opportunities: 0.45,
    closed_won: 0.38,
  },
};

const AUDIENCE_FUNNEL: Record<
  Exclude<AudienceKey, "all">,
  Partial<Record<FunnelStageKey, number>>
> = {
  icp: {
    impressions: 0.42,
    clicks: 0.48,
    leads: 0.52,
    mql: 0.62,
    sql: 0.68,
    opportunities: 0.74,
    closed_won: 0.81,
  },
  non_icp: {
    impressions: 0.58,
    clicks: 0.52,
    leads: 0.48,
    mql: 0.38,
    sql: 0.32,
    opportunities: 0.26,
    closed_won: 0.19,
  },
};

const PERIOD_FUNNEL: Record<Exclude<PeriodKey, "this_month">, number> = {
  last_month: 0.91,
};

const STAGES_ORDER: FunnelStageKey[] = [
  "impressions",
  "clicks",
  "leads",
  "mql",
  "sql",
  "opportunities",
  "closed_won",
];

function roundSmart(n: number): number {
  if (n >= 1_000_000) return Math.round(n / 1000) * 1000;
  if (n >= 10_000) return Math.round(n / 100) * 100;
  if (n >= 1_000) return Math.round(n / 10) * 10;
  return Math.round(n);
}

function applyPartialMultipliers(
  base: Record<FunnelStageKey, number>,
  partial: Partial<Record<FunnelStageKey, number>> | undefined,
): Record<FunnelStageKey, number> {
  if (!partial) return { ...base };
  const out = { ...base };
  for (const k of STAGES_ORDER) {
    const m = partial[k];
    if (typeof m === "number") out[k] = roundSmart(base[k] * m);
  }
  return out;
}

export function getFunnelCounts(
  channel: ChannelKey,
  audience: AudienceKey,
  period: PeriodKey,
): Record<FunnelStageKey, number> {
  let counts = { ...BASE_FUNNEL };
  if (channel !== "all") {
    counts = applyPartialMultipliers(counts, CHANNEL_FUNNEL[channel]);
  }
  if (audience !== "all") {
    counts = applyPartialMultipliers(counts, AUDIENCE_FUNNEL[audience]);
  }
  if (period === "last_month") {
    for (const k of STAGES_ORDER) {
      counts[k] = roundSmart(counts[k] * PERIOD_FUNNEL.last_month);
    }
  }
  return counts;
}

/** Average contract value used for revenue display (dummy). */
export const ACV_USD = 42_500;

export function getClosedWonRevenueUsd(counts: Record<FunnelStageKey, number>): number {
  return counts.closed_won * ACV_USD;
}

export type CohortId = "2025-11" | "2025-12" | "2026-01" | "2026-02";

export type CohortRow = {
  id: CohortId;
  label: string;
  source: "linkedin" | "google" | "mixed";
  /** Week index 0 = acquisition week */
  retentionPct: number[];
  cumulativeRevenueK: number[];
};

/** Weekly retention % and cumulative revenue ($K) for synthetic cohorts. */
export const COHORTS: CohortRow[] = [
  {
    id: "2025-11",
    label: "Nov 2025",
    source: "google",
    retentionPct: [100, 78, 62, 54, 48, 44, 41, 38, 36],
    cumulativeRevenueK: [0, 120, 210, 280, 330, 365, 392, 412, 428],
  },
  {
    id: "2025-12",
    label: "Dec 2025",
    source: "mixed",
    retentionPct: [100, 82, 70, 64, 60, 57, 55, 53, 52],
    cumulativeRevenueK: [0, 95, 180, 255, 318, 368, 408, 442, 472],
  },
  {
    id: "2026-01",
    label: "Jan 2026",
    source: "linkedin",
    retentionPct: [100, 88, 81, 77, 74, 72, 70, 69, 68],
    cumulativeRevenueK: [0, 72, 138, 198, 252, 302, 348, 392, 434],
  },
  {
    id: "2026-02",
    label: "Feb 2026",
    source: "linkedin",
    retentionPct: [100, 90, 84, 80, 77, 75, 73, 72, 71],
    cumulativeRevenueK: [0, 58, 112, 162, 208, 252, 294, 334, 374],
  },
];

export type ChannelRoiPoint = {
  id: string;
  label: string;
  channel: "linkedin" | "google" | "webinar" | "content" | "paid_search";
  cac: number;
  ltv: number;
  customers: number;
  spendK: number;
};

export const CHANNEL_ROI: ChannelRoiPoint[] = [
  {
    id: "li-sponsor",
    label: "LinkedIn — Sponsored",
    channel: "linkedin",
    cac: 18_200,
    ltv: 186_000,
    customers: 34,
    spendK: 620,
  },
  {
    id: "li-abm",
    label: "LinkedIn — ABM",
    channel: "linkedin",
    cac: 22_400,
    ltv: 224_000,
    customers: 21,
    spendK: 470,
  },
  {
    id: "g-search-brand",
    label: "Google — Brand Search",
    channel: "google",
    cac: 4_800,
    ltv: 68_000,
    customers: 112,
    spendK: 540,
  },
  {
    id: "g-search-nonbrand",
    label: "Google — Non-Brand",
    channel: "google",
    cac: 11_200,
    ltv: 72_000,
    customers: 58,
    spendK: 650,
  },
  {
    id: "webinar-q1",
    label: "Webinar Series",
    channel: "webinar",
    cac: 28_500,
    ltv: 310_000,
    customers: 16,
    spendK: 456,
  },
  {
    id: "content-seo",
    label: "Content / SEO",
    channel: "content",
    cac: 6_200,
    ltv: 54_000,
    customers: 86,
    spendK: 210,
  },
  {
    id: "pmax-retarget",
    label: "PMax — Retargeting",
    channel: "paid_search",
    cac: 9_400,
    ltv: 61_000,
    customers: 44,
    spendK: 414,
  },
];

export const CHANNEL_COLORS: Record<ChannelRoiPoint["channel"], string> = {
  linkedin: "#38bdf8",
  google: "#a78bfa",
  webinar: "#fbbf24",
  content: "#34d399",
  paid_search: "#fb7185",
};

export const INSIGHTS = {
  funnel:
    "LinkedIn drives fewer raw leads but a meaningfully higher share of late-stage pipeline — a conversion story, not a traffic story.",
  cohort:
    "Google-acquired cohorts monetize faster in the first 90 days but decay earlier; LinkedIn cohorts compound — higher LTV after week 6.",
  scatter:
    "Webinars sit highest on CAC yet highest on LTV — a deliberate ‘pay more, earn more’ motion worth scaling if capacity allows.",
} as const;
