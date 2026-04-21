import {
  ACV_USD,
  CASE_STUDY,
  getClosedWonRevenueUsd,
  getFunnelCounts,
  INSIGHTS,
  STAGE_LABELS,
  type AudienceKey,
  type ChannelKey,
  type FunnelStageKey,
  type PeriodKey,
} from "../data/caseStudy";
import { formatCompact, formatPct, formatUsd } from "../lib/format";

const STAGES: FunnelStageKey[] = [
  "impressions",
  "clicks",
  "leads",
  "mql",
  "sql",
  "opportunities",
  "closed_won",
];

type Props = {
  channel: ChannelKey;
  audience: AudienceKey;
  period: PeriodKey;
  comparePeriod: PeriodKey;
};

function maxFunnelWidth(counts: Record<FunnelStageKey, number>): number {
  return Math.max(...STAGES.map((s) => counts[s]));
}

export function FunnelSection({ channel, audience, period, comparePeriod }: Props) {
  const current = getFunnelCounts(channel, audience, period);
  const compare = getFunnelCounts(channel, audience, comparePeriod);
  const maxW = maxFunnelWidth(current);
  const revenue = getClosedWonRevenueUsd(current);
  const compareRevenue = getClosedWonRevenueUsd(compare);

  return (
    <section className="rounded-2xl border border-ink-700/80 bg-ink-900/60 p-6 shadow-xl shadow-black/20 backdrop-blur">
      <header className="mb-6 flex flex-col gap-2 border-b border-ink-700/60 pb-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-accent">
            1 — Funnel + revenue waterfall
          </p>
          <h2 className="mt-1 text-xl font-semibold text-ink-100">Pipeline backbone</h2>
          <p className="mt-1 max-w-2xl text-sm text-ink-400">
            Synthetic funnel for {CASE_STUDY.company}. Conversion and drop-off between each
            stage; closed-won revenue uses a flat {formatUsd(ACV_USD)} ACV for demo purposes.
          </p>
        </div>
        <div className="rounded-xl border border-ink-700 bg-ink-800/50 px-4 py-3 text-right">
          <p className="text-xs text-ink-400">Closed won revenue ({STAGE_LABELS.closed_won})</p>
          <p className="font-mono text-lg font-semibold text-accent-glow">{formatUsd(revenue)}</p>
          {comparePeriod !== period ? (
            <p className="mt-1 text-xs text-ink-500">
              vs {comparePeriod === "last_month" ? "last month" : "this month"}:{" "}
              <span
                className={
                  revenue >= compareRevenue ? "text-emerald-400" : "text-rose-300"
                }
              >
                {formatPct(revenue / compareRevenue - 1, 1)}
              </span>
            </p>
          ) : null}
        </div>
      </header>

      <div className="space-y-3">
        {STAGES.map((stage, idx) => {
          const value = current[stage];
          const widthPct = Math.max(8, (value / maxW) * 100);
          const prev = idx > 0 ? current[STAGES[idx - 1]] : null;
          const convFromPrev =
            prev && prev > 0 ? value / prev : null;
          const dropFromPrev = convFromPrev !== null ? 1 - convFromPrev : null;

          return (
            <div key={stage}>
              {idx > 0 && convFromPrev !== null && dropFromPrev !== null ? (
                <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1 pl-1 text-xs text-ink-500">
                  <span>
                    Conv from {STAGE_LABELS[STAGES[idx - 1]]}:{" "}
                    <span className="font-mono text-ink-200">{formatPct(convFromPrev, 2)}</span>
                  </span>
                  <span>
                    Drop-off:{" "}
                    <span className="font-mono text-rose-300/90">
                      {formatPct(dropFromPrev, 2)}
                    </span>
                  </span>
                </div>
              ) : null}
              <div className="flex items-center gap-4">
                <div className="w-36 shrink-0 text-sm font-medium text-ink-200">
                  {STAGE_LABELS[stage]}
                </div>
                <div className="relative min-w-0 flex-1">
                  <div className="h-10 overflow-hidden rounded-lg bg-ink-800/80 ring-1 ring-ink-700/80">
                    <div
                      className="flex h-full items-center justify-end bg-gradient-to-r from-sky-600/90 to-accent/80 px-3 transition-[width] duration-500"
                      style={{ width: `${widthPct}%` }}
                    >
                      <span className="font-mono text-xs font-medium text-ink-950 tabular-nums">
                        {formatCompact(value)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <aside className="mt-6 rounded-xl border border-ink-700/80 bg-ink-950/40 p-4 text-sm text-ink-300">
        <span className="font-medium text-ink-100">Read of the board: </span>
        {INSIGHTS.funnel}
      </aside>
    </section>
  );
}
