import React from 'react';
import {
  Database,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Layers,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { DATASET_SOURCES_METADATA } from '../data/mockWatersheds';
import type { EvaluatedWatershed } from '../types/watershed';

interface DataPipelineMetadataViewProps {
  evaluatedWatersheds: EvaluatedWatershed[];
  onInspectWatershedOnMap: (id: string) => void;
}

const PIPELINE_STEPS = [
  {
    step: '01',
    title: 'Open Data Integration',
    subtitle: 'India-WRIS • ESA WorldCover • USGS SRTM • Copernicus ERA5',
    description:
      'Acquire watershed boundaries from India-WRIS, 10m land-cover rasters from ESA WorldCover, 30m elevation DEMs from USGS SRTM, rainfall climatology from Copernicus ERA5, and settlement exposure vectors.',
  },
  {
    step: '02',
    title: 'Spatial Preprocessing',
    subtitle: 'CRS Alignment (EPSG:4326 / UTM 44N) & Zonal Clipping',
    description:
      'Align coordinate reference systems, clip multi-resolution rasters to micro-watershed boundaries, fill SRTM radar voids via spline interpolation, and compute zonal statistics.',
  },
  {
    step: '03',
    title: 'Environmental Indicator Extraction',
    subtitle: 'GeoPandas • Rasterio • WhiteboxTools D8 Hydrology',
    description:
      'Derive slope steepness and D8 flow accumulation from DEMs; estimate bare/degraded vegetation deficit from 10m land cover; calculate extreme rainfall intensity and downstream population exposure.',
  },
  {
    step: '04',
    title: 'MCDA-Based Priority Scoring',
    subtitle: 'Min-Max Normalization & Real-Time Policy Weighting',
    description:
      'Normalize physical indicators to a common [0, 1] scale and combine them using configurable policy weights (∑ ŵ_k · I_i,k) to rank micro-watersheds by restoration urgency.',
  },
  {
    step: '05',
    title: 'Explainable & Uncertainty-Aware Analysis',
    subtitle: 'Point-Contribution Decomposition & Sensitivity Auditing',
    description:
      'Expose each indicator’s exact point contribution, spatial resolution disparity (10m optical vs. ~9km ERA5 grid), DEM void %, and rank sensitivity under ±15% weight perturbations.',
  },
  {
    step: '06',
    title: 'Interactive Decision Support',
    subtitle: 'Leaflet WebGIS • Scenario Comparator • Evidence Export',
    description:
      'Visualize ranked micro-watersheds on interactive maps, compare policy scenarios to isolate No-Regret sites, recommend engineering interventions, and export CSV/JSON evidence reports.',
  },
];

export const DataPipelineMetadataView: React.FC<DataPipelineMetadataViewProps> = ({
  evaluatedWatersheds,
  onInspectWatershedOnMap,
}) => {
  return (
    <div className="flex-1 h-full bg-[#0B132B] overflow-y-auto p-4 space-y-5 select-none">
      {/* Section 1: 6-Step Geospatial Data Pipeline */}
      <div className="bg-[#1C2541]/70 border border-cyan-500/30 rounded-2xl p-4 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#00B4D8]" />
            <div>
              <h2 className="font-display font-extrabold text-sm uppercase tracking-wider text-white">
                End-to-End Geospatial Data Pipeline &amp; Decision Intelligence
              </h2>
              <p className="text-xs text-slate-300">
                Architecture Flow: React + Leaflet → FastAPI → Python GIS &amp; Scoring Engine (GeoPandas, Rasterio, WhiteboxTools) → PostGIS / Processed Geospatial Datasets
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-[#0B132B] text-cyan-300 border border-cyan-500/30">
            6-Stage Calibrated Workflow
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {PIPELINE_STEPS.map((st, idx) => (
            <div
              key={st.step}
              className="bg-[#0B132B]/85 border border-slate-800 hover:border-cyan-500/40 rounded-xl p-3.5 relative transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-mono font-extrabold px-2 py-0.5 rounded bg-cyan-500/20 text-[#00B4D8] border border-cyan-500/30">
                    STEP {st.step}
                  </span>
                  {idx < PIPELINE_STEPS.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-slate-600 hidden lg:block" />
                  )}
                </div>
                <h3 className="text-xs font-bold text-white mb-0.5">{st.title}</h3>
                <div className="text-[10px] font-mono text-emerald-400 mb-2">
                  {st.subtitle}
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {st.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Required & Public Datasets Resolution Matrix */}
      <div className="bg-[#1C2541]/70 border border-slate-700/80 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="font-display font-extrabold text-sm uppercase tracking-wider text-white">
                Source Resolution &amp; Open Dataset Provenance Matrix
              </h2>
              <p className="text-xs text-slate-400">
                Multi-resolution satellite and hydrological sources powering AquaVane’s MCDA indicators
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {DATASET_SOURCES_METADATA.map((ds) => {
            const isWarning = ds.precisionRating === 'Coarse Resolution Warning';
            return (
              <div
                key={ds.id}
                className={`bg-[#0B132B]/90 rounded-xl p-3.5 border ${
                  isWarning
                    ? 'border-amber-500/40'
                    : 'border-slate-800 hover:border-slate-700'
                } flex flex-col justify-between gap-2`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <h3 className="text-sm font-bold text-white">{ds.name}</h3>
                      <div className="text-[11px] text-slate-400">{ds.provider}</div>
                    </div>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded flex items-center gap-1 shrink-0 ${
                        isWarning
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      {isWarning ? (
                        <AlertTriangle className="w-3 h-3" />
                      ) : (
                        <CheckCircle2 className="w-3 h-3" />
                      )}
                      {ds.precisionRating}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 my-2 text-[11px] font-mono">
                    <span className="px-2 py-0.5 rounded bg-[#1C2541] text-cyan-300 border border-cyan-500/30">
                      Resolution: {ds.spatialResolution}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#1C2541] text-slate-300">
                      {ds.temporalCoverage}
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed mb-2">
                    <strong className="text-cyan-300">Role in AquaVane:</strong>{' '}
                    {ds.roleInAquaVane}
                  </p>

                  <div className="text-[11px] text-amber-300/90 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2">
                    <strong>Uncertainty &amp; Resolution Note:</strong>{' '}
                    {ds.knownLimitations}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {ds.derivedIndicators.map((ind) => (
                      <span
                        key={ind}
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300"
                      >
                        {ind}
                      </span>
                    ))}
                  </div>
                  <a
                    href={ds.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-mono font-semibold text-[#00B4D8] hover:underline flex items-center gap-1 shrink-0"
                  >
                    <span>Dataset Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 3: Per-Watershed Uncertainty & Quality Audit Table */}
      <div className="bg-[#1C2541]/70 border border-slate-700/80 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="font-display font-extrabold text-sm uppercase tracking-wider text-white">
                Micro-Watershed Data Confidence &amp; Uncertainty Audit
              </h2>
              <p className="text-xs text-slate-400">
                Highlights DEM radar shadow void interpolation, optical cloud-free coverage, and MCDA rank sensitivity
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>12 Pilot Micro-Watersheds Audited</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-700 text-[11px] font-mono uppercase text-slate-400">
                <th className="py-2 px-3">Rank &amp; ID</th>
                <th className="py-2 px-3">Micro-Watershed</th>
                <th className="py-2 px-3">Overall Confidence</th>
                <th className="py-2 px-3">DEM Void Filled (%)</th>
                <th className="py-2 px-3">Sentinel Cloud-Free</th>
                <th className="py-2 px-3">Ranking Sensitivity</th>
                <th className="py-2 px-3">Diagnostic Audit Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {evaluatedWatersheds.map((ws) => (
                <tr
                  key={ws.id}
                  onClick={() => onInspectWatershedOnMap(ws.id)}
                  className="hover:bg-[#0B132B]/70 cursor-pointer transition"
                >
                  <td className="py-2.5 px-3 font-mono font-bold text-cyan-300">
                    #{ws.rank} • {ws.id}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-white">
                    {ws.name}
                  </td>
                  <td className="py-2.5 px-3 font-mono">
                    <span
                      className={`px-2 py-0.5 rounded font-bold ${
                        ws.uncertainty.confidenceLevel === 'High'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {ws.uncertainty.overallConfidencePct}% ({ws.uncertainty.confidenceLevel})
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-200">
                    {ws.uncertainty.demVoidInterpolationPct}%
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-200">
                    {ws.uncertainty.cloudCoverFreePct}%
                  </td>
                  <td className="py-2.5 px-3 font-mono">
                    <span
                      className={
                        ws.uncertainty.rankingSensitivityIndex.includes('Low')
                          ? 'text-emerald-400 font-semibold'
                          : ws.uncertainty.rankingSensitivityIndex.includes('High')
                          ? 'text-amber-400 font-semibold'
                          : 'text-cyan-300'
                      }
                    >
                      {ws.uncertainty.rankingSensitivityIndex} (±
                      {ws.uncertainty.sensitivityDeltaRanks})
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300">
                    {ws.uncertainty.confidenceNote}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
