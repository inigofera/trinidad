<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { onMount } from 'svelte';

  export interface FilterOption {
    id: string;
    label: string;
    count?: number | undefined;
  }

  export interface FilterBarProps extends Omit<
    HTMLAttributes<HTMLDivElement>,
    'children' | 'onchange'
  > {
    options: FilterOption[];
    selected?: string | undefined;
    label?: string | undefined;
    syncUrl?: boolean | undefined;
    paramName?: string | undefined;
    onchange?: ((id: string) => void) | undefined;
    class?: string | undefined;
  }

  let {
    options = [],
    selected = $bindable(options[0]?.id ?? 'all'),
    label = 'Filter by discipline',
    syncUrl = false,
    paramName = 'discipline',
    onchange,
    class: className = '',
    ...rest
  }: FilterBarProps = $props();

  let buttons: (HTMLButtonElement | null)[] = [];

  onMount(() => {
    if (syncUrl && typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      const paramVal = url.searchParams.get(paramName);
      if (paramVal && options.some((opt) => opt.id === paramVal)) {
        selected = paramVal;
        onchange?.(paramVal);
      }
    }
  });

  function selectOption(id: string) {
    selected = id;
    if (syncUrl && typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (id === options[0]?.id) {
        url.searchParams.delete(paramName);
      } else {
        url.searchParams.set(paramName, id);
      }
      window.history.replaceState({}, '', url.toString());
    }
    onchange?.(id);
  }

  function handleKeydown(event: KeyboardEvent, index: number) {
    let targetIndex = -1;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        targetIndex = (index + 1) % options.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        targetIndex = (index - 1 + options.length) % options.length;
        break;
      case 'Home':
        event.preventDefault();
        targetIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        targetIndex = options.length - 1;
        break;
    }

    if (targetIndex >= 0 && buttons[targetIndex]) {
      const opt = options[targetIndex];
      if (opt) {
        selectOption(opt.id);
        buttons[targetIndex]?.focus();
      }
    }
  }
</script>

<div
  role="radiogroup"
  aria-label={label}
  class="flex items-center gap-1.5 p-1 rounded-[var(--radius-card)] border border-border-subtle bg-surface-elevated/70 backdrop-blur-sm overflow-x-auto no-scrollbar font-mono text-xs select-none {className}"
  {...rest}
>
  {#each options as opt, index}
    {@const isSelected = selected === opt.id}
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      tabindex={isSelected ? 0 : -1}
      bind:this={buttons[index]}
      onclick={() => selectOption(opt.id)}
      onkeydown={(e) => handleKeydown(e, index)}
      class="group relative flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-control)] border transition-all duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-accent-interactive focus-visible:outline-offset-1 {isSelected
        ? 'border-border-subtle bg-surface-canvas text-fg-primary font-bold shadow-subtle'
        : 'border-transparent text-fg-muted hover:text-fg-primary hover:bg-surface-canvas/50'}"
    >
      {#if isSelected}
        <span class="w-1.5 h-1.5 rounded-full bg-accent-interactive shrink-0" aria-hidden="true"
        ></span>
      {/if}
      <span>{opt.label}</span>
      {#if typeof opt.count === 'number'}
        <span
          class="px-1.5 py-0.2 rounded-full text-[10px] {isSelected
            ? 'bg-surface-muted text-fg-primary'
            : 'bg-surface-muted/60 text-fg-muted'}"
        >
          {opt.count}
        </span>
      {/if}
    </button>
  {/each}
</div>
