<script lang="ts">
  import type { HTMLTextareaAttributes } from 'svelte/elements';

  export interface TextAreaProps extends Omit<HTMLTextareaAttributes, 'children'> {
    label: string;
    value?: string | undefined;
    placeholder?: string | undefined;
    error?: string | undefined;
    hint?: string | undefined;
    id?: string | undefined;
    rows?: number | undefined;
    resizable?: boolean | undefined;
    class?: string | undefined;
  }

  let {
    label,
    value = $bindable(''),
    placeholder,
    error,
    hint,
    id: customId,
    rows = 4,
    resizable = true,
    class: className = '',
    required = false,
    disabled = false,
    ...rest
  }: TextAreaProps = $props();

  const generatedId = `textarea-${Math.random().toString(36).substring(2, 9)}`;
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

  <!-- Textarea Element -->
  <textarea
    id={inputId}
    bind:value
    {placeholder}
    {rows}
    {required}
    {disabled}
    aria-invalid={error ? 'true' : undefined}
    aria-describedby={describedBy}
    class="w-full rounded-[var(--radius-control)] border transition-all duration-150 bg-surface-canvas px-3 py-2 text-sm text-fg-primary placeholder:text-fg-muted/60 focus:outline-hidden disabled:cursor-not-allowed font-sans shadow-subtle {error
      ? 'border-status-critical ring-1 ring-status-critical/30'
      : 'border-border-subtle focus:border-accent-interactive focus:ring-1 focus:ring-accent-interactive'} {disabled
      ? 'opacity-60 cursor-not-allowed bg-surface-muted'
      : ''} {resizable ? 'resize-y' : 'resize-none'}"
    {...rest}></textarea>

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
