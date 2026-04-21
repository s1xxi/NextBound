import { useMemo, useState } from "react";
import { CASE_STUDY } from "./data/caseStudy";
import type { AudienceKey, ChannelKey, PeriodKey } from "./data/caseStudy";
import { CohortSection } from "./components/CohortSection";
import { FunnelSection } from "./components/FunnelSection";
import { ScatterSection } from "./components/ScatterSection";

type CohortMetric = "retention" | "revenue";
type CohortSource = "all" | "linkedin" | "google";

export default function App() {
  const [channel, setChannel] = useState<ChannelKey>("all");
  const [audience, setAudience] = useState<AudienceKey>("all");
  const [funnelPeriod, setFunnelPeriod] = useState<PeriodKey>("this_month");
  const [comparePeriod, setComparePeriod] = useState<PeriodKey>("last_month");
  const [cohortMetric, setCohortMetric] = useState<CohortMetric>("retention");
  const [cohortSource, setCohortSource] = useState<CohortSource>("all");

  const compareEnabled = funnelPeriod !== comparePeriod;

  const funnelCompare = useMemo(
    () => (compareEnabled ? comparePeriod : funnelPeriod),
    [compareEnabled, comparePeriod, funnelPeriod],
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <header className="mb-10">
        <p className="text-xs font-medium uppercase tracking-widest text-accent/90">
          Marketing intelligence MVP
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink-100 md:text-4xl">
          {CASE_STUDY.company}
        </h1>
        <p className="mt-2 max-w-3xl text-base text-ink-400">{CASE_STUDY.tagline}</p>
        <p className="mt-4 rounded-xl border border-ink-700/80 bg-ink-900/40 p-4 text-sm leading-relaxed text-ink-300">
          <span className="font-medium text-ink-100">Case study (dummy): </span>
          {CASE_STUDY.narrative} Filters below re-weight synthetic funnel splits so you can
          practice the narrative: traffic vs conversion, ICP vs non-ICP, and channel mix.
        </p>
      </header>

      <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-ink-700/60 bg-ink-900/30 p-4 md:flex-row md:flex-wrap md:items-center md:justify-between">
        <div className="flex flex-wrap gap-3">
          <label className="flex flex-col gap-1 text-xs text-ink-500">
            <span className="uppercase tracking-wide">Channel (funnel)</span>
            <select
              className="rounded-lg border border-ink-600 bg-ink-800 px-3 py-2 text-sm text-ink-100 outline-none ring-accent/0 transition focus:ring-2 focus:ring-accent/40"
              value={channel}
              onChange={(e) => setChannel(e.target.value as ChannelKey)}
            >
              <option value="all">All channels</option>
              <option value="linkedin">LinkedIn</option>
              <option value="google">Google</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs text-ink-500">
            <span className="uppercase tracking-wide">Audience</span>
            <select
              className="rounded-lg border border-ink-600 bg-ink-800 px-3 py-2 text-sm text-ink-100 outline-none focus:ring-2 focus:ring-accent/40"
              value={audience}
              onChange={(e) => setAudience(e.target.value as AudienceKey)}
            >
              <option value="all">All</option>
              <option value="icp">ICP</option>
              <option value="non_icp">Non-ICP</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs text-ink-500">
            <span className="uppercase tracking-wide">Funnel period</span>
            <select
              className="rounded-lg border border-ink-600 bg-ink-800 px-3 py-2 text-sm text-ink-100 outline-none focus:ring-2 focus:ring-accent/40"
              value={funnelPeriod}
              onChange={(e) => setFunnelPeriod(e.target.value as PeriodKey)}
            >
              <option value="this_month">This month</option>
              <option value="last_month">Last month</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs text-ink-500">
            <span className="uppercase tracking-wide">Compare revenue to</span>
            <select
              className="rounded-lg border border-ink-600 bg-ink-800 px-3 py-2 text-sm text-ink-100 outline-none focus:ring-2 focus:ring-accent/40"
              value={comparePeriod}
              onChange={(e) => setComparePeriod(e.target.value as PeriodKey)}
            >
              <option value="this_month">This month</option>
              <option value="last_month">Last month</option>
            </select>
          </label>
        </div>
        <div className="flex flex-wrap gap-3 md:justify-end">
          <label className="flex flex-col gap-1 text-xs text-ink-500">
            <span className="uppercase tracking-wide">Cohort acquisition source</span>
            <select
              className="rounded-lg border border-ink-600 bg-ink-800 px-3 py-2 text-sm text-ink-100 outline-none focus:ring-2 focus:ring-accent/40"
              value={cohortSource}
              onChange={(e) => setCohortSource(e.target.value as CohortSource)}
            >
              <option value="all">All sources</option>
              <option value="linkedin">LinkedIn-heavy</option>
              <option value="google">Google-heavy</option>
            </select>
          </label>
        </div>
      </div>

      {!compareEnabled ? (
        <p className="mb-6 text-sm text-ink-500">
          Pick two different periods above to see a closed-won revenue delta on the funnel card.
        </p>
      ) : null}

      <div className="flex flex-col gap-10">
        <FunnelSection
          channel={channel}
          audience={audience}
          period={funnelPeriod}
          comparePeriod={funnelCompare}
        />
        <CohortSection
          sourceFilter={cohortSource}
          metric={cohortMetric}
          onMetricChange={setCohortMetric}
        />
        <ScatterSection />
      </div>

      <footer className="mt-14 border-t border-ink-800 pt-6 text-center text-xs text-ink-600">
        Local MVP only — replace dummy data with warehouse / CRM / ad exports for production.
      </footer>
    </div>
  );
}
