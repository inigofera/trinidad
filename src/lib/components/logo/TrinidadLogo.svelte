<script lang="ts">
  import type { SVGAttributes } from 'svelte/elements';

  export interface TrinidadLogoProps extends SVGAttributes<SVGSVGElement> {
    /** Height of the mark in pixels */
    size?: number;
    /** 'mark' = icon only | 'lockup' = icon + wordmark */
    variant?: 'mark' | 'lockup';
    class?: string;
  }

  export type Props = TrinidadLogoProps;

  let { size = 32, variant = 'lockup', class: className = '', ...rest }: Props = $props();
</script>

<div
  class="inline-flex items-center select-none {className}"
  style="--logo-size: {size}px; gap: calc(var(--logo-size) * 0.05);"
>
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="trinidad design system"
    class="shrink-0"
    {...rest}
  >
    <!-- Left Pillar (60° Parallelogram) -->
    <!-- Dark green in Paper mode, turns white in Industrial mode -->
    <polygon
      points="32,7 37.2,16 16.41,52.03 6,52.03"
      fill="var(--brand-primary, var(--raw-forest-900, #24422a))"
      class="transition-colors duration-200"
    />

    <!-- Right Pillar (Separated from Left Pillar at the top by a parallel -60° gap) -->
    <!-- Invariant brand olive color: does not invert in Industrial Dark mode -->
    <polygon
      points="38.64,18.5 58,52.03 47.59,52.03 33.44,27.5"
      fill="var(--brand-secondary, var(--raw-olive-600, #5c744e))"
    />

    <!-- Bottom Mint Base (Touches Left Pillar and Right Pillar with zero gap) -->
    <!-- Invariant brand chartreuse color: does not invert in Industrial Dark mode -->
    <polygon
      points="21.61,43.03 42.39,43.03 47.59,52.03 16.41,52.03"
      fill="var(--brand-accent, var(--raw-lime-400, #a6c856))"
    />
  </svg>

  {#if variant === 'lockup'}
    <div class="flex items-baseline leading-none" style="gap: calc(var(--logo-size) * 0.1);">
      <span
        class="font-sans font-bold tracking-tight text-fg-primary lowercase"
        style="font-size: calc(var(--logo-size) * 0.56);"
      >
        trinidad
      </span>
      <span
        class="font-mono font-normal text-fg-muted"
        style="font-size: calc(var(--logo-size) * 0.32);"
      >
        v1.0
      </span>
    </div>
  {/if}
</div>
