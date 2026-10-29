<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';

  export interface SocialLink {
    label: string;
    href: string;
    note?: string | undefined;
  }

  export interface SiteFooterProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
    brandName?: string | undefined;
    colophon?: string | undefined;
    socialLinks?: SocialLink[] | undefined;
    statusText?: string | undefined;
    backToTop?: boolean | undefined;
    children?: Snippet | undefined;
    class?: string | undefined;
  }

  let {
    brandName = 'Iñigo Artolozaga',
    colophon = 'Designed with Trinidad Design System · DTCG 3-tier tokens · Svelte 5',
    socialLinks = [
      { label: 'GitHub', href: 'https://github.com/inigoart' },
      { label: 'LinkedIn', href: 'https://linkedin.com/in/inigoart' },
      { label: 'Read.cv', href: 'https://read.cv/inigoart' }
    ],
    statusText = '100% WCAG AA Verified · 16.1 kB Gzip Bundle',
    backToTop = true,
    children,
    class: className = '',
    ...rest
  }: SiteFooterProps = $props();

  function scrollToTop() {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
</script>

<footer
  class="w-full border-t border-border-subtle bg-surface-canvas font-sans transition-colors {className}"
  {...rest}
>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
    <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
      <!-- Identity & Colophon -->
      <div class="md:col-span-6 space-y-3">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-accent-interactive" aria-hidden="true"></span>
          <span class="font-bold text-fg-primary text-base tracking-tight">{brandName}</span>
        </div>
        <p class="text-xs text-fg-muted max-w-md leading-relaxed font-mono">
          {colophon}
        </p>
        {#if statusText}
          <div
            class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[var(--radius-control)] border border-border-subtle bg-surface-elevated text-[11px] font-mono text-fg-muted select-none"
          >
            <span class="text-status-nominal font-bold">●</span>
            <span>{statusText}</span>
          </div>
        {/if}
      </div>

      <!-- Links & Back to Top -->
      <div class="md:col-span-6 flex flex-col md:items-end gap-4 font-mono text-xs">
        {#if socialLinks && socialLinks.length > 0}
          <div class="flex flex-wrap items-center gap-3">
            {#each socialLinks as link}
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                class="text-fg-muted hover:text-fg-primary focus-visible:outline-2 focus-visible:outline-accent-interactive rounded-[var(--radius-control)] px-1.5 py-0.5 transition-colors"
              >
                {link.label} ↗
              </a>
            {/each}
          </div>
        {/if}

        {#if children}
          {@render children()}
        {/if}

        {#if backToTop}
          <button
            type="button"
            onclick={scrollToTop}
            class="inline-flex items-center gap-1 text-xs text-fg-muted hover:text-fg-primary focus-visible:outline-2 focus-visible:outline-accent-interactive rounded-[var(--radius-control)] px-2 py-1 border border-border-subtle bg-surface-elevated cursor-pointer transition-colors mt-2"
          >
            <span>Back to top</span>
            <span aria-hidden="true">↑</span>
          </button>
        {/if}
      </div>
    </div>
  </div>
</footer>
