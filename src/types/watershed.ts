import type { Polygon, LineString, FeatureCollection } from 'geojson';

export type IndicatorKey =
  | 'slope'
  | 'runoff'
  | 'vegDeficit'
  | 'rainfall'
  | 'exposure';

export interface PolicyWeights {
  slope: number;      // DEM Slope Steepness (0-100 slider value)
  runoff: number;     // Runoff & Flow Accumulation (0-100 slider value)
  vegDeficit: number; // Vegetation Deficit / Bare Land (0-100 slider value)
  rainfall: number;   // Extreme Rainfall Intensity (0-100 slider value)
  exposure: number;   // Downstream Population Exposure (0-100 slider value)
}

export interface NormalizedWeights {
  slope: number;      // [0, 1], sum = 1.0
  runoff: number;
  vegDeficit: number;
  rainfall: number;
  exposure: number;
}

export interface NormalizedIndicators {
  slope: number;      // I_{i,k} in [0, 1]
  runoff: number;     // I_{i,k} in [0, 1]
  vegDeficit: number; // I_{i,k} in [0, 1]
  rainfall: number;   // I_{i,k} in [0, 1]
  exposure: number;   // I_{i,k} in [0, 1]
}

export interface PhysicalIndicators {
  meanSlopeDeg: number;          // e.g., 26.4°
  runoffCoefficient: number;     // e.g., 0.78
  flowAccumulationIndex: number; // e.g., 8.4 (TWI / log flow acc)
  degradedLandPct: number;       // e.g., 71%
  annualRainfallMm: number;      // e.g., 1,240 mm
  extremeRainDays: number;       // e.g., 14 days/yr > 65mm
  exposedPopulation: number;     // e.g., 4,850 residents
  settlementCount: number;       // e.g., 6 villages/hamlets
}

export interface UncertaintyMetadata {
  overallConfidencePct: number; // e.g., 91%
  confidenceLevel: 'High' | 'Moderate' | 'Low';
  confidenceNote: string;       // e.g., "High optical & radar coverage" or "Coarse ERA5 rainfall grid interpolation"
  demVoidInterpolationPct: number; // e.g., 1.4%
  cloudCoverFreePct: number;       // e.g., 96.5%
  rankingSensitivityIndex: 'Low (Robust)' | 'Moderate' | 'High (Weight-Sensitive)';
  sensitivityDeltaRanks: number;   // Max rank swing under ±15% weight perturbation
}

export interface RestorationIntervention {
  id: string;
  title: string;
  category: 'Structural Hydrology' | 'Bio-Ecological' | 'Downstream Flood Defense';
  triggerRule: string;
  description: string;
  estimatedImpact: string;
  priorityLevel: 'Primary' | 'Secondary';
}

export interface MicroWatershed {
  id: string;                 // e.g., "MW-01"
  code: string;               // e.g., "4D3B2-A1" (India-WRIS style code)
  name: string;               // e.g., "Kondapalli Ridge Upper"
  subBasin: string;           // e.g., "Upper Krishna Sub-Basin (Pilot)"
  areaSqKm: number;           // e.g., 18.4 sq. km
  estimatedCostLakhs: number; // e.g., 28 (₹ Lakhs)
  centroid: [number, number]; // [lat, lng] for Leaflet zoom
  geometry: Polygon;          // Valid GeoJSON Polygon ([lng, lat] rings)
  normalizedIndicators: NormalizedIndicators;
  physicalIndicators: PhysicalIndicators;
  uncertainty: UncertaintyMetadata;
}

export interface ScoredContributions {
  slope: number;      // c_{i,k} = \hat{w}_k * I_{i,k}
  runoff: number;
  vegDeficit: number;
  rainfall: number;
  exposure: number;
}

export type PriorityTier = 'Critical' | 'High' | 'Moderate' | 'Low';

export interface EvaluatedWatershed extends MicroWatershed {
  priorityScore: number;             // in [0, 1]
  priorityScore100: number;          // in [0, 100]
  rank: number;                      // 1..N
  priorityTier: PriorityTier;
  contributions: ScoredContributions;
  contributions100: ScoredContributions; // scaled 0..100
  isFundedWithinBudget: boolean;
  cumulativeCostLakhs: number;
  naturalLanguageSummary: string;
  recommendedInterventions: RestorationIntervention[];
}

export interface ScenarioComparisonItem {
  watershedId: string;
  watershedName: string;
  watershedCode: string;
  areaSqKm: number;
  costLakhs: number;
  exposedPopulation: number;
  confidencePct: number;
  rankA: number;
  scoreA: number; // 0..100
  tierA: PriorityTier;
  rankB: number;
  scoreB: number; // 0..100
  tierB: PriorityTier;
  rankDelta: number;  // rankA - rankB (positive means moved UP in Scenario B)
  scoreDelta: number; // scoreB - scoreA
  isNoRegretTopSite: boolean; // Remains in Top 4 across BOTH Scenario A and Scenario B
}

export interface ScenarioComparison {
  scenarioAName: string;
  scenarioBName: string;
  weightsA: PolicyWeights;
  weightsB: PolicyWeights;
  items: ScenarioComparisonItem[];
  noRegretSites: ScenarioComparisonItem[];
  rankCorrelationSpearman: number;
}

export interface StreamSegmentProperties {
  id: string;
  name: string;
  streamOrder: 1 | 2 | 3 | 4;
  flowRateClass: 'Ephemeral Headwater' | 'Seasonal Tributary' | 'Perennial Mainstem';
}

export type StreamNetworkGeoJSON = FeatureCollection<LineString, StreamSegmentProperties>;

export interface SettlementExposurePoint {
  id: string;
  name: string;
  watershedId: string;
  coordinates: [number, number]; // [lat, lng]
  population: number;
  floodRiskTier: 'Severe' | 'High' | 'Moderate';
  elevationM: number;
}

export interface DatasetSourceMetadata {
  id: string;
  name: string;
  provider: string;
  url: string;
  spatialResolution: string;
  temporalCoverage: string;
  precisionRating: 'High Spatial Precision' | 'Moderate Precision' | 'Coarse Resolution Warning' | 'Validated Vector Reference';
  roleInAquaVane: string;
  derivedIndicators: string[];
  knownLimitations: string;
}
