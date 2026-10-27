import React from 'react';
import {
  Sliders,
  Mountain,
  Waves,
  Trees,
  CloudRain,
  Users,
  Wallet,
  RotateCcw,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import type {
  PolicyWeights,
  IndicatorKey,
  EvaluatedWatershed,
} from '../types/watershed';
import { POLICY_PRESETS } from '../data/mockWatersheds';
import { normalizeWeights } from '../services/mcdaEngine';

interface LeftPolicySidebarProps {
  weights: PolicyWeights;
  activePresetId: string | null;
  onSelectPreset: (presetId: string, presetWeights: PolicyWeights) => void;
  onChangeWeight: (key: IndicatorKey, value: number) => void;
  budgetLakhs: number;
  onChangeBudget: (budget: number) => void;
  evaluatedWatersheds: EvaluatedWatershed[];
}

interface SliderConfig {
  key: IndicatorKey;
  label: string;
  sourceTag: string;
  color: string;
  barClass: string;
  icon: React.ReactNode;
}

const SLIDER_CONFIGS: SliderConfig[] = [
  {
    key: 'slope',
    label: 'DEM Slope Steepness',
    sourceTag: 'USGS SRTM 30m',
    color: '#F97316',
    barClass: 'bg-orange-500',
    icon: <Mountain className="w-3.5 h-3.5 text-orange-400" />,
  },
  {
    key: 'runoff',
    label: 'Runoff & Flow Accumulation',
    sourceTag: 'WhiteboxTools / India-WRIS',
    color: '#00B4D8',
    barClass: 'bg-[#00B4D8]',
    icon: <Waves className="w-3.5 h-3.5 text-[#00B4D8]" />,
  },
  {
    key: 'vegDeficit',
    label: 'Vegetation Deficit / Bare Land',
    sourceTag: 'ESA WorldCover 10m',
    color: '#10B981',
    barClass: 'bg-emerald-500',
    icon: <Trees className="w-3.5 h-3.5 text-emerald-400" />,
  },
  {
    key: 'rainfall',
    label: 'Extreme Rainfall Intensity',
    sourceTag: 'Copernicus ERA5',
    color: '#3B82F6',
    barClass: 'bg-blue-500',
    icon: <CloudRain className="w-3.5 h-3.5 text-blue-400" />,
  },
  {
    key: 'exposure',
    label: 'Downstream Population Exposure',
    sourceTag: 'Settlement Vulnerability',
    color: '#EF4444',
    barClass: 'bg-red-500',
    icon: <Users className="w-3.5 h-3.5 text-red-400" />,
  },
];

export const LeftPolicySidebar: React.FC<LeftPolicySidebarProps> = ({
  weights,
  activePresetId,
  onSelectPreset,
  onChangeWeight,
  budgetLakhs,
  onChangeBudget,
  evaluatedWatersheds,
}) => {
  const normW = normalizeWeights(weights);

  const fundedSites = evaluatedWatersheds.filter((w) => w.isFundedWithinBudget);
  const totalBudgetUsed = fundedSites.reduce((s, w) => s + w.estimatedCostLakhs, 0);
  const totalAreaRestored = fundedSites.reduce((s, w) => s + w.areaSqKm, 0);
  const totalPopProtected = fundedSites.reduce(
    (s, w) => s + w.physicalIndicators.exposedPopulation,
    0
  );

  return (
    <aside className="w-[26%] min-w-[295px] max-w-[380px] h-full bg-[#0B132B] border-r border-slate-800/90 flex flex-col overflow-y-auto px-3.5 py-3 gap-3.5 shrink-0 select-none">
      {/* Section 1: One-Click Policy Presets */}
      <div className="bg-[#1C2541]/70 border border-slate-700/70 rounded-xl p-3 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#00B4D8]" />
            <h2 className="font-display font-bold text-xs uppercase tracking-wider text-slate-200">
              One-Click Policy Presets
            </h2>
          </div>
          <button
            onClick={() =>
              onSelectPreset('balanced', POLICY_PRESETS.balanced.weights)
            }
            title="Reset to Balanced 20% Equal Weights"
            className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium transition"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>

        <div className="flex flex-col gap-1.5">
          {Object.values(POLICY_PRESETS).map((preset) => {
            const isActive = activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset.id, preset.weights)}
                className={`w-full text-left p-2 rounded-lg border transition flex flex-col gap-0.5 ${
                  isActive
                    ? 'bg-[#00B4D8]/15 border-[#00B4D8] shadow-sm shadow-cyan-500/10'
                    : 'bg-[#0B132B]/70 border-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{preset.label}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      isActive
                        ? 'bg-[#00B4D8] text-[#0B132B] font-bold'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {preset.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  {preset.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 2: 5 Interactive MCDA Weight Sliders */}
      <div className="bg-[#1C2541]/70 border border-slate-700/70 rounded-xl p-3 shadow-sm flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#00B4D8]" />
              <h2 className="font-display font-bold text-xs uppercase tracking-wider text-slate-200">
                MCDA Policy Weights
              </h2>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 rounded">
              ∑ ŵ_k = 1.00 (100%)
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mb-3">
            Drag sliders to simulate policy priorities. Scores &amp; ranks update in{' '}
            <span className="text-cyan-400 font-mono">&lt;1ms</span>.
          </p>

          {/* Normalized Weight Proportion Bar */}
          <div className="h-2 w-full rounded-full overflow-hidden flex bg-[#0B132B] mb-3 border border-slate-800">
            {SLIDER_CONFIGS.map((cfg) => (
              <div
                key={cfg.key}
                style={{ width: `${(normW[cfg.key] * 100).toFixed(1)}%` }}
                className={`${cfg.barClass} transition-all duration-150`}
                title={`${cfg.label}: ${(normW[cfg.key] * 100).toFixed(1)}%`}
              />
            ))}
          </div>

          <div className="space-y-3">
            {SLIDER_CONFIGS.map((cfg) => {
              const rawVal = weights[cfg.key];
              const normalizedPct = (normW[cfg.key] * 100).toFixed(1);

              return (
                <div
                  key={cfg.key}
                  className="bg-[#0B132B]/75 border border-slate-800/90 rounded-lg p-2.5"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      {cfg.icon}
                      <span className="text-xs font-semibold text-slate-100">
                        {cfg.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-slate-400">
                        raw:{rawVal}
                      </span>
                      <span
                        className="text-xs font-mono font-bold px-1.5 py-0.5 rounded"
                        style={{
                          backgroundColor: `${cfg.color}20`,
                          color: cfg.color,
                          border: `1px solid ${cfg.color}50`,
                        }}
                      >
                        {normalizedPct}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1.5">
                    <span>Source: {cfg.sourceTag}</span>
                    <span className="font-mono">ŵ = {normW[cfg.key].toFixed(2)}</span>
                  </div>

                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    aria-label={cfg.label}
                    value={rawVal}
                    onChange={(e) =>
                      onChangeWeight(cfg.key, Number(e.target.value))
                    }
                    className="w-full gis-slider"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Formula Reference Box */}
        <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>MCDA Formula:</span>
          <span className="text-cyan-300">Score_i = ∑ (ŵ_k × I_i,k)</span>
        </div>
      </div>

      {/* Section 3: Budget Constraint Simulator */}
      <div className="bg-gradient-to-br from-[#1C2541] to-[#112233] border border-emerald-500/35 rounded-xl p-3 shadow-md">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <Wallet className="w-4 h-4 text-emerald-400" />
            <h2 className="font-display font-bold text-xs uppercase tracking-wider text-white">
              Restoration Budget Simulator
            </h2>
          </div>
          <span className="text-xs font-mono font-extrabold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-500/40">
            ₹{budgetLakhs} Lakhs
          </span>
        </div>

        <p className="text-[11px] text-slate-300 mb-2">
          Allocates funds top-down by priority rank and highlights funded polygons on the map.
        </p>

        <input
          type="range"
          min={25}
          max={250}
          step={5}
          aria-label="Available Restoration Budget in Lakhs"
          value={budgetLakhs}
          onChange={(e) => onChangeBudget(Number(e.target.value))}
          className="w-full gis-slider mb-2.5"
        />

        <div className="grid grid-cols-3 gap-1.5 text-center">
          <div className="bg-[#0B132B]/80 border border-slate-800 rounded-lg p-1.5">
            <div className="text-[10px] text-slate-400">Funded Sites</div>
            <div className="text-xs font-mono font-bold text-emerald-400 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>
                {fundedSites.length}/{evaluatedWatersheds.length}
              </span>
            </div>
          </div>

          <div className="bg-[#0B132B]/80 border border-slate-800 rounded-lg p-1.5">
            <div className="text-[10px] text-slate-400">Area Restored</div>
            <div className="text-xs font-mono font-bold text-cyan-300">
              {totalAreaRestored.toFixed(1)} km²
            </div>
          </div>

          <div className="bg-[#0B132B]/80 border border-slate-800 rounded-lg p-1.5">
            <div className="text-[10px] text-slate-400">Pop. Shielded</div>
            <div className="text-xs font-mono font-bold text-white">
              {totalPopProtected.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span>Committed: ₹{totalBudgetUsed}L</span>
          <span>Unallocated Reserve: ₹{Math.max(0, budgetLakhs - totalBudgetUsed)}L</span>
        </div>
      </div>
    </aside>
  );
};
