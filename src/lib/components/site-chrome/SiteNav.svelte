<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';
  import { getEnvironment } from '$lib/state/environment.svelte.js';

  export interface NavLink {
    label: string;
    href: string;
    active?: boolean | undefined;
    external?: boolean | undefined;
  }

  export interface SiteNavProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
    brandName?: string | undefined;
    brandRole?: string | undefined;
    links: NavLink[];
    currentPath?: string | undefined;
    sticky?: boolean | undefined;
    showThemeToggle?: boolean | undefined;
    showDensityToggle?: boolean | undefined;
    brand?: Snippet | undefined;
    actions?: Snippet | undefined;
    class?: string | undefined;
  }

  let {
    brandName = 'Iñigo Artolozaga',
    brandRole = 'UX Designer & Engineer',
    links = [],
    currentPath = '',
    sticky = true,
    showThemeToggle = true,
    showDensityToggle = true,
    brand,
    actions,
    class: className = '',
    ...rest
  }: SiteNavProps = $props();

  const env = getEnvironment();
  let mobileMenuOpen = $state(false);

  function isLinkActive(link: NavLink): boolean {
    if (typeof link.active === 'boolean') return link.active;
    if (!currentPath) return false;
    if (link.href === '/' && currentPath === '/') return true;
    return link.href !== '/' && currentPath.startsWith(link.href);
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && mobileMenuOpen) {
      mobileMenuOpen = false;
    }
  }

  function toggleTheme() {
    env.setTheme(env.theme === 'paper' ? 'industrial' : 'paper');
  }

  function toggleDensity() {
    env.setDensity(env.density === 'comfortable' ? 'compact' : 'comfortable');
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<header
  class="w-full border-b border-border-subtle bg-surface-canvas/90 backdrop-blur-md z-40 transition-colors font-sans {sticky
    ? 'sticky top-0'
    : 'relative'} {className}"
  {...rest}
>
  <div
    class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-4"
  >
    <!-- Brand / Name Identity -->
    <div class="flex items-center gap-3 shrink-0">
      {#if brand}
        {@render brand()}
      {:else}
        <a
          href="/"
          class="group flex flex-col focus-visible:outline-2 focus-visible:outline-accent-interactive focus-visible:outline-offset-2 rounded-[var(--radius-control)]"
        >
          <span
            class="text-sm sm:text-base font-bold text-fg-primary group-hover:text-fg-primary tracking-tight"
          >
            {brandName}
          </span>
          {#if brandRole}
            <span class="text-[11px] font-mono text-fg-muted uppercase tracking-wider">
              [{brandRole}]
            </span>
          {/if}
        </a>
      {/if}
    </div>

    <!-- Desktop Navigation Links -->
    <nav aria-label="Main Navigation" class="hidden md:flex items-center gap-1 font-mono text-xs">
      {#each links as link}
        {@const active = isLinkActive(link)}
        <a
          href={link.href}
          aria-current={active ? 'page' : undefined}
          target={link.external ? '_blank' : undefined}
          rel={link.external ? 'noopener noreferrer' : undefined}
          class="px-3 py-1.5 rounded-[var(--radius-control)] border transition-all duration-150 focus-visible:outline-2 focus-visible:outline-accent-interactive {active
            ? 'border-border-subtle bg-surface-elevated text-fg-primary font-bold'
            : 'border-transparent text-fg-muted hover:text-fg-primary hover:bg-surface-elevated/50'}"
        >
          {link.label}
        </a>
      {/each}
    </nav>

    <!-- Chrome Controls & Actions -->
    <div class="flex items-center gap-2">
      {#if showDensityToggle}
        <button
          type="button"
          onclick={toggleDensity}
          class="hidden sm:inline-flex items-center px-2 py-1 rounded-[var(--radius-control)] border border-border-subtle bg-surface-canvas text-fg-muted hover:text-fg-primary hover:border-accent-interactive focus-visible:outline-2 focus-visible:outline-accent-interactive cursor-pointer text-xs font-mono select-none"
          title="Toggle density"
          aria-label="Density: {env.density}. Click to toggle."
        >
          <span class="text-[10px] uppercase text-fg-muted">DENSITY:</span>
          <span class="ml-1 text-fg-primary font-bold">{env.density}</span>
        </button>
      {/if}

      {#if showThemeToggle}
        <button
          type="button"
          onclick={toggleTheme}
          class="inline-flex items-center px-2.5 py-1 rounded-[var(--radius-control)] border border-border-subtle bg-surface-canvas text-fg-muted hover:text-fg-primary hover:border-accent-interactive focus-visible:outline-2 focus-visible:outline-accent-interactive cursor-pointer text-xs font-mono select-none"
          title="Toggle theme (Editorial Paper / Industrial Dark)"
          aria-label="Current theme: {env.theme}. Click to switch."
        >
          <span
            class="w-2 h-2 rounded-full mr-1.5 {env.theme === 'paper'
              ? 'bg-amber-600'
              : 'bg-accent-interactive'}"
            aria-hidden="true"
          ></span>
          <span class="text-fg-primary font-bold">{env.theme}</span>
        </button>
      {/if}

      {#if actions}
        <div class="shrink-0">
          {@render actions()}
        </div>
      {/if}

      <!-- Mobile Hamburger Button -->
      <button
        type="button"
        onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
        aria-expanded={mobileMenuOpen}
        aria-controls="mobile-navigation-menu"
        aria-label="Toggle navigation menu"
        class="md:hidden p-1.5 rounded-[var(--radius-control)] border border-border-subtle bg-surface-canvas text-fg-muted hover:text-fg-primary focus-visible:outline-2 focus-visible:outline-accent-interactive cursor-pointer"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          {#if mobileMenuOpen}
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          {:else}
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          {/if}
        </svg>
      </button>
    </div>
  </div>

  <!-- Mobile Dropdown Menu -->
  {#if mobileMenuOpen}
    <div
      id="mobile-navigation-menu"
      class="md:hidden border-t border-border-subtle bg-surface-canvas px-4 py-3 space-y-2 font-mono text-sm shadow-floating"
    >
      <nav aria-label="Mobile Navigation" class="flex flex-col space-y-1">
        {#each links as link}
          {@const active = isLinkActive(link)}
          <a
            href={link.href}
            aria-current={active ? 'page' : undefined}
            onclick={() => (mobileMenuOpen = false)}
            class="px-3 py-2 rounded-[var(--radius-control)] border transition-colors {active
              ? 'border-border-subtle bg-surface-elevated text-fg-primary font-bold'
              : 'border-transparent text-fg-muted hover:text-fg-primary hover:bg-surface-elevated/50'}"
          >
            {link.label}
          </a>
        {/each}
      </nav>

      <div
        class="pt-2 border-t border-border-subtle flex items-center justify-between text-xs text-fg-muted"
      >
        <span>Density:</span>
        <button
          type="button"
          onclick={toggleDensity}
          class="px-2 py-0.5 rounded-[var(--radius-control)] border border-border-subtle bg-surface-elevated text-fg-primary font-bold"
        >
          {env.density}
        </button>
      </div>
    </div>
  {/if}
</header>
