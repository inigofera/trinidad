<script lang="ts">
  import type { Snippet } from 'svelte';
  import '../lib/styles/theme.css';
  import { TrinidadLogo } from '$lib/components/logo/index.js';
  import { setEnvironment, type Theme } from '$lib/state/environment.svelte.js';
  import { useRovingTabindex, Announcer } from '$lib/actions/index.js';

  interface Props {
    children?: Snippet;
  }

  let { children }: Props = $props();

  const env = setEnvironment();
  let fps = $state(60);
  let navOpen = $state(false);
  let componentsOpen = $state(false);
  let componentsNavEl = $state<HTMLElement | null>(null);
  let componentsTriggerBtn = $state<HTMLElement | null>(null);

  $effect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedTheme = localStorage.getItem('trinidad-theme');
        const theme: Theme = storedTheme === 'industrial' ? 'industrial' : 'paper';
        const density = (localStorage.getItem('trinidad-density') || 'comfortable') as
          'comfortable' | 'compact';
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const motion = (localStorage.getItem('trinidad-motion') ||
          (reduced ? 'reduced' : 'full')) as 'full' | 'reduced';
        env.setTheme(theme);
        env.setDensity(density);
        env.setMotion(motion);
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.setAttribute('data-density', density);
        document.documentElement.setAttribute('data-motion', motion);
      } catch (e) {}
    }
    return env.init();
  });

  function setTheme(t: Theme) {
    env.setTheme(t);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('trinidad-theme', t);
      } catch (e) {}
      document.documentElement.setAttribute('data-theme', t);
    }
    Announcer.announce(`Active theme set to ${t}`, 'polite');
  }

  function setDensity(d: 'comfortable' | 'compact') {
    env.setDensity(d);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('trinidad-density', d);
      } catch (e) {}
      document.documentElement.setAttribute('data-density', d);
    }
    Announcer.announce(`Active density set to ${d}`, 'polite');
  }

  function setMotion(m: 'full' | 'reduced') {
    env.setMotion(m);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('trinidad-motion', m);
      } catch (e) {}
      document.documentElement.setAttribute('data-motion', m);
    }
    Announcer.announce(`Motion set to ${m}`, 'polite');
  }

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

  $effect(() => {
    if (!componentsOpen || typeof window === 'undefined') return;

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        componentsOpen = false;
        componentsTriggerBtn?.focus();
      }
    };

    const handleMousedown = (event: MouseEvent) => {
      if (!componentsNavEl || !componentsNavEl.contains(event.target as Node)) {
        componentsOpen = false;
      }
    };

    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('mousedown', handleMousedown);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('mousedown', handleMousedown);
    };
  });
</script>

<div
  class="min-h-screen bg-surface-canvas text-fg-primary font-sans transition-colors duration-200 flex flex-col"
