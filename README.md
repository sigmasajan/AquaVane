# AquaVane — Geospatial Decision-Support Platform for Watershed Restoration

[![Deploy AquaVane to GitHub Pages](https://github.com/sigmasajan/AquaVane/actions/workflows/deploy.yml/badge.svg)](https://github.com/sigmasajan/AquaVane/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-00B4D8?style=flat&logo=github)](https://sigmasajan.github.io/AquaVane/)
[![Pitch Deck](https://img.shields.io/badge/Pitch%20Deck-7--Slide%20Deck-10B981?style=flat&logo=slides)](https://sigmasajan.github.io/AquaVane/pitch-deck.html)

**Team:** `Labyrinth.exe` (`Sajan Sivakumar — 25BCS7084`)  
**Hackathon:** Chakravyuh  
**Problem Statement:** *Watershed Restoration Prioritisation with Explainable Evidence*

---

## 🌐 Live URLs

- **Live Prototype:** [https://sigmasajan.github.io/AquaVane/](https://sigmasajan.github.io/AquaVane/)
- **7-Slide Pitch Deck:** [https://sigmasajan.github.io/AquaVane/pitch-deck.html](https://sigmasajan.github.io/AquaVane/pitch-deck.html)

---

## 📌 Problem Statement & Objective

Tree planting, erosion control, and runoff interventions compete for limited funding. Selecting sites from a single map layer overlooks slope, upstream connectivity, land cover, settlement exposure, and data uncertainty.

**AquaVane** is a geospatial decision-support platform that ranks candidate micro-watersheds for restoration using openly available terrain, land-cover, rainfall, and settlement indicators with configurable policy weights, explainable evidence breakdowns, counterfactual scenario comparisons, and uncertainty auditing.

---

## 🚀 Key Features

### 1. Zero-Latency Client-Side MCDA Scoring Engine
Recalculates priority scores and re-ranks all 12 calibrated micro-watersheds in `<1ms` whenever any policy slider or preset is adjusted:
$$\text{PriorityScore}_i = \sum_{k=1}^{5} \hat{w}_k \cdot I_{i,k}, \quad \text{where } \hat{w}_k = \frac{w_k}{\sum_{j=1}^{5} w_j}$$

- **One-Click Policy Presets:**
  - ⚖️ *Balanced Ecological* (Equal 20% weights)
  - 🌊 *Flood & Downstream Defense* (Runoff 35%, Exposure 30%, Rainfall 20%, Slope 10%, Veg 5%)
  - 🌱 *Soil Erosion & Afforestation* (Slope 35%, Veg Deficit 35%, Runoff 15%, Rainfall 10%, Exposure 5%)

### 2. Interactive Leaflet GIS Command Center
- **Calibrated Sub-Basin:** 12 contiguous micro-watershed GeoJSON polygons across the **Upper Krishna / Kondapalli–Munneru Catchment** (`16.50°N–16.75°N, 80.42°E–80.70°E`).
- **Dynamic Layer Overlays:**
  - Priority Tier Color-coding (🔴 Critical `#EF4444`, 🟠 High `#F97316`, 🟡 Moderate `#EAB308`, 🟢 Low `#10B981`)
  - Strahler Order 2–4 Drainage Network LineStrings
  - Downstream Settlement Exposure Markers (sized by population)
  - Budget Constraint Halo (highlights which catchments are funded within ₹ Lakhs budget)
  - Base Map Switcher: CartoDB Dark GIS, OpenTopoMap DEM, and Esri World Imagery Satellite

### 3. Per-Site Explainable Evidence Inspector ("Why This Score?")
- **Natural Language Summary:** Automatically decomposes top driving physical factors.
- **Score Contribution Breakdown Chart:** Recharts horizontal bar chart showing exact point additions from Slope, Runoff, Veg Deficit, Rainfall, and Exposure.
- **Multi-Criteria Radar Chart:** Compares the selected micro-watershed against the regional basin baseline.
- **Automated Interventions:** Suggests engineering/ecological interventions (Gabion Check Dams & CCT, Native Afforestation & Vetiver Bio-Bunds, Percolation Tanks & 30m Riparian Buffers).

### 4. Counterfactual Policy Scenario Comparator
- Side-by-side comparison of **Scenario A (Live Weights)** vs. **Scenario B (Alternate Policy)**.
- **"No-Regret / Robust Priority Sites":** Automatically flags micro-watersheds that stay in the Top 4 regardless of policy shifts.
- Computes Spearman Rank Correlation ($\rho$).

### 5. Multi-Resolution Geospatial Data Pipeline & Audit
- Transparent provenance tracking for multi-resolution datasets:
  - **ESA WorldCover:** 10m Optical/SAR (High Spatial Precision)
  - **USGS SRTM DEM:** 30m Radar Elevation
  - **Copernicus ERA5:** ~9km–25km Grid (Coarse Resolution Warning & Interpolation)
  - **India-WRIS:** 1:50,000 Hydrological Cadastre & Drainage

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 18, Vite, TypeScript |
| **Styling & Theme** | Tailwind CSS (Dark GIS Command Center aesthetic) |
| **Mapping Engine** | Leaflet.js, React-Leaflet |
| **Analytics & Charts** | Recharts (Horizontal Bar, Radar, Grouped Bar) |
| **Icons & UI** | Lucide React |
| **Deployment** | GitHub Actions CI/CD to GitHub Pages |

---

## 💻 Local Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/sigmasajan/AquaVane.git
cd AquaVane

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Build production bundle
npm run build
```
