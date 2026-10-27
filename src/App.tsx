import React, { useState, useEffect, useMemo } from 'react';
import type {
  MicroWatershed,
  PolicyWeights,
  IndicatorKey,
} from './types/watershed';
import { MOCK_WATERSHEDS, POLICY_PRESETS } from './data/mockWatersheds';
import { fetchWatersheds, calculatePriority } from './services/api';
import { calculateBasinMeanIndicators } from './services/mcdaEngine';
import {
  TopNavTelemetryBar,
  type ActiveViewMode,
} from './components/TopNavTelemetryBar';
import { LeftPolicySidebar } from './components/LeftPolicySidebar';
import { CenterMapCanvas } from './components/CenterMapCanvas';
import { RightInspectorSidebar } from './components/RightInspectorSidebar';
import { ScenarioComparatorView } from './components/ScenarioComparatorView';
import { DataPipelineMetadataView } from './components/DataPipelineMetadataView';
import { PipelineArchitectureModal } from './components/PipelineArchitectureModal';
import { PitchDeckModal } from './components/PitchDeckModal';

export function App() {
  const [watersheds, setWatersheds] = useState<MicroWatershed[]>(MOCK_WATERSHEDS);
  const [studyBasin, setStudyBasin] = useState<string>(
    'Upper Krishna Sub-Basin (Pilot)'
  );
  const [activeView, setActiveView] = useState<ActiveViewMode>('explorer');

  const [activePresetId, setActivePresetId] = useState<string | null>('balanced');
  const [weights, setWeights] = useState<PolicyWeights>(
    POLICY_PRESETS.balanced.weights
  );
  const [budgetLakhs, setBudgetLakhs] = useState<number>(130);
  const [selectedWatershedId, setSelectedWatershedId] = useState<string>('MW-01');

  const [architectureModalOpen, setArchitectureModalOpen] =
    useState<boolean>(false);
  const [pitchDeckModalOpen, setPitchDeckModalOpen] = useState<boolean>(false);

  // Attempt FastAPI backend fetch on mount with instant fallback to embedded GeoJSON
  useEffect(() => {
    let mounted = true;
    fetchWatersheds().then(({ watersheds: data }) => {
      if (mounted && data.length > 0) {
        setWatersheds(data);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Zero-Latency (<1ms) Client-Side MCDA Priority & Ranking Evaluation
  const evaluatedWatersheds = useMemo(
    () => calculatePriority(watersheds, weights, budgetLakhs),
    [watersheds, weights, budgetLakhs]
  );

  // Regional Basin Mean Baseline for Multi-Criteria Radar Chart
  const basinMeanIndicators = useMemo(
    () => calculateBasinMeanIndicators(watersheds),
    [watersheds]
  );

  const handleSelectPreset = (presetId: string, presetWeights: PolicyWeights) => {
    setActivePresetId(presetId);
    setWeights(presetWeights);
  };

  const handleChangeWeight = (key: IndicatorKey, value: number) => {
    setActivePresetId(null);
    setWeights((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleInspectWatershedOnMap = (id: string) => {
    setSelectedWatershedId(id);
    setActiveView('explorer');
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0B132B] text-slate-100 flex flex-col font-sans">
      {/* 1. Top Navigation & Telemetry Bar */}
      <TopNavTelemetryBar
        activeView={activeView}
        setActiveView={setActiveView}
        studyBasin={studyBasin}
        setStudyBasin={setStudyBasin}
        evaluatedWatersheds={evaluatedWatersheds}
        weights={weights}
        budgetLakhs={budgetLakhs}
        onOpenArchitectureModal={() => setArchitectureModalOpen(true)}
        onOpenPitchDeckModal={() => setPitchDeckModalOpen(true)}
      />

      {/* Main Workspace Area (100% remaining viewport height, no page scroll) */}
      <div className="flex-1 w-full flex overflow-hidden">
        {activeView === 'explorer' && (
          <>
            {/* 2. Left Sidebar: Policy Weight Simulator & Budget Allocator (~26%) */}
            <LeftPolicySidebar
              weights={weights}
              activePresetId={activePresetId}
              onSelectPreset={handleSelectPreset}
              onChangeWeight={handleChangeWeight}
              budgetLakhs={budgetLakhs}
              onChangeBudget={setBudgetLakhs}
              evaluatedWatersheds={evaluatedWatersheds}
            />

            {/* 3. Center Canvas: Interactive Leaflet Map (~42%) */}
            <CenterMapCanvas
              evaluatedWatersheds={evaluatedWatersheds}
              selectedWatershedId={selectedWatershedId}
              onSelectWatershed={setSelectedWatershedId}
            />

            {/* 4. Right Sidebar: Ranked Leaderboard & Explainable Evidence Inspector (~32%) */}
            <RightInspectorSidebar
              evaluatedWatersheds={evaluatedWatersheds}
              selectedWatershedId={selectedWatershedId}
              onSelectWatershed={setSelectedWatershedId}
              basinMeanIndicators={basinMeanIndicators}
            />
          </>
        )}

        {activeView === 'comparator' && (
          <>
            <LeftPolicySidebar
              weights={weights}
              activePresetId={activePresetId}
              onSelectPreset={handleSelectPreset}
              onChangeWeight={handleChangeWeight}
              budgetLakhs={budgetLakhs}
              onChangeBudget={setBudgetLakhs}
              evaluatedWatersheds={evaluatedWatersheds}
            />
            <ScenarioComparatorView
              watersheds={watersheds}
              scenarioAWeights={weights}
              budgetLakhs={budgetLakhs}
              onInspectWatershedOnMap={handleInspectWatershedOnMap}
            />
          </>
        )}

        {activeView === 'metadata' && (
          <DataPipelineMetadataView
            evaluatedWatersheds={evaluatedWatersheds}
            onInspectWatershedOnMap={handleInspectWatershedOnMap}
          />
        )}
      </div>

      {/* Modals */}
      <PipelineArchitectureModal
        isOpen={architectureModalOpen}
        onClose={() => setArchitectureModalOpen(false)}
      />
      <PitchDeckModal
        isOpen={pitchDeckModalOpen}
        onClose={() => setPitchDeckModalOpen(false)}
      />
    </div>
  );
}

export default App;
