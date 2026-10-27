import React, { useState, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Polygon as LeafletPolygon,
  Polyline,
  CircleMarker,
  Tooltip,
  useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Maximize2,
  Waves,
  Users,
  CheckCircle2,
  Globe,
  Compass,
} from 'lucide-react';
import type { EvaluatedWatershed } from '../types/watershed';
import {
  BASIN_CENTER,
  BASIN_BOUNDS,
  STREAM_NETWORK_GEOJSON,
  SETTLEMENT_EXPOSURE_POINTS,
} from '../data/mockWatersheds';
import { PRIORITY_TIER_COLORS } from '../services/mcdaEngine';

interface CenterMapCanvasProps {
  evaluatedWatersheds: EvaluatedWatershed[];
  selectedWatershedId: string;
  onSelectWatershed: (id: string) => void;
}

type BaseMapType = 'dark' | 'topo' | 'satellite';

const BASE_MAPS: Record<
  BaseMapType,
  { label: string; url: string; attribution: string }
> = {
  dark: {
    label: 'Dark GIS',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap &copy; CARTO',
  },
  topo: {
    label: 'Topo DEM',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenTopoMap (CC-BY-SA)',
  },
  satellite: {
    label: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri World Imagery',
  },
};

interface MapCameraControllerProps {
  selectedWatershed?: EvaluatedWatershed;
  fitBoundsTrigger: number;
}

const MapCameraController: React.FC<MapCameraControllerProps> = ({
  selectedWatershed,
  fitBoundsTrigger,
}) => {
  const map = useMap();

  useEffect(() => {
    if (selectedWatershed) {
      map.flyTo(selectedWatershed.centroid, 11.5, {
        duration: 0.65,
      });
    }
  }, [selectedWatershed?.id, map]);

  useEffect(() => {
    if (fitBoundsTrigger > 0) {
      map.fitBounds(BASIN_BOUNDS, { padding: [24, 24], animate: true });
    }
  }, [fitBoundsTrigger, map]);

  return null;
};

