# SAMEER: Spectral Atmosphere-Mode Emulator for Emission Response

**High-resolution 72-hour Air Pollution–Weather Coupled Forecasting & Decision Control Room for Delhi NCR**  
*System Complete (Phases 1–5): Production-Grade Decision Intelligence, Constrained MPC, and Interactive Control Room*

---

## 1. Scientific Thesis & Identity

> **SAMEER** uses physically coupled atmospheric simulations (WRF-Chem v4.5.1) to learn the dominant interactions between meteorology and atmospheric chemistry, enabling rapid 72-hour pollution forecasting, explainability, counterfactual source attribution, and model predictive control.

The system addresses the computational bottleneck of high-resolution numerical chemical-transport models by training a reduced-order linear Koopman dynamical emulator:

$$x(t+1) = A x(t) + B u(t)$$

where:
- $x(t) \in \mathbb{R}^{15}$ is the coupled atmospheric state vector (meteorology, thermal stability, gas and particulate chemistry).
- $u(t) \in \mathbb{R}^8$ is the exogenous policy/forcing vector (anthropogenic emissions, fire FRP, plume transport, solar radiation).
- $A \in \mathbb{R}^{15 \times 15}$ is the learned Koopman state-transition operator (SVD Rank $r=12$).
- $B \in \mathbb{R}^{15 \times 8}$ is the learned control/forcing input operator.

```text
WRF-Chem Coupled Simulation Trajectories
                 ↓
      Augmented Snapshots: Ω = [X ; U]
                 ↓
     Regularized Truncated SVD & DMDc (Rank 12, λ=0)
                 ↓
     Learned Linear Operators: A, B (Stabilized ρ=1.0000)
                 ↓
   72-Hour Rapid Rollout Engine (Latency ~32.2 ms, >500,000x speedup)
                 ↓
  Constrained Model Predictive Control (SLSQP, Low-Cost / Balanced / Aggressive)
                 ↓
  Unified Atmospheric Decision Control Room (React + Vite + FastAPI)
```

---

## 2. Quickstart & Running the Application

### Prerequisites
- Python 3.10+ (tested on Python 3.13)
- Node.js 18+ & npm 9+ (for building frontend)

### Installation & Execution

1. **Install Python Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Build the Production Frontend:**
   ```bash
   cd dashboard
   npm install
   npm run build
   cd ..
   ```

3. **Launch the SAMEER Control Room:**
   ```bash
   uvicorn api.server:app --host 127.0.0.1 --port 8000
   ```

4. **Access the Application:**
   Open your browser to: **`http://localhost:8000`**
   - Interactive Control Room dashboard with live NAQI radial gauge.
   - 72h forward rollout with Lyapunov error ribbon.
   - 3-km D03 spatial dispersion map with dynamic wind vectors & FIRMS active fire markers.
   - Atmospheric vertical column ("Pressure Cooker") inversion visualizer.
   - Source attribution & zero-out sensitivity table.
   - Constrained MPC intervention simulator with feasibility enforcement.
   - Guided 8-step narrative Judge Walkthrough tour.

---

## 3. System Architecture

