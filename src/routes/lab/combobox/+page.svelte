<script lang="ts">
  import WorkbenchShell from '../WorkbenchShell.svelte';
  import bundleStats from '../bundle-stats.json';
  import { Combobox, type CommandItem } from '$lib/components/combobox/index.js';

  let open = $state(false);
  let query = $state('');
  let placeholder = $state('Search commands or telemetry channels... [Type or use ↑↓]');
  let lastSelected = $state<string>('None');

  const sampleItems: CommandItem[] = [
    {
      id: 'cal-zero',
      label: 'Zero-Point Sensor Calibration',
      group: 'Calibration',
      shortcut: '⌘Z',
      onSelect: () => (lastSelected = 'Zero-Point Sensor Calibration')
    },
    {
      id: 'cal-span',
      label: 'Span Offset Fine Tuning',
      group: 'Calibration',
      shortcut: '⌘S',
      onSelect: () => (lastSelected = 'Span Offset Fine Tuning')
    },
    {
      id: 'tel-freq',
      label: 'Sample Frequency: 60Hz Target',
      group: 'Telemetry',
      shortcut: '⌘6',
      onSelect: () => (lastSelected = 'Sample Frequency: 60Hz Target')
    },
    {
      id: 'tel-dump',
      label: 'Dump Ring Buffer to JSON',
      group: 'Telemetry',
      shortcut: '⌘D',
      onSelect: () => (lastSelected = 'Dump Ring Buffer to JSON')
    },
    {
      id: 'sys-lock',
      label: 'Engage Safety Hardware Interlock',
      group: 'System',
      shortcut: '⌘L',
      onSelect: () => (lastSelected = 'Engage Safety Hardware Interlock')
    },
    {
      id: 'sys-reboot',
      label: 'Reboot Core Telemetry Controller',
      group: 'System',
      disabled: true,
      onSelect: () => (lastSelected = 'Reboot Core Telemetry Controller')
    }
  ];

  const trinity = {
    ergonomics:
      'Virtual focus with aria-activedescendant maintains real DOM focus in input while navigating options with arrow keys',
    design:
      'Terminal-inspired prompt character, hairline group headers, and compact shortcut badges',
    engineering:
      'Subsequence fuzzy scoring with consecutive character and word-boundary bonuses in headless ComboboxState'
  };

  const generatedCode = $derived.by(() => {
    return `<script lang="ts">
  import { Combobox, type CommandItem } from 'trinidad-ui';

  const items: CommandItem[] = [
    { id: 'cal-zero', label: 'Zero-Point Calibration', group: 'Calibration', shortcut: '⌘Z' },
    { id: 'tel-dump', label: 'Dump Ring Buffer', group: 'Telemetry', shortcut: '⌘D' }
  ];
<\/script>

<Combobox
  {items}
  placeholder="${placeholder}"
  bind:open
  bind:query
  onSelect={(item) => console.log('Executed:', item.label)}
/>`;
  });
</script>

<WorkbenchShell
  name="Combobox (Command Palette)"
  description="Command palette and omnibar with subsequence fuzzy search scoring, virtual focus (aria-activedescendant), keyboard listbox scrolling, and ARIA announcements."
  bundleSize={bundleStats.combobox}
  {trinity}
  {generatedCode}
>
  {#snippet stage()}
    <div class="w-full max-w-md">
      <Combobox
        items={sampleItems}
        {placeholder}
        bind:open
        bind:query
        onSelect={(item) => (lastSelected = item.label)}
      />
      <div
        class="mt-4 p-2.5 rounded bg-surface-elevated border border-border-subtle font-mono text-[11px] text-fg-muted"
      >
        LAST SELECTED: <span class="text-fg-primary font-bold">{lastSelected}</span>
      </div>
    </div>
  {/snippet}

  {#snippet controls()}
    <div class="space-y-4 font-mono text-xs">
      <div class="space-y-1">
        <label for="ctrl-open" class="text-fg-muted font-bold block">// Dropdown State</label>
        <button
          id="ctrl-open"
          type="button"
          class="w-full py-1.5 rounded border border-border-subtle {open
            ? 'bg-accent-interactive text-accent-contrast font-bold'
            : 'bg-surface-canvas text-fg-primary'}"
          onclick={() => (open = !open)}
        >
          {open ? 'State: OPEN (Click to Close)' : 'State: CLOSED (Click to Open)'}
        </button>
      </div>

      <div class="space-y-1">
        <label for="ctrl-q" class="text-fg-muted font-bold block">// Active Query</label>
        <input
          id="ctrl-q"
          type="text"
          bind:value={query}
          placeholder="Type fuzzy search query..."
          class="w-full px-2 py-1 bg-surface-canvas border border-border-subtle text-fg-primary"
        />
      </div>

      <div class="space-y-1">
        <label for="ctrl-ph" class="text-fg-muted font-bold block">// Placeholder</label>
        <input
          id="ctrl-ph"
          type="text"
          bind:value={placeholder}
          class="w-full px-2 py-1 bg-surface-canvas border border-border-subtle text-fg-primary"
        />
      </div>
    </div>
  {/snippet}
</WorkbenchShell>
