# DTracker - Dhruv's Baby Growth & WHO Percentiles Tracker

Customizing the growth tracking app with personalized branding for baby Dhruv ("DTracker"), refined baby profile settings, and a warm honey & terracotta visual identity.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following user preferences were confirmed in Phase 1 and will guide this update:
> - **App Branding**: Named **DTracker** across the top bar, meta headers, and doctor export reports.
> - **Baby Identity**: Configured with baby name **Dhruv**, setting Dhruv as the active profile with dedicated birthday editing and custom birth measurements in the Profile Settings drawer.
> - **Color & Visual Atmosphere**: Warm Honey & Terracotta aesthetic (`#faf9f6` canvas, soft amber/honey surfaces, terracotta `#ea580c`/`#c2410c` baby growth curves, and emerald milestones).

---

## 1. Overview & Core Concept

- **What It Does**: A personal, 100% free, private growth tracker for 7-month-old baby Dhruv that plots his weight, length, and head circumference against official WHO Child Growth Standards (CDC-recommended percentiles from 0 to 24 months).
- **Target Audience / Persona**: Parents of baby Dhruv seeking a reliable, subscription-free alternative to Nara Baby with effortless 1-tap logging, offline persistence, and exportable pediatric reports.
- **Key Value**: Instant percentile calculations, no paywalls, zero cloud vendor lock-in, and total data freedom with JSON backup and printable doctor summaries.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Brand & Identity First Impression**:
   - The top navigation features the clean **DTracker** wordmark with a warm terracotta badge icon ("D") and direct links to *Growth Curves*, *Monthly Journal*, *7-Month Guide*, and *Doctor Report*.
   - The hero card prominently displays **Dhruv**'s current age (7 months, calculated down to the day), date of birth, and quick toggles for metric/imperial units.
2. **Profile & Birthday Customization**:
   - Clicking the Profile Settings icon opens the settings sheet where parents can set Dhruv's exact calendar birthdate, adjust birth stats (weight, length, head circumference), and update his notes.
3. **WHO Interactive Graphing**:
   - High-contrast interactive SVG chart plotting Dhruv's measurements against WHO 3rd, 15th, 50th (median), 85th, and 97th percentile bands with live tooltips.
4. **Pediatric Wellness Report**:
   - One-click print/PDF view titled *"DTracker · Dhruv's Growth & WHO Percentile Record"* for well-child pediatric checkups.

### Visual Identity & Theme
- **Aesthetic Direction**: Tender, high-design Scandinavian nursery aesthetic with warm organic typography and gentle terracotta accents.
- **Color Palette**:
  - Neutral Canvas: `#faf9f6` (warm linen / oatmeal)
  - Structural Surfaces: `#ffffff` with hairline `#e7e5e4` borders
  - Primary Accent: Terracotta (`#ea580c` / `#c2410c`) for Dhruv's trajectory curve and primary CTAs
  - Reference Core Band: Soft Honey & Sage (`#f59e0b` 5% opacity, `#0d9488` 6% opacity)
  - Milestone Accents: Warm Amber (`#d97706`) and Gentle Emerald (`#059669`)
- **Typography**: Clean `Plus Jakarta Sans` for titles and body, paired with `font-mono tabular-nums` for clinical metrics.

---

## 3. Key Product Decisions & Trade-Offs

- **App Naming & Logo**:
  - *Chosen Approach*: Brand the app **DTracker** with a warm terracotta monogram emblem and subtitle "Dhruv's Growth Journey".
  - *Why*: Direct, memorable, and personalized for baby Dhruv while retaining high usability.
- **Initial Profile & Birthday Management**:
  - *Chosen Approach*: Initialize default profile with Dhruv's name, 7-month milestone data, and a prominent "Set Exact Birthdate" shortcut in the profile card and settings modal.
  - *Why*: Allows parents to immediately see realistic graphs without entering 7 months of past data from scratch, while letting them calibrate to Dhruv's exact birthday in seconds.
- **Local Browser Persistence & Backup**:
  - *Chosen Approach*: Continue using browser `localStorage` + JSON Import/Export + Print-ready CSS.
  - *Why*: Complete privacy, zero hosting costs, instant responsiveness, and zero risk of paywalling.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────┐
│                        DTracker                        │
│                   App Header & Brand                   │
└───────────────────────────┬────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            ▼                               ▼
  ┌───────────────────┐           ┌───────────────────┐
  │   Dhruv Profile   │           │ Unit System State │
  │ (Name, DOB, Sex)  │           │ (Metric/Imperial) │
  └─────────┬─────────┘           └─────────┬─────────┘
            │                               │
            ├───────────────────────────────┤
            ▼                               ▼
  ┌───────────────────────────────────────────────────┐
  │              Active Navigation Views              │
  ├─────────────────┬─────────────────┬───────────────┤
  │   WHO Charts    │ Monthly Journal │ 7-Month Guide │
  │ (SVG + Bands)   │ (Timeline & Tag)│  (Pediatric)  │
  └─────────────────┴─────────────────┴───────────────┘
            │
            ▼
  ┌───────────────────────────────────────────────────┐
  │         Modal Layers & Persistence Store          │
  ├───────────────────┬───────────────────────────────┤
  │ Quick Log Modal   │ Print Doctor Report (PDF)     │
  ├───────────────────┼───────────────────────────────┤
  │ Profile Settings  │ LocalStorage + JSON Backup    │
  └───────────────────┴───────────────────────────────┘
```

### Planned Code Updates
1. `metadata.json` & `index.html`: Update title and descriptions to **DTracker - Dhruv's Growth & WHO Percentiles Tracker**.
2. `src/data/defaultData.ts`: Update default profile name to **Dhruv**, refine birth notes, and set initial 7-month measurements reflecting Dhruv's milestones.
3. `src/App.tsx`: Update top bar wordmark to **DTracker**, adjust hero profile display to showcase Dhruv with quick access to birthdate customization, and update report headers.
4. `src/components/SettingsModal.tsx` & `src/components/PrintDoctorReport.tsx`: Update branding references, report headers, and ensure clean birthdate editing.
