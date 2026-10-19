<script lang="ts">
  import type { Snippet } from 'svelte';
  import '../lib/styles/theme.css';
  import { TrinidadLogo } from '$lib/components/logo/index.js';
  import { setEnvironment } from '$lib/state/environment.svelte.js';
  import { useRovingTabindex, Announcer } from '$lib/actions/index.js';

  interface Props {
    children?: Snippet;
  }

  let { children }: Props = $props();

  const env = setEnvironment();
  let fps = $state(60);
  let navOpen = $state(false);

  $effect(() => {
    return env.init();
  });

  $effect(() => {
    if (typeof window === 'undefined') return;
    let lastTime = performance.now();
    let frames = 0;
    let handle: number;

    const tick = (now: number) => {
      frames++;
      if (now - lastTime >= 1000) {
        fps = Math.round((frames * 1000) / (now - lastTime));
        frames = 0;
        lastTime = now;
      }
      handle = requestAnimationFrame(tick);
    };

    handle = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(handle);
  });

  const labComponents = [
    { name: 'Button', href: '/lab/button' },
    { name: 'NumberField', href: '/lab/number-field' },
    { name: 'Dialog', href: '/lab/dialog' },
    { name: 'Combobox', href: '/lab/combobox' },
    { name: 'Sparkline', href: '/lab/sparkline' },
    { name: 'DataTable', href: '/lab/data-table' },
    { name: 'DiffViewer', href: '/lab/diff-viewer' }
  ];
</script>

<div
  class="min-h-screen bg-surface-canvas text-fg-primary font-sans transition-colors duration-200 flex flex-col"
