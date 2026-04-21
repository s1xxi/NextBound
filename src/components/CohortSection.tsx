import {
  CASE_STUDY,
  COHORTS,
  INSIGHTS,
  type CohortId,
  type CohortRow,
} from "../data/caseStudy";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type MetricMode = "retention" | "revenue";

type Props = {
  sourceFilter: "all" | "linkedin" | "google";
  metric: MetricMode;
  onMetricChange: (m: MetricMode) => void;
};

function filterCohorts(source: Props["sourceFilter"]): CohortRow[] {
  if (source === "all") return COHORTS;
  return COHORTS.filter((c) => c.source === source || c.source === "mixed");
}

function buildChartRows(cohorts: CohortRow[], metric: MetricMode) {
  const weeks = cohorts[0]?.retentionPct.length ?? 0;
  const rows: Record<string, string | number>[] = [];
  for (let w = 0; w < weeks; w += 1) {
    const row: Record<string, string | number> = { week: `W${w}` };
    for (const c of cohorts) {
      row[c.id] =
        metric === "retention" ? c.retentionPct[w] ?? 0 : c.cumulativeRevenueK[w] ?? 0;
    }
    rows.push(row);
  }
  return rows;
}

const COLORS = ["#38bdf8", "#a78bfa", "#34d399", "#fbbf24"];

export function CohortSection({ sourceFilter, metric, onMetricChange }: Props) {
  const cohorts = filterCohorts(sourceFilter);
  const data = buildChartRows(cohorts, metric);

  return (
    <section className="rounded-2xl border border-ink-700/80 bg-ink-900/60 p-6 shadow-xl shadow-black/20 backdrop-blur">
      <header className="mb-4 flex flex-col gap-4 border-b border-ink-700/60 pb-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-accent">
            2 — Cohort quality over time
          </p>
          <h2 className="mt-1 text-xl font-semibold text-ink-100">Retention & cumulative revenue</h2>
          <p className="mt-1 max-w-2xl text-sm text-ink-400">
            Each line is a monthly acquisition cohort at {CASE_STUDY.company}. Toggle metric to
            compare short-term activation vs revenue compounding.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onMetricChange("retention")}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
              metric === "retention"
                ? "bg-accent/20 text-accent-glow ring-1 ring-accent/40"
                : "bg-ink-800 text-ink-300 ring-1 ring-ink-700 hover:text-ink-100"
            }`}
          >
            Retention %
          </button>
          <button
            type="button"
            onClick={() => onMetricChange("revenue")}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
              metric === "revenue"
                ? "bg-accent/20 text-accent-glow ring-1 ring-accent/40"
                : "bg-ink-800 text-ink-300 ring-1 ring-ink-700 hover:text-ink-100"
            }`}
          >
            Cumulative revenue ($K)
          </button>
        </div>
      </header>

      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#243044" strokeDasharray="3 3" />
            <XAxis dataKey="week" stroke="#8a9bb5" tick={{ fill: "#8a9bb5", fontSize: 12 }} />
            <YAxis
              stroke="#8a9bb5"
              tick={{ fill: "#8a9bb5", fontSize: 12 }}
              domain={metric === "retention" ? [0, 100] : [0, "auto"]}
              tickFormatter={(v) => (metric === "retention" ? `${v}%` : `${v}`)}
            />
            <Tooltip
              contentStyle={{
                background: "#121722",
                border: "1px solid #243044",
                borderRadius: 12,
              }}
              labelStyle={{ color: "#d6deeb" }}
              formatter={(value: number, name: string) => [
                metric === "retention" ? `${value}%` : `$${value}K`,
                COHORTS.find((c) => c.id === (name as CohortId))?.label ?? name,
              ]}
            />
            <Legend />
            {cohorts.map((c, i) => (
              <Line
                key={c.id}
                type="monotone"
                dataKey={c.id}
                name={c.label}
                stroke={COLORS[i % COLORS.length]}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <aside className="mt-4 rounded-xl border border-ink-700/80 bg-ink-950/40 p-4 text-sm text-ink-300">
        <span className="font-medium text-ink-100">Read of the board: </span>
        {INSIGHTS.cohort}
      </aside>
    </section>
  );
}
