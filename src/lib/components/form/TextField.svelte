<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';

  export interface TextFieldProps extends Omit<HTMLInputAttributes, 'children' | 'prefix'> {
    label: string;
    value?: string | undefined;
    placeholder?: string | undefined;
    error?: string | undefined;
    hint?: string | undefined;
    id?: string | undefined;
    prefix?: Snippet | string | undefined;
    suffix?: Snippet | string | undefined;
    class?: string | undefined;
  }

  let {
    label,
    value = $bindable(''),
    placeholder,
    error,
    hint,
    id: customId,
    prefix,
    suffix,
    class: className = '',
    required = false,
    disabled = false,
    ...rest
  }: TextFieldProps = $props();

  const generatedId = `input-${Math.random().toString(36).substring(2, 9)}`;
  const inputId = $derived(customId ?? generatedId);
  const hintId = $derived(hint ? `${inputId}-hint` : undefined);
  const errorId = $derived(error ? `${inputId}-error` : undefined);
  const describedBy = $derived([hintId, errorId].filter(Boolean).join(' ') || undefined);
</script>

<div class="flex flex-col gap-1.5 font-sans {className}">
  <!-- Label Bar -->
  <div class="flex items-center justify-between text-xs font-mono">
    <label for={inputId} class="font-bold text-fg-primary flex items-center gap-1 select-none">
      <span>{label}</span>
      {#if required}
        <span class="text-status-warning" aria-hidden="true">*</span>
      {/if}
    </label>

    {#if hint}
      <span id={hintId} class="text-[11px] text-fg-muted select-none">
        {hint}
      </span>
    {/if}
  </div>

  <!-- Input Wrapper -->
  <div
    class="relative flex items-center rounded-[var(--radius-control)] border transition-all duration-150 bg-surface-canvas shadow-subtle overflow-hidden {error
      ? 'border-status-critical ring-1 ring-status-critical/30'
      : 'border-border-subtle focus-within:border-accent-interactive focus-within:ring-1 focus-within:ring-accent-interactive'} {disabled
      ? 'opacity-60 cursor-not-allowed bg-surface-muted'
      : ''}"
  >
    {#if prefix}
      <div class="pl-3 text-fg-muted select-none flex items-center shrink-0 font-mono text-xs">
        {#if typeof prefix === 'string'}
          <span>{prefix}</span>
        {:else}
          {@render prefix()}
        {/if}
      </div>
    {/if}

    <input
      id={inputId}
      type="text"
      bind:value
      {placeholder}
      {required}
      {disabled}
      aria-invalid={error ? 'true' : undefined}
      aria-describedby={describedBy}
      class="w-full bg-transparent px-3 py-2 text-sm text-fg-primary placeholder:text-fg-muted/60 focus:outline-hidden disabled:cursor-not-allowed font-sans"
      {...rest}
    />

    {#if suffix}
      <div class="pr-3 text-fg-muted select-none flex items-center shrink-0 font-mono text-xs">
        {#if typeof suffix === 'string'}
          <span>{suffix}</span>
        {:else}
          {@render suffix()}
        {/if}
      </div>
    {/if}
  </div>

  <!-- Accessible Error Notification -->
  {#if error}
    <div
      id={errorId}
      role="alert"
      class="flex items-center gap-1.5 text-xs font-mono text-status-critical select-none pt-0.5"
    >
      <span aria-hidden="true">⚠</span>
      <span>{error}</span>
    </div>
  {/if}
</div>
