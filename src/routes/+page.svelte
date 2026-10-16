<script lang="ts">
  import { tokens } from '$lib/tokens/tokens.js';
  import { TrinidadLogo } from '$lib/components/logo/index.js';
  import { env } from '$lib/state/environment.svelte.js';

  let previewVariant = $state<'lockup' | 'mark'>('lockup');

  const primitiveColors = Object.entries(tokens.primitive.color);
  const semanticTokens = [
    {
      key: '--surface-canvas',
      label: 'Canvas Surface',
      class: 'bg-surface-canvas text-fg-primary border border-border-subtle'
    },
    {
      key: '--surface-elevated',
      label: 'Elevated Card',
      class: 'bg-surface-elevated text-fg-primary border border-border-subtle shadow-sm'
    },
    {
      key: '--surface-muted',
      label: 'Muted Well',
      class: 'bg-surface-muted text-fg-primary border border-border-subtle'
    },
    {
      key: '--fg-primary',
      label: 'Primary Ink',
      class: 'bg-surface-elevated text-fg-primary font-bold'
    },
    { key: '--fg-muted', label: 'Muted Ink', class: 'bg-surface-elevated text-fg-muted' },
    {
      key: '--border-subtle',
      label: 'Subtle Hairline',
      class: 'border-2 border-border-subtle p-2'
    },
    {
      key: '--accent-interactive',
      label: 'Interactive Accent',
      class: 'bg-accent-interactive text-[#24422a] font-mono font-bold'
    },
    {
      key: '--status-critical',
      label: 'Status Critical',
      class: 'bg-status-critical text-[#fcf9f3] font-mono'
    },
    {
      key: '--status-warning',
      label: 'Status Warning',
      class: 'bg-status-warning text-[#0d1310] font-mono'
    },
    {
      key: '--status-nominal',
      label: 'Status Nominal',
      class: 'bg-status-nominal text-[#fcf9f3] font-mono'
    }
  ];
</script>

<svelte:head>
  <title>trinidad — Master System Overview & Token Matrix</title>
</svelte:head>

<div
  class="min-h-screen bg-surface-canvas text-fg-primary p-6 md:p-12 font-sans transition-colors duration-200"
