import type {
  MicroWatershed,
  PolicyWeights,
  NormalizedWeights,
  EvaluatedWatershed,
  PriorityTier,
  RestorationIntervention,
  ScenarioComparison,
  ScenarioComparisonItem,
  NormalizedIndicators,
} from '../types/watershed';

export const PRIORITY_TIER_COLORS: Record<PriorityTier, string> = {
  Critical: '#EF4444', // Red (0.75 - 1.00)
  High: '#F97316',     // Orange (0.55 - 0.74)
  Moderate: '#EAB308', // Yellow/Amber (0.35 - 0.54)
  Low: '#10B981',      // Emerald (< 0.35)
};

export function normalizeWeights(weights: PolicyWeights): NormalizedWeights {
  const sum =
    weights.slope +
    weights.runoff +
    weights.vegDeficit +
    weights.rainfall +
    weights.exposure;

  if (sum <= 0) {
    return {
      slope: 0.2,
      runoff: 0.2,
      vegDeficit: 0.2,
      rainfall: 0.2,
      exposure: 0.2,
    };
  }

  return {
    slope: weights.slope / sum,
    runoff: weights.runoff / sum,
    vegDeficit: weights.vegDeficit / sum,
    rainfall: weights.rainfall / sum,
    exposure: weights.exposure / sum,
  };
}

export function getPriorityTier(score: number): PriorityTier {
  if (score >= 0.75) return 'Critical';
  if (score >= 0.55) return 'High';
  if (score >= 0.35) return 'Moderate';
  return 'Low';
}

export function generateInterventions(ws: MicroWatershed): RestorationIntervention[] {
  const { slope, runoff, vegDeficit, rainfall, exposure } = ws.normalizedIndicators;
  const interventions: RestorationIntervention[] = [];

  // Rule 1: High Slope + High Runoff -> Gabion Check Dams & Contour Trenching
  if (slope >= 0.65 && runoff >= 0.65) {
    interventions.push({
      id: 'INT-GABION',
      title: 'Gabion Check Dams & Continuous Contour Trenching (CCT)',
      category: 'Structural Hydrology',
      triggerRule: `High DEM Slope (${ws.physicalIndicators.meanSlopeDeg}°) + High Runoff Coeff (${ws.physicalIndicators.runoffCoefficient})`,
      description:
        'Install boulder-filled wire-mesh check dams across 2nd/3rd order gullies paired with staggered contour trenches on >20° escarpments.',
      estimatedImpact: 'Reduces peak storm sediment yield by ~58% and arrests headward gully erosion.',
      priorityLevel: 'Primary',
    });
  }

  // Rule 2: High Veg Deficit + Moderate/High Slope -> Native Afforestation & Vetiver Grass Bunds
  if (vegDeficit >= 0.60 && slope >= 0.40) {
    interventions.push({
      id: 'INT-VETIVER',
      title: 'Native Afforestation & Vetiver Grass Bio-Bunds',
      category: 'Bio-Ecological',
      triggerRule: `High Vegetation Deficit (${ws.physicalIndicators.degradedLandPct}% degraded) + Slope (${ws.physicalIndicators.meanSlopeDeg}°)`,
      description:
        'Revegetate bare scrubland patches using drought-resilient native species (Pongamia, Hardwickia, Bamboo) anchored by deep-rooting Chrysopogon zizanioides bunds.',
      estimatedImpact: 'Increases topsoil infiltration by ~34% and restores 10m canopy cover within 3 monsoons.',
      priorityLevel: interventions.length === 0 ? 'Primary' : 'Secondary',
    });
  }

  // Rule 3: High Runoff + High Downstream Exposure -> Percolation Tanks & Riparian Buffer Zones
  if (runoff >= 0.65 && exposure >= 0.60) {
    interventions.push({
      id: 'INT-PERCOLATION',
      title: 'Percolation Tanks & 30m Riparian Flood Buffer Zones',
      category: 'Downstream Flood Defense',
      triggerRule: `High Runoff (${ws.physicalIndicators.runoffCoefficient}) + High Downstream Exposure (${ws.physicalIndicators.exposedPopulation.toLocaleString()} residents)`,
      description:
        'Construct decentralized detention percolation ponds at foothill chutes and restore 30m multi-tier riparian buffers upstream of vulnerable habitations.',
      estimatedImpact: `Attenuates downstream flash-flood peak discharge by ~42% for ${ws.physicalIndicators.settlementCount} settlements.`,
      priorityLevel: interventions.length === 0 ? 'Primary' : 'Secondary',
    });
  }

  // Fallback for moderate/low lowland watersheds
  if (interventions.length === 0) {
    if (rainfall >= 0.65 || exposure >= 0.45) {
      interventions.push({
        id: 'INT-FARMPOND',
        title: 'Decentralized Farm Ponds & Check Weirs',
        category: 'Downstream Flood Defense',
        triggerRule: `Monsoon Rainfall (${ws.physicalIndicators.annualRainfallMm} mm) + Alluvial Catchment Buffering`,
        description:
          'Establish community farm ponds and low-crest masonry nala plugs to harvest monsoon sheet flow and recharge shallow aquifers.',
        estimatedImpact: 'Enhances dry-season groundwater table by +1.8m across downstream agro-well zones.',
        priorityLevel: 'Primary',
      });
    } else {
      interventions.push({
        id: 'INT-AGROFOREST',
        title: 'Agro-Forestry Shelterbelts & Soil Moisture Conservation',
        category: 'Bio-Ecological',
        triggerRule: `Preventive Maintenance (${ws.physicalIndicators.degradedLandPct}% degraded land)`,
        description:
          'Promote field-bund agro-forestry and mulching across gently sloping croplands to sustain soil organic carbon.',
        estimatedImpact: 'Maintains baseline infiltration and prevents sheet erosion during intense rainfall spells.',
        priorityLevel: 'Primary',
      });
    }
  }

  return interventions;
}

