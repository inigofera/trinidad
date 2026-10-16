<script lang="ts">
  import { tokens } from '$lib/tokens/tokens.js';

  let theme = $state<'paper' | 'industrial'>('paper');
  let density = $state<'comfortable' | 'compact'>('comfortable');

  $effect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.setAttribute('data-density', density);
    }
  });

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
  <title>Trinidad — Master System Overview & Token Matrix</title>
</svelte:head>

<div
  class="min-h-screen bg-surface-canvas text-fg-primary p-6 md:p-12 font-sans transition-colors duration-200"
>
  <div class="max-w-6xl mx-auto space-y-10">
    <!-- Header with Live System Telemetry -->
    <header
      class="border-b border-border-subtle pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6"
    >
      <div>
        <div class="flex items-center gap-3">
          <span class="inline-block w-3 h-3 rounded-full bg-accent-interactive animate-pulse"
          ></span>
          <span class="font-mono text-xs text-fg-muted uppercase tracking-wider"
            >// SYSTEM TARGET: TRINIDAD UI</span
          >
        </div>
        <h1 class="text-3xl md:text-4xl font-bold tracking-tight mt-1">
          Master Token & Architecture Lab
        </h1>
        <p class="text-fg-muted font-mono text-xs md:text-sm mt-1">
          Svelte 5 (Runes) · SvelteKit 2 · Tailwind CSS v4 · TypeScript 5+ Strict · W3C DTCG Engine
        </p>
      </div>

      <!-- Live Interactive Mode Segmented Controls -->
      <div class="flex flex-wrap items-center gap-3 font-mono text-xs">
        <div
          class="bg-surface-elevated p-1 rounded border border-border-subtle flex items-center gap-1 shadow-sm"
        >
          <span class="px-2 text-fg-muted select-none">THEME:</span>
          <button
            type="button"
            class="px-2.5 py-1 rounded transition-colors {theme === 'paper'
              ? 'bg-accent-interactive text-[#24422a] font-bold'
              : 'text-fg-muted hover:text-fg-primary'}"
            onclick={() => (theme = 'paper')}
          >
            Paper
          </button>
          <button
            type="button"
            class="px-2.5 py-1 rounded transition-colors {theme === 'industrial'
              ? 'bg-accent-interactive text-[#24422a] font-bold'
              : 'text-fg-muted hover:text-fg-primary'}"
            onclick={() => (theme = 'industrial')}
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
            class="px-2.5 py-1 rounded transition-colors {density === 'comfortable'
              ? 'bg-accent-interactive text-[#24422a] font-bold'
              : 'text-fg-muted hover:text-fg-primary'}"
            onclick={() => (density = 'comfortable')}
          >
            Comfortable
          </button>
          <button
            type="button"
            class="px-2.5 py-1 rounded transition-colors {density === 'compact'
              ? 'bg-accent-interactive text-[#24422a] font-bold'
              : 'text-fg-muted hover:text-fg-primary'}"
            onclick={() => (density = 'compact')}
          >
            Compact
          </button>
        </div>
      </div>
    </header>

    <!-- Phase 1 Architecture Verification Summary Card -->
    <section
      class="bg-surface-elevated border border-border-subtle rounded-lg p-6 space-y-4 shadow-sm"
    >
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-mono uppercase tracking-wider text-fg-muted">
          // REPOSITORY ARCHITECTURE VERIFICATION
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
          <div class="text-fg-primary font-bold mt-1">W3C DTCG $\to$ CSS + TS</div>
        </div>
      </div>
    </section>

    <!-- Tier 2: Live Semantic Tokens Showcase (Theme Responsive) -->
    <section class="space-y-4">
      <div class="flex items-center justify-between border-b border-border-subtle pb-2">
        <h2 class="text-lg font-bold">Tier 2: Semantic Design Tokens</h2>
        <span class="text-xs font-mono text-fg-muted">Active Theme: [{theme.toUpperCase()}]</span>
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

    <!-- Tier 1: Primitive Scales -->
    <section class="space-y-4">
      <div class="flex items-center justify-between border-b border-border-subtle pb-2">
        <h2 class="text-lg font-bold">Tier 1: Raw Color Primitives</h2>
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

    <!-- Tier 3: Density Controls Showcase -->
    <section class="space-y-4">
      <div class="flex items-center justify-between border-b border-border-subtle pb-2">
        <h2 class="text-lg font-bold">Tier 3: Density System</h2>
        <span class="text-xs font-mono text-fg-muted"
          >Active Density: [{density.toUpperCase()}]</span
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
            // Sample Control ({density})
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
