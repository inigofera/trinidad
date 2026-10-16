# // TRINIDAD

**Industrial-Grade Design System & Interactive Component Lab**  
*Built with Svelte 5 (Runes), SvelteKit 2, Tailwind CSS v4, and W3C Design Tokens.*

[![WCAG 2.1 AA](https://img.shields.io/badge/WCAG_2.1_AA-Verified-a6c856?style=flat-square&labelColor=24422a)](#verification--testing)
[![Svelte 5](https://img.shields.io/badge/Svelte-5.0_(Runes)-a6c856?style=flat-square&labelColor=24422a)](https://svelte.dev)
[![Zero Runtime CSS](https://img.shields.io/badge/CSS-Zero_Runtime-a6c856?style=flat-square&labelColor=24422a)](#token-engine)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-a6c856?style=flat-square&labelColor=24422a)](#architecture)

---

## 1. System Thesis: The UX Engineering Trinity

**Trinidad** (*Spanish for Trinity*) is an architectural component library and live telemetry workbench created by **Iñigo Artolozaga**[cite: 1]. 

In standard software organizations, user research, visual design, and frontend engineering operate in isolated silos. This separation causes translation loss between prototype and production. Trinidad eliminates the handoff gap by uniting the three core disciplines of UX Engineering inside a single codebase:

```text
                  [ 01. HUMAN FACTORS ]
            (Ergonomics, Cognitive Load, WAI-ARIA)
                         /     \
                        /       \
                       /         \
[ 02. VISUAL DESIGN ] ————————————— [ 03. SYSTEMS ENGINEERING ]
(Swiss Grids, Tactile Tokens,     (Svelte 5 Runes, 60fps Canvas,
 Warm Brutalism, Typography)       Zero-Runtime CSS, Strict TS)

```

| Pillar | Discipline | Implementation in Trinidad |
| :--- | :--- | :--- |
| **`01 // ERGONOMICS`** | **Human Factors & HCI** | • Deterministic WAI-ARIA 1.2 state machines (`spinbutton`, `combobox`, `grid`)<br>• Roving `tabindex` and cyclic focus traps (`<dialog>`)<br>• Pointer-scrubbing inputs and step modifiers (`Shift`/`Alt`) to minimize operator fatigue<br>• Atomic proposal confirmation gates (`DiffViewer`) to prevent destructive overwrites |
| **`02 // DESIGN`** | **Interaction & Visual Systems** | • Synthesis of mid-century Swiss grids, warm editorial printing, and technical telemetry<br>• Multi-theme W3C DTCG Token Engine (`Editorial Paper` vs. `Industrial Operator Dark`)<br>• Runtime spatial density scaling (`Comfortable` vs. `Compact`)<br>• Self-hosted `Space Grotesk` and `Space Mono` typography |
| **`03 // ENGINEERING`** | **Systems Architecture** | • Decoupled headless `.svelte.ts` Runes state machines (`$state`, `$derived`)<br>• $O(1)$ DOM viewport virtualization for `10,000+` row logs (`DataTable`)<br>• Hardware-accelerated `60fps` Retina `<canvas>` rendering (`Sparkline`)<br>• Zero runtime CSS-in-JS overhead; strictly typed HTML attribute forwarding |

---

## 2. Component Roster

Rather than duplicating generic marketing UI templates, Trinidad focuses on high-precision foundational primitives and complex domain widgets for **Human-Robot Interaction (HRI)**, **B2B CRM systems**, and **Agentic Knowledge Management**.

### Tier A: Foundational Primitives

1. **`Button` & `ToggleButton**`: Polymorphic triggers with layout-locked loading states, keyboard shortcut badges (`⌘K`), tactile press physics, and compile-time `aria-label` enforcement for icon-only variants.
2. **`NumberField`**: Calibration-grade numeric control featuring horizontal pointer scrubbing (`ew-resize`), floating-point clamping math, unit suffixes (`mm`, `ms`, `%`), and multi-tier keyboard step modifiers.
3. **`Dialog`**: Built on the native browser `<dialog>` API with `.showModal()` focus trapping, backdrop click dismissal, scroll locking, and deterministic focus restoration.



### Tier B: Domain-Specific Engineering Widgets

4. **`Combobox` (Command Palette)**: Zero-latency omnibar with subsequence fuzzy scoring, grouped actions, and virtual focus management via `aria-activedescendant`.
5. **`Sparkline` (Telemetry Tile)**: High-frequency `60fps` DPI-scaled `<canvas>` stream with configurable warning/critical threshold zones and pause-on-hover/keyboard crosshair inspection.
6. **`DataTable` (Virtualized Log Grid)**: Renders `10,000+` telemetry or CRM records smoothly via mathematical viewport virtualization, multi-column sorting (`aria-sort`), and 2D keyboard cell navigation.
7. **`DiffViewer` (Proposal Gate)**: Longest Common Subsequence (LCS) line diff engine featuring atomic `[Accept]`, `[Reject]`, and `[Modify Inline]` operator gates for safe human-AI workflows.

---

## 3. Three-Tier Design Token Engine

Trinidad uses a zero-runtime CSS Custom Property pipeline compiled from a single W3C Design Tokens Community Group (`tokens.json`) source of truth into static CSS (`tokens.css`) and TypeScript constants (`tokens.ts`).

```text
[ Tier 1: Primitives ] ──> [ Tier 2: Semantic Roles ] ──> [ Tier 3: Environmental Axes ]
   --raw-forest-900           --fg-primary                   [data-theme="industrial"]
   --raw-cream-100            --surface-canvas               [data-density="compact"]

```

* **Theme Axis**: Switch instantaneously between **Editorial Paper** (unbleached cream `#f8f3e7` and deep forest ink `#24422a`) and **Industrial Operator Dark** (high-contrast slate `#0d1310` and electric chartreuse `#a6c856` for low-light warehouse/operator floors).


* **Density Axis**: Toggle UI dimensions between **Comfortable** (`36px` controls, generous whitespace) and **Compact** (`28px` controls, high-density data tables).
* **Kinetics Axis**: Respects OS `prefers-reduced-motion` and provides a manual lab override to test instant state transitions.



---

## 4. The Interactive Workbench (`/lab`)

Instead of relying on third-party documentation frameworks, Trinidad ships with a custom-engineered telemetry workbench inside `src/routes/lab`. Every component page features a 4-zone inspection layout:

1. **Stage Canvas**: Live interactive component rendering with theme, density, and motion controls, plus a gzipped bundle weight badge (`kB gzip`).
2. **Reactive Prop Controls**: Real-time inputs bound directly to Svelte 5 `$state` props to test boundary conditions, error states, and high-frequency data bursts.


3. **Live A11y & DOM Telemetry Inspector**: Powered by a `MutationObserver` and focus tracker that outputs real-time `document.activeElement`, computed `role`, live `aria-*` attribute maps, render timing (`ms`), and a rolling keyboard event log.
4. **Dynamic Code Output**: Self-updating Svelte 5 usage snippet reflecting current prop mutations.

---

## 5. Repository Structure

Trinidad is structured as a dual-purpose workspace using `@sveltejs/package`: `src/lib` contains the pure, publishable UI library, while `src/routes` powers the static verification workbench.

```text
trinidad/
├── scripts/
│   ├── build-tokens.mjs        # W3C JSON -> CSS Custom Properties & TS compiler
│   └── measure-bundles.mjs     # Gzipped byte-weight analyzer per component
├── src/
│   ├── lib/                    # Publishable Package Root (trinidad-ui)
│   │   ├── tokens/             # W3C tokens.json + generated CSS/TS outputs
│   │   ├── styles/             # Tailwind CSS v4 @theme mapping
│   │   ├── actions/            # Focus trap, roving tabindex, ARIA live announcer
│   │   └── components/         # Headless .svelte.ts state + .svelte view components
│   └── routes/                 # Interactive Component Lab & Documentation
│       ├── +page.svelte        # System Manifesto & Trinity Overview
│       └── lab/                # 4-Zone Component Workbench & A11y Inspector
└── tests/                      # Playwright + Axe-Core WCAG 2.1 AA test suites

```

---

## 6. Getting Started & Verification

### Prerequisites

* **Node.js** `>= 22.0.0` (or **Bun** `>= 1.1.0`)



### Installation & Local Development

```bash
# Install dependencies
npm install

# Compile W3C design tokens and start the Vite development server
npm run dev

```

### Build & Verification Commands

Every pull request and commit is gated by strict static analysis, package compilation, and automated browser accessibility checks:

| Command | Action |
| --- | --- |
| `npm run tokens` | Compiles `src/lib/tokens/tokens.json` into `tokens.css` and `tokens.ts`. |
| `npm run check` | Runs `svelte-check` with strict TypeScript flags (`0 errors, 0 warnings` enforced).

 |
| `npm run build` | Builds the static workbench (`build/`), packages the library (`dist/`), and calculates gzipped bundle sizes. |
| `npm test` | Executes Playwright keyboard navigation tests and `@axe-core/playwright` WCAG 2.1 AA audits across both `paper` and `industrial` themes. |

---

## 7. Consuming the Library

When packaged via `npm run build`, components and tokens can be imported directly into any Svelte 5 application:

```svelte
<script lang="ts">
  import 'trinidad-ui/theme.css';
  import { NumberField, Button } from 'trinidad-ui';

  let confidenceThreshold = $state(85.5);
</script>

<NumberField bind:value="{confidenceThreshold}" label="Confidence Threshold" max="{100}" min="{0}" step="{0.5}" unit="%"/>

<Button onclick="{()" shortcut="⌘S" variant="primary"> saveConfig(confidenceThreshold)}>
  Apply Calibration
</Button>

```

---

## 8. Author & License

Engineered by **Iñigo Artolozaga** — UX Engineer.

* [Portfolio](https://www.google.com/search?q=https://artolozaga.dev) · [GitHub (@inigofera)](https://www.google.com/search?q=https://github.com/inigofera) · [LinkedIn](https://www.google.com/search?q=https://linkedin.com/in/inigoada)


Released under the **MIT License**.

```

```
