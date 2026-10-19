<script lang="ts">
  import { ComboboxState, type CommandItem } from './combobox.svelte.js';

  export interface ComboboxProps {
    items: CommandItem[];
    placeholder?: string | undefined;
    open?: boolean | undefined;
    query?: string | undefined;
    class?: string | undefined;
    onSelect?: ((item: CommandItem) => void) | undefined;
    onOpenChange?: ((open: boolean) => void) | undefined;
  }

  let {
    items = [],
    placeholder = 'Search commands or telemetry channels... [Type or use ↑↓]',
    open = $bindable(false),
    query = $bindable(''),
    class: className = '',
    onSelect,
    onOpenChange
  }: ComboboxProps = $props();

  const generatedId = $props.id();
  const inputId = $derived(`${generatedId}-input`);
  const listboxId = $derived(`${generatedId}-listbox`);

  const logic = new ComboboxState({
    items: () => items,
    query: () => query,
    open: () => open,
    onQueryChange: (q) => {
      query = q;
    },
    onOpenChange: (next) => {
      open = next;
      onOpenChange?.(next);
    },
    onSelect: (item) => {
      onSelect?.(item);
    }
  });

  const activeItemId = $derived(
    logic.isOpen && logic.activeItem ? `trinidad-option-${logic.activeItem.id}` : undefined
  );
</script>

<div class="relative w-full font-mono text-xs {className}">
  <!-- Combobox Input Bar -->
  <div
    class="relative flex items-center bg-surface-elevated border border-border-subtle focus-within:border-accent-interactive focus-within:ring-1 focus-within:ring-accent-interactive transition-colors"
  >
    <span class="pl-3 pr-1 text-fg-muted select-none font-bold" aria-hidden="true">&gt;</span>

    <input
      id={inputId}
      type="text"
      role="combobox"
      aria-expanded={open}
      aria-controls={listboxId}
      aria-activedescendant={activeItemId}
      aria-autocomplete="list"
      value={query}
      {placeholder}
      onfocus={() => logic.setOpen(true)}
      oninput={(e) => {
        logic.setQuery(e.currentTarget.value);
        if (!open) logic.setOpen(true);
      }}
      onkeydown={logic.handleKeyDown}
      class="w-full h-[var(--control-height)] px-2 bg-transparent text-fg-primary placeholder:text-fg-muted/60 focus:outline-none font-mono text-[length:var(--font-size-ui)]"
    />

    {#if query}
      <button
        type="button"
        tabindex="-1"
        onclick={() => logic.setQuery('')}
        aria-label="Clear query"
        class="px-2 text-fg-muted hover:text-fg-primary select-none cursor-pointer"
      >
        ✕
      </button>
    {/if}

    <button
      type="button"
      tabindex="-1"
      onclick={() => logic.setOpen(!open)}
      aria-label="Toggle command palette dropdown"
      class="px-2.5 text-fg-muted hover:text-fg-primary select-none cursor-pointer text-[10px]"
    >
      {open ? '▲' : '▼'}
    </button>
  </div>

  <!-- Virtual Floating Listbox -->
  {#if open}
    <div
      id={listboxId}
      role="listbox"
      aria-label="Available commands"
      class="absolute z-50 left-0 right-0 mt-1 max-h-64 overflow-y-auto bg-surface-elevated border border-border-subtle shadow-xl divide-y divide-border-subtle/50 font-mono text-xs focus:outline-none"
    >
      {#if Object.keys(logic.groupedItems).length === 0}
        <div class="p-3 text-center text-fg-muted italic">// No matching commands found</div>
      {:else}
        {#each Object.entries(logic.groupedItems) as [groupName, groupItems] (groupName)}
          <div role="group" aria-label={groupName} class="py-1">
            <div
              role="presentation"
              class="px-3 py-1 text-[10px] uppercase font-bold text-fg-muted tracking-wider bg-surface-canvas/40 select-none"
            >
              // {groupName}
            </div>

            <ul class="list-none p-0 m-0">
              {#each groupItems as item (item.id)}
                {@const isSelected = logic.activeItem?.id === item.id}
                <li
                  id={`trinidad-option-${item.id}`}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={item.disabled}
                  tabindex="-1"
                  onclick={() => logic.selectItem(item)}
                  onkeydown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      logic.selectItem(item);
                    }
                  }}
                  onmouseenter={() => {
                    const idx = logic.flattenedNavigableItems.findIndex((i) => i.id === item.id);
                    if (idx !== -1) logic.activeIndex = idx;
                  }}
                  class="flex items-center justify-between px-3 py-1.5 cursor-pointer select-none transition-colors {item.disabled
                    ? 'opacity-40 cursor-not-allowed text-fg-muted'
                    : isSelected
                      ? 'bg-accent-interactive text-accent-contrast font-bold'
                      : 'text-fg-primary hover:bg-surface-muted'}"
                >
                  <span class="inline-flex items-center gap-2">
                    <span class="opacity-60 text-[10px] font-mono">{isSelected ? '►' : ' '}</span>
                    <span>{item.label}</span>
                  </span>

                  {#if item.shortcut}
                    <kbd
                      class="px-1 py-0.5 text-[10px] rounded border border-border-subtle {isSelected
                        ? 'bg-accent-contrast/10 text-accent-contrast'
                        : 'bg-surface-canvas text-fg-muted'}"
                    >
                      {item.shortcut}
                    </kbd>
                  {/if}
                </li>
              {/each}
            </ul>
          </div>
        {/each}
      {/if}
    </div>
  {/if}
</div>
