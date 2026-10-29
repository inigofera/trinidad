<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  export interface TimelineStep {
    title: string;
    subtitle?: string | undefined;
    kicker?: string | undefined;
    description?: string | undefined;
    status?: 'completed' | 'active' | 'upcoming' | undefined;
  }

  export interface ProcessTimelineProps extends HTMLAttributes<HTMLOListElement> {
    steps?: TimelineStep[] | undefined;
    orientation?: 'vertical' | 'horizontal' | undefined;
    class?: string | undefined;
  }

  let {
    steps = [],
    orientation = 'vertical',
    class: className = '',
    ...rest
  }: ProcessTimelineProps = $props();
</script>

<ol
  class="relative {orientation === 'vertical'
    ? 'border-l border-border-subtle ml-3 space-y-6 my-6'
    : 'grid grid-cols-1 md:grid-cols-4 gap-4 my-6'} {className}"
  {...rest}
>
  {#each steps as step, index (step.title)}
    {@const isCompleted = step.status === 'completed'}
    {@const isActive = step.status === 'active'}
    {@const isVertical = orientation === 'vertical'}

    <li
      class="relative {isVertical
        ? 'pl-6'
        : 'rounded-[var(--radius-card)] border border-border-subtle bg-surface-elevated p-4'}"
    >
      {#if isVertical}
        <span
          class="absolute -left-[9px] top-1 flex h-4 w-4 items-center justify-center rounded-full border text-[10px] font-mono font-bold {isActive
            ? 'border-accent-interactive bg-accent-interactive text-accent-contrast'
            : isCompleted
              ? 'border-status-nominal bg-surface-canvas text-status-nominal'
              : 'border-border-subtle bg-surface-muted text-fg-muted'}"
          aria-hidden="true"
        >
          {#if isCompleted}
            ✓
          {:else}
            {index + 1}
          {/if}
        </span>
      {/if}

      <div>
        <div class="flex items-center gap-2 mb-1 flex-wrap">
          {#if step.kicker}
            <span class="font-mono text-xs uppercase tracking-wider text-fg-muted">
              [{step.kicker}]
            </span>
          {/if}
          {#if isActive}
            <span
              class="font-mono text-[10px] uppercase px-1.5 py-0.2 rounded-[var(--radius-control)] bg-accent-interactive text-accent-contrast font-bold"
            >
              Active Phase
            </span>
          {/if}
        </div>

        <h3 class="text-base font-bold text-fg-primary font-sans m-0">
          {!isVertical ? `${index + 1}. ` : ''}{step.title}
        </h3>

        {#if step.subtitle}
          <div class="text-xs font-mono text-fg-muted mt-0.5">
            {step.subtitle}
          </div>
        {/if}

        {#if step.description}
          <p class="text-sm text-fg-muted mt-2 leading-relaxed m-0">
            {step.description}
          </p>
        {/if}
      </div>
    </li>
  {/each}
</ol>
