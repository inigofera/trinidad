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

  // Total library gzipped weight (single source of truth: bundle ledger)
  const totalBundleWeight = $derived(parseFloat(bundleStats.totalKb).toFixed(1));

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
      focus: 'Polymorphic Actions · Animated Spinners · Width Preservation'
    },
    {
      name: 'NumberField',
      href: '/lab/number-field',
      focus: 'Scrubbing Ergonomics · Math Clamping · Spinbutton ARIA'
    },
    {
      name: 'Dialog',
      href: '/lab/dialog',
      focus: 'Focus Trapping · Scroll Locking · Backdrop Dismiss'
    },
    {
      name: 'Combobox',
      href: '/lab/combobox',
      focus: 'Fuzzy Subsequence · Virtual Focus · Keyboard Roving'
    },
    {
      name: 'Sparkline',
      href: '/lab/sparkline',
      focus: '60fps Retina Canvas · Dimension Caching · Crosshair Scrubbing'
    },
    {
      name: 'DataTable',
      href: '/lab/data-table',
      focus: 'O(1) Virtualization · 2D Cell Navigation · Multi-Sort'
    },
    {
      name: 'DiffViewer',
      href: '/lab/diff-viewer',
      focus: 'LCS Diff Engine · Confirmation Gates · Inline Editor'
    }
  ];
</script>

<svelte:head>
  <title>Trinidad Design System &amp; Component Lab</title>
</svelte:head>

<div
  class="min-h-screen bg-surface-canvas text-fg-primary p-6 md:p-12 font-sans transition-colors duration-200"
>
  <div class="max-w-6xl mx-auto space-y-16">
    <!-- Hero -->
    <section class="space-y-4 max-w-3xl">
      <TrinidadLogo size={48} variant="lockup" />

      <p class="text-sm md:text-base text-fg-primary font-mono max-w-3xl leading-relaxed">
        Trinidad is an industrial-grade UI primitive library built at the intersection of the three
        disciplines that define UX engineering: human factors, visual design, and systems
        engineering.
      </p>
    </section>

    <!-- Interactive "Three Pillars" -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-12 items-start">
      <!-- Pillar 1: Human Factors (Ergonomics) -->
      <div class="space-y-4">
        <h2 class="text-lg md:text-xl font-bold tracking-tight text-fg-primary">
          Human Factors (Ergonomics)
        </h2>
        <p class="text-sm text-fg-muted leading-relaxed">
          Interfaces engineered for human cognition and physical ergonomics, with strict keyboard
          navigation and deterministic focus management.
        </p>

        <!-- Embedded Micro-Proof: Live Keyboard Observer -->
        <div class="font-mono text-xs space-y-2.5">
          <div class="text-[10px] text-fg-muted">Live keyboard observer</div>
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
      <div class="space-y-4">
        <h2 class="text-lg md:text-xl font-bold tracking-tight text-fg-primary">
          Interaction Design (Aesthetics)
        </h2>
        <p class="text-sm text-fg-muted leading-relaxed">
          A three-tier W3C token engine that adapts between editorial reading environments and
          high-contrast operator consoles.
        </p>

        <!-- Embedded Micro-Proof: 1-Click Inverter -->
        <div>
          <button
            type="button"
            onclick={invertThemeAndDensity}
            class="w-full py-1 rounded bg-surface-elevated border border-border-subtle text-[11px] text-fg-primary hover:border-accent-interactive transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-interactive"
          >
            ⇄ Invert Theme &amp; Density
          </button>
        </div>
      </div>

      <!-- Pillar 3: Systems Engineering (Architecture) -->
      <div class="space-y-4">
        <h2 class="text-lg md:text-xl font-bold tracking-tight text-fg-primary">
          Systems Engineering (Architecture)
        </h2>
        <p class="text-sm text-fg-muted leading-relaxed">
          Zero-runtime CSS and headless Svelte 5 Runes state machines, built for 10,000-row datasets
          and 60fps sensor streams.
        </p>

        <!-- Embedded Micro-Proof: Frame-Delta Sparkline -->
        <div class="font-mono text-xs space-y-2">
          <div class="flex items-center justify-between text-[10px] text-fg-muted">
            <span>Real-time frame delta</span>
            <span class="text-status-nominal font-bold"
              >{(frameDeltas[frameDeltas.length - 1] ?? 16.6).toFixed(1)} ms</span
            >
          </div>
          <div class="h-14">
            <Sparkline
              label="Frame timing"
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

    <!-- Component Directory -->
    <section class="space-y-4">
      <h2 class="text-lg font-bold tracking-tight text-fg-primary">Component directory</h2>

      <div class="overflow-x-auto font-mono text-xs">
        <table class="w-full text-left border-collapse border border-border-subtle">
          <thead>
            <tr class="border-b border-border-subtle text-[11px] text-fg-muted">
              <th scope="col" class="py-2.5 px-4 font-bold">Component &amp; Route</th>
              <th scope="col" class="py-2.5 px-4 font-bold">Primary Trinity Focus</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border-subtle/40">
            {#each componentDirectory as comp}
              <tr class="hover:bg-surface-muted/30 transition-colors">
                <td class="py-3 px-4 font-bold">
                  <a
                    href={comp.href}
                    class="text-accent-interactive hover:underline focus-visible:outline-2 focus-visible:outline-accent-interactive"
                  >
                    {comp.name}
                  </a>
                </td>
                <td class="py-3 px-4 text-fg-primary">{comp.focus}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </section>

    <!-- Visual Identity & Logo Calibration Preview -->
    <section class="space-y-5">
      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-4"
      >
        <h2 class="text-lg md:text-xl font-bold tracking-tight text-fg-primary">
          The Trinidad Geometric Mark
        </h2>

        <div class="flex items-center gap-3">
          <a
            href="/lab/logo"
            class="px-3 py-1 text-xs rounded bg-surface-canvas border border-border-subtle text-fg-primary hover:border-accent-interactive transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-interactive"
          >
            Open Logo Lab
          </a>
          <a
            href="/lab/primitives"
            class="px-3 py-1 text-xs rounded bg-surface-canvas border border-border-subtle text-fg-primary hover:border-accent-interactive transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-interactive"
          >
            Open Primitives Lab
          </a>
        </div>
      </div>

      <div class="flex flex-wrap items-center justify-around gap-x-10 gap-y-4">
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
          <span class="text-[10px] text-fg-muted">mark 32px</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <TrinidadLogo size={20} variant="mark" />
          <span class="text-[10px] text-fg-muted">mark 20px (favicon)</span>
        </div>
      </div>
    </section>
  </div>
</div>