export function evaluateWatersheds(
  watersheds: MicroWatershed[],
  weights: PolicyWeights,
  budgetLakhs: number
): EvaluatedWatershed[] {
  const normW = normalizeWeights(weights);

  // First pass: calculate weighted contributions and raw priority score
  const prelim = watersheds.map((ws) => {
    const cSlope = normW.slope * ws.normalizedIndicators.slope;
    const cRunoff = normW.runoff * ws.normalizedIndicators.runoff;
    const cVeg = normW.vegDeficit * ws.normalizedIndicators.vegDeficit;
    const cRain = normW.rainfall * ws.normalizedIndicators.rainfall;
    const cExp = normW.exposure * ws.normalizedIndicators.exposure;

    const priorityScore = cSlope + cRunoff + cVeg + cRain + cExp;
    const priorityScore100 = Number((priorityScore * 100).toFixed(1));

    const contributions = {
      slope: cSlope,
      runoff: cRunoff,
      vegDeficit: cVeg,
      rainfall: cRain,
      exposure: cExp,
    };

    const contributions100 = {
      slope: Number((cSlope * 100).toFixed(1)),
      runoff: Number((cRunoff * 100).toFixed(1)),
      vegDeficit: Number((cVeg * 100).toFixed(1)),
      rainfall: Number((cRain * 100).toFixed(1)),
      exposure: Number((cExp * 100).toFixed(1)),
    };

    return {
      ...ws,
      priorityScore,
      priorityScore100,
      priorityTier: getPriorityTier(priorityScore),
      contributions,
      contributions100,
    };
  });

  // Sort descending by priorityScore
  prelim.sort((a, b) => b.priorityScore - a.priorityScore);

  // Second pass: assign rank, budget allocation, natural language explanation, and interventions
  let runningBudget = 0;

  return prelim.map((ws, index) => {
    const rank = index + 1;
    const canFund = runningBudget + ws.estimatedCostLakhs <= budgetLakhs;
    if (canFund) {
      runningBudget += ws.estimatedCostLakhs;
    }

    // Identify top 2 driving factors for Natural Language Evidence Summary
    const factorDescriptors = [
      {
        key: 'slope',
        pts: ws.contributions100.slope,
        text: `severe DEM Slope (${ws.physicalIndicators.meanSlopeDeg}°, contributing +${ws.contributions100.slope.toFixed(1)} pts)`,
      },
      {
        key: 'runoff',
        pts: ws.contributions100.runoff,
        text: `high Runoff & Flow Accumulation (Coeff ${ws.physicalIndicators.runoffCoefficient}, contributing +${ws.contributions100.runoff.toFixed(1)} pts)`,
      },
      {
        key: 'vegDeficit',
        pts: ws.contributions100.vegDeficit,
        text: `acute Vegetation Deficit (${ws.physicalIndicators.degradedLandPct}% degraded cover, contributing +${ws.contributions100.vegDeficit.toFixed(1)} pts)`,
      },
      {
        key: 'rainfall',
        pts: ws.contributions100.rainfall,
        text: `extreme Rainfall Intensity (${ws.physicalIndicators.annualRainfallMm.toLocaleString()} mm/yr, contributing +${ws.contributions100.rainfall.toFixed(1)} pts)`,
      },
      {
        key: 'exposure',
        pts: ws.contributions100.exposure,
        text: `high Downstream Exposure (${ws.physicalIndicators.exposedPopulation.toLocaleString()} residents, contributing +${ws.contributions100.exposure.toFixed(1)} pts)`,
      },
    ].sort((a, b) => b.pts - a.pts);

    const top1 = factorDescriptors[0];
    const top2 = factorDescriptors[1];

    const naturalLanguageSummary = `${ws.id} (${ws.name}) ranks #${rank} (Score: ${ws.priorityScore100.toFixed(
      1
    )}/100) primarily driven by ${top1.text} and ${top2.text}.`;

    return {
      ...ws,
      rank,
      isFundedWithinBudget: canFund,
      cumulativeCostLakhs: runningBudget,
      naturalLanguageSummary,
      recommendedInterventions: generateInterventions(ws),
    };
  });
}

