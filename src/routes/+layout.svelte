<script lang="ts">
  import type { Snippet } from 'svelte';
  import '../lib/styles/theme.css';
  import { TrinidadLogo } from '$lib/components/logo/index.js';
  import { env } from '$lib/state/environment.svelte.js';
  import { useRovingTabindex, Announcer } from '$lib/actions/index.js';

  interface Props {
    children?: Snippet;
  }

  let { children }: Props = $props();

  $effect(() => {
    env.init();
  });
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
      <nav class="hidden md:flex items-center gap-4 text-xs font-mono">
        <a
          href="/"
          class="text-fg-muted hover:text-fg-primary transition-colors focus-visible:outline-2 focus-visible:outline-accent-interactive rounded px-1"
        >
          Overview
        </a>
        <a
          href="/lab/primitives"
          class="text-fg-muted hover:text-fg-primary transition-colors focus-visible:outline-2 focus-visible:outline-accent-interactive rounded px-1"
        >
          Lab: Primitives
        </a>
        <a
          href="/lab/logo"
          class="text-fg-muted hover:text-fg-primary transition-colors focus-visible:outline-2 focus-visible:outline-accent-interactive rounded px-1"
        >
          Lab: Logo
        </a>
      </nav>
    </div>

    <!-- Quick Environment Telemetry Controls -->
    <div class="flex items-center gap-2 font-mono text-xs">
      <div
        class="bg-surface-canvas p-0.5 rounded border border-border-subtle flex items-center shadow-xs"
        role="toolbar"
        aria-label="Theme mode switcher"
        use:useRovingTabindex={{ selector: 'button', orientation: 'horizontal' }}
      >
        <button
          type="button"
          class="px-2 py-0.5 rounded transition-colors {env.theme === 'paper'
            ? 'bg-accent-interactive text-[#24422a] font-bold'
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
            ? 'bg-accent-interactive text-[#24422a] font-bold'
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

      <div
        class="bg-surface-canvas p-0.5 rounded border border-border-subtle flex items-center shadow-xs"
        role="toolbar"
        aria-label="Density mode switcher"
        use:useRovingTabindex={{ selector: 'button', orientation: 'horizontal' }}
      >
        <button
          type="button"
          class="px-2 py-0.5 rounded transition-colors {env.density === 'comfortable'
            ? 'bg-accent-interactive text-[#24422a] font-bold'
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
            ? 'bg-accent-interactive text-[#24422a] font-bold'
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
    </div>
  </header>

  <main class="flex-1">
    {@render children?.()}
  </main>
</div>
