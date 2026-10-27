import React, { useState } from 'react';
import {
  Droplets,
  Map as MapIcon,
  Scale,
  Database,
  Download,
  AlertTriangle,
  Users,
  ShieldCheck,
  Layers,
  Cpu,
  Presentation,
  ChevronDown,
} from 'lucide-react';
import type { EvaluatedWatershed, PolicyWeights } from '../types/watershed';
import { exportScenarioReport } from '../services/api';

export type ActiveViewMode = 'explorer' | 'comparator' | 'metadata';

interface TopNavTelemetryBarProps {
  activeView: ActiveViewMode;
  setActiveView: (view: ActiveViewMode) => void;
  studyBasin: string;
  setStudyBasin: (basin: string) => void;
  evaluatedWatersheds: EvaluatedWatershed[];
  weights: PolicyWeights;
  budgetLakhs: number;
  onOpenArchitectureModal: () => void;
  onOpenPitchDeckModal: () => void;
}

export const TopNavTelemetryBar: React.FC<TopNavTelemetryBarProps> = ({
  activeView,
  setActiveView,
  studyBasin,
  setStudyBasin,
  evaluatedWatersheds,
  weights,
  budgetLakhs,
  onOpenArchitectureModal,
  onOpenPitchDeckModal,
}) => {
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  const totalSites = evaluatedWatersheds.length;
  const criticalCount = evaluatedWatersheds.filter(
    (w) => w.priorityTier === 'Critical'
  ).length;
  const highCount = evaluatedWatersheds.filter((w) => w.priorityTier === 'High').length;

  const fundedWatersheds = evaluatedWatersheds.filter((w) => w.isFundedWithinBudget);
  const protectedPop = fundedWatersheds.reduce(
    (acc, w) => acc + w.physicalIndicators.exposedPopulation,
    0
  );

  const meanConfidence = Math.round(
    evaluatedWatersheds.reduce((acc, w) => acc + w.uncertainty.overallConfidencePct, 0) /
      (totalSites || 1)
  );

  return (
    <header className="h-14 w-full bg-[#0B132B]/95 border-b border-cyan-500/25 px-3 flex items-center justify-between gap-2 shrink-0 z-30 shadow-lg">
      {/* Brand & Study Basin Selector */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00B4D8] to-[#10B981] p-0.5 shadow-md shadow-cyan-500/20">
            <div className="w-full h-full bg-[#0B132B] rounded-[6px] flex items-center justify-center">
              <Droplets className="w-5 h-5 text-[#00B4D8]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-base tracking-tight text-white">
                Aqua<span className="text-[#00B4D8]">Vane</span>
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Labyrinth.exe
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-none hidden xl:block">
              Explainable Watershed Restoration Prioritisation
            </p>
          </div>
        </div>

        <div className="h-6 w-px bg-slate-800 hidden md:block" />

        {/* Study Basin Dropdown */}
        <div className="relative hidden lg:flex items-center">
          <select
            aria-label="Study Basin Selector"
            value={studyBasin}
            onChange={(e) => setStudyBasin(e.target.value)}
            className="bg-[#1C2541] hover:bg-[#253154] text-slate-100 text-xs font-medium rounded-lg pl-2.5 pr-7 py-1.5 border border-cyan-500/30 focus:outline-none focus:border-[#00B4D8] transition cursor-pointer appearance-none"
          >
            <option value="Upper Krishna Sub-Basin (Pilot)">
              📍 Upper Krishna Sub-Basin (Pilot — 12 Micro-Watersheds)
            </option>
            <option value="Kondapalli–Munneru Confluence Zone">
              📍 Kondapalli–Munneru Confluence Zone (Calibrated)
            </option>
            <option value="Western Ghats — Upper Bhima Catchment">
              📍 Western Ghats — Upper Bhima Catchment (Simulated)
            </option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-cyan-400 absolute right-2 pointer-events-none" />
        </div>
      </div>

      {/* Center View Mode Switcher Tabs */}
      <nav className="flex items-center bg-[#1C2541]/80 p-1 rounded-lg border border-slate-700/70">
        <button
          onClick={() => setActiveView('explorer')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition ${
            activeView === 'explorer'
              ? 'bg-[#00B4D8] text-[#0B132B] shadow-sm shadow-cyan-500/40'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <MapIcon className="w-3.5 h-3.5" />
          <span>Spatial Explorer &amp; Ranking</span>
        </button>

        <button
          onClick={() => setActiveView('comparator')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition ${
            activeView === 'comparator'
              ? 'bg-[#00B4D8] text-[#0B132B] shadow-sm shadow-cyan-500/40'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>Policy Scenario Comparator</span>
        </button>

        <button
          onClick={() => setActiveView('metadata')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition ${
            activeView === 'metadata'
              ? 'bg-[#00B4D8] text-[#0B132B] shadow-sm shadow-cyan-500/40'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Data Resolution &amp; Pipeline</span>
        </button>
      </nav>

      {/* Live KPI Telemetry Pills & Actions */}
      <div className="flex items-center gap-2">
        <div className="hidden 2xl:flex items-center gap-1.5">
          {/* KPI 1: Total Micro-Watersheds */}
          <div className="bg-[#1C2541]/90 border border-slate-700/80 rounded-lg px-2.5 py-1 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#00B4D8]" />
            <div>
              <div className="text-[10px] text-slate-400 leading-none">Micro-Watersheds</div>
              <div className="text-xs font-mono font-bold text-white">{totalSites} Active</div>
            </div>
          </div>

          {/* KPI 2: Critical / High Sites */}
          <div className="bg-[#1C2541]/90 border border-red-500/30 rounded-lg px-2.5 py-1 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <div>
              <div className="text-[10px] text-slate-400 leading-none">Critical / High</div>
              <div className="text-xs font-mono font-bold text-red-400">
                {criticalCount} Crit <span className="text-orange-400">• {highCount} High</span>
              </div>
            </div>
          </div>

          {/* KPI 3: Vulnerable Population Protected */}
          <div className="bg-[#1C2541]/90 border border-emerald-500/30 rounded-lg px-2.5 py-1 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <div>
              <div className="text-[10px] text-slate-400 leading-none">Pop. Protected (Funded)</div>
              <div className="text-xs font-mono font-bold text-emerald-400">
                {protectedPop.toLocaleString()}
              </div>
            </div>
          </div>

          {/* KPI 4: Mean Data Confidence */}
          <div className="bg-[#1C2541]/90 border border-cyan-500/30 rounded-lg px-2.5 py-1 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <div>
              <div className="text-[10px] text-slate-400 leading-none">Mean Confidence</div>
              <div className="text-xs font-mono font-bold text-cyan-300">{meanConfidence}%</div>
            </div>
          </div>
        </div>

        {/* Pitch Deck Viewer Button */}
        <button
          onClick={onOpenPitchDeckModal}
          title="Open 7-Slide Chakravyuh Pitch Deck"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/35 text-xs font-semibold transition"
        >
          <Presentation className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Pitch Deck</span>
        </button>

        {/* Architecture Modal Button */}
        <button
          onClick={onOpenArchitectureModal}
          title="About AquaVane & 6-Step Geospatial Pipeline"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#1C2541] hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-xs font-medium transition"
        >
          <Cpu className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Pipeline</span>
        </button>

        {/* Export Evidence Report Dropdown */}
        <div className="relative">
          <button
            onClick={() => setExportMenuOpen((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#00B4D8] to-[#0096C7] hover:from-[#38BDF8] hover:to-[#00B4D8] text-[#0B132B] font-bold text-xs shadow-md shadow-cyan-500/20 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Evidence</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {exportMenuOpen && (
            <div
              onMouseLeave={() => setExportMenuOpen(false)}
              className="absolute right-0 mt-1.5 w-56 bg-[#0B132B] border border-cyan-500/40 rounded-xl shadow-2xl p-1.5 z-50"
            >
              <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-slate-800">
                Export Decision-Support Evidence
              </div>
              <button
                onClick={() => {
                  exportScenarioReport(
                    evaluatedWatersheds,
                    weights,
                    budgetLakhs,
                    'csv',
                    studyBasin
                  );
                  setExportMenuOpen(false);
                }}
                className="w-full text-left px-2.5 py-2 text-xs text-slate-200 hover:bg-[#1C2541] rounded-lg flex items-center justify-between transition mt-1"
              >
                <span>📊 Ranked Matrix (CSV)</span>
                <span className="text-[10px] font-mono text-cyan-400">.csv</span>
              </button>
              <button
                onClick={() => {
                  exportScenarioReport(
                    evaluatedWatersheds,
                    weights,
                    budgetLakhs,
                    'json',
                    studyBasin
                  );
                  setExportMenuOpen(false);
                }}
                className="w-full text-left px-2.5 py-2 text-xs text-slate-200 hover:bg-[#1C2541] rounded-lg flex items-center justify-between transition"
              >
                <span>🧬 Full Geo-Evidence Bundle</span>
                <span className="text-[10px] font-mono text-emerald-400">.json</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
