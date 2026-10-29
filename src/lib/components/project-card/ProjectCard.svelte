<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';

  export interface ProjectMetric {
    value: string;
    label: string;
    positive?: boolean | undefined;
  }

  export interface ProjectCardProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
    title: string;
    description: string;
    href: string;
    kicker?: string | undefined;
    imageSrc?: string | undefined;
    imageAlt?: string | undefined;
    tags?: string[] | undefined;
    metric?: ProjectMetric | undefined;
    featured?: boolean | undefined;
    media?: Snippet | undefined;
    badges?: Snippet | undefined;
    children?: Snippet | undefined;
    class?: string | undefined;
  }

  let {
    title,
    description,
    href,
    kicker,
    imageSrc,
    imageAlt = '',
    tags = [],
    metric,
    featured = false,
    media,
    badges,
    children,
    class: className = '',
    ...rest
  }: ProjectCardProps = $props();
</script>

<article
  class="group relative flex flex-col rounded-[var(--radius-card)] border border-border-subtle bg-surface-canvas hover:border-accent-interactive hover:shadow-floating transition-all duration-200 overflow-hidden font-sans {featured
    ? 'lg:grid lg:grid-cols-12 lg:gap-6'
    : ''} {className}"
  {...rest}
>
  <!-- Media Zone -->
  {#if media || imageSrc}
    <div
      class="relative overflow-hidden bg-surface-muted {featured
        ? 'lg:col-span-7'
        : 'aspect-video w-full'}"
    >
      {#if media}
        {@render media()}
      {:else if imageSrc}
        <img
          src={imageSrc}
          alt={imageAlt}
          class="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
          loading="lazy"
        />
      {/if}

      {#if metric}
        <div
          class="absolute bottom-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-[var(--radius-control)] border border-border-subtle bg-surface-canvas/95 backdrop-blur-sm shadow-subtle font-mono text-xs select-none"
        >
          <span class="font-bold text-fg-primary">{metric.value}</span>
          <span class="text-fg-muted">{metric.label}</span>
        </div>
      {/if}
    </div>
  {/if}

  <!-- Body Content -->
  <div class="flex flex-col flex-1 p-5 md:p-6 {featured ? 'lg:col-span-5 lg:justify-between' : ''}">
    <div>
      <!-- Kicker & Badges -->
      <div class="flex items-center justify-between gap-2 mb-2.5">
        {#if kicker}
          <span class="text-xs font-mono uppercase tracking-wider text-fg-muted truncate">
            [{kicker}]
          </span>
        {/if}

        {#if badges}
          <div class="flex items-center gap-1.5 shrink-0">
            {@render badges()}
          </div>
        {/if}
      </div>

      <!-- Title Link -->
      <h3 class="text-xl md:text-2xl font-bold text-fg-primary mb-2 leading-tight">
        <a
          {href}
          class="inline-flex items-center gap-1.5 group-hover:text-fg-primary focus-visible:outline-2 focus-visible:outline-accent-interactive focus-visible:outline-offset-2 rounded-[var(--radius-control)]"
        >
          <span>{title}</span>
          <span
            class="inline-block transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-0.5 text-fg-muted"
            aria-hidden="true"
          >
            ↗
          </span>
        </a>
      </h3>

      <!-- Description -->
      <p class="text-sm text-fg-muted leading-relaxed mb-4">
        {description}
      </p>

      {#if children}
        <div class="my-3">
          {@render children()}
        </div>
      {/if}
    </div>

    <!-- Tags List -->
    {#if tags && tags.length > 0}
      <div
        class="flex flex-wrap items-center gap-1.5 pt-4 mt-auto border-t border-border-subtle/60 text-[11px] font-mono text-fg-muted select-none"
      >
        {#each tags as tag}
          <span
            class="px-2 py-0.5 rounded-[var(--radius-control)] border border-border-subtle bg-surface-muted"
          >
            {tag}
          </span>
        {/each}
      </div>
    {/if}
  </div>
</article>
