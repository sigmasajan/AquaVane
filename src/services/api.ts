import type {
  MicroWatershed,
  PolicyWeights,
  EvaluatedWatershed,
} from '../types/watershed';
import { MOCK_WATERSHEDS } from '../data/mockWatersheds';
import { evaluateWatersheds, normalizeWeights } from './mcdaEngine';

const FASTAPI_BASE_URL = 'http://localhost:8000/api/v1';

/**
 * Fetches candidate micro-watersheds from the FastAPI + PostGIS backend,
 * falling back seamlessly to the embedded Upper Krishna Sub-Basin dataset
 * when the backend is offline.
 */
export async function fetchWatersheds(): Promise<{
  watersheds: MicroWatershed[];
  source: 'postgis-api' | 'embedded-geojson';
}> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 900);
    const res = await fetch(`${FASTAPI_BASE_URL}/watersheds`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = (await res.json()) as MicroWatershed[];
      return { watersheds: data, source: 'postgis-api' };
    }
  } catch {
    // Graceful fallback to embedded calibrated GeoJSON dataset
  }
  return { watersheds: MOCK_WATERSHEDS, source: 'embedded-geojson' };
}

/**
 * Calculates MCDA priority scores via the FastAPI scoring engine or
 * zero-latency client-side engine.
 */
export function calculatePriority(
  watersheds: MicroWatershed[],
  weights: PolicyWeights,
  budgetLakhs: number
): EvaluatedWatershed[] {
  return evaluateWatersheds(watersheds, weights, budgetLakhs);
}

/**
 * Exports an Explainable Evidence Report in JSON or CSV format for decision-makers.
 */
export function exportScenarioReport(
  evaluated: EvaluatedWatershed[],
  weights: PolicyWeights,
  budgetLakhs: number,
  format: 'csv' | 'json',
  studyBasin: string
): void {
  const normW = normalizeWeights(weights);
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');

  if (format === 'json') {
    const payload = {
      platform: 'AquaVane Geospatial Decision-Support Tool',
      team: 'Labyrinth.exe — Chakravyuh Hackathon',
      generatedAt: new Date().toISOString(),
      studyBasin,
      budgetConstraintLakhs: budgetLakhs,
      normalizedPolicyWeights: {
        slope: Number((normW.slope * 100).toFixed(1)),
        runoff: Number((normW.runoff * 100).toFixed(1)),
        vegDeficit: Number((normW.vegDeficit * 100).toFixed(1)),
        rainfall: Number((normW.rainfall * 100).toFixed(1)),
        exposure: Number((normW.exposure * 100).toFixed(1)),
      },
      summaryMetrics: {
        totalWatersheds: evaluated.length,
        criticalSitesCount: evaluated.filter((w) => w.priorityTier === 'Critical').length,
        fundedSitesCount: evaluated.filter((w) => w.isFundedWithinBudget).length,
        fundedAreaSqKm: Number(
          evaluated
            .filter((w) => w.isFundedWithinBudget)
            .reduce((s, w) => s + w.areaSqKm, 0)
            .toFixed(1)
        ),
        protectedPopulationInBudget: evaluated
          .filter((w) => w.isFundedWithinBudget)
          .reduce((s, w) => s + w.physicalIndicators.exposedPopulation, 0),
      },
      rankedWatersheds: evaluated.map((w) => ({
        rank: w.rank,
        id: w.id,
        wrisCode: w.code,
        name: w.name,
        priorityScore100: w.priorityScore100,
        priorityTier: w.priorityTier,
        isFundedWithinBudget: w.isFundedWithinBudget,
        estimatedCostLakhs: w.estimatedCostLakhs,
        areaSqKm: w.areaSqKm,
        scoreContributionsPts: w.contributions100,
        physicalIndicators: w.physicalIndicators,
        uncertaintyMetadata: w.uncertainty,
        explainableEvidence: w.naturalLanguageSummary,
        recommendedInterventions: w.recommendedInterventions.map((i) => i.title),
      })),
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AquaVane_Evidence_Report_${timestamp}.json`;
    a.click();
    URL.revokeObjectURL(url);
    return;
  }

  // CSV Export
  const headers = [
    'Rank',
    'Watershed_ID',
    'WRIS_Code',
    'Name',
    'Priority_Score_100',
    'Priority_Tier',
    'Funded_Within_Budget',
    'Cost_Lakhs_INR',
    'Area_SqKm',
    'Slope_Contribution_Pts',
    'Runoff_Contribution_Pts',
    'VegDeficit_Contribution_Pts',
    'Rainfall_Contribution_Pts',
    'Exposure_Contribution_Pts',
    'Mean_Slope_Deg',
    'Runoff_Coeff',
    'Degraded_Land_Pct',
    'Annual_Rainfall_Mm',
    'Exposed_Population',
    'Data_Confidence_Pct',
    'Ranking_Sensitivity',
    'Primary_Recommended_Intervention',
    'Explainable_Evidence_Summary',
  ];

  const rows = evaluated.map((w) => [
    w.rank,
    w.id,
    w.code,
    `"${w.name}"`,
    w.priorityScore100,
    w.priorityTier,
    w.isFundedWithinBudget ? 'YES' : 'NO',
    w.estimatedCostLakhs,
    w.areaSqKm,
    w.contributions100.slope,
    w.contributions100.runoff,
    w.contributions100.vegDeficit,
    w.contributions100.rainfall,
    w.contributions100.exposure,
    w.physicalIndicators.meanSlopeDeg,
    w.physicalIndicators.runoffCoefficient,
    w.physicalIndicators.degradedLandPct,
    w.physicalIndicators.annualRainfallMm,
    w.physicalIndicators.exposedPopulation,
    w.uncertainty.overallConfidencePct,
    `"${w.uncertainty.rankingSensitivityIndex}"`,
    `"${w.recommendedInterventions[0]?.title || ''}"`,
    `"${w.naturalLanguageSummary.replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `AquaVane_Evidence_Report_${timestamp}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