export function calculateBasinMeanIndicators(watersheds: MicroWatershed[]): NormalizedIndicators {
  const n = watersheds.length || 1;
  const totals = watersheds.reduce(
    (acc, ws) => ({
      slope: acc.slope + ws.normalizedIndicators.slope,
      runoff: acc.runoff + ws.normalizedIndicators.runoff,
      vegDeficit: acc.vegDeficit + ws.normalizedIndicators.vegDeficit,
      rainfall: acc.rainfall + ws.normalizedIndicators.rainfall,
      exposure: acc.exposure + ws.normalizedIndicators.exposure,
    }),
    { slope: 0, runoff: 0, vegDeficit: 0, rainfall: 0, exposure: 0 }
  );

  return {
    slope: Number((totals.slope / n).toFixed(2)),
    runoff: Number((totals.runoff / n).toFixed(2)),
    vegDeficit: Number((totals.vegDeficit / n).toFixed(2)),
    rainfall: Number((totals.rainfall / n).toFixed(2)),
    exposure: Number((totals.exposure / n).toFixed(2)),
  };
}

export function comparePolicyScenarios(
  watersheds: MicroWatershed[],
  scenarioAName: string,
  weightsA: PolicyWeights,
  scenarioBName: string,
  weightsB: PolicyWeights,
  budgetLakhs: number
): ScenarioComparison {
  const evalA = evaluateWatersheds(watersheds, weightsA, budgetLakhs);
  const evalB = evaluateWatersheds(watersheds, weightsB, budgetLakhs);

  const mapB = new Map<string, EvaluatedWatershed>();
  evalB.forEach((w) => mapB.set(w.id, w));

  const items: ScenarioComparisonItem[] = evalA.map((wA) => {
    const wB = mapB.get(wA.id)!;
    const rankDelta = wA.rank - wB.rank; // positive = improved rank in B
    const scoreDelta = Number((wB.priorityScore100 - wA.priorityScore100).toFixed(1));
    const isNoRegretTopSite = wA.rank <= 4 && wB.rank <= 4;

    return {
      watershedId: wA.id,
      watershedName: wA.name,
      watershedCode: wA.code,
      areaSqKm: wA.areaSqKm,
      costLakhs: wA.estimatedCostLakhs,
      exposedPopulation: wA.physicalIndicators.exposedPopulation,
      confidencePct: wA.uncertainty.overallConfidencePct,
      rankA: wA.rank,
      scoreA: wA.priorityScore100,
      tierA: wA.priorityTier,
      rankB: wB.rank,
      scoreB: wB.priorityScore100,
      tierB: wB.priorityTier,
      rankDelta,
      scoreDelta,
      isNoRegretTopSite,
    };
  });

  // Compute Spearman Rank Correlation rho = 1 - (6 * sum(d_i^2)) / (n * (n^2 - 1))
  const n = items.length;
  const sumD2 = items.reduce((acc, item) => acc + item.rankDelta * item.rankDelta, 0);
  const rho = n > 1 ? 1 - (6 * sumD2) / (n * (n * n - 1)) : 1;

  return {
    scenarioAName,
    scenarioBName,
    weightsA,
    weightsB,
    items,
    noRegretSites: items.filter((item) => item.isNoRegretTopSite),
    rankCorrelationSpearman: Number(rho.toFixed(3)),
  };
}
