import { CASE_STUDY, CHANNEL_COLORS, CHANNEL_ROI, INSIGHTS } from "../data/caseStudy";
import { formatUsd } from "../lib/format";
import {
  CartesianGrid,
  Cell,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

const scatterData = CHANNEL_ROI.map((p) => ({
  ...p,
  fill: CHANNEL_COLORS[p.channel],
}));

export function ScatterSection() {
  const maxAxis = Math.max(
    ...CHANNEL_ROI.map((p) => p.cac),
    ...CHANNEL_ROI.map((p) => p.ltv),
  );
  const axisMax = Math.ceil(maxAxis / 50_000) * 50_000;

  return (
    <section className="rounded-2xl border border-ink-700/80 bg-ink-900/60 p-6 shadow-xl shadow-black/20 backdrop-blur">
      <header className="mb-4 border-b border-ink-700/60 pb-4">
        <p className="text-xs font-medium uppercase tracking-widest text-accent">
          3 — Channel ROI (CAC vs LTV)
        </p>
        <h2 className="mt-1 text-xl font-semibold text-ink-100">Where to scale vs cut</h2>
        <p className="mt-1 max-w-2xl text-sm text-ink-400">
          Each bubble is a program at {CASE_STUDY.company}. X is blended CAC; Y is modeled LTV.
          Bubble size scales with customer count. The diagonal marks LTV = CAC (break-even on
          first-dollar gross margin — illustrative only).
        </p>
      </header>

      <div className="h-[380px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 8, right: 24, bottom: 8, left: 8 }}>
            <CartesianGrid stroke="#243044" strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="cac"
              name="CAC"
              domain={[0, axisMax]}
              tickFormatter={(v) => `${Math.round(v / 1000)}k`}
              stroke="#8a9bb5"
              tick={{ fill: "#8a9bb5", fontSize: 12 }}
              label={{ value: "CAC ($)", position: "insideBottom", offset: -4, fill: "#b4c0d4" }}
            />
            <YAxis
              type="number"
              dataKey="ltv"
              name="LTV"
              domain={[0, axisMax]}
              tickFormatter={(v) => `${Math.round(v / 1000)}k`}
              stroke="#8a9bb5"
              tick={{ fill: "#8a9bb5", fontSize: 12 }}
              label={{
                value: "LTV ($)",
                angle: -90,
                position: "insideLeft",
                fill: "#b4c0d4",
              }}
            />
            <ZAxis type="number" dataKey="customers" range={[80, 800]} />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              contentStyle={{
                background: "#121722",
                border: "1px solid #243044",
                borderRadius: 12,
              }}
              formatter={(value: number, name: string) => {
                if (name === "cac" || name === "ltv") return [formatUsd(value), name.toUpperCase()];
                if (name === "customers") return [value, "Customers"];
                return [value, name];
              }}
              labelFormatter={(_, payload) => payload?.[0]?.payload?.label ?? ""}
            />
            <ReferenceLine
              segment={[
                { x: 0, y: 0 },
                { x: axisMax, y: axisMax },
              ]}
              stroke="#fb7185"
              strokeDasharray="6 4"
              ifOverflow="extendDomain"
            />
            <Legend />
            <Scatter name="Programs" data={scatterData} fill="#5eead4">
              {scatterData.map((entry) => (
                <Cell key={`cell-${entry.id}`} fill={entry.fill} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-2 text-center text-xs text-ink-500">
        Points above the red line have LTV &gt; CAC on this synthetic basis; favor programs in
        the upper-left quadrant for capital efficiency at scale.
      </p>

      <aside className="mt-4 rounded-xl border border-ink-700/80 bg-ink-950/40 p-4 text-sm text-ink-300">
        <span className="font-medium text-ink-100">Read of the board: </span>
        {INSIGHTS.scatter}
      </aside>
    </section>
  );
}
