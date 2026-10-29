<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { ThemeScope } from '$lib/components/layout/index.js';
  import { Announcer } from '$lib/actions/announcer.svelte.js';

  export interface InteractiveSandboxProps extends Omit<
    HTMLAttributes<HTMLDivElement>,
    'children'
  > {
    title?: string | undefined;
    kicker?: string | undefined;
    theme?: 'paper' | 'industrial' | undefined;
    density?: 'comfortable' | 'compact' | undefined;
    codeSnippet?: Snippet | undefined;
    children: Snippet;
    controls?: Snippet | undefined;
    class?: string | undefined;
  }

  let {
    title = 'Interactive Component Sandbox',
    kicker = 'LIVE RUNTIME PROTOTYPE',
    theme = 'industrial',
    density = 'compact',
    codeSnippet,
    children,
    controls,
    class: className = '',
    ...rest
  }: InteractiveSandboxProps = $props();

  let activeTheme = $state<'paper' | 'industrial'>('industrial');
  let activeDensity = $state<'comfortable' | 'compact'>('compact');
  let showCode = $state(false);

  $effect(() => {
    activeTheme = theme;
  });

  $effect(() => {
    activeDensity = density;
  });

  function toggleTheme() {
    activeTheme = activeTheme === 'paper' ? 'industrial' : 'paper';
    Announcer.announce(`Sandbox theme inverted to ${activeTheme}`, 'polite');
  }

  function toggleDensity() {
    activeDensity = activeDensity === 'comfortable' ? 'compact' : 'comfortable';
    Announcer.announce(`Sandbox density toggled to ${activeDensity}`, 'polite');
  }
</script>

<div
  role="region"
  aria-label="{title} sandbox"
  class="my-8 rounded-[var(--radius-card)] border border-border-subtle bg-surface-canvas shadow-subtle overflow-hidden font-sans {className}"
  {...rest}
>
  <!-- Top Environment Toolbar -->
  <div
    class="flex items-center justify-between gap-3 px-3.5 py-2 border-b border-border-subtle bg-surface-elevated select-none text-xs font-mono"
  >
    <div class="flex items-center gap-2 truncate">
      <span class="w-2 h-2 rounded-full bg-accent-interactive" aria-hidden="true"></span>
      <span class="font-bold text-fg-primary truncate">[{kicker}]</span>
      <span class="text-fg-muted hidden sm:inline truncate">{title}</span>
    </div>

    <!-- Scoped Subtree Controls -->
    <div class="flex items-center gap-1.5 shrink-0">
      <button
        type="button"
        onclick={toggleTheme}
        class="px-2 py-0.5 rounded-[var(--radius-control)] border border-border-subtle bg-surface-canvas text-fg-muted hover:text-fg-primary hover:border-accent-interactive focus-visible:outline-2 focus-visible:outline-accent-interactive cursor-pointer select-none"
        title="Toggle embedded subtree theme"
      >
        Theme: <span class="text-fg-primary font-bold">{activeTheme}</span>
      </button>

      <button
        type="button"
        onclick={toggleDensity}
        class="px-2 py-0.5 rounded-[var(--radius-control)] border border-border-subtle bg-surface-canvas text-fg-muted hover:text-fg-primary hover:border-accent-interactive focus-visible:outline-2 focus-visible:outline-accent-interactive cursor-pointer select-none"
        title="Toggle embedded subtree density"
      >
        Density: <span class="text-fg-primary font-bold">{activeDensity}</span>
      </button>

      {#if codeSnippet}
        <button
          type="button"
          onclick={() => (showCode = !showCode)}
          class="px-2 py-0.5 rounded-[var(--radius-control)] border border-border-subtle bg-surface-canvas text-fg-muted hover:text-fg-primary hover:border-accent-interactive focus-visible:outline-2 focus-visible:outline-accent-interactive cursor-pointer select-none"
        >
          {showCode ? 'Hide Code' : 'View Code'}
        </button>
      {/if}
    </div>
  </div>

  <!-- Stage Canvas wrapped in ThemeScope -->
  <ThemeScope theme={activeTheme} density={activeDensity}>
    <div
      class="p-6 md:p-8 bg-surface-canvas text-fg-primary flex items-center justify-center min-h-[220px]"
    >
      {@render children()}
    </div>
  </ThemeScope>

  <!-- Interactive Controls Drawer (if provided) -->
  {#if controls}
    <div class="border-t border-border-subtle bg-surface-elevated p-4 font-mono text-xs">
      <div class="text-[11px] font-bold uppercase tracking-wider text-fg-muted mb-3 select-none">
        [Reactive Prop Mutators]
      </div>
      {@render controls()}
    </div>
  {/if}

  <!-- Collapsible Code Drawer -->
  {#if showCode && codeSnippet}
    <div class="border-t border-border-subtle bg-surface-canvas p-2">
      {@render codeSnippet()}
    </div>
  {/if}
</div>
