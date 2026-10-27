import React, { useState } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Presentation,
  ExternalLink,
  Layers,
  Database,
  ShieldCheck,
  Sparkles,
  Cpu,
  Users,
} from 'lucide-react';

interface PitchDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PitchDeckModal: React.FC<PitchDeckModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [slideIndex, setSlideIndex] = useState(0);

  if (!isOpen) return null;

  const totalSlides = 7;
  const nextSlide = () => setSlideIndex((i) => (i + 1) % totalSlides);
  const prevSlide = () =>
    setSlideIndex((i) => (i - 1 + totalSlides) % totalSlides);

  return (
    <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-[#0B192C] border border-cyan-500/45 rounded-2xl max-w-6xl w-full h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top Deck Bar */}
        <div className="px-5 py-3 bg-[#1C2541] border-b border-slate-700 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <Presentation className="w-5 h-5 text-[#00B4D8]" />
            <span className="font-display font-extrabold text-sm text-white">
              AquaVane — Chakravyuh Hackathon 7-Slide Pitch Deck
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Slide {slideIndex + 1} of {totalSlides}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {Array.from({ length: totalSlides }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSlideIndex(idx)}
                  className={`w-6 h-6 rounded text-xs font-mono font-bold transition ${
                    slideIndex === idx
                      ? 'bg-[#00B4D8] text-[#0B192C]'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Slide Content Canvas */}
        <div className="flex-1 overflow-y-auto p-6 topo-pattern flex flex-col justify-between">
          {slideIndex === 0 && (
            <div className="space-y-6 my-auto">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
                  <span>HACKATHON: CHAKRAVYUH</span>
                </div>
                <div className="px-4 py-2 rounded-xl bg-[#1C2541] border border-dashed border-cyan-400/50 text-xs font-mono text-cyan-300">
                  Hackathon Name: Chakravyuh [Insert Chakravyuh Logo Here]
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-xs font-mono uppercase tracking-widest text-emerald-400">
                  Proposed Solution Name
                </div>
                <h1 className="font-display font-extrabold text-4xl md:text-5xl text-white tracking-tight">
                  Aqua<span className="text-[#00B4D8]">Vane</span>
                </h1>
                <h2 className="text-xl md:text-2xl font-display font-bold text-cyan-300">
                  Problem Title: Watershed Restoration Prioritisation with Explainable Evidence
                </h2>
              </div>

              <div className="bg-[#1C2541]/85 border border-cyan-500/35 rounded-2xl p-4">
                <div className="text-xs font-mono uppercase text-cyan-300 mb-1">
                  Objective
                </div>
                <p className="text-sm text-slate-100 leading-relaxed">
                  Build a geospatial decision-support tool ranking micro-watersheds for restoration using terrain, land cover, rainfall, and downstream exposure indicators. Multi-criteria spatial evaluation combining DEM slope hydrology, runoff coefficients, and population vulnerability with interactive weight sensitivity analysis.
                </p>
              </div>

              <div className="bg-[#1C2541]/90 border border-emerald-500/40 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-400" />
                    <span className="font-display font-bold text-sm text-white">
                      Team Name: <span className="text-emerald-400">Labyrinth.exe</span>
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    Team Members &amp; Registration Numbers
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
                  <div className="bg-[#0B192C] border border-cyan-500/40 rounded-xl p-3">
                    <div className="font-bold text-white">1. Sajan Sivakumar</div>
                    <div className="font-mono text-cyan-300 mt-0.5">25BCS7084</div>
                  </div>
                  <div className="bg-[#0B192C] border border-slate-700 rounded-xl p-3">
                    <div className="font-bold text-slate-200">2. [Team Member 2 Name]</div>
                    <div className="font-mono text-slate-400 mt-0.5">[Registration No.]</div>
                  </div>
                  <div className="bg-[#0B192C] border border-slate-700 rounded-xl p-3">
                    <div className="font-bold text-slate-200">3. [Team Member 3 Name]</div>
                    <div className="font-mono text-slate-400 mt-0.5">[Registration No.]</div>
                  </div>
                  <div className="bg-[#0B192C] border border-slate-700 rounded-xl p-3">
                    <div className="font-bold text-slate-200">4. [Team Member 4 Name]</div>
                    <div className="font-mono text-slate-400 mt-0.5">[Registration No.]</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {slideIndex === 1 && (
            <div className="space-y-4 my-auto">
              <h2 className="font-display font-extrabold text-2xl text-white border-b border-slate-800 pb-2">
                Problem Statement &amp; Proposed Solution — AquaVane
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-6 space-y-4">
                  <div className="bg-[#1C2541]/85 border border-red-500/40 rounded-2xl p-4 space-y-2">
                    <h3 className="font-display font-bold text-sm uppercase text-red-400">
                      Problem Statement
                    </h3>
                    <ul className="space-y-2 text-xs text-slate-200 list-disc pl-4">
                      <li>Tree planting, erosion control and runoff interventions compete for limited funding.</li>
                      <li>Selecting sites from a single map layer can overlook slope, upstream connectivity, land cover, settlement exposure and data uncertainty.</li>
                      <li>Goal: Build a geospatial decision-support tool that ranks candidate micro-watersheds for restoration using openly available terrain, land-cover, rainfall and settlement indicators with configurable policy weights.</li>
                    </ul>
                  </div>

                  <div className="bg-[#1C2541]/85 border border-cyan-500/40 rounded-2xl p-4 space-y-2">
                    <h3 className="font-display font-bold text-sm uppercase text-[#00B4D8]">
                      Proposed Solution Idea
                    </h3>
                    <p className="text-xs text-slate-100 leading-relaxed">
                      Build a GIS-based web platform that ranks micro-watersheds for restoration using terrain, rainfall, land cover and downstream exposure data, with explainable scores and interactive policy simulations.
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-6 bg-[#1C2541]/85 border border-emerald-500/40 rounded-2xl p-4 space-y-2.5">
                  <h3 className="font-display font-bold text-sm uppercase text-emerald-400">
                    Unique Value Proposition
                  </h3>
                  <div className="space-y-2 text-xs">
                    {[
                      [
                        'Interactive GIS Dashboard:',
                        'Visualise and explore restoration priorities on a live map.',
                      ],
                      [
                        'Smart Priority Ranking:',
                        'Identify the most critical watersheds using multiple environmental indicators.',
                      ],
                      [
                        'Explainable Evidence:',
                        'Understand why each watershed is prioritised through indicator-level score breakdowns.',
                      ],
                      [
                        'Policy Scenario Simulator:',
                        'Compare restoration strategies by adjusting weights and analysing ranking changes.',
                      ],
                      [
                        'Uncertainty Awareness:',
                        'Highlight data limitations and ranking reliability to support informed decisions.',
                      ],
                    ].map(([title, desc]) => (
                      <div
                        key={title}
                        className="bg-[#0B192C] border border-slate-800 rounded-xl p-2.5"
                      >
                        <span className="font-bold text-cyan-300">{title}</span>{' '}
                        <span className="text-slate-200">{desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {slideIndex === 2 && (
            <div className="space-y-4 my-auto">
              <h2 className="font-display font-extrabold text-2xl text-white border-b border-slate-800 pb-2">
                Technology Stack — Building the Geospatial Intelligence Platform
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                {[
                  [
                    'Frontend — React.js + TypeScript:',
                    'Builds an interactive dashboard with watershed rankings, filter controls, policy-weight sliders and detailed site analysis.',
                  ],
                  [
                    'Geospatial Visualisation — Leaflet.js:',
                    'Displays watershed boundaries, colour-coded priority zones, drainage networks and selectable map layers.',
                  ],
                  [
                    'Backend — Python + FastAPI:',
                    'Exposes REST APIs for watershed data, priority-score calculations, scenario comparisons and site-specific explanations.',
                  ],
                  [
                    'GIS & Hydrological Processing — GeoPandas, Rasterio & WhiteboxTools:',
                    'Processes elevation and land-cover rasters, calculates slope and flow accumulation, and derives watershed-level environmental indicators.',
                  ],
                  [
                    'Database — PostgreSQL + PostGIS:',
                    'Stores watershed geometries, calculated indicators, rankings, data-source metadata and saved policy scenarios.',
                  ],
                  [
                    'Charts & Analytics — Recharts + NumPy/Pandas:',
                    'Visualises indicator contributions, compares policy scenarios and performs efficient weighted-score calculations.',
                  ],
                ].map(([title, body]) => (
                  <div
                    key={title}
                    className="bg-[#1C2541]/85 border border-cyan-500/30 rounded-xl p-3.5 space-y-1.5"
                  >
                    <div className="font-bold text-[#00B4D8]">{title}</div>
                    <p className="text-slate-200 leading-relaxed">{body}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-[#1C2541] to-[#112A2E] border border-emerald-500/40 rounded-xl p-3.5 text-center">
                <div className="text-[10px] font-mono uppercase text-emerald-400 mb-1">
                  Architecture Flow Diagram
                </div>
                <div className="text-sm font-mono font-bold text-white">
                  React + Leaflet → FastAPI → Python GIS &amp; Scoring Engine → PostGIS / Processed Geospatial Datasets
                </div>
              </div>
            </div>
          )}

          {slideIndex === 3 && (
            <div className="space-y-4 my-auto">
              <h2 className="font-display font-extrabold text-2xl text-white border-b border-slate-800 pb-2">
                From Raw Environmental Data to Explainable Restoration Priorities
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                {[
                  [
                    '1. Open Data Integration:',
                    'Acquire watershed boundaries from India-WRIS, land-cover data from ESA WorldCover, elevation data from USGS SRTM, rainfall from Copernicus ERA5, and population data from an appropriate documented source.',
                  ],
                  [
                    '2. Spatial Preprocessing:',
                    'Align coordinate reference systems, clip datasets to the study area, handle missing data, and calculate statistics for each micro-watershed.',
                  ],
                  [
                    '3. Environmental Indicator Extraction:',
                    'Derive slope and flow accumulation from DEMs; estimate vegetation deficit from land cover; calculate rainfall indicators, runoff potential and downstream population exposure.',
                  ],
                  [
                    '4. MCDA-Based Priority Scoring:',
                    'Normalise indicators to a common scale and combine them using configurable policy weights to rank watersheds by restoration priority.',
                  ],
                  [
                    '5. Explainable & Uncertainty-Aware Analysis:',
                    "Show each indicator's score contribution, source resolution, data gaps and ranking sensitivity under alternative weights.",
                  ],
                  [
                    '6. Interactive Decision Support:',
                    'Display ranked watersheds on Leaflet maps, compare policy scenarios, identify potential restoration interventions and export evidence-based reports.',
                  ],
                ].map(([title, desc]) => (
                  <div
                    key={title}
                    className="bg-[#1C2541]/85 border border-cyan-500/35 rounded-xl p-4 space-y-1.5"
                  >
                    <div className="font-bold text-cyan-300 text-sm">{title}</div>
                    <p className="text-slate-200 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {slideIndex === 4 && (
            <div className="space-y-4 my-auto">
              <h2 className="font-display font-extrabold text-2xl text-white border-b border-slate-800 pb-2">
                Feasibility &amp; Viability — Commercial Potential, Challenges &amp; Strategies
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-[#1C2541]/85 border border-cyan-500/40 rounded-2xl p-4 space-y-2">
                  <h3 className="font-display font-bold text-sm uppercase text-cyan-300">
                    Feasibility
                  </h3>
                  <ul className="space-y-1.5 text-slate-200 list-disc pl-4">
                    <li>Uses publicly available environmental datasets and open-source technologies.</li>
                    <li>Can be developed using Python, GIS tools, React, and FastAPI.</li>
                    <li>Scalable to additional regions and datasets.</li>
                  </ul>
                </div>

                <div className="bg-[#1C2541]/85 border border-emerald-500/40 rounded-2xl p-4 space-y-2">
                  <h3 className="font-display font-bold text-sm uppercase text-emerald-400">
                    Commercial Feasibility
                  </h3>
                  <ul className="space-y-1.5 text-slate-200 list-disc pl-4">
                    <li>Low initial development cost using open-source tools.</li>
                    <li>Potential users include government agencies, NGOs, and environmental consultancies.</li>
                    <li>Revenue through subscriptions, customised reports, and institutional licensing.</li>
                  </ul>
                </div>

                <div className="bg-[#1C2541]/85 border border-orange-500/40 rounded-2xl p-4 space-y-2">
                  <h3 className="font-display font-bold text-sm uppercase text-orange-400">
                    Challenges
                  </h3>
                  <ul className="space-y-1.5 text-slate-200 list-disc pl-4">
                    <li>Incomplete or inconsistent regional datasets.</li>
                    <li>Different spatial resolutions and data update frequencies.</li>
                    <li>Limited ground-level validation.</li>
                    <li>Processing large geospatial datasets efficiently.</li>
                  </ul>
                </div>

                <div className="bg-[#1C2541]/85 border border-blue-500/40 rounded-2xl p-4 space-y-2">
                  <h3 className="font-display font-bold text-sm uppercase text-blue-400">
                    Strategy
                  </h3>
                  <ul className="space-y-1.5 text-slate-200 list-disc pl-4">
                    <li>Start with a pilot watershed region and expand gradually.</li>
                    <li>Standardise and validate datasets before analysis.</li>
                    <li>Use explainable scoring and uncertainty indicators.</li>
                    <li>Collaborate with local experts and agencies to validate results.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {slideIndex === 5 && (
            <div className="space-y-4 my-auto">
              <h2 className="font-display font-extrabold text-2xl text-white border-b border-slate-800 pb-2">
                Impact &amp; Benefits — Target Users, Economic, Environmental &amp; Strategic Value
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-[#1C2541]/85 border border-cyan-500/40 rounded-2xl p-4 space-y-2">
                  <h3 className="font-display font-bold text-sm uppercase text-cyan-300">
                    Direct Impact on Target Users
                  </h3>
                  <ul className="space-y-1.5 text-slate-200 list-disc pl-4">
                    <li><strong>Government &amp; Planning Departments:</strong> Identify and prioritise micro-watersheds requiring restoration.</li>
                    <li><strong>Environmental Agencies:</strong> Access data-driven insights for targeted conservation.</li>
                    <li><strong>Local Communities &amp; Farmers:</strong> Support better soil conservation, water management, and sustainable land use.</li>
                  </ul>
                </div>

                <div className="bg-[#1C2541]/85 border border-amber-500/40 rounded-2xl p-4 space-y-2">
                  <h3 className="font-display font-bold text-sm uppercase text-amber-400">
                    Economic Benefits
                  </h3>
                  <ul className="space-y-1.5 text-slate-200 list-disc pl-4">
                    <li>Optimises restoration budgets by directing funds towards high-priority areas.</li>
                    <li>Reduces resource wastage through evidence-based project selection.</li>
                    <li>Supports long-term savings by helping prevent soil erosion and land degradation.</li>
                  </ul>
                </div>

                <div className="bg-[#1C2541]/85 border border-emerald-500/40 rounded-2xl p-4 space-y-2">
                  <h3 className="font-display font-bold text-sm uppercase text-emerald-400">
                    Environmental Benefits
                  </h3>
                  <ul className="space-y-1.5 text-slate-200 list-disc pl-4">
                    <li>Helps identify areas vulnerable to erosion and excessive runoff.</li>
                    <li>Supports vegetation recovery, soil conservation, and groundwater recharge planning.</li>
                    <li>Promotes sustainable watershed and ecosystem management.</li>
                  </ul>
                </div>

                <div className="bg-[#1C2541]/85 border border-purple-500/40 rounded-2xl p-4 space-y-2">
                  <h3 className="font-display font-bold text-sm uppercase text-purple-300">
                    Strategic Benefits
                  </h3>
                  <ul className="space-y-1.5 text-slate-200 list-disc pl-4">
                    <li>Provides transparent, explainable restoration-priority rankings.</li>
                    <li>Enables policy scenario testing by adjusting decision-making weights.</li>
                    <li>Supports data-driven planning, monitoring, and long-term restoration strategies.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {slideIndex === 6 && (
            <div className="space-y-4 my-auto">
              <h2 className="font-display font-extrabold text-2xl text-white border-b border-slate-800 pb-2">
                Required &amp; Public Datasets Powering AquaVane
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {[
                  {
                    num: '1. Copernicus ERA5',
                    url: 'https://cds.climate.copernicus.eu/',
                    use: 'Historical rainfall and climate data for analysing precipitation patterns.',
                  },
                  {
                    num: '2. USGS SRTM',
                    url: 'https://earthexplorer.usgs.gov/',
                    use: 'Elevation data for calculating slope, terrain, and water-flow direction.',
                  },
                  {
                    num: '3. ESA WorldCover',
                    url: 'https://esa-worldcover.org/en',
                    use: 'Land-cover data for identifying vegetation, forests, croplands, and built-up areas.',
                  },
                  {
                    num: '4. India-WRIS',
                    url: 'https://indiawris.gov.in/wris/#/',
                    use: 'Water-resource data for analysing river networks, drainage systems, and watersheds.',
                  },
                ].map((d) => (
                  <div
                    key={d.num}
                    className="bg-[#1C2541]/85 border border-cyan-500/35 rounded-2xl p-4 space-y-2"
                  >
                    <div className="font-display font-bold text-base text-white">
                      {d.num}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400 font-semibold">Link:</span>
                      <a
                        href={d.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-cyan-300 hover:underline flex items-center gap-1"
                      >
                        <span>{d.url}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <p className="text-slate-200 leading-relaxed">
                      <strong className="text-emerald-400">Use:</strong> {d.use}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Navigation Controls */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={prevSlide}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1C2541] hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Slide</span>
            </button>
            <span className="text-xs font-mono text-slate-400">
              AquaVane • Team Labyrinth.exe • Chakravyuh Hackathon
            </span>
            <button
              onClick={nextSlide}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00B4D8] hover:bg-cyan-400 text-[#0B192C] text-xs font-bold transition"
            >
              <span>Next Slide</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