>
  <div class="max-w-6xl mx-auto space-y-10">
    <!-- Header with Live System Telemetry & Brand Mark -->
    <header
      class="border-b border-border-subtle pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6"
    >
      <div class="space-y-4">
        <a
          href="/"
          class="inline-block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-interactive rounded"
          aria-label="trinidad design system"
        >
          <TrinidadLogo size={36} variant="lockup" />
        </a>
        <div>
          <h1 class="text-3xl md:text-4xl font-bold tracking-tight mt-1">
            Master Token & Architecture Lab
          </h1>
          <p class="text-fg-muted font-mono text-xs md:text-sm mt-1">
            Svelte 5 (Runes) · SvelteKit 2 · Tailwind CSS v4 · TypeScript 5+ Strict · W3C DTCG
            Engine
          </p>
        </div>
      </div>

      <!-- Live Interactive Mode Segmented Controls -->
      <div class="flex flex-wrap items-center gap-3 font-mono text-xs">
        <div
          class="bg-surface-elevated p-1 rounded border border-border-subtle flex items-center gap-1 shadow-sm"
        >
          <span class="px-2 text-fg-muted select-none">THEME:</span>
          <button
            type="button"
            class="px-2.5 py-1 rounded transition-colors {env.theme === 'paper'
              ? 'bg-accent-interactive text-[#24422a] font-bold'
              : 'text-fg-muted hover:text-fg-primary'}"
            onclick={() => env.setTheme('paper')}
          >
            Paper
          </button>
          <button
            type="button"
            class="px-2.5 py-1 rounded transition-colors {env.theme === 'industrial'
              ? 'bg-accent-interactive text-[#24422a] font-bold'
              : 'text-fg-muted hover:text-fg-primary'}"
            onclick={() => env.setTheme('industrial')}
          >
            Industrial
          </button>
        </div>

        <div
          class="bg-surface-elevated p-1 rounded border border-border-subtle flex items-center gap-1 shadow-sm"
        >
          <span class="px-2 text-fg-muted select-none">DENSITY:</span>
          <button
            type="button"
            class="px-2.5 py-1 rounded transition-colors {env.density === 'comfortable'
              ? 'bg-accent-interactive text-[#24422a] font-bold'
              : 'text-fg-muted hover:text-fg-primary'}"
            onclick={() => env.setDensity('comfortable')}
          >
            Comfortable
          </button>
          <button
            type="button"
            class="px-2.5 py-1 rounded transition-colors {env.density === 'compact'
              ? 'bg-accent-interactive text-[#24422a] font-bold'
              : 'text-fg-muted hover:text-fg-primary'}"
            onclick={() => env.setDensity('compact')}
          >
            Compact
          </button>
        </div>
      </div>
    </header>

    <!-- Calibration Trinity Mark & Visual Identity Showcase -->
    <section
      class="bg-surface-elevated border border-border-subtle rounded-lg p-6 space-y-6 shadow-sm"
    >
      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-4"
      >
        <div>
          <div class="flex items-center gap-2">
            <span class="inline-block w-2.5 h-2.5 rounded-full bg-accent-interactive"></span>
            <h2 class="text-sm font-mono uppercase tracking-wider text-fg-muted">
              Brand Asset &middot; The Interlocking Trinity Mark
            </h2>
          </div>
          <p class="text-xs text-fg-muted mt-1 font-mono">
            60° isometric parallel facets with flush chartreuse base and single 2.5px negative-space
            top channel
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button
            type="button"
            class="px-3 py-1 font-mono text-xs rounded border border-border-subtle transition-colors bg-surface-canvas text-fg-primary hover:border-accent-interactive"
            onclick={() => (previewVariant = previewVariant === 'lockup' ? 'mark' : 'lockup')}
          >
            Variant: [{previewVariant.toUpperCase()}]
          </button>

          <a
            href="/lab/logo"
            class="px-3 py-1 font-mono text-xs rounded bg-surface-canvas border border-border-subtle text-fg-primary hover:border-accent-interactive transition-colors"
          >
            Open Logo Lab &rarr;
          </a>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <!-- Interactive Mark Preview Column -->
        <div
          class="lg:col-span-5 p-6 bg-surface-canvas rounded-md border border-border-subtle flex flex-col items-center justify-center gap-6"
        >
          <div class="p-6 bg-surface-elevated rounded border border-border-subtle shadow-xs">
            <TrinidadLogo size={64} variant={previewVariant} />
          </div>

          <!-- Micro Scales Array -->
          <div class="flex items-center gap-5 font-mono text-[10px] text-fg-muted">
            <div class="flex flex-col items-center gap-1.5">
              <TrinidadLogo size={16} variant="mark" />
              <span>16px</span>
            </div>
            <div class="flex flex-col items-center gap-1.5">
              <TrinidadLogo size={24} variant="mark" />
              <span>24px</span>
            </div>
            <div class="flex flex-col items-center gap-1.5">
              <TrinidadLogo size={32} variant="mark" />
              <span class="text-accent-interactive font-bold">32px*</span>
            </div>
            <div class="flex flex-col items-center gap-1.5">
              <TrinidadLogo size={48} variant="mark" />
              <span>48px</span>
            </div>
            <div class="flex flex-col items-center gap-1.5">
              <TrinidadLogo size={64} variant="mark" />
              <span>64px</span>
            </div>
          </div>
        </div>

        <!-- Geometric Anatomy Column -->
        <div class="lg:col-span-7 space-y-3 font-mono text-xs">
          <div class="p-3 bg-surface-canvas rounded border border-border-subtle">
            <div class="text-fg-primary font-bold">Left Pillar (60° Parallelogram)</div>
            <p class="text-fg-muted text-[11px] mt-0.5">
              Outer-left edge and inner-right edge are strictly parallel (-60°). Points: 32,7 &rarr;
              37.2,16 &rarr; 16.41,52.03 &rarr; 6,52.03.
            </p>
          </div>
          <div class="p-3 bg-surface-canvas rounded border border-border-subtle">
            <div class="text-fg-muted font-bold">Right Pillar (Parallel Channel)</div>
            <p class="text-fg-muted text-[11px] mt-0.5">
              Separated from the left pillar at the top by a parallel -60° gap (2.5px). Points:
              38.64,18.5 &rarr; 58,52.03 &rarr; 47.59,52.03 &rarr; 33.44,27.5.
            </p>
          </div>
          <div class="p-3 bg-surface-canvas rounded border border-border-subtle">
            <div class="text-accent-interactive font-bold">Flush Chartreuse Base (Zero Gap)</div>
            <p class="text-fg-muted text-[11px] mt-0.5">
              Touches the left and right pillars with zero seam gap: points (21.61, 43.03) and
              (42.39, 43.03).
            </p>
          </div>
          <div
            class="p-3 bg-surface-canvas rounded border border-border-subtle flex items-center justify-between"
          >
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 bg-accent-interactive inline-block border border-border-subtle"
              ></span>
              <span class="text-fg-primary font-bold">FLUSH SEAM INTERLOCK:</span>
            </div>
            <span class="text-fg-muted text-[11px]"
              >Exact vertex sharing eliminates sub-pixel raster fringing</span
            >
          </div>
        </div>
      </div>
    </section>

    <!-- Phase 1 Architecture Verification Summary Card -->
    <section
      class="bg-surface-elevated border border-border-subtle rounded-lg p-6 space-y-4 shadow-sm"
    >
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-mono uppercase tracking-wider text-fg-muted">
          Repository Architecture Verification
        </h2>
        <span
          class="px-2 py-0.5 rounded text-xs font-mono font-bold bg-status-nominal/20 text-status-nominal border border-status-nominal/30"
        >
          PHASE 1 COMPLETE (GATE PASSED)
        </span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
        <div class="p-3 bg-surface-canvas rounded border border-border-subtle">
          <div class="text-fg-muted">svelte-check:</div>
          <div class="text-status-nominal font-bold mt-1">0 errors / 0 warnings</div>
        </div>
        <div class="p-3 bg-surface-canvas rounded border border-border-subtle">
          <div class="text-fg-muted">Compiler Mode:</div>
          <div class="text-fg-primary font-bold mt-1">Strict Svelte 5 Runes</div>
        </div>
        <div class="p-3 bg-surface-canvas rounded border border-border-subtle">
          <div class="text-fg-muted">Git Hook Gate:</div>
          <div class="text-fg-primary font-bold mt-1">Lefthook (typecheck + format)</div>
        </div>
        <div class="p-3 bg-surface-canvas rounded border border-border-subtle">
          <div class="text-fg-muted">Token Pipeline:</div>
          <div class="text-fg-primary font-bold mt-1">W3C DTCG &rarr; CSS + TS</div>
        </div>
      </div>
    </section>

    <!-- Semantic Tokens Showcase (Theme Responsive) -->
    <section class="space-y-4">
      <div class="flex items-center justify-between border-b border-border-subtle pb-2">
        <h2 class="text-lg font-bold">Semantic Design Tokens</h2>
        <span class="text-xs font-mono text-fg-muted"
          >Active Theme: [{env.theme.toUpperCase()}]</span
        >
      </div>
      <p class="text-xs text-fg-muted">
        Semantic tokens switch dynamically between <strong>Paper</strong> (warm editorial canvas)
        and <strong>Industrial</strong> (dark operator console) modes.
      </p>

      <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
        {#each semanticTokens as item}
          <div
            class="p-4 rounded border border-border-subtle flex flex-col justify-between h-28 {item.class}"
          >
            <span class="text-xs font-mono opacity-80">{item.key}</span>
            <span class="text-xs font-bold">{item.label}</span>
          </div>
        {/each}
      </div>
    </section>

    <!-- Primitive Scales -->
    <section class="space-y-4">
      <div class="flex items-center justify-between border-b border-border-subtle pb-2">
        <h2 class="text-lg font-bold">Raw Color Primitives</h2>
        <span class="text-xs font-mono text-fg-muted">{primitiveColors.length} scales defined</span>
      </div>
      <div
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 font-mono text-xs"
      >
        {#each primitiveColors as [name, hex]}
          <div class="bg-surface-elevated border border-border-subtle rounded p-2.5 space-y-2">
            <div
              class="w-full h-12 rounded border border-border-subtle shadow-inner"
              style="background-color: {hex};"
            ></div>
            <div class="truncate font-semibold">{name}</div>
            <div class="text-fg-muted opacity-75">{hex}</div>
          </div>
        {/each}
      </div>
    </section>

    <!-- Density Controls Showcase -->
    <section class="space-y-4">
      <div class="flex items-center justify-between border-b border-border-subtle pb-2">
        <h2 class="text-lg font-bold">Density System</h2>
        <span class="text-xs font-mono text-fg-muted"
          >Active Density: [{env.density.toUpperCase()}]</span
        >
      </div>
      <div class="bg-surface-elevated border border-border-subtle rounded-lg p-6 space-y-4">
        <p class="text-xs text-fg-muted">
          Controls dynamically adapt their dimensions via <code>--control-height</code>,
          <code>--control-px</code>, <code>--control-py</code>, and <code>--font-size-ui</code>.
        </p>

        <div class="flex flex-wrap items-center gap-4">
          <div
            class="inline-flex items-center justify-center px-[var(--control-px)] py-[var(--control-py)] h-[var(--control-height)] text-[var(--font-size-ui)] font-mono bg-surface-canvas border border-border-subtle rounded"
          >
            Sample Control ({env.density})
          </div>
          <div
            class="inline-flex items-center justify-center px-[var(--control-px)] py-[var(--control-py)] h-[var(--control-height)] text-[var(--font-size-ui)] font-mono bg-accent-interactive text-[#24422a] font-bold rounded"
          >
            Interactive Button
          </div>
          <div
            class="inline-flex items-center justify-center px-[var(--control-px)] py-[var(--control-py)] h-[var(--control-height)] text-[var(--font-size-ui)] font-mono bg-surface-muted text-fg-muted border border-border-subtle rounded"
          >
            Disabled Metric State
          </div>
        </div>
      </div>
    </section>
  </div>
</div>