>
  <!-- Sticky Global Telemetry Header -->
  <header
    class="sticky top-0 z-50 bg-surface-canvas border-b border-border-subtle px-4 md:px-8 py-2.5 flex items-center justify-between gap-2 xl:gap-4"
  >
    <div class="flex items-center gap-3 xl:gap-6">
      <a
        href="/"
        class="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-interactive rounded"
        aria-label="trinidad design system home"
      >
        <TrinidadLogo size={28} variant="lockup" />
      </a>

      <!-- Desktop Nav -->
      <nav
        aria-label="Primary"
        class="hidden lg:flex items-center gap-2 xl:gap-3 text-xs font-mono"
      >
        <a
          href="/"
          class="text-fg-muted hover:text-fg-primary transition-colors focus-visible:outline-2 focus-visible:outline-accent-interactive rounded px-1 xl:px-1.5 py-0.5 whitespace-nowrap"
        >
          Overview
        </a>

        <a
          href="/foundations"
          class="text-fg-muted hover:text-fg-primary transition-colors focus-visible:outline-2 focus-visible:outline-accent-interactive rounded px-1 xl:px-1.5 py-0.5 whitespace-nowrap"
        >
          Foundations
        </a>

        <a
          href="/patterns"
          class="text-fg-muted hover:text-fg-primary transition-colors focus-visible:outline-2 focus-visible:outline-accent-interactive rounded px-1 xl:px-1.5 py-0.5 whitespace-nowrap"
        >
          In the Wild
        </a>
        <a
          href="/architecture"
          class="text-fg-muted hover:text-fg-primary transition-colors focus-visible:outline-2 focus-visible:outline-accent-interactive rounded px-1 xl:px-1.5 py-0.5 whitespace-nowrap"
        >
          Contracts
        </a>

        <!-- Components Disclosure Menu -->
        <div class="relative" bind:this={componentsNavEl}>
          <button
            type="button"
            aria-haspopup="true"
            aria-expanded={componentsOpen}
            onclick={() => (componentsOpen = !componentsOpen)}
            class="text-fg-muted hover:text-fg-primary transition-colors focus-visible:outline-2 focus-visible:outline-accent-interactive rounded px-1 xl:px-1.5 py-0.5 whitespace-nowrap flex items-center gap-1"
          >
            Components
            <span aria-hidden="true">&#9662;</span>
          </button>

          {#if componentsOpen}
            <div
              class="absolute left-0 top-full z-40 mt-1 w-48 flex flex-col gap-0.5 p-1 bg-surface-canvas border border-border-subtle rounded shadow-xs"
            >
              {#each labComponents as comp}
                <a
                  href={comp.href}
                  onclick={() => (componentsOpen = false)}
                  class="px-2 py-1 rounded text-fg-muted hover:text-fg-primary transition-colors focus-visible:outline-2 focus-visible:outline-accent-interactive"
                >
                  {comp.name}
                </a>
              {/each}

              <div aria-hidden="true" class="mx-1 my-1 h-px bg-border-subtle"></div>

              <a
                href="/lab/primitives"
                onclick={() => (componentsOpen = false)}
                class="px-2 py-1 rounded text-fg-muted hover:text-fg-primary transition-colors focus-visible:outline-2 focus-visible:outline-accent-interactive"
              >
                Primitives
              </a>
              <a
                href="/lab/logo"
                onclick={() => (componentsOpen = false)}
                class="px-2 py-1 rounded text-fg-muted hover:text-fg-primary transition-colors focus-visible:outline-2 focus-visible:outline-accent-interactive"
              >
                Logo
              </a>
            </div>
          {/if}
        </div>
      </nav>
    </div>

    <!-- Telemetry & Environment Switchers -->
    <div class="flex items-center gap-1.5 xl:gap-2 font-mono text-xs whitespace-nowrap">
      <!-- Live FPS Telemetry Badge -->
      <span
        class="hidden sm:inline-flex lg:hidden xl:inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-border-subtle bg-surface-canvas text-[11px] text-fg-primary font-bold"
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
        <span>{fps} fps</span>
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
          onclick={() => setTheme('paper')}
          aria-pressed={env.theme === 'paper'}
        >
          Paper
        </button>
        <button
          type="button"
          class="px-2 py-0.5 rounded transition-colors {env.theme === 'industrial'
            ? 'bg-accent-interactive text-accent-contrast font-bold'
            : 'text-fg-muted hover:text-fg-primary'}"
          onclick={() => setTheme('industrial')}
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
          onclick={() => setDensity('comfortable')}
          aria-pressed={env.density === 'comfortable'}
        >
          Comfortable
        </button>
        <button
          type="button"
          class="px-2 py-0.5 rounded transition-colors {env.density === 'compact'
            ? 'bg-accent-interactive text-accent-contrast font-bold'
            : 'text-fg-muted hover:text-fg-primary'}"
          onclick={() => setDensity('compact')}
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
          onclick={() => setMotion('full')}
          aria-pressed={env.motion === 'full'}
        >
          Motion
        </button>
        <button
          type="button"
          class="px-2 py-0.5 rounded transition-colors {env.motion === 'reduced'
            ? 'bg-accent-interactive text-accent-contrast font-bold'
            : 'text-fg-muted hover:text-fg-primary'}"
          onclick={() => setMotion('reduced')}
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
      class="lg:hidden bg-surface-elevated border-b border-border-subtle p-4 font-mono text-xs flex flex-wrap items-center gap-x-3 gap-y-1"
    >
      <a
        href="/"
        onclick={() => (navOpen = false)}
        class="px-1.5 py-0.5 rounded text-fg-muted hover:text-fg-primary transition-colors focus-visible:outline-2 focus-visible:outline-accent-interactive"
      >
        Overview
      </a>
      <a
        href="/foundations"
        onclick={() => (navOpen = false)}
        class="px-1.5 py-0.5 rounded text-fg-muted hover:text-fg-primary transition-colors focus-visible:outline-2 focus-visible:outline-accent-interactive"
      >
        Foundations
      </a>
      <a
        href="/patterns"
        onclick={() => (navOpen = false)}
        class="px-1.5 py-0.5 rounded text-fg-muted hover:text-fg-primary transition-colors focus-visible:outline-2 focus-visible:outline-accent-interactive"
      >
        In the Wild
      </a>
      <a
        href="/architecture"
        onclick={() => (navOpen = false)}
        class="px-1.5 py-0.5 rounded text-fg-muted hover:text-fg-primary transition-colors focus-visible:outline-2 focus-visible:outline-accent-interactive"
      >
        Contracts
      </a>

      <span
        class="w-full mt-2 border-t border-border-subtle pb-1 pt-3 text-[10px] uppercase tracking-wider text-fg-muted"
        >Components</span
      >

      {#each labComponents as comp}
        <a
          href={comp.href}
          onclick={() => (navOpen = false)}
          class="px-1.5 py-0.5 rounded text-fg-muted hover:text-fg-primary transition-colors focus-visible:outline-2 focus-visible:outline-accent-interactive"
        >
          {comp.name}
        </a>
      {/each}

      <a
        href="/lab/primitives"
        onclick={() => (navOpen = false)}
        class="px-1.5 py-0.5 rounded text-fg-muted hover:text-fg-primary transition-colors focus-visible:outline-2 focus-visible:outline-accent-interactive"
      >
        Primitives
      </a>
      <a
        href="/lab/logo"
        onclick={() => (navOpen = false)}
        class="px-1.5 py-0.5 rounded text-fg-muted hover:text-fg-primary transition-colors focus-visible:outline-2 focus-visible:outline-accent-interactive"
      >
        Logo
      </a>
    </div>
  {/if}

  <main class="flex-1">
    {@render children?.()}
  </main>
</div>
