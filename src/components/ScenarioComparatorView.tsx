import React, { useState, useMemo } from 'react';
import {
  Scale,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Sliders,
  Sparkles,
  CheckCircle2,
  MapPin,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import type {
  MicroWatershed,
  PolicyWeights,
  IndicatorKey,
} from '../types/watershed';
import { POLICY_PRESETS } from '../data/mockWatersheds';
import {
  comparePolicyScenarios,
  normalizeWeights,
  PRIORITY_TIER_COLORS,
} from '../services/mcdaEngine';

interface ScenarioComparatorViewProps {
  watersheds: MicroWatershed[];
  scenarioAWeights: PolicyWeights;
  budgetLakhs: number;
  onInspectWatershedOnMap: (watershedId: string) => void;
}

export const ScenarioComparatorView: React.FC<ScenarioComparatorViewProps> = ({
  watersheds,
  scenarioAWeights,
  budgetLakhs,
  onInspectWatershedOnMap,
}) => {
  const [scenarioBPresetId, setScenarioBPresetId] = useState<string>('soilErosion');
  const [scenarioBWeights, setScenarioBWeights] = useState<PolicyWeights>(
    POLICY_PRESETS.soilErosion.weights
  );

  const comparison = useMemo(
    () =>
      comparePolicyScenarios(
        watersheds,
        'Scenario A (Active Live Policy)',
        scenarioAWeights,
        `Scenario B (${POLICY_PRESETS[scenarioBPresetId]?.label || 'Custom Alternate Policy'})`,
        scenarioBWeights,
        budgetLakhs
      ),
    [watersheds, scenarioAWeights, scenarioBWeights, scenarioBPresetId, budgetLakhs]
  );

  const normA = normalizeWeights(scenarioAWeights);
  const normB = normalizeWeights(scenarioBWeights);

  const handleScenarioBSlider = (key: IndicatorKey, val: number) => {
    setScenarioBPresetId('custom');
    setScenarioBWeights((prev) => ({ ...prev, [key]: val }));
  };

  const chartData = comparison.items.map((item) => ({
    id: item.watershedId,
    name: item.watershedName,
    ScenarioA: item.scoreA,
    ScenarioB: item.scoreB,
  }));

  return (
    <div className="flex-1 h-full bg-[#0B132B] overflow-y-auto p-4 space-y-4 select-none">
      {/* Top Banner: No-Regret / Robust Priority Sites Callout */}
      <div className="bg-gradient-to-r from-[#112A2E] via-[#162C3D] to-[#1C2541] border border-emerald-500/45 rounded-2xl p-4 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-extrabold text-sm uppercase tracking-wider text-white">
                  “No-Regret” Robust Priority Micro-Watersheds
                </h2>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {comparison.noRegretSites.length} Sites Remain in Top 4 Across Both Policies
                </span>
              </div>
              <p className="text-xs text-slate-300">
                These micro-watersheds rank in the Top 4 under both Scenario A and Scenario B regardless of policy weight shifts — ideal for immediate, low-risk Phase-1 funding.
              </p>
            </div>
          </div>

          <div className="bg-[#0B132B]/80 border border-cyan-500/30 rounded-xl px-3 py-2 text-right">
            <div className="text-[10px] font-mono uppercase text-slate-400">
              Spearman Rank Stability (ρ)
            </div>
            <div className="text-sm font-mono font-extrabold text-cyan-300">
              ρ = {comparison.rankCorrelationSpearman.toFixed(3)}
            </div>
          </div>
        </div>

        {/* No-Regret Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {comparison.noRegretSites.map((site) => (
            <div
              key={site.watershedId}
              onClick={() => onInspectWatershedOnMap(site.watershedId)}
              className="bg-[#0B132B]/85 hover:bg-[#0B132B] border border-emerald-500/40 rounded-xl p-3 cursor-pointer transition group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono font-extrabold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {site.watershedId} • ROBUST TOP-4
                </span>
                <span className="text-[10px] font-mono text-cyan-300 group-hover:underline flex items-center gap-0.5">
                  <MapPin className="w-3 h-3" /> Map
                </span>
              </div>
              <div className="text-xs font-bold text-white truncate mb-1.5">
                {site.watershedName}
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono bg-[#1C2541]/80 rounded-lg px-2 py-1">
                <span className="text-cyan-300">
                  Scen A: #{site.rankA} ({site.scoreA})
                </span>
                <span className="text-slate-500">→</span>
                <span className="text-emerald-300">
                  Scen B: #{site.rankB} ({site.scoreB})
                </span>
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400">
                <span>Cost: ₹{site.costLakhs}L • {site.areaSqKm} km²</span>
                <span>Pop: {site.exposedPopulation.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Middle Row: Scenario Weight Configurator + Side-by-Side Score Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left 5 cols: Scenario A vs Scenario B Weight Controls */}
        <div className="lg:col-span-5 bg-[#1C2541]/70 border border-slate-700/80 rounded-2xl p-4 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-[#00B4D8]" />
                <h3 className="font-display font-bold text-xs uppercase tracking-wider text-white">
                  Configure Scenario B (Counterfactual Policy)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-cyan-300">
                Compare against Live Sidebar (Scenario A)
              </span>
            </div>

            {/* Scenario B Preset Buttons */}
            <div className="grid grid-cols-3 gap-1.5 mb-3">
              {Object.values(POLICY_PRESETS).map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    setScenarioBPresetId(preset.id);
                    setScenarioBWeights(preset.weights);
                  }}
                  className={`p-2 rounded-lg border text-left transition ${
                    scenarioBPresetId === preset.id
                      ? 'bg-emerald-500/20 border-emerald-400 text-white'
                      : 'bg-[#0B132B]/70 border-slate-800 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="text-[11px] font-bold truncate">{preset.label}</div>
                  <div className="text-[9px] font-mono text-slate-400 truncate">
                    {preset.badge}
                  </div>
                </button>
              ))}
            </div>

            {/* Side-by-Side Weight Table & Sliders */}
            <div className="space-y-2">
              {(
                [
                  { key: 'slope', label: 'DEM Slope Steepness' },
                  { key: 'runoff', label: 'Runoff & Flow Acc.' },
                  { key: 'vegDeficit', label: 'Vegetation Deficit' },
                  { key: 'rainfall', label: 'Extreme Rainfall' },
                  { key: 'exposure', label: 'Downstream Exposure' },
                ] as { key: IndicatorKey; label: string }[]
              ).map((row) => (
                <div
                  key={row.key}
                  className="bg-[#0B132B]/80 border border-slate-800 rounded-lg p-2"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-200">{row.label}</span>
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="text-cyan-300">
                        A: {(normA[row.key] * 100).toFixed(0)}%
                      </span>
                      <span className="text-slate-500">vs</span>
                      <span className="text-emerald-400 font-bold">
                        B: {(normB[row.key] * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={scenarioBWeights[row.key]}
                    onChange={(e) =>
                      handleScenarioBSlider(row.key, Number(e.target.value))
                    }
                    className="w-full gis-slider"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 7 cols: Recharts Scenario A vs Scenario B Grouped Bar Chart */}
        <div className="lg:col-span-7 bg-[#1C2541]/70 border border-slate-700/80 rounded-2xl p-4 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-[#00B4D8]" />
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-white">
                Multi-Watershed Score Shift Distribution (Scenario A vs. Scenario B)
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              0–100 Normalized MCDA Scale
            </span>
          </div>

          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 16, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis
                  dataKey="id"
                  tick={{ fill: '#CBD5E1', fontSize: 11, fontWeight: 600 }}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: '#94A3B8', fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0B132B',
                    borderColor: '#00B4D8',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar
                  dataKey="ScenarioA"
                  name="Scenario A (Live Weights)"
                  fill="#00B4D8"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="ScenarioB"
                  name="Scenario B (Alternate Policy)"
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row: Complete Rank Shift ("Bump") Comparison Table */}
      <div className="bg-[#1C2541]/70 border border-slate-700/80 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#00B4D8]" />
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-white">
              Rank Shift (“Bump”) Matrix — All 12 Candidate Micro-Watersheds
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Click any row to inspect that micro-watershed on the Spatial Explorer map
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-700 text-[11px] font-mono uppercase text-slate-400">
                <th className="py-2 px-3">Watershed</th>
                <th className="py-2 px-3">Scenario A Rank &amp; Score</th>
                <th className="py-2 px-3">Scenario B Rank &amp; Score</th>
                <th className="py-2 px-3">Rank Shift (Δ)</th>
                <th className="py-2 px-3">Score Delta</th>
                <th className="py-2 px-3">Exposed Pop.</th>
                <th className="py-2 px-3">Confidence</th>
                <th className="py-2 px-3">Robust Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {comparison.items.map((item) => {
                const colorA = PRIORITY_TIER_COLORS[item.tierA];
                const colorB = PRIORITY_TIER_COLORS[item.tierB];

                return (
                  <tr
                    key={item.watershedId}
                    onClick={() => onInspectWatershedOnMap(item.watershedId)}
                    className="hover:bg-[#0B132B]/70 cursor-pointer transition"
                  >
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span className="font-mono text-cyan-300">
                          {item.watershedId}
                        </span>
                        <span>{item.watershedName}</span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">
                        WRIS: {item.watershedCode} • {item.areaSqKm} km² • ₹
                        {item.costLakhs}L
                      </div>
                    </td>

                    <td className="py-2.5 px-3 font-mono">
                      <span
                        className="font-extrabold px-2 py-0.5 rounded mr-1.5"
                        style={{
                          backgroundColor: `${colorA}20`,
                          color: colorA,
                          border: `1px solid ${colorA}50`,
                        }}
                      >
                        #{item.rankA}
                      </span>
                      <span className="text-slate-200 font-semibold">
                        {item.scoreA.toFixed(1)} pts
                      </span>
                    </td>

                    <td className="py-2.5 px-3 font-mono">
                      <span
                        className="font-extrabold px-2 py-0.5 rounded mr-1.5"
                        style={{
                          backgroundColor: `${colorB}20`,
                          color: colorB,
                          border: `1px solid ${colorB}50`,
                        }}
                      >
                        #{item.rankB}
                      </span>
                      <span className="text-slate-200 font-semibold">
                        {item.scoreB.toFixed(1)} pts
                      </span>
                    </td>

                    <td className="py-2.5 px-3 font-mono">
                      {item.rankDelta > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                          <ArrowUpRight className="w-3.5 h-3.5" />▲ +{item.rankDelta}
                        </span>
                      ) : item.rankDelta < 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/40 font-bold">
                          <ArrowDownRight className="w-3.5 h-3.5" />▼ {item.rankDelta}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                          <Minus className="w-3 h-3" />— Stable
                        </span>
                      )}
                    </td>

                    <td className="py-2.5 px-3 font-mono">
                      <span
                        className={
                          item.scoreDelta > 0
                            ? 'text-emerald-400 font-bold'
                            : item.scoreDelta < 0
                            ? 'text-orange-400 font-bold'
                            : 'text-slate-400'
                        }
                      >
                        {item.scoreDelta > 0 ? `+${item.scoreDelta}` : item.scoreDelta}{' '}
                        pts
                      </span>
                    </td>

                    <td className="py-2.5 px-3 font-mono text-slate-200">
                      {item.exposedPopulation.toLocaleString()}
                    </td>

                    <td className="py-2.5 px-3 font-mono text-cyan-300">
                      {item.confidencePct}%
                    </td>

                    <td className="py-2.5 px-3">
                      {item.isNoRegretTopSite ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          <ShieldCheck className="w-3 h-3" /> No-Regret Top-4
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-500">
                          Policy-Dependent
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
