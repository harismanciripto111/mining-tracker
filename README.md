# Crypto Mining Tracker

A modern, glassmorphism-styled Vue 3 + TypeScript application for tracking crypto mining operations, profit/loss, and analytics.

> **STATUS: WORK IN PROGRESS** -- See [Progress](#progress) below for details.

## Tech Stack

- **Frontend:** Vue 3 + TypeScript + Vite
- **State:** Pinia (localStorage persistence)
- **Styling:** Custom CSS with glassmorphism effects, CSS variables, responsive design
- **Charts:** vue3-apexcharts
- **Utilities:** date-fns, uuid
- **Deployment:** Docker + Nginx (planned)

## Features (Planned)

- Dashboard with P&L calendar, summary cards, quick actions
- Mining rig management (add/edit/delete rigs, log mining output)
- Profit & Loss tracking (buy/sell/fee transactions, import/export)
- Analytics with cumulative charts, daily bars, heatmaps, ROI, distribution
- Settings (currency, theme, data management)
- Animated particle background + glassmorphism UI
- Fully responsive (mobile, tablet, desktop)
- Export data to JSON/CSV

---

## Progress

### DONE (44 files)

#### Scaffolding & Config
- [x] `package.json` -- dependencies & scripts
- [x] `vite.config.ts` -- Vite config with aliases
- [x] `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
- [x] `index.html` -- entry HTML
- [x] `.env.example` -- environment template
- [x] `env.d.ts` -- Vite env type declarations

#### Core (`src/`)
- [x] `main.ts` -- app entry, Pinia + Router setup
- [x] `App.vue` -- root component with layout
- [x] `types/index.ts` -- all TypeScript interfaces
- [x] `router/index.ts` -- Vue Router with lazy routes

#### Stores (`src/stores/`)
- [x] `mining.ts` -- mining rigs & logs state
- [x] `profit.ts` -- transactions & P&L state
- [x] `settings.ts` -- app settings state

#### Styles (`src/styles/`)
- [x] `variables.css` -- CSS custom properties / theme
- [x] `main.css` -- global styles
- [x] `glassmorphism.css` -- glass effect utilities
- [x] `animations.css` -- keyframe animations
- [x] `responsive.css` -- media queries

#### Background Components (`src/components/background/`)
- [x] `ParticleBackground.vue` -- animated floating particles
- [x] `AnimatedGradient.vue` -- gradient background layer

#### Layout (`src/components/layout/`)
- [x] `AppSidebar.vue` -- navigation sidebar
- [x] `TopBar.vue` -- top bar with search & actions

#### Shared Components (`src/components/shared/`)
- [x] `GlassCard.vue` -- reusable glass card wrapper
- [x] `AnimatedCounter.vue` -- animated number counter
- [x] `StatusBadge.vue` -- status indicator badge
- [x] `ChartWrapper.vue` -- ApexCharts wrapper
- [x] `ConfirmModal.vue` -- confirmation dialog
- [x] `EmptyState.vue` -- empty data placeholder

#### Utils (`src/utils/`)
- [x] `formatters.ts` -- currency, date, number formatters
- [x] `colors.ts` -- chart color palettes
- [x] `seedData.ts` -- demo/seed data generator
- [x] `chartConfigs.ts` -- ApexCharts config presets

#### Composables (`src/composables/`)
- [x] `useAnimatedCounter.ts` -- counter animation logic
- [x] `useExport.ts` -- JSON/CSV export logic

#### Dashboard (`src/components/dashboard/` + `src/views/`)
- [x] `PnLCalendar.vue` -- monthly P&L calendar heatmap
- [x] `SummaryCards.vue` -- KPI summary cards
- [x] `QuickActions.vue` -- quick action buttons
- [x] `DashboardView.vue` -- dashboard page view

#### Mining (`src/components/mining/`)
- [x] `RigCard.vue` -- mining rig display card
- [x] `RigForm.vue` -- add/edit rig form
- [x] `MiningLogTable.vue` -- mining logs data table
- [x] `MiningLogForm.vue` -- add mining log form

---

### TODO (Remaining Files)

#### Mining View
- [ ] `src/views/MiningView.vue` -- mining page (combines RigCard, RigForm, MiningLogTable, MiningLogForm)

#### Profit & Loss (`src/components/profit/`)
- [ ] `TransactionTable.vue` -- transactions data table with sorting/filtering
- [ ] `TransactionForm.vue` -- add/edit buy/sell/fee transaction form
- [ ] `FilterBar.vue` -- date range & type filter bar
- [ ] `ImportExport.vue` -- import/export transactions UI
- [ ] `src/views/ProfitLossView.vue` -- P&L page view

#### Analytics (`src/components/analytics/`)
- [ ] `CumulativeChart.vue` -- cumulative P&L line chart
- [ ] `DailyBarChart.vue` -- daily profit/loss bar chart
- [ ] `HeatmapChart.vue` -- monthly heatmap chart
- [ ] `RoiChart.vue` -- ROI over time chart
- [ ] `DistributionChart.vue` -- profit distribution chart
- [ ] `src/views/AnalyticsView.vue` -- analytics page view

#### Settings
- [ ] `src/views/SettingsView.vue` -- settings page (currency, theme, seed data, reset)

#### Deployment
- [ ] `Dockerfile` -- multi-stage build
- [ ] `docker-compose.yml` -- container orchestration
- [ ] `nginx.conf` -- production Nginx config
- [ ] `.gitignore` -- git ignore rules

---

## Setup (once complete)

```bash
npm install
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
```

## Docker (planned)

```bash
docker-compose up -d
```

## License

MIT