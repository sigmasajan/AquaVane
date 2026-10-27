import React from 'react';
import {
  X,
  Cpu,
  Layers,
  Database,
  ArrowRight,
  CheckCircle2,
  Globe,
  BarChart3,
} from 'lucide-react';

interface PipelineArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PipelineArchitectureModal: React.FC<
  PipelineArchitectureModalProps
> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="bg-[#0B132B] border border-cyan-500/40 rounded-2xl max-w-4xl w-full max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-[#1C2541] border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-[#00B4D8]" />
            <div>
              <h2 className="font-display font-extrabold text-sm uppercase tracking-wider text-white">
                About AquaVane — System Architecture &amp; 6-Stage Geospatial Pipeline
              </h2>
              <p className="text-[11px] text-slate-300">
                Team Labyrinth.exe • Chakravyuh Hackathon — Watershed Restoration Prioritisation with Explainable Evidence
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs">
          {/* System Architecture Flow Banner */}
          <div className="bg-[#1C2541]/80 border border-cyan-500/30 rounded-xl p-4">
            <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 mb-2">
              End-to-End Technology Architecture Flow
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
              <div className="bg-[#0B132B] border border-cyan-500/40 rounded-xl p-3">
                <div className="flex items-center gap-1.5 font-bold text-white mb-1">
                  <Globe className="w-4 h-4 text-[#00B4D8]" />
                  <span>React + TypeScript + Leaflet</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Interactive GIS Command Center, zero-latency MCDA sliders &amp; Recharts evidence inspector.
                </p>
              </div>

              <div className="bg-[#0B132B] border border-emerald-500/40 rounded-xl p-3">
                <div className="flex items-center gap-1.5 font-bold text-white mb-1">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  <span>Python + FastAPI REST Engine</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Exposes REST endpoints for watershed geometries, scenario comparisons, and site-level explanations.
                </p>
              </div>

              <div className="bg-[#0B132B] border border-orange-500/40 rounded-xl p-3">
                <div className="flex items-center gap-1.5 font-bold text-white mb-1">
                  <Layers className="w-4 h-4 text-orange-400" />
                  <span>GeoPandas, Rasterio &amp; Whitebox</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Processes DEM slope, D8 flow accumulation, 10m land-cover deficit, and ERA5 rainfall grids.
                </p>
              </div>

              <div className="bg-[#0B132B] border border-blue-500/40 rounded-xl p-3">
                <div className="flex items-center gap-1.5 font-bold text-white mb-1">
                  <Database className="w-4 h-4 text-blue-400" />
                  <span>PostgreSQL + PostGIS</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Stores multi-polygon watershed boundaries, precomputed zonal statistics, and uncertainty metadata.
                </p>
              </div>
            </div>
          </div>

          {/* 6-Step Pipeline Grid */}
          <div>
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-white mb-2.5 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>6-Stage Hydrological &amp; MCDA Decision Pipeline</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                {
                  num: '1. Open Data Integration',
                  body: 'Acquire watershed boundaries from India-WRIS, land-cover data from ESA WorldCover (10m), elevation data from USGS SRTM (30m), rainfall from Copernicus ERA5, and downstream settlement exposure data.',
                },
                {
                  num: '2. Spatial Preprocessing',
                  body: 'Align coordinate reference systems (EPSG:4326 / UTM), clip datasets to the study basin, interpolate SRTM radar voids, and calculate zonal statistics for each micro-watershed.',
                },
                {
                  num: '3. Indicator Extraction',
                  body: 'Derive slope and D8 flow accumulation from DEMs; estimate vegetation deficit from land cover; calculate rainfall erosivity, runoff potential, and downstream population exposure.',
                },
                {
                  num: '4. MCDA Priority Scoring',
                  body: 'Normalize indicators to a common [0, 1] scale and combine them using configurable policy weights (PriorityScore_i = ∑ ŵ_k · I_i,k) to rank micro-watersheds in real time.',
                },
                {
                  num: '5. Explainable & Uncertainty Analysis',
                  body: 'Decompose each watershed score into exact indicator point contributions, surface source resolution warnings (~9km ERA5 grid vs 10m optical), and evaluate rank stability.',
                },
                {
                  num: '6. Interactive Decision Support',
                  body: 'Display ranked micro-watersheds on Leaflet maps, compare counterfactual policy scenarios to find No-Regret sites, recommend interventions, and export evidence reports.',
                },
              ].map((s) => (
                <div
                  key={s.num}
                  className="bg-[#1C2541]/60 border border-slate-800 rounded-xl p-3 space-y-1"
                >
                  <div className="font-bold text-cyan-300 flex items-center justify-between">
                    <span>{s.num}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mathematical Formulation Footer */}
          <div className="bg-[#1C2541]/50 border border-emerald-500/30 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero-Latency Explainable MCDA Formulation</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Every watershed’s score is transparently auditable as the sum of 5 normalized weight × indicator products.
              </p>
            </div>
            <div className="font-mono text-xs bg-[#0B132B] px-3 py-2 rounded-lg border border-cyan-500/30 text-cyan-300">
              PriorityScore_i = ∑ (w_k / ∑ w_j) × I_i,k
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
