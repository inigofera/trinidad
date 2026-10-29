<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';

  export interface ExperienceItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    period: string;
    role: string;
    organization: string;
    location?: string | undefined;
    description?: string | undefined;
    skills?: string[] | undefined;
    highlights?: string[] | undefined;
    current?: boolean | undefined;
    children?: Snippet | undefined;
    class?: string | undefined;
  }

  let {
    period,
    role,
    organization,
    location,
    description,
    skills = [],
    highlights = [],
    current = false,
    children,
    class: className = '',
    ...rest
  }: ExperienceItemProps = $props();
</script>

<div
  class="relative pl-6 sm:pl-8 pb-8 last:pb-0 border-l border-border-subtle group font-sans {className}"
  {...rest}
>
  <!-- Timeline Node Dot -->
  <div
    class="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border transition-colors {current
      ? 'border-border-subtle bg-accent-interactive ring-4 ring-accent-interactive/20'
      : 'border-border-subtle bg-surface-muted group-hover:border-fg-muted'}"
    aria-hidden="true"
  ></div>

  <!-- Content Block -->
  <div class="space-y-2">
    <!-- Meta Header -->
    <div class="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
      <span class="text-fg-muted">
        {period}
      </span>
      {#if current}
        <span
          class="px-2 py-0.5 rounded-[var(--radius-control)] border border-border-subtle bg-surface-elevated text-fg-primary font-bold text-[10px] uppercase tracking-wider"
        >
          Current Role
        </span>
      {/if}
    </div>

    <!-- Role & Organization -->
    <div>
      <h4 class="text-base sm:text-lg font-bold text-fg-primary leading-snug">
        {role}
      </h4>
      <div class="text-sm text-fg-muted font-medium flex items-center gap-2">
        <span>{organization}</span>
        {#if location}
          <span aria-hidden="true">·</span>
          <span>{location}</span>
        {/if}
      </div>
    </div>

    <!-- Description -->
    {#if description}
      <p class="text-sm text-fg-muted leading-relaxed pt-1">
        {description}
      </p>
    {/if}

    <!-- Highlights Bullet Points -->
    {#if highlights && highlights.length > 0}
      <ul class="space-y-1.5 pt-2 text-xs text-fg-muted font-mono leading-relaxed list-none">
        {#each highlights as item}
          <li class="flex items-start gap-2">
            <span class="text-fg-primary font-bold shrink-0" aria-hidden="true">›</span>
            <span>{item}</span>
          </li>
        {/each}
      </ul>
    {/if}

    {#if children}
      <div class="pt-2">
        {@render children()}
      </div>
    {/if}

    <!-- Skills Badges -->
    {#if skills && skills.length > 0}
      <div class="flex flex-wrap items-center gap-1.5 pt-3 select-none">
        {#each skills as skill}
          <span
            class="px-2 py-0.5 rounded-[var(--radius-control)] border border-border-subtle bg-surface-muted text-[11px] font-mono text-fg-muted"
          >
            {skill}
          </span>
        {/each}
      </div>
    {/if}
  </div>
</div>
