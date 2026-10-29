<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { Announcer } from '$lib/actions/announcer.svelte.js';

  export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

  export interface HeadingProps extends Omit<HTMLAttributes<HTMLHeadingElement>, 'children'> {
    level?: HeadingLevel | undefined;
    id?: string | undefined;
    kicker?: string | undefined;
    showAnchor?: boolean | undefined;
    children: Snippet;
    class?: string | undefined;
  }

  let {
    level = 2,
    id,
    kicker,
    showAnchor = true,
    children,
    class: className = '',
    ...rest
  }: HeadingProps = $props();

  let copied = $state(false);

  const headingTag = $derived(`h${level}` as const);

  const levelClasses: Record<HeadingLevel, string> = {
    1: 'text-4xl md:text-5xl font-bold tracking-tight text-fg-primary leading-tight',
    2: 'text-2xl md:text-3xl font-bold tracking-tight text-fg-primary leading-snug',
    3: 'text-xl md:text-2xl font-semibold text-fg-primary leading-snug',
    4: 'text-lg font-semibold text-fg-primary leading-normal',
    5: 'text-base font-semibold text-fg-primary leading-normal',
    6: 'text-xs font-semibold uppercase tracking-wider text-fg-muted'
  };

  async function copyAnchor() {
    if (!id || typeof window === 'undefined') return;
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    try {
      await navigator.clipboard.writeText(url);
      copied = true;
      Announcer.announce(`Heading link for #${id} copied to clipboard`, 'polite');
      setTimeout(() => {
        copied = false;
      }, 1500);
    } catch {
      window.location.hash = id;
    }
  }
</script>

<div class="group relative my-4 scroll-mt-20 {className}">
  {#if kicker}
    <div class="font-mono text-xs uppercase tracking-wider text-fg-muted mb-1 select-none">
      {kicker}
    </div>
  {/if}

  <div class="inline-flex items-center gap-2 max-w-full">
    <svelte:element
      this={headingTag}
      {id}
      class="{levelClasses[level]} m-0 font-sans break-words"
      {...rest}
    >
      {@render children()}
    </svelte:element>

    {#if id && showAnchor}
      <button
        type="button"
        onclick={copyAnchor}
        aria-label="Copy permalink to section: {id}"
        class="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity font-mono text-xs px-1.5 py-0.5 rounded-[var(--radius-control)] border border-border-subtle bg-surface-elevated text-fg-muted hover:text-fg-primary hover:border-accent-interactive focus-visible:outline-2 focus-visible:outline-accent-interactive cursor-pointer select-none"
        title="Copy section link"
      >
        {#if copied}
          <span class="text-accent-interactive font-bold">✓</span>
        {:else}
          <span aria-hidden="true">#</span>
        {/if}
      </button>
    {/if}
  </div>
</div>