>
  <!-- Sticky Global Telemetry Header -->
  <header
    class="sticky top-0 z-50 bg-surface-elevated/90 backdrop-blur border-b border-border-subtle px-4 md:px-8 py-2.5 flex items-center justify-between gap-4"
  >
    <div class="flex items-center gap-6">
      <a
        href="/"
        class="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-interactive rounded"
        aria-label="trinidad design system home"
      >
        <TrinidadLogo size={28} variant="lockup" />
      </a>

      <!-- Desktop Nav -->
      <nav class="hidden lg:flex items-center gap-3 text-xs font-mono">
        <a
          href="/"
          class="text-fg-muted hover:text-fg-primary transition-colors focus-visible:outline-2 focus-visible:outline-accent-interactive rounded px-1.5 py-0.5"
        >
          Overview
        </a>

        <div class="h-3 w-px bg-border-subtle"></div>

        {#each labComponents as comp}
          <a
            href={comp.href}
            class="text-fg-muted hover:text-fg-primary hover:bg-surface-canvas transition-colors focus-visible:outline-2 focus-visible:outline-accent-interactive rounded px-1.5 py-0.5"
          >
            {comp.name}
          </a>
        {/each}

        <div class="h-3 w-px bg-border-subtle"></div>

        <a
          href="/lab/primitives"
          class="text-fg-muted hover:text-fg-primary transition-colors focus-visible:outline-2 focus-visible:outline-accent-interactive rounded px-1.5 py-0.5"
        >
          Primitives
        </a>
        <a
          href="/lab/logo"
          class="text-fg-muted hover:text-fg-primary transition-colors focus-visible:outline-2 focus-visible:outline-accent-interactive rounded px-1.5 py-0.5"
        >
          Logo
        </a>
      </nav>
    </div>

    <!-- Telemetry & Environment Switchers -->
    <div class="flex items-center gap-2 font-mono text-xs">
      <!-- Live FPS Telemetry Badge -->
      <span
        class="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-border-subtle bg-surface-canvas text-[11px] text-fg-primary font-bold"
        title="Live requestAnimationFrame frequency"
      >
        <span
          class="inline-block w-1.5 h-1.5 rounded-full {fps >= 55
            ? 'bg-status-nominal'
            : fps >= 30
              ? 'bg-status-warning'
              : 'bg-status-critical'}"
          aria-hidden="true"
        ></span>
        <span>[FPS: {fps}]</span>
      </span>

      <!-- Theme Switcher -->
      <div
        class="bg-surface-canvas p-0.5 rounded border border-border-subtle flex items-center shadow-xs"
        role="toolbar"
        aria-label="Theme mode switcher"
        use:useRovingTabindex={{ selector: 'button', orientation: 'horizontal' }}
      >
        <button
          type="button"
          class="px-2 py-0.5 rounded transition-colors {env.theme === 'paper'
            ? 'bg-accent-interactive text-accent-contrast font-bold'
            : 'text-fg-muted hover:text-fg-primary'}"
          onclick={() => {
            env.setTheme('paper');
            Announcer.announce('Active theme set to paper', 'polite');
          }}
          aria-pressed={env.theme === 'paper'}
        >
          Paper
        </button>
        <button
          type="button"
          class="px-2 py-0.5 rounded transition-colors {env.theme === 'industrial'
            ? 'bg-accent-interactive text-accent-contrast font-bold'
            : 'text-fg-muted hover:text-fg-primary'}"
          onclick={() => {
            env.setTheme('industrial');
            Announcer.announce('Active theme set to industrial', 'polite');
          }}
          aria-pressed={env.theme === 'industrial'}
        >
          Industrial
        </button>
      </div>

      <!-- Density Switcher -->
      <div
        class="bg-surface-canvas p-0.5 rounded border border-border-subtle hidden sm:flex items-center shadow-xs"
        role="toolbar"
        aria-label="Density mode switcher"
        use:useRovingTabindex={{ selector: 'button', orientation: 'horizontal' }}
      >
        <button
          type="button"
          class="px-2 py-0.5 rounded transition-colors {env.density === 'comfortable'
            ? 'bg-accent-interactive text-accent-contrast font-bold'
            : 'text-fg-muted hover:text-fg-primary'}"
          onclick={() => {
            env.setDensity('comfortable');
            Announcer.announce('Active density set to comfortable', 'polite');
          }}
          aria-pressed={env.density === 'comfortable'}
        >
          Comfortable
        </button>
        <button
          type="button"
          class="px-2 py-0.5 rounded transition-colors {env.density === 'compact'
            ? 'bg-accent-interactive text-accent-contrast font-bold'
            : 'text-fg-muted hover:text-fg-primary'}"
          onclick={() => {
            env.setDensity('compact');
            Announcer.announce('Active density set to compact', 'polite');
          }}
          aria-pressed={env.density === 'compact'}
        >
          Compact
        </button>
      </div>

      <!-- Motion Switcher -->
      <div
        class="bg-surface-canvas p-0.5 rounded border border-border-subtle hidden md:flex items-center shadow-xs"
        role="toolbar"
        aria-label="Motion preference switcher"
        use:useRovingTabindex={{ selector: 'button', orientation: 'horizontal' }}
      >
        <button
          type="button"
          class="px-2 py-0.5 rounded transition-colors {env.motion === 'full'
            ? 'bg-accent-interactive text-accent-contrast font-bold'
            : 'text-fg-muted hover:text-fg-primary'}"
          onclick={() => {
            env.setMotion('full');
            Announcer.announce('Motion set to full', 'polite');
          }}
          aria-pressed={env.motion === 'full'}
        >
          Motion
        </button>
        <button
          type="button"
          class="px-2 py-0.5 rounded transition-colors {env.motion === 'reduced'
            ? 'bg-accent-interactive text-accent-contrast font-bold'
            : 'text-fg-muted hover:text-fg-primary'}"
          onclick={() => {
            env.setMotion('reduced');
            Announcer.announce('Motion set to reduced', 'polite');
          }}
          aria-pressed={env.motion === 'reduced'}
        >
          Reduced
        </button>
      </div>

      <!-- Mobile Menu Toggle -->
      <button
        type="button"
        onclick={() => (navOpen = !navOpen)}
        class="lg:hidden p-1.5 rounded border border-border-subtle bg-surface-canvas text-fg-muted hover:text-fg-primary"
        aria-label="Toggle navigation menu"
        aria-expanded={navOpen}
      >
        ☰
      </button>
    </div>
  </header>

  <!-- Mobile Nav Drawer -->
  {#if navOpen}
    <div
      class="lg:hidden bg-surface-elevated border-b border-border-subtle p-4 font-mono text-xs flex flex-wrap gap-2"
    >
      <a
        href="/"
        onclick={() => (navOpen = false)}
        class="px-2.5 py-1 rounded bg-surface-canvas border border-border-subtle text-fg-primary"
      >
        Overview
      </a>
      {#each labComponents as comp}
        <a
          href={comp.href}
          onclick={() => (navOpen = false)}
          class="px-2.5 py-1 rounded bg-surface-canvas border border-border-subtle text-fg-primary hover:border-accent-interactive"
        >
          {comp.name}
        </a>
      {/each}
      <a
        href="/lab/primitives"
        onclick={() => (navOpen = false)}
        class="px-2.5 py-1 rounded bg-surface-canvas border border-border-subtle text-fg-primary"
      >
        Primitives
      </a>
      <a
        href="/lab/logo"
        onclick={() => (navOpen = false)}
        class="px-2.5 py-1 rounded bg-surface-canvas border border-border-subtle text-fg-primary"
      >
        Logo
      </a>
    </div>
  {/if}

  <main class="flex-1">
    {@render children?.()}
  </main>
</div>