export const CenterMapCanvas: React.FC<CenterMapCanvasProps> = ({
  evaluatedWatersheds,
  selectedWatershedId,
  onSelectWatershed,
}) => {
  const [baseMap, setBaseMap] = useState<BaseMapType>('dark');
  const [showStreams, setShowStreams] = useState<boolean>(true);
  const [showSettlements, setShowSettlements] = useState<boolean>(true);
  const [showFundedHalo, setShowFundedHalo] = useState<boolean>(true);
  const [fitBoundsTrigger, setFitBoundsTrigger] = useState<number>(0);

  const selectedWatershed = evaluatedWatersheds.find(
    (w) => w.id === selectedWatershedId
  );

  return (
    <main className="flex-1 h-full relative bg-[#070D1D] overflow-hidden select-none">
      {/* Top Floating GIS Layer & Base Map Controls */}
      <div className="absolute top-3 left-3 right-3 z-[500] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Layer Overlay Toggles */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#0B132B]/90 backdrop-blur-md border border-cyan-500/30 rounded-xl p-1.5 shadow-xl pointer-events-auto">
          <button
            onClick={() => setShowStreams((v) => !v)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
              showStreams
                ? 'bg-[#00B4D8]/20 text-cyan-300 border border-[#00B4D8]/50'
                : 'text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            <Waves className="w-3.5 h-3.5 text-[#00B4D8]" />
            <span>Drainage Network</span>
          </button>

          <button
            onClick={() => setShowSettlements((v) => !v)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
              showSettlements
                ? 'bg-red-500/20 text-red-300 border border-red-500/50'
                : 'text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-red-400" />
            <span>Settlement Exposure</span>
          </button>

          <button
            onClick={() => setShowFundedHalo((v) => !v)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
              showFundedHalo
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                : 'text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Funded Budget Halo</span>
          </button>

          <div className="h-4 w-px bg-slate-700 mx-0.5" />

          <button
            onClick={() => setFitBoundsTrigger((c) => c + 1)}
            title="Recenter and Fit to Sub-Basin Bounds"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#1C2541] hover:bg-slate-700 text-white border border-slate-600 transition"
          >
            <Maximize2 className="w-3.5 h-3.5 text-[#00B4D8]" />
            <span>Fit Basin Bounds</span>
          </button>
        </div>

        {/* Base Map Switcher */}
        <div className="flex items-center gap-1 bg-[#0B132B]/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-1 shadow-xl pointer-events-auto">
          <Globe className="w-3.5 h-3.5 text-cyan-400 ml-1.5 mr-0.5" />
          {(Object.keys(BASE_MAPS) as BaseMapType[]).map((key) => (
            <button
              key={key}
              onClick={() => setBaseMap(key)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                baseMap === key
                  ? 'bg-[#00B4D8] text-[#0B132B]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {BASE_MAPS[key].label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Leaflet Map */}
      <MapContainer
        center={BASIN_CENTER}
        zoom={11}
        minZoom={9}
        maxZoom={16}
        zoomControl={false}
        className="w-full h-full z-10"
      >
        <TileLayer
          key={baseMap}
          url={BASE_MAPS[baseMap].url}
          attribution={BASE_MAPS[baseMap].attribution}
        />

        <MapCameraController
          selectedWatershed={selectedWatershed}
          fitBoundsTrigger={fitBoundsTrigger}
        />

        {/* Render Micro-Watershed Polygons */}
        {evaluatedWatersheds.map((ws) => {
          const isSelected = ws.id === selectedWatershedId;
          const fillColor = PRIORITY_TIER_COLORS[ws.priorityTier];

          // Convert GeoJSON [lng, lat] ring to Leaflet [lat, lng] positions
          const latLngPositions = ws.geometry.coordinates[0].map(
            ([lng, lat]) => [lat, lng] as [number, number]
          );

          const borderColor = isSelected
            ? '#38BDF8'
            : showFundedHalo && ws.isFundedWithinBudget
            ? '#10B981'
            : '#0F172A';

          const borderWeight = isSelected
            ? 3.5
            : showFundedHalo && ws.isFundedWithinBudget
            ? 2.5
            : 1.4;

          return (
            <LeafletPolygon
              key={ws.id}
              positions={latLngPositions}
              pathOptions={{
                fillColor,
                fillOpacity: isSelected ? 0.65 : 0.45,
                color: borderColor,
                weight: borderWeight,
                dashArray:
                  !isSelected && showFundedHalo && ws.isFundedWithinBudget
                    ? undefined
                    : undefined,
              }}
              eventHandlers={{
                click: () => onSelectWatershed(ws.id),
              }}
            >
              <Tooltip sticky direction="top" className="gis-tooltip">
                <div className="min-w-[205px] space-y-1">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-700/80 pb-1">
                    <span className="text-xs font-mono font-extrabold text-cyan-300">
                      Rank #{ws.rank} • {ws.id}
                    </span>
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase"
                      style={{
                        backgroundColor: `${fillColor}25`,
                        color: fillColor,
                        border: `1px solid ${fillColor}60`,
                      }}
                    >
                      {ws.priorityTier}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white">{ws.name}</div>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[11px] pt-0.5">
                    <span className="text-slate-400">Priority Score:</span>
                    <span className="font-mono font-bold text-right text-white">
                      {ws.priorityScore100.toFixed(1)} / 100
                    </span>
                    <span className="text-slate-400">Data Confidence:</span>
                    <span className="font-mono font-semibold text-right text-cyan-300">
                      {ws.uncertainty.overallConfidencePct}% ({ws.uncertainty.confidenceLevel})
                    </span>
                    <span className="text-slate-400">Est. Cost / Area:</span>
                    <span className="font-mono text-right text-slate-200">
                      ₹{ws.estimatedCostLakhs}L • {ws.areaSqKm} km²
                    </span>
                  </div>
                  {ws.isFundedWithinBudget && (
                    <div className="mt-1 pt-1 border-t border-emerald-500/30 text-[10px] font-mono font-semibold text-emerald-400 flex items-center justify-between">
                      <span>✓ FUNDED WITHIN BUDGET</span>
                      <span>Cum: ₹{ws.cumulativeCostLakhs}L</span>
                    </div>
                  )}
                </div>
              </Tooltip>
            </LeafletPolygon>
          );
        })}

        {/* Render Synthetic Stream / Drainage Network */}
        {showStreams &&
          STREAM_NETWORK_GEOJSON.features.map((feat) => {
            const positions = feat.geometry.coordinates.map(
              ([lng, lat]) => [lat, lng] as [number, number]
            );
            const order = feat.properties.streamOrder;
            return (
              <Polyline
                key={feat.properties.id}
                positions={positions}
                pathOptions={{
                  color: '#00B4D8',
                  weight: order === 4 ? 3.5 : order === 3 ? 2.5 : 1.8,
                  opacity: 0.88,
                  dashArray: order === 2 ? '4 4' : undefined,
                }}
              >
                <Tooltip sticky className="gis-tooltip">
                  <div className="text-xs">
                    <div className="font-bold text-cyan-300">{feat.properties.name}</div>
                    <div className="text-[11px] text-slate-300">
                      Strahler Order {order} • {feat.properties.flowRateClass}
                    </div>
                  </div>
                </Tooltip>
              </Polyline>
            );
          })}

        {/* Render Downstream Settlement Exposure Markers */}
        {showSettlements &&
          SETTLEMENT_EXPOSURE_POINTS.map((pt) => {
            const radius = Math.max(5, Math.min(11, Math.sqrt(pt.population) / 8));
            const color =
              pt.floodRiskTier === 'Severe'
                ? '#EF4444'
                : pt.floodRiskTier === 'High'
                ? '#F97316'
                : '#FACC15';

            return (
              <CircleMarker
                key={pt.id}
                center={pt.coordinates}
                radius={radius}
                pathOptions={{
                  color: '#FFFFFF',
                  weight: 1.5,
                  fillColor: color,
                  fillOpacity: 0.9,
                }}
                eventHandlers={{
                  click: () => onSelectWatershed(pt.watershedId),
                }}
              >
                <Tooltip direction="top" className="gis-tooltip">
                  <div className="text-xs space-y-0.5">
                    <div className="font-bold text-white">{pt.name}</div>
                    <div className="text-[11px] text-slate-300">
                      Exposed Pop:{' '}
                      <span className="font-mono font-bold text-red-300">
                        {pt.population.toLocaleString()}
                      </span>{' '}
                      • {pt.floodRiskTier} Flood Risk
                    </div>
                    <div className="text-[10px] font-mono text-cyan-400">
                      Watershed: {pt.watershedId} • Elev: {pt.elevationM}m ASL
                    </div>
                  </div>
                </Tooltip>
              </CircleMarker>
            );
          })}
      </MapContainer>

      {/* Bottom-Left Floating Glassmorphic Priority Score Legend */}
      <div className="absolute bottom-3 left-3 z-[500] bg-[#0B132B]/92 backdrop-blur-md border border-slate-700/80 rounded-xl p-3 shadow-2xl pointer-events-auto max-w-xs">
        <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
          <span>MCDA Restoration Priority Index</span>
          <span className="text-cyan-400">EPSG:4326</span>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-[#EF4444] border border-white/30 shrink-0" />
            <span className="text-slate-200 font-medium">Critical (0.75–1.00)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-[#F97316] border border-white/30 shrink-0" />
            <span className="text-slate-200 font-medium">High (0.55–0.74)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-[#EAB308] border border-white/30 shrink-0" />
            <span className="text-slate-200 font-medium">Moderate (0.35–0.54)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-[#10B981] border border-white/30 shrink-0" />
            <span className="text-slate-200 font-medium">Low (&lt; 0.35)</span>
          </div>
        </div>

        <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-300 gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#00B4D8] inline-block" />
            WRIS Stream
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 border border-white inline-block" />
            Exposed Habitation
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm border-2 border-emerald-400 inline-block" />
            Funded
          </span>
        </div>
      </div>

      {/* Bottom-Right Selected Site Coordinates Telemetry HUD */}
      {selectedWatershed && (
        <div className="absolute bottom-3 right-3 z-[500] bg-[#0B132B]/92 backdrop-blur-md border border-cyan-500/40 rounded-xl px-3 py-2 shadow-2xl pointer-events-auto hidden sm:flex items-center gap-3">
          <Compass className="w-4 h-4 text-[#00B4D8]" />
          <div className="text-xs">
            <div className="font-bold text-white flex items-center gap-2">
              <span>
                {selectedWatershed.id}: {selectedWatershed.name}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                Rank #{selectedWatershed.rank}
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              Centroid: {selectedWatershed.centroid[0].toFixed(3)}°N,{' '}
              {selectedWatershed.centroid[1].toFixed(3)}°E • Area:{' '}
              {selectedWatershed.areaSqKm} km²
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