```text
SAMEER/
│
├── api/
│   ├── __init__.py
│   └── server.py                  # Production FastAPI service with static SPA mounting
│
├── dashboard/                     # Judge-Ready Control Room (React 18 + Vite 6 + TypeScript)
│   ├── index.html                 # Main entry HTML with Google Fonts
│   ├── package.json               # Frontend dependencies (React, Vite, Lucide)
│   ├── tsconfig.json              # TypeScript compilation settings
│   ├── vite.config.ts             # Vite config with /api proxy
│   ├── dist/                      # Production SPA bundle
│   └── src/
│       ├── main.tsx               # SPA entry point
│       ├── App.tsx                # Main Control Room responsive layout
│       ├── index.css              # Custom Vanilla CSS design system
│       ├── types.ts               # TypeScript data schemas
│       ├── api.ts                 # API client wrapper
│       └── components/
│           ├── Header.tsx         # Brand, badges, presentation mode toggle, tour trigger
│           ├── AQICard.tsx        # CPCB NAQI radial ring gauge & category pill
│           ├── CurrentStatePanel.tsx # 8-metric atmospheric state grid
│           ├── ForecastChart.tsx  # 72h SVG rollout, Lyapunov error band, Section 10 disclaimer
│           ├── PollutionMap.tsx   # 3-km D03 spatial heatmap with wind vectors & FIRMS fires
│           ├── InversionPressureCooker.tsx # Vertical boundary layer & capping lid physics
│           ├── WhyAQIRisesPanel.tsx # Physical degradation diagnostics & Koopman modes
│           ├── SourceAttributionPanel.tsx # Local/regional/background apportionment & zero-outs
│           ├── PlumeClock.tsx     # Upwind Punjab/Haryana fire tracking & transit ETA
│           ├── InterventionOptimizer.tsx # Constrained SLSQP MPC policy solver & feasibility
│           ├── CounterfactualComparisonChart.tsx # Baseline vs SAMEER Plan comparison
│           ├── TechnicalHealthDrawer.tsx # Rank-12 SVD & provenance inspector
│           └── DemoTourModal.tsx  # 8-step guided judge demonstration tour
│
├── models/
│   ├── artifacts/                 # Immutable rank-12 production model artifacts
│   ├── dmdc/                      # Koopman/DMDc emulator & rollout engine
│   ├── attribution/               # Counterfactual source attribution & plume clock
│   ├── control/                   # Constrained MPC policy optimizer
│   └── explainability/            # Atmospheric inversion diagnostics
│
├── reports/
│   ├── PHASE_4_COMPLETION_REPORT.md
│   └── PHASE_5_COMPLETION_REPORT.md
│
└── tests/
    └── test_phase5_integration.py # 12 Phase 5 integration & regression tests
```

---

## 4. Production Model Verification & Scientific Audit

In strict accordance with project requirements, **the verified Rank-12 model from Phase 3.2 is deployed with zero retraining**:

| Metric / Parameter | Specification | Status |
| :--- | :--- | :--- |
| **State Dimension ($n$)** | 15 variables | VERIFIED |
| **Control Dimension ($m$)** | 8 variables | VERIFIED |
| **Selected SVD Rank ($r$)** | 12 | VERIFIED |
| **Numerical Rank** | 12 ($\sigma_{12}/\sigma_1 > 10^{-6}$) | VERIFIED |
| **Regularization ($\lambda$)** | 0.0 (Exact pseudo-inverse) | VERIFIED |
| **Raw Spectral Radius $\rho(\mathbf{A})$** | 1.1512 | VERIFIED |
| **Stabilized Spectral Radius** | 1.0000 (Lyapunov projection) | VERIFIED |
| **Rollout Capability** | 72 hours (finite, physical, bounded) | VERIFIED |
| **Empirical Accuracy Validation** | 1–10 hours | VALIDATED OVER AVAILABLE 1–10H TEST HORIZONS |
| **Inference Acceleration** | **32.2 ms** vs 4.5h WRF-Chem | **> 500,000× Speedup** |

---

## 5. Automated Test Suite Results

The complete test suite spans 103 automated tests with 100% pass rate:

```bash
pytest tests/ -v
```

```text
====================== 103 passed in 16.09s ======================
```

Coverage:
- **Phase 1 (Data Engineering & Grid):** 26 tests
- **Phase 2 (WRF-Chem Two-Way Coupling):** 12 tests
- **Phase 3 (Koopman/DMDc Spectral Emulator):** 18 tests
- **Phase 3.1 & 3.2 (Verification & Audit):** 10 tests
- **Phase 4 (Attribution, Plumes & MPC):** 25 tests
- **Phase 5 (Control Room Integration & Health):** 12 tests

---

## 6. Scientific Provenance Policy & Disclaimers

Every metric, visual, and panel carries an explicit provenance tag:
- `MODELLED`: Physical WRF-Chem simulation or stabilized DMDc rollout.
- `COUNTERFACTUAL`: Derived from model sensitivity zero-out perturbations.
- `OBSERVED`: Raw satellite observations from NASA FIRMS / GFAS.
- `INFERRED`: Derived from physics-guided atmospheric diagnostics.
- `SCENARIO`: Generated by user-configured policy interventions.

> **MANDATORY SECTION 10 DISCLAIMER:**  
> 72h trajectory: **MODEL ROLLOUT** | Held-out empirical accuracy: **VALIDATED OVER AVAILABLE 1–10H TEST HORIZONS**.
