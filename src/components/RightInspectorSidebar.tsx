import React, { useState } from 'react';
import {
  Search,
  Trophy,
  FileSearch,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  Wrench,
  Activity,
  BarChart3,
  Radar as RadarIcon,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from 'recharts';
import type {
  EvaluatedWatershed,
  NormalizedIndicators,
} from '../types/watershed';
import { PRIORITY_TIER_COLORS } from '../services/mcdaEngine';

interface RightInspectorSidebarProps {
  evaluatedWatersheds: EvaluatedWatershed[];
  selectedWatershedId: string;
  onSelectWatershed: (id: string) => void;
  basinMeanIndicators: NormalizedIndicators;
}

export const RightInspectorSidebar: React.FC<RightInspectorSidebarProps> = ({
  evaluatedWatersheds,
  selectedWatershedId,
  onSelectWatershed,
  basinMeanIndicators,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'funded' | 'critical'>('all');
  const [chartTab, setChartTab] = useState<'contributions' | 'radar'>('contributions');

  const selectedWatershed =
    evaluatedWatersheds.find((w) => w.id === selectedWatershedId) ||
    evaluatedWatersheds[0];

  const filteredList = evaluatedWatersheds.filter((w) => {
    const matchesSearch =
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.code.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterMode === 'funded') return w.isFundedWithinBudget;
    if (filterMode === 'critical')
      return w.priorityTier === 'Critical' || w.priorityTier === 'High';
    return true;
  });

  // Data for Horizontal Score Contribution Breakdown Chart
  const contributionData = selectedWatershed
    ? [
        {
          name: 'DEM Slope',
          points: selectedWatershed.contributions100.slope,
          color: '#F97316',
          raw: `${selectedWatershed.physicalIndicators.meanSlopeDeg}°`,
        },
        {
          name: 'Runoff & Flow',
          points: selectedWatershed.contributions100.runoff,
          color: '#00B4D8',
          raw: `Coeff ${selectedWatershed.physicalIndicators.runoffCoefficient}`,
        },
        {
          name: 'Veg Deficit',
          points: selectedWatershed.contributions100.vegDeficit,
          color: '#10B981',
          raw: `${selectedWatershed.physicalIndicators.degradedLandPct}% bare`,
        },
        {
          name: 'Rain Intensity',
          points: selectedWatershed.contributions100.rainfall,
          color: '#3B82F6',
          raw: `${selectedWatershed.physicalIndicators.annualRainfallMm} mm`,
        },
        {
          name: 'Pop. Exposure',
          points: selectedWatershed.contributions100.exposure,
          color: '#EF4444',
          raw: `${selectedWatershed.physicalIndicators.exposedPopulation.toLocaleString()} pop`,
        },
      ]
    : [];

  // Data for Multi-Criteria Radar Chart vs. Basin Mean Baseline
  const radarData = selectedWatershed
    ? [
        {
          indicator: 'Slope',
          site: Math.round(selectedWatershed.normalizedIndicators.slope * 100),
          basinMean: Math.round(basinMeanIndicators.slope * 100),
        },
        {
          indicator: 'Runoff',
          site: Math.round(selectedWatershed.normalizedIndicators.runoff * 100),
          basinMean: Math.round(basinMeanIndicators.runoff * 100),
        },
        {
          indicator: 'Veg Deficit',
          site: Math.round(selectedWatershed.normalizedIndicators.vegDeficit * 100),
          basinMean: Math.round(basinMeanIndicators.vegDeficit * 100),
        },
        {
          indicator: 'Rainfall',
          site: Math.round(selectedWatershed.normalizedIndicators.rainfall * 100),
          basinMean: Math.round(basinMeanIndicators.rainfall * 100),
        },
        {
          indicator: 'Exposure',
          site: Math.round(selectedWatershed.normalizedIndicators.exposure * 100),
          basinMean: Math.round(basinMeanIndicators.exposure * 100),
        },
      ]
    : [];

  return (
    <aside className="w-[32%] min-w-[360px] max-w-[480px] h-full bg-[#0B132B] border-l border-slate-800/90 flex flex-col overflow-hidden shrink-0 select-none">
      {/* TOP HALF: Live Ranked Micro-Watershed Leaderboard */}
      <div className="h-[42%] flex flex-col border-b border-slate-800 p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-[#00B4D8]" />
            <h2 className="font-display font-bold text-xs uppercase tracking-wider text-white">
              Ranked Micro-Watershed Leaderboard
            </h2>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            Click card to inspect
          </span>
        </div>

        {/* Search & Quick Filter Pills */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ID, name, or WRIS code..."
              className="w-full bg-[#1C2541] text-xs text-white placeholder-slate-400 pl-8 pr-2.5 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-[#00B4D8]"
            />
          </div>

          <div className="flex items-center bg-[#1C2541] p-0.5 rounded-lg border border-slate-700 text-[11px]">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-2 py-1 rounded-md font-medium transition ${
                filterMode === 'all'
                  ? 'bg-[#00B4D8] text-[#0B132B] font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterMode('funded')}
              className={`px-2 py-1 rounded-md font-medium transition ${
                filterMode === 'funded'
                  ? 'bg-emerald-500 text-[#0B132B] font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Funded
            </button>
            <button
              onClick={() => setFilterMode('critical')}
              className={`px-2 py-1 rounded-md font-medium transition ${
                filterMode === 'critical'
                  ? 'bg-red-500 text-white font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Crit/High
            </button>
          </div>
        </div>

        {/* Scrollable Ranked Cards */}
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
          {filteredList.map((ws) => {
            const isSelected = ws.id === selectedWatershed?.id;
            const tierColor = PRIORITY_TIER_COLORS[ws.priorityTier];

            return (
              <button
                key={ws.id}
                onClick={() => onSelectWatershed(ws.id)}
                className={`w-full text-left p-2 rounded-xl border transition flex items-center justify-between gap-2.5 ${
                  isSelected
                    ? 'bg-[#1C2541] border-[#00B4D8] shadow-md shadow-cyan-500/10'
                    : 'bg-[#1C2541]/45 border-slate-800/90 hover:bg-[#1C2541]/80 hover:border-slate-700'
                }`}
              >
                {/* Rank Badge */}
                <div
                  className="w-8 h-8 rounded-lg flex flex-col items-center justify-center shrink-0 font-mono font-extrabold text-xs"
                  style={{
                    backgroundColor: `${tierColor}20`,
                    color: tierColor,
                    border: `1px solid ${tierColor}55`,
                  }}
                >
                  <span>#{ws.rank}</span>
                </div>

                {/* Middle Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-mono font-bold text-cyan-300">
                      {ws.id}
                    </span>
                    <span className="text-xs font-bold text-white truncate">
                      {ws.name}
                    </span>
                  </div>

                  {/* Mini Score Bar */}
                  <div className="w-full h-1.5 bg-[#0B132B] rounded-full overflow-hidden mt-1 border border-slate-800">
                    <div
                      className="h-full rounded-full transition-all duration-200"
                      style={{
                        width: `${ws.priorityScore100}%`,
                        backgroundColor: tierColor,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                    <span>
                      ₹{ws.estimatedCostLakhs}L • {ws.areaSqKm} km²
                    </span>
                    <span>Conf: {ws.uncertainty.overallConfidencePct}%</span>
                  </div>
                </div>

                {/* Score & Funded Pill */}
                <div className="text-right shrink-0 flex flex-col items-end gap-1">
                  <span
                    className="text-xs font-mono font-extrabold px-1.5 py-0.5 rounded"
                    style={{
                      backgroundColor: `${tierColor}20`,
                      color: tierColor,
                    }}
                  >
                    {ws.priorityScore100.toFixed(1)}
                  </span>
                  {ws.isFundedWithinBudget ? (
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-0.5">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      FUNDED
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono text-slate-500">
                      Unfunded
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* BOTTOM HALF: Per-Site Explainable Evidence Inspector ("Why This Score?") */}
      {selectedWatershed && (
        <div className="h-[58%] flex flex-col overflow-y-auto p-3 space-y-3">
          {/* Inspector Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <FileSearch className="w-4 h-4 text-[#00B4D8]" />
              <h2 className="font-display font-bold text-xs uppercase tracking-wider text-white">
                Explainable Evidence Inspector — {selectedWatershed.id}
              </h2>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              WRIS: {selectedWatershed.code}
            </span>
          </div>

          {/* 1. Natural Language Evidence Summary Box */}
          <div className="bg-gradient-to-r from-[#1C2541] to-[#16293B] border border-cyan-500/40 rounded-xl p-2.5 shadow-sm">
            <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-cyan-300 mb-1">
              <Sparkles className="w-3 h-3" />
              <span>Why This Watershed Ranks #{selectedWatershed.rank}</span>
            </div>
            <p className="text-xs text-slate-100 leading-relaxed">
              {selectedWatershed.naturalLanguageSummary}
            </p>
          </div>

          {/* 2 & 3. Interactive Chart Switcher: Score Contributions vs. Multi-Criteria Radar */}
          <div className="bg-[#1C2541]/60 border border-slate-800 rounded-xl p-2.5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1 bg-[#0B132B] p-0.5 rounded-lg border border-slate-800">
                <button
                  onClick={() => setChartTab('contributions')}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold transition ${
                    chartTab === 'contributions'
                      ? 'bg-[#00B4D8] text-[#0B132B]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <BarChart3 className="w-3 h-3" />
                  <span>Score Breakdown (Pts)</span>
                </button>
                <button
                  onClick={() => setChartTab('radar')}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold transition ${
                    chartTab === 'radar'
                      ? 'bg-[#00B4D8] text-[#0B132B]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <RadarIcon className="w-3 h-3" />
                  <span>Radar vs. Basin Mean</span>
                </button>
              </div>
              <span className="text-xs font-mono font-bold text-white">
                Total: {selectedWatershed.priorityScore100.toFixed(1)} pts
              </span>
            </div>

            {chartTab === 'contributions' ? (
              <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={contributionData}
                    layout="vertical"
                    margin={{ top: 2, right: 24, left: 10, bottom: 2 }}
                  >
                    <XAxis
                      type="number"
                      domain={[0, 40]}
                      tick={{ fill: '#94A3B8', fontSize: 10 }}
                      axisLine={{ stroke: '#334155' }}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={88}
                      tick={{ fill: '#E2E8F0', fontSize: 11, fontWeight: 600 }}
                      axisLine={false}
                    />
                    <RechartsTooltip
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      contentStyle={{
                        backgroundColor: '#0B132B',
                        borderColor: '#00B4D8',
                        borderRadius: '8px',
                        fontSize: '11px',
                      }}
                      formatter={(value: number, _name: string, props: { payload?: { raw?: string } }) => [
                        `+${value.toFixed(1)} pts (${props.payload?.raw || ''})`,
                        'Weighted Contribution',
                      ]}
                    />
                    <Bar dataKey="points" radius={[0, 4, 4, 0]} barSize={14}>
                      {contributionData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="68%" data={radarData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis
                      dataKey="indicator"
                      tick={{ fill: '#E2E8F0', fontSize: 10, fontWeight: 600 }}
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 100]}
                      tick={{ fill: '#64748B', fontSize: 9 }}
                    />
                    <Radar
                      name={selectedWatershed.id}
                      dataKey="site"
                      stroke="#00B4D8"
                      fill="#00B4D8"
                      fillOpacity={0.45}
                    />
                    <Radar
                      name="Basin Mean"
                      dataKey="basinMean"
                      stroke="#10B981"
                      fill="#10B981"
                      fillOpacity={0.2}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: '10px', paddingTop: '4px' }}
                    />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: '#0B132B',
                        borderColor: '#00B4D8',
                        borderRadius: '8px',
                        fontSize: '11px',
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* 4. Raw Physical Indicators Grid */}
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
              <Activity className="w-3 h-3 text-cyan-400" />
              <span>Observed Physical Telemetry (Unnormalized Units)</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <div className="bg-[#1C2541]/60 border border-slate-800 rounded-lg p-2">
                <div className="text-[10px] text-slate-400">Mean DEM Slope</div>
                <div className="text-xs font-mono font-bold text-orange-400">
                  {selectedWatershed.physicalIndicators.meanSlopeDeg}°
                </div>
              </div>
              <div className="bg-[#1C2541]/60 border border-slate-800 rounded-lg p-2">
                <div className="text-[10px] text-slate-400">Runoff Coeff</div>
                <div className="text-xs font-mono font-bold text-cyan-300">
                  {selectedWatershed.physicalIndicators.runoffCoefficient}
                </div>
              </div>
              <div className="bg-[#1C2541]/60 border border-slate-800 rounded-lg p-2">
                <div className="text-[10px] text-slate-400">Degraded Land</div>
                <div className="text-xs font-mono font-bold text-emerald-400">
                  {selectedWatershed.physicalIndicators.degradedLandPct}%
                </div>
              </div>
              <div className="bg-[#1C2541]/60 border border-slate-800 rounded-lg p-2">
                <div className="text-[10px] text-slate-400">Annual Rainfall</div>
                <div className="text-xs font-mono font-bold text-blue-400">
                  {selectedWatershed.physicalIndicators.annualRainfallMm.toLocaleString()} mm
                </div>
              </div>
              <div className="bg-[#1C2541]/60 border border-slate-800 rounded-lg p-2">
                <div className="text-[10px] text-slate-400">Exposed Pop.</div>
                <div className="text-xs font-mono font-bold text-red-400">
                  {selectedWatershed.physicalIndicators.exposedPopulation.toLocaleString()}
                </div>
              </div>
              <div className="bg-[#1C2541]/60 border border-slate-800 rounded-lg p-2">
                <div className="text-[10px] text-slate-400">Flow Acc. Index</div>
                <div className="text-xs font-mono font-bold text-slate-200">
                  {selectedWatershed.physicalIndicators.flowAccumulationIndex} TWI
                </div>
              </div>
            </div>
          </div>

          {/* 5. Rule-Based Restoration Intervention Recommender */}
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 mb-1.5 flex items-center gap-1">
              <Wrench className="w-3 h-3" />
              <span>Recommended Engineering &amp; Ecological Interventions</span>
            </div>
            <div className="space-y-1.5">
              {selectedWatershed.recommendedInterventions.map((intv) => (
                <div
                  key={intv.id}
                  className="bg-[#1C2541]/75 border border-emerald-500/35 rounded-xl p-2.5 space-y-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white">{intv.title}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0">
                      {intv.category}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-cyan-300">
                    Trigger: {intv.triggerRule}
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    {intv.description}
                  </p>
                  <div className="text-[10px] font-semibold text-emerald-400 pt-0.5">
                    Expected Outcome: {intv.estimatedImpact}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Per-Site Data Uncertainty & Sensitivity Card */}
          <div className="bg-[#1C2541]/60 border border-amber-500/30 rounded-xl p-2.5 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] font-bold text-white uppercase tracking-wider">
                  Data Uncertainty &amp; Rank Sensitivity
                </span>
              </div>
              <span
                className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  selectedWatershed.uncertainty.confidenceLevel === 'High'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}
              >
                {selectedWatershed.uncertainty.overallConfidencePct}%{' '}
                {selectedWatershed.uncertainty.confidenceLevel}
              </span>
            </div>

            <p className="text-[11px] text-slate-300 leading-snug">
              {selectedWatershed.uncertainty.confidenceNote}
            </p>

            <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px] font-mono">
              <div className="bg-[#0B132B]/70 rounded p-1.5 border border-slate-800">
                <span className="text-slate-400 block">DEM Void Interpolation:</span>
                <span className="text-cyan-300 font-bold">
                  {selectedWatershed.uncertainty.demVoidInterpolationPct}% NoData filled
                </span>
              </div>
              <div className="bg-[#0B132B]/70 rounded p-1.5 border border-slate-800">
                <span className="text-slate-400 block">Rank Sensitivity (±15% w):</span>
                <span className="text-amber-300 font-bold">
                  {selectedWatershed.uncertainty.rankingSensitivityIndex} (±
                  {selectedWatershed.uncertainty.sensitivityDeltaRanks} rank)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
