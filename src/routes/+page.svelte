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

  interface ComponentEntry {
    name: string;
    href: string;
    category: 'Case Study' | 'Structure' | 'Engineering' | 'Media' | 'Editorial' | 'Foundations';
    focus: string;
  }

  const componentDirectory: ComponentEntry[] = [
    // Case Study Flagship
    {
      name: 'Master Case Study Template',
      href: '/case-study/trinidad-hri',
      category: 'Case Study',
      focus: 'End-to-End Showcase · Sticky TOC · Live Sandboxes · Form Dispatches'
    },
    // Portfolio Structure & Discovery
    {
      name: 'ProjectCard & FilterBar',
      href: '/lab/showcase',
      category: 'Structure',
      focus: 'Teaser Cards · Roving Tabindex Filter Pills · URL Sync · Milestones'
    },
    {
      name: 'SiteNav & SiteFooter',
      href: '/lab/showcase',
      category: 'Structure',
      focus: 'Portfolio Chrome · Fast Theme & Density Inverters · Mobile Drawer'
    },
    {
      name: 'ExperienceItem',
      href: '/lab/showcase',
      category: 'Structure',
      focus: 'Career Milestones · Active Role Indicators · Quantifiable Bullets'
    },
    // UX Engineering & Interactive Sandboxes
    {
      name: 'CodeBlock with Runes Syntax',
      href: '/lab/engineering',
      category: 'Engineering',
      focus: 'Svelte 5 Runes Highlighting · Range Highlighting · Permalinks'
    },
    {
      name: 'InteractiveSandbox',
      href: '/lab/engineering',
      category: 'Engineering',
      focus: 'Embeddable Mini-Workbench · Scoped ThemeScope · Density Toggles'
    },
    {
      name: 'BenchmarkBadge, Tooltip & Kbd',
      href: '/lab/engineering',
      category: 'Engineering',
      focus: 'Audit Badges (FPS/Bundle/A11y) · WAI-ARIA Tooltips · Tactile Keys'
    },
    // Visual Media & Artifact Presentation
    {
      name: 'ImageCompare Slider',
      href: '/lab/media',
      category: 'Media',
      focus: 'Before / After Scrubbing · Keyboard Slider ARIA · Touch Gestures'
    },
    {
      name: 'DeviceFrame Enclosures',
      href: '/lab/media',
      category: 'Media',
      focus: 'macOS Browser Chrome · Mobile Chassis · Industrial Terminal Bezel'
    },
    {
      name: 'MediaFigure, Lightbox & Carousel',
      href: '/lab/media',
      category: 'Media',
      focus: 'Native <dialog> Lightbox · Slide Progressions · Counter Badges'
    },
    // Editorial & Narrative
    {
      name: 'Heading, Prose & Callout',
      href: '/lab/editorial',
      category: 'Editorial',
      focus: 'Display Typography (4xl-6xl) · Permalinks · 5 Semantic Admonitions'
    },
    {
      name: 'TableOfContents & ReadingProgress',
      href: '/lab/editorial',
      category: 'Editorial',
      focus: 'Scrollspy Navigation · Pinned Zero-Thrash Reading Indicator'
    },
    {
      name: 'StatCard, StatGrid & Timeline',
      href: '/lab/editorial',
      category: 'Editorial',
      focus: 'Quantitative Impact Cards · Delta Badges · Process Steppers'
    },
    // 7 Foundation Roster
    {
      name: 'Button & ToggleButton',
      href: '/lab/button',
      category: 'Foundations',
      focus: 'Polymorphic Actions · Animated Spinners · Width Preservation'
    },
    {
      name: 'NumberField',
      href: '/lab/number-field',
      category: 'Foundations',
      focus: 'Scrubbing Ergonomics · Math Clamping · Spinbutton ARIA'
    },
    {
      name: 'Dialog',
      href: '/lab/dialog',
      category: 'Foundations',
      focus: 'Focus Trapping · Scroll Locking · Backdrop Dismiss'
    },
    {
      name: 'Combobox',
      href: '/lab/combobox',
      category: 'Foundations',
      focus: 'Fuzzy Subsequence · Virtual Focus · Keyboard Roving'
    },
    {
      name: 'Sparkline',
      href: '/lab/sparkline',
      category: 'Foundations',
      focus: '60fps Retina Canvas · Dimension Caching · Crosshair Scrubbing'
    },
    {
      name: 'DataTable',
      href: '/lab/data-table',
      category: 'Foundations',
      focus: 'O(1) Virtualization · 2D Cell Navigation · Multi-Sort'
    },
    {
      name: 'DiffViewer',
      href: '/lab/diff-viewer',
      category: 'Foundations',
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

    <!-- Portfolio Readiness Showcase -->
    <section class="space-y-6 pt-4 border-t border-border-subtle">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span class="text-xs font-mono text-fg-muted uppercase tracking-wider">
            [Portfolio Toolset // All 5 Tiers Operational]
          </span>
          <h2 class="text-xl md:text-2xl font-bold tracking-tight text-fg-primary pt-1">
            Portfolio &amp; Case Study Showcase
          </h2>
        </div>

        <a
          href="/case-study/trinidad-hri"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-control)] border border-border-subtle bg-surface-elevated text-xs font-mono font-bold text-fg-primary hover:border-accent-interactive transition-colors focus-visible:outline-2 focus-visible:outline-accent-interactive"
        >
          <span>Open Master Case Study</span>
          <span aria-hidden="true">↗</span>
        </a>
      </div>

      <!-- Workbench Launch Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
        <a
          href="/lab/editorial"
          class="group p-4 rounded-[var(--radius-card)] border border-border-subtle bg-surface-canvas hover:border-accent-interactive hover:shadow-subtle transition-all duration-150 flex flex-col justify-between focus-visible:outline-2 focus-visible:outline-accent-interactive"
        >
          <div class="space-y-1">
            <div class="text-[10px] text-fg-muted uppercase tracking-wider">[Tier 1]</div>
            <div
              class="font-bold text-fg-primary group-hover:text-fg-primary text-sm flex items-center justify-between"
            >
              <span>Editorial Lab</span>
              <span class="text-fg-muted transition-transform group-hover:translate-x-0.5">→</span>
            </div>
            <p class="text-fg-muted text-[11px] leading-relaxed pt-1">
              Heading, Prose, Callout, StatCard, TableOfContents, Timeline, ReadingProgress.
            </p>
          </div>
          <div class="pt-3 text-[10px] text-status-nominal font-bold">● 7 Components</div>
        </a>

        <a
          href="/lab/media"
          class="group p-4 rounded-[var(--radius-card)] border border-border-subtle bg-surface-canvas hover:border-accent-interactive hover:shadow-subtle transition-all duration-150 flex flex-col justify-between focus-visible:outline-2 focus-visible:outline-accent-interactive"
        >
          <div class="space-y-1">
            <div class="text-[10px] text-fg-muted uppercase tracking-wider">[Tier 2]</div>
            <div
              class="font-bold text-fg-primary group-hover:text-fg-primary text-sm flex items-center justify-between"
            >
              <span>Visual Media Lab</span>
              <span class="text-fg-muted transition-transform group-hover:translate-x-0.5">→</span>
            </div>
            <p class="text-fg-muted text-[11px] leading-relaxed pt-1">
              ImageCompare before/after slider, DeviceFrame (browser/terminal), MediaFigure &amp;
              Lightbox, Carousel.
            </p>
          </div>
          <div class="pt-3 text-[10px] text-status-nominal font-bold">● 4 Components</div>
        </a>

        <a
          href="/lab/engineering"
          class="group p-4 rounded-[var(--radius-card)] border border-border-subtle bg-surface-canvas hover:border-accent-interactive hover:shadow-subtle transition-all duration-150 flex flex-col justify-between focus-visible:outline-2 focus-visible:outline-accent-interactive"
        >
          <div class="space-y-1">
            <div class="text-[10px] text-fg-muted uppercase tracking-wider">[Tier 3]</div>
            <div
              class="font-bold text-fg-primary group-hover:text-fg-primary text-sm flex items-center justify-between"
            >
              <span>UX Engineering Lab</span>
              <span class="text-fg-muted transition-transform group-hover:translate-x-0.5">→</span>
            </div>
            <p class="text-fg-muted text-[11px] leading-relaxed pt-1">
              CodeBlock with Svelte runes tokenizer, InteractiveSandbox, BenchmarkBadge, Tooltip,
              Kbd.
            </p>
          </div>
          <div class="pt-3 text-[10px] text-status-nominal font-bold">● 5 Components</div>
        </a>

        <a
          href="/lab/showcase"
          class="group p-4 rounded-[var(--radius-card)] border border-border-subtle bg-surface-canvas hover:border-accent-interactive hover:shadow-subtle transition-all duration-150 flex flex-col justify-between focus-visible:outline-2 focus-visible:outline-accent-interactive"
        >
          <div class="space-y-1">
            <div class="text-[10px] text-fg-muted uppercase tracking-wider">[Tier 4 &amp; 5]</div>
            <div
              class="font-bold text-fg-primary group-hover:text-fg-primary text-sm flex items-center justify-between"
            >
              <span>Structure &amp; Chrome</span>
              <span class="text-fg-muted transition-transform group-hover:translate-x-0.5">→</span>
            </div>
            <p class="text-fg-muted text-[11px] leading-relaxed pt-1">
              ProjectCard teasers, FilterBar with URL sync, SiteNav &amp; SiteFooter shell,
              ExperienceItem.
            </p>
          </div>
          <div class="pt-3 text-[10px] text-status-nominal font-bold">● 5 Components</div>
        </a>
      </div>
    </section>

    <!-- Component Directory -->
    <section class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-bold tracking-tight text-fg-primary">Component Directory</h2>
        <span class="text-xs font-mono text-fg-muted"
          >[{componentDirectory.length} Total Components &amp; Templates]</span
        >
      </div>

      <div class="overflow-x-auto font-mono text-xs">
        <table class="w-full text-left border-collapse border border-border-subtle">
          <thead>
            <tr class="border-b border-border-subtle text-[11px] text-fg-muted">
              <th scope="col" class="py-2.5 px-4 font-bold">Component &amp; Route</th>
              <th scope="col" class="py-2.5 px-4 font-bold">Category</th>
              <th scope="col" class="py-2.5 px-4 font-bold">Primary Trinity Focus</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border-subtle/40">
            {#each componentDirectory as comp}
              <tr class="hover:bg-surface-muted/30 transition-colors">
                <td class="py-3 px-4 font-bold">
                  <a
                    href={comp.href}
                    class="text-fg-primary underline decoration-accent-interactive decoration-2 hover:text-fg-primary focus-visible:outline-2 focus-visible:outline-accent-interactive"
                  >
                    {comp.name}
                  </a>
                </td>
                <td class="py-3 px-4">
                  <span
                    class="inline-block px-2 py-0.5 rounded-[var(--radius-control)] border border-border-subtle bg-surface-elevated text-[10px] font-mono text-fg-muted"
                  >
                    {comp.category}
                  </span>
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
