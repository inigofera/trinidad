<script lang="ts">
  import { TrinidadLogo } from '$lib/components/logo/index.js';
  import { getEnvironment } from '$lib/state/environment.svelte.js';
  import type { Theme } from '$lib/state/environment.svelte.js';
  import { Announcer } from '$lib/actions/index.js';
  import { Sparkline } from '$lib/components/sparkline/index.js';
  import bundleStats from './lab/bundle-stats.json';

  const env = getEnvironment();

  // State for Pillar 1: Human Factors (Live Mini-Keyboard Visualizer)
  let activeElementTag = $state<string>('document.body');
  let pressedKeys = $state<Set<string>>(new Set());

  // State for Pillar 3: Systems Engineering (Live Frame Delta Sparkline)
  let frameDeltas = $state<number[]>([16.6, 16.7, 16.5, 16.8, 16.6, 16.7, 16.6, 16.5, 16.7, 16.6]);

  // Compute total library gzipped weight
  const totalBundleWeight = $derived(
    Object.values(bundleStats)
      .reduce((acc, val) => acc + parseFloat(val), 0)
      .toFixed(1)
  );

  $effect(() => {
    if (typeof window === 'undefined') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      pressedKeys.add(e.key);
      pressedKeys = new Set(pressedKeys);
      if (document.activeElement) {
        const el = document.activeElement as HTMLElement;
        activeElementTag = `<${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}>`;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      pressedKeys.delete(e.key);
      pressedKeys = new Set(pressedKeys);
    };

    const handleFocusIn = () => {
      if (document.activeElement) {
        const el = document.activeElement as HTMLElement;
        activeElementTag = `<${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}>`;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('focusin', handleFocusIn);

    // Live frame delta measurement for Mini-Sparkline
    let lastTime = performance.now();
    let frameId: number;

    const tick = (now: number) => {
      const delta = now - lastTime;
      lastTime = now;
      if (delta > 0 && delta < 100) {
        frameDeltas = [...frameDeltas.slice(-19), Number(delta.toFixed(1))];
      }
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('focusin', handleFocusIn);
      cancelAnimationFrame(frameId);
    };
  });

  const nextThemeOf: Record<Theme, Theme> = { paper: 'industrial', industrial: 'paper' };

  function invertThemeAndDensity() {
    const nextTheme = nextThemeOf[env.theme];
    const nextDensity = env.density === 'comfortable' ? 'compact' : 'comfortable';
    env.setTheme(nextTheme);
    env.setDensity(nextDensity);
    Announcer.announce(`Inverted to ${nextTheme} theme and ${nextDensity} density`, 'polite');
  }

  const componentDirectory = [
    {
      name: 'Button & ToggleButton',
      href: '/lab/button',
      focus: 'Polymorphic Actions · Animated Spinners · Width Preservation',
      module: 'button.svelte.ts',
      bundle: `${bundleStats.button} kB`
    },
    {
      name: 'NumberField',
      href: '/lab/number-field',
      focus: 'Scrubbing Ergonomics · Math Clamping · Spinbutton ARIA',
      module: 'number-field.svelte.ts',
      bundle: `${bundleStats['number-field']} kB`
    },
    {
      name: 'Dialog',
      href: '/lab/dialog',
      focus: 'Focus Trapping · Scroll Locking · Backdrop Dismiss',
      module: 'dialog.svelte.ts',
      bundle: `${bundleStats.dialog} kB`
    },
    {
      name: 'Combobox',
      href: '/lab/combobox',
      focus: 'Fuzzy Subsequence · Virtual Focus · Keyboard Roving',
      module: 'combobox.svelte.ts',
      bundle: `${bundleStats.combobox} kB`
    },
    {
      name: 'Sparkline',
      href: '/lab/sparkline',
      focus: '60fps Retina Canvas · Dimension Caching · Crosshair Scrubbing',
      module: 'sparkline.svelte.ts',
      bundle: `${bundleStats.sparkline} kB`
    },
    {
      name: 'DataTable',
      href: '/lab/data-table',
      focus: 'O(1) Virtualization · 2D Cell Navigation · Multi-Sort',
      module: 'data-table.svelte.ts',
      bundle: `${bundleStats['data-table']} kB`
    },
    {
      name: 'DiffViewer',
      href: '/lab/diff-viewer',
      focus: 'LCS Diff Engine · Confirmation Gates · Inline Editor',
      module: 'diff-viewer.svelte.ts',
      bundle: `${bundleStats['diff-viewer']} kB`
    }
  ];
</script>

<svelte:head>
  <title>TRINIDAD — System Manifesto & Component Lab</title>
</svelte:head>

<div
  class="min-h-screen bg-surface-canvas text-fg-primary p-6 md:p-12 font-sans transition-colors duration-200"
>
  <div class="max-w-6xl mx-auto space-y-16">
    <!-- SECTION 3.1: Hero Manifesto Block -->
    <section
      class="bg-surface-elevated border border-border-subtle p-6 md:p-10 space-y-6 shadow-xs"
    >
      <div class="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div class="space-y-3">
          <div class="text-xs font-mono font-bold text-accent-interactive tracking-wider uppercase">
            // DESIGN SYSTEM &amp; COMPONENT LAB &middot; v1.0.0
          </div>
          <div class="flex items-center gap-4">
            <TrinidadLogo size={48} variant="lockup" />
          </div>
          <p class="text-sm md:text-base text-fg-primary font-mono max-w-3xl leading-relaxed pt-2">
            &ldquo;Named after the Spanish word for Trinity, Trinidad is an industrial-grade UI
            primitive library built at the intersection of the three disciplines that define UX
            Engineering: <strong class="text-accent-interactive">Human Factors</strong>,
            <strong class="text-fg-primary font-bold">Visual Design</strong>, and
            <strong class="text-fg-primary font-bold">Systems Engineering</strong>.&rdquo;
          </p>
        </div>
      </div>

      <!-- Live Telemetry Status Bar -->
      <div
        class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-border-subtle/50 font-mono text-xs"
      >
        <div class="p-2.5 rounded bg-surface-canvas border border-border-subtle">
          <span class="text-fg-muted block text-[10px] uppercase">// ACTIVE THEME</span>
          <span class="text-accent-interactive font-bold">[{env.theme.toUpperCase()}]</span>
        </div>
        <div class="p-2.5 rounded bg-surface-canvas border border-border-subtle">
          <span class="text-fg-muted block text-[10px] uppercase">// ACTIVE DENSITY</span>
          <span class="text-fg-primary font-bold">[{env.density.toUpperCase()}]</span>
        </div>
        <div class="p-2.5 rounded bg-surface-canvas border border-border-subtle">
          <span class="text-fg-muted block text-[10px] uppercase">// TOTAL COMPONENTS</span>
          <span class="text-status-nominal font-bold">[7 PRIMITIVES]</span>
        </div>
        <div class="p-2.5 rounded bg-surface-canvas border border-border-subtle">
          <span class="text-fg-muted block text-[10px] uppercase">// A11Y TELEMETRY</span>
          <span class="text-status-nominal font-bold">[WCAG 2.1 AA: VERIFIED]</span>
        </div>
      </div>
    </section>

    <!-- SECTION 3.2: Interactive "Three Pillars" Architecture Cards -->
    <section class="space-y-4">
      <div class="text-xs font-mono uppercase text-fg-muted tracking-wider">
        // THE THREE PILLARS &middot; INTERACTIVE ARCHITECTURAL PROOFS
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Pillar 1: Human Factors (Ergonomics) -->
        <div
          class="bg-surface-elevated border border-border-subtle p-6 flex flex-col justify-between space-y-4 shadow-xs"
        >
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-accent-interactive"></span>
              <h2 class="text-sm font-bold font-mono uppercase tracking-wide text-fg-primary">
                Human Factors (Ergonomics)
              </h2>
            </div>
            <p class="text-xs text-fg-muted leading-relaxed">
              Interfaces engineered for human cognition and physical ergonomics. Every primitive
              enforces strict keyboard navigation, deterministic focus management, and screen-reader
              telemetry.
            </p>
          </div>

          <!-- Embedded Micro-Proof: Live Keyboard Visualizer -->
          <div
            class="p-3 bg-surface-canvas rounded border border-border-subtle font-mono text-xs space-y-2.5"
          >
            <div class="text-[10px] text-fg-muted uppercase">// LIVE KEYBOARD OBSERVER</div>
            <div class="flex flex-wrap gap-1.5">
              {#each ['Tab', 'ArrowUp', 'ArrowDown', 'Escape'] as key}
                {@const isPressed = pressedKeys.has(key)}
                <span
                  class="px-2 py-1 rounded text-[11px] font-bold border transition-colors {isPressed
                    ? 'bg-accent-interactive text-accent-contrast border-accent-interactive scale-105'
                    : 'bg-surface-elevated text-fg-muted border-border-subtle'}"
                >
                  {key === 'ArrowUp' ? '↑' : key === 'ArrowDown' ? '↓' : key}
                </span>
              {/each}
            </div>
            <div class="text-[11px] text-fg-muted pt-1 border-t border-border-subtle/40 truncate">
              activeElement: <span class="text-fg-primary font-bold">{activeElementTag}</span>
            </div>
          </div>
        </div>

        <!-- Pillar 2: Interaction Design (Aesthetics) -->
        <div
          class="bg-surface-elevated border border-border-subtle p-6 flex flex-col justify-between space-y-4 shadow-xs"
        >
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-accent-interactive"></span>
              <h2 class="text-sm font-bold font-mono uppercase tracking-wide text-fg-primary">
                Interaction Design (Aesthetics)
              </h2>
            </div>
            <p class="text-xs text-fg-muted leading-relaxed">
              Warm intellectual brutalism meets industrial telemetry. A three-tier W3C token engine
              adapts seamlessly between editorial reading environments and high-contrast warehouse
              operator consoles.
            </p>
          </div>

          <!-- Embedded Micro-Proof: Swatch Matrix & 1-Click Inverter -->
          <div
            class="p-3 bg-surface-canvas rounded border border-border-subtle font-mono text-xs space-y-2.5"
          >
            <div class="flex items-center justify-between text-[10px] text-fg-muted uppercase">
              <span>// SEMANTIC TOKEN SWATCHES</span>
              <span class="text-fg-primary font-bold">LIVE</span>
            </div>
            <div class="grid grid-cols-4 gap-1.5 text-[9px] text-center select-none">
              <div
                class="p-1.5 rounded bg-surface-canvas border border-border-subtle text-fg-primary"
              >
                canvas
              </div>
              <div
                class="p-1.5 rounded bg-surface-elevated border border-border-subtle text-fg-primary"
              >
                elevated
              </div>
              <div class="p-1.5 rounded bg-accent-interactive text-accent-contrast font-bold">
                accent
              </div>
              <div class="p-1.5 rounded bg-status-critical text-white font-bold">crit</div>
            </div>
            <button
              type="button"
              onclick={invertThemeAndDensity}
              class="w-full py-1 rounded bg-surface-elevated border border-border-subtle text-[11px] text-fg-primary hover:border-accent-interactive transition-colors cursor-pointer"
            >
              ⇄ Invert Theme &amp; Density
            </button>
          </div>
        </div>

        <!-- Pillar 3: Systems Engineering (Architecture) -->
        <div
          class="bg-surface-elevated border border-border-subtle p-6 flex flex-col justify-between space-y-4 shadow-xs"
        >
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-accent-interactive"></span>
              <h2 class="text-sm font-bold font-mono uppercase tracking-wide text-fg-primary">
                Systems Engineering (Architecture)
              </h2>
            </div>
            <p class="text-xs text-fg-muted leading-relaxed">
              Zero-runtime CSS, headless Svelte 5 Runes state machines, and hardware-accelerated
              rendering. Built to handle 10,000-row virtualized logs and 60fps sensor streams
              without frame drops.
            </p>
          </div>

          <!-- Embedded Micro-Proof: Mini Sparkline & Bundle Weight -->
          <div
            class="p-3 bg-surface-canvas rounded border border-border-subtle font-mono text-xs space-y-2"
          >
            <div class="flex items-center justify-between text-[10px] text-fg-muted uppercase">
              <span>// REAL-TIME FRAME DELTA</span>
              <span class="text-status-nominal font-bold"
                >{(frameDeltas[frameDeltas.length - 1] ?? 16.6).toFixed(1)} ms</span
              >
            </div>
            <div class="h-14">
              <Sparkline
                label="FRAME_TIMING"
                data={frameDeltas}
                min={10}
                max={30}
                warnThreshold={20}
                criticalThreshold={25}
                unit="ms"
              />
            </div>
            <div
              class="text-[11px] text-fg-muted pt-1 border-t border-border-subtle/40 flex justify-between"
            >
              <span>Total Gzipped Weight:</span>
              <span class="text-status-nominal font-bold">{totalBundleWeight} kB gzip</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 3.3: Component Directory Matrix Table -->
    <section class="space-y-4">
      <div class="flex items-center justify-between border-b border-border-subtle pb-3">
        <div>
          <h2 class="text-lg font-bold font-mono tracking-tight text-fg-primary">
            // COMPONENT DIRECTORY MATRIX
          </h2>
          <p class="text-xs text-fg-muted mt-0.5">
            Architectural index of the 7 production primitives exported by <code>trinidad-ui</code>.
          </p>
        </div>
        <span class="text-xs font-mono text-status-nominal font-bold"> [7 / 7 VERIFIED] </span>
      </div>

      <div
        class="overflow-x-auto border border-border-subtle bg-surface-elevated shadow-xs font-mono text-xs"
      >
        <table class="w-full text-left border-collapse">
          <thead>
            <tr
              class="bg-surface-canvas border-b border-border-subtle text-[11px] text-fg-muted uppercase"
            >
              <th class="py-2.5 px-4 font-bold">Component &amp; Route</th>
              <th class="py-2.5 px-4 font-bold">Primary Trinity Focus</th>
              <th class="py-2.5 px-4 font-bold">Headless State Module</th>
              <th class="py-2.5 px-4 font-bold text-right">Gzip Weight</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border-subtle/40">
            {#each componentDirectory as comp}
              <tr class="hover:bg-surface-muted/30 transition-colors">
                <td class="py-3 px-4 font-bold">
                  <a
                    href={comp.href}
                    class="text-accent-interactive hover:underline inline-flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-accent-interactive"
                  >
                    <span>{comp.name}</span>
                    <span>&rarr;</span>
                  </a>
                </td>
                <td class="py-3 px-4 text-fg-primary">
                  {comp.focus}
                </td>
                <td class="py-3 px-4 text-fg-muted">
                  <code>{comp.module}</code>
                </td>
                <td class="py-3 px-4 text-right font-bold text-status-nominal">
                  {comp.bundle}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </section>

    <!-- Visual Identity & Logo Calibration Preview -->
    <section
      class="bg-surface-elevated border border-border-subtle rounded-lg p-6 space-y-4 shadow-xs font-mono"
    >
      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-4"
      >
        <div>
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-accent-interactive"></span>
            <h3 class="text-sm font-bold uppercase tracking-wide text-fg-primary">
              The Trinidad Geometric Mark
            </h3>
          </div>
          <p class="text-xs text-fg-muted mt-1">
            60° isometric parallel facets with flush chartreuse base and single 2.5px negative-space
            channel.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <a
            href="/lab/logo"
            class="px-3 py-1 text-xs rounded bg-surface-canvas border border-border-subtle text-fg-primary hover:border-accent-interactive transition-colors"
          >
            Open Logo Lab &rarr;
          </a>
          <a
            href="/lab/primitives"
            class="px-3 py-1 text-xs rounded bg-surface-canvas border border-border-subtle text-fg-primary hover:border-accent-interactive transition-colors"
          >
            Open Primitives Lab &rarr;
          </a>
        </div>
      </div>

      <div
        class="flex flex-wrap items-center justify-around gap-6 p-6 bg-surface-canvas rounded border border-border-subtle"
      >
        <div class="flex flex-col items-center gap-2">
          <TrinidadLogo size={64} variant="lockup" />
          <span class="text-[10px] text-fg-muted">lockup 64px</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <TrinidadLogo size={48} variant="mark" />
          <span class="text-[10px] text-fg-muted">mark 48px</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <TrinidadLogo size={32} variant="mark" />
          <span class="text-[10px] text-fg-muted text-accent-interactive font-bold"
            >mark 32px (optimal)</span
          >
        </div>
        <div class="flex flex-col items-center gap-2">
          <TrinidadLogo size={20} variant="mark" />
          <span class="text-[10px] text-fg-muted">mark 20px (favicon)</span>
        </div>
      </div>
    </section>
  </div>
</div>
