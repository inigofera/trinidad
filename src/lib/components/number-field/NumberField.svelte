<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';
  import { NumberFieldState } from './number-field.svelte.js';

  export interface NumberFieldProps extends Omit<HTMLInputAttributes, 'type' | 'value'> {
    value?: number | undefined;
    min?: number | undefined;
    max?: number | undefined;
    step?: number | undefined;
    unit?: string | undefined;
    label: string;
    disabled?: boolean | undefined;
    invalid?: boolean | undefined;
    errorMessage?: string | undefined;
    onValueChange?: ((val: number) => void) | undefined;
  }

  let {
    value = $bindable(0),
    min,
    max,
    step = 1,
    unit,
    label,
    disabled = false,
    invalid = false,
    errorMessage,
    id,
    class: className = '',
    onValueChange,
    ...rest
  }: NumberFieldProps = $props();

  const generatedId = $props.id();
  const inputId = $derived(id ?? generatedId);
  const errorId = $derived(`${inputId}-error`);

  const logic = new NumberFieldState({
    value: () => value,
    min: () => min,
    max: () => max,
    step: () => step,
    disabled: () => Boolean(disabled),
    invalid: () => Boolean(invalid),
    onChange: (next) => {
      value = next;
      onValueChange?.(next);
    }
  });
</script>

<div class="inline-flex flex-col gap-1 font-mono text-xs {className}">
  <div class="flex items-center justify-between select-none">
    <label
      for={inputId}
      class="cursor-ew-resize text-fg-muted hover:text-fg-primary transition-colors flex items-center gap-1.5"
      title="Drag horizontally to scrub value"
      onpointerdown={logic.handlePointerDown}
      onpointermove={logic.handlePointerMove}
      onpointerup={logic.handlePointerUp}
      onpointercancel={logic.handlePointerUp}
    >
      <span class="font-bold">{label}</span>
      {#if logic.isScrubbing}
        <span class="text-accent-interactive text-[10px] animate-pulse">[Scrub]</span>
      {/if}
    </label>

    {#if unit}
      <span class="text-fg-muted">[{unit}]</span>
    {/if}
  </div>

  <div class="relative flex items-center">
    <button
      type="button"
      tabindex="-1"
      {disabled}
      onclick={() => logic.decrement()}
      class="h-[var(--control-height)] px-2 bg-surface-elevated text-fg-muted hover:text-fg-primary border border-border-subtle border-r-0 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-accent-interactive"
      aria-label="Decrement {label}"
    >
      -
    </button>

    <input
      id={inputId}
      type="number"
      {value}
      {min}
      {max}
      {step}
      {disabled}
      {...logic.ariaAttrs}
      aria-errormessage={invalid && errorMessage ? errorId : undefined}
      onkeydown={logic.handleKeyDown}
      oninput={(e) => {
        const parsed = parseFloat(e.currentTarget.value);
        if (!Number.isNaN(parsed)) {
          const clamped = logic.clamp(parsed);
          value = clamped;
          onValueChange?.(clamped);
        }
      }}
      class="w-full h-[var(--control-height)] px-[var(--control-px)] py-[var(--control-py)] bg-surface-elevated text-fg-primary text-center font-mono border {invalid
        ? 'border-status-critical focus-visible:outline-status-critical'
        : 'border-border-subtle focus-visible:outline-accent-interactive'} focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      {...rest}
    />

    <button
      type="button"
      tabindex="-1"
      {disabled}
      onclick={() => logic.increment()}
      class="h-[var(--control-height)] px-2 bg-surface-elevated text-fg-muted hover:text-fg-primary border border-border-subtle border-l-0 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-accent-interactive"
      aria-label="Increment {label}"
    >
      +
    </button>
  </div>

  {#if invalid && errorMessage}
    <span
      id={errorId}
      role="alert"
      class="block w-0 min-w-full text-status-critical text-[11px] font-mono mt-0.5"
    >
      ! {errorMessage}
    </span>
  {/if}
</div>
