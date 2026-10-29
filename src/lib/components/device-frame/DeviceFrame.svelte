<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  export type DeviceFrameVariant = 'browser' | 'mobile' | 'terminal';

  export interface DeviceFrameProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    variant?: DeviceFrameVariant | undefined;
    url?: string | undefined;
    title?: string | undefined;
    status?: 'nominal' | 'warning' | 'critical' | 'offline' | undefined;
    children: Snippet;
    class?: string | undefined;
  }

  let {
    variant = 'browser',
    url = 'https://artolozaga.dev',
    title,
    status = 'nominal',
    children,
    class: className = '',
    ...rest
  }: DeviceFrameProps = $props();

  const statusLedClasses = {
    nominal: 'bg-status-nominal shadow-[0_0_8px_var(--color-status-nominal)]',
    warning: 'bg-status-warning shadow-[0_0_8px_var(--color-status-warning)]',
    critical: 'bg-status-critical shadow-[0_0_8px_var(--color-status-critical)]',
    offline: 'bg-fg-muted'
  };
</script>

{#if variant === 'browser'}
  <!-- Browser Chrome Frame -->
  <div
    class="rounded-[var(--radius-card)] border border-border-subtle bg-surface-canvas shadow-subtle overflow-hidden font-sans {className}"
    {...rest}
  >
    <!-- Top Chrome Bar -->
    <div
      class="flex items-center justify-between gap-3 px-3.5 py-2.5 border-b border-border-subtle bg-surface-elevated select-none"
    >
      <!-- Traffic Light Window Buttons -->
      <div class="flex items-center gap-1.5 shrink-0" aria-hidden="true">
        <span class="w-2.5 h-2.5 rounded-full bg-[#ff5f56] inline-block border border-[#e0443e]"
        ></span>
        <span class="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] inline-block border border-[#dea123]"
        ></span>
        <span class="w-2.5 h-2.5 rounded-full bg-[#27c93f] inline-block border border-[#1aab29]"
        ></span>
      </div>

      <!-- Address Bar Pill -->
      <div
        class="flex-1 max-w-md mx-auto flex items-center justify-center gap-2 px-3 py-1 rounded-[var(--radius-control)] bg-surface-canvas border border-border-subtle text-xs font-mono text-fg-muted truncate"
      >
        <span class="text-[10px] text-fg-muted" aria-hidden="true">🔒</span>
        <span class="truncate">{url}</span>
      </div>

      <!-- Right Utility Actions -->
      <div
        class="flex items-center gap-2 text-xs font-mono text-fg-muted shrink-0"
        aria-hidden="true"
      >
        <span>⌘K</span>
      </div>
    </div>

    <!-- Viewport Canvas -->
    <div class="relative w-full overflow-hidden">
      {@render children()}
    </div>
  </div>
{:else if variant === 'mobile'}
  <!-- Mobile Smartphone Chassis -->
  <div
    class="max-w-sm mx-auto rounded-[28px] border-4 border-border-subtle bg-surface-canvas shadow-floating overflow-hidden font-sans {className}"
    {...rest}
  >
    <!-- Top Speaker & Camera Notch -->
    <div
      class="flex items-center justify-between px-6 pt-3 pb-2 border-b border-border-subtle/50 bg-surface-elevated select-none"
    >
      <span class="font-mono text-[10px] font-bold text-fg-primary">09:41</span>
      <!-- Dynamic Island / Speaker Pill -->
      <div class="w-16 h-3 rounded-full bg-border-subtle" aria-hidden="true"></div>
      <div class="flex items-center gap-1 text-[10px] text-fg-muted font-mono" aria-hidden="true">
        <span>5G</span>
        <span>100%</span>
      </div>
    </div>

    <!-- Mobile Viewport Canvas -->
    <div class="relative w-full overflow-hidden">
      {@render children()}
    </div>

    <!-- Bottom Home Bar -->
    <div class="py-2.5 flex justify-center bg-surface-elevated" aria-hidden="true">
      <div class="w-28 h-1 rounded-full bg-border-subtle"></div>
    </div>
  </div>
{:else}
  <!-- Industrial Operator Rugged Terminal Frame -->
  <div
    class="relative rounded-[var(--radius-card)] border-2 border-border-subtle bg-surface-canvas shadow-subtle overflow-hidden font-mono {className}"
    {...rest}
  >
    <!-- Top Operator Telemetry Header -->
    <div
      class="flex items-center justify-between px-4 py-2 border-b-2 border-border-subtle bg-surface-elevated select-none text-xs"
    >
      <div class="flex items-center gap-2">
        <!-- Status LED -->
        <span
          class="inline-block w-2 h-2 rounded-full {statusLedClasses[status]}"
          aria-hidden="true"
        ></span>
        <span class="font-bold text-fg-primary tracking-wider uppercase">
          [{title ?? 'OPERATOR_CONSOLE // TRINIDAD_V2'}]
        </span>
      </div>

      <div class="flex items-center gap-3 text-fg-muted text-[11px]">
        <span>CAL: 60Hz</span>
        <span class="text-status-nominal font-bold">ONLINE</span>
      </div>
    </div>

    <!-- Viewport Canvas -->
    <div class="relative w-full overflow-hidden">
      {@render children()}
    </div>

    <!-- Bottom Technical Coordinate Footer -->
    <div
      class="flex items-center justify-between px-3 py-1 border-t border-border-subtle bg-surface-muted text-[10px] text-fg-muted select-none"
    >
      <span>AXIS_X: +0.0000</span>
      <span>AXIS_Y: +0.0000</span>
      <span>STATUS: {status.toUpperCase()}</span>
    </div>
  </div>
{/if}
