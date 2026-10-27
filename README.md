# AquaVane — Geospatial Decision-Support Platform for Watershed Restoration

**Team:** `Labyrinth.exe` (`Sajan Sivakumar — 25BCS7084`)  
**Hackathon:** Chakravyuh  
**Problem Statement:** *Watershed Restoration Prioritisation with Explainable Evidence*

---

## Overview

**AquaVane** is a 3-Pane GIS Command Center web application that ranks candidate micro-watersheds for ecological restoration using openly available terrain, land-cover, rainfall, and settlement exposure indicators with real-time policy weight sensitivity analysis, explainable score breakdowns, counterfactual scenario comparison, and spatial uncertainty auditing.

### Core Capabilities
1. **Zero-Latency Client-Side MCDA Scoring Engine (`src/services/mcdaEngine.ts`):**
   Recalculates priority scores and re-ranks all 12 calibrated micro-watersheds in `<1ms` whenever any policy slider or preset is adjusted:
   $$\text{PriorityScore}_i = \sum_{k=1}^{5} \hat{w}_k \cdot I_{i,k}, \quad \hat{w}_k = \frac{w_k}{\sum_{j=1}^{5} w_j}$$
2. **Interactive Leaflet Map (`src/components/CenterMapCanvas.tsx`):**
   - Renders 12 contiguous micro-watershed GeoJSON polygons across the **Upper Krishna / Kondapalli–Munneru Sub-Basin** (`16.50°N–16.75°N, 80.42°E–80.70°E`).
   - Dynamic priority tier color-coding (`Critical`, `High`, `Moderate`, `Low`), toggleable **India-WRIS Drainage Network** lines, **Downstream Settlement Exposure** markers, **Funded Within Budget** polygon borders, and base map switching (`Dark GIS`, `Topo DEM`, `Esri Satellite`).
3. **Explainable Evidence Inspector (`src/components/RightInspectorSidebar.tsx`):**
   - Natural language evidence summary citing top 2 physical drivers and exact point contributions.
   - Recharts horizontal score contribution breakdown bar chart & Multi-Criteria Radar Chart comparing the selected micro-watershed against the **Basin Mean Baseline**.
   - Rule-based engineering & bio-ecological intervention recommender (*Gabion Check Dams & CCT*, *Native Afforestation & Vetiver Bio-Bunds*, *Percolation Tanks & 30m Riparian Buffers*).
4. **Policy Scenario Comparator (`src/components/ScenarioComparatorView.tsx`):**
   - Side-by-side comparison of **Scenario A (Live Weights)** vs. **Scenario B (Counterfactual Policy)**.
   - Automatically identifies **"No-Regret / Robust Priority Sites"** that remain in the **Top 4** across both scenarios and computes Spearman rank stability ($\rho$).
5. **Data Resolution & Pipeline Metadata (`src/components/DataPipelineMetadataView.tsx`):**
   - Surfaces spatial resolution disparities (`ESA WorldCover 10m`, `USGS SRTM 30m`, `Copernicus ERA5 ~9km–25km Coarse Grid Warning`, `India-WRIS 1:50,000`), DEM void interpolation percentages, and ranking sensitivity.
6. **Chakravyuh 7-Slide Hackathon Pitch Deck:**
   - Accessible directly inside the app via the **[Pitch Deck]** button in the top navigation bar, or standalone at `/pitch-deck.html`.

---

## Quick Start

```bash
npm install
npm run dev
```
