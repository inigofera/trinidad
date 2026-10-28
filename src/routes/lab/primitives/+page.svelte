<script lang="ts">
  import { useFocusTrap, useRovingTabindex, Announcer } from '$lib/actions/index.js';

  // Reactive prop controls
  let activeTab = $state<'composite' | 'focus-trap' | 'roving-tabindex' | 'announcer'>('composite');
  let labGateOpen = $state<boolean>(false);
  let labGateStatus = $state<string>('Nominal. Ready for operator sequence.');
  let trapEnabled = $state<boolean>(false);
  let rovingOrientation = $state<'horizontal' | 'vertical' | 'both'>('horizontal');
  let rovingLoop = $state<boolean>(true);
  let announceMessage = $state<string>('Telemetry stream calibrated to 60fps nominal');
  let announcePoliteness = $state<'polite' | 'assertive'>('polite');

  // Stage & Telemetry state
  let stageElement = $state<HTMLElement | null>(null);
  let activeElementTag = $state<string>('none');
  let computedRole = $state<string>('none');
  let ariaState = $state<Record<string, string | null>>({});
  let lastKeyPressed = $state<string>('None');
  let copied = $state<boolean>(false);
  let announcementLog = $state<Array<{ time: string; text: string; mode: string }>>([]);

  function sendAnnouncement() {
    if (!announceMessage.trim()) return;
    Announcer.announce(announceMessage, announcePoliteness);
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`;
    announcementLog = [
      { time: timeStr, text: announceMessage, mode: announcePoliteness },
      ...announcementLog.slice(0, 4)
    ];
  }

  // Dynamic code snippet generation
  const generatedCode = $derived.by(() => {
    switch (activeTab) {
      case 'composite':
        return `<script lang="ts">
  import { useFocusTrap, useRovingTabindex, Announcer } from '$lib/actions';

  let isOpen = $state(false);

  function execute(command: string) {
    Announcer.announce(\`Executed \${command}\`, 'polite');
  }
<\/script>

{#if !isOpen}
  <button type="button" onclick={() => (isOpen = true)}>
    Open Operator Gate
  </button>
{:else}
  <div
    role="dialog"
    aria-modal="true"
    use:useFocusTrap={() => isOpen}
  >
    <div
      role="toolbar"
      use:useRovingTabindex={{ selector: 'button', orientation: 'horizontal', loop: true }}
    >
      <button type="button" onclick={() => execute('Diagnostics')}>Run Diagnostics</button>
      <button type="button" onclick={() => execute('Purge')}>Purge Cache</button>
      <button type="button" onclick={() => (isOpen = false)}>Exit</button>
    </div>
  </div>
{/if}`;
      case 'focus-trap':
        return `<script lang="ts">
  import { useFocusTrap } from '$lib/actions';

  let isOpen = $state(true);
<\/script>

<div use:useFocusTrap={() => isOpen}>
  <input type="text" placeholder="Trapped input" />
  <button type="button" onclick={() => (isOpen = false)}>Close</button>
</div>`;
      case 'roving-tabindex':
        return `<script lang="ts">
  import { useRovingTabindex } from '$lib/actions';
<\/script>

<div
  role="toolbar"
  use:useRovingTabindex={{
    selector: 'button',
    orientation: '${rovingOrientation}',
    loop: ${rovingLoop}
  }}
>
  <button type="button">Action A</button>
  <button type="button">Action B</button>
  <button type="button" disabled>Action C (Disabled)</button>
  <button type="button">Action D</button>
</div>`;
      case 'announcer':
        return `<script lang="ts">
  import { Announcer } from '$lib/actions';

  function notifyUser() {
    Announcer.announce('${announceMessage}', '${announcePoliteness}');
  }
<\/script>

<button type="button" onclick={notifyUser}>
  Announce via Screen Reader
</button>`;
    }
  });

  // Active tab context & technical explanation
  const tabExplanations = $derived.by(() => {
    switch (activeTab) {
      case 'composite':
        return {
          title: 'Composite Operator Confirmation Gate',
          summary:
            'Demonstrates all three primitives operating in synchronization within a high-stakes modal workflow: useFocusTrap isolates keyboard focus inside the dialog, useRovingTabindex provides single-tab-stop arrow traversal across actions, and Announcer dispatches assistive voiceover updates.',
          keys: 'Tab / Shift+Tab (trap boundary wrapping) · ArrowLeft / ArrowRight (roving traversal) · Enter (execute command) · Escape (dismiss & restore focus)',
          aria: 'role="dialog" aria-modal="true" · role="toolbar" · aria-live="polite | assertive"'
        };
      case 'focus-trap':
        return {
          title: 'Deterministic Focus Confinement (useFocusTrap)',
          summary:
            'Intercepts Tab and Shift+Tab key sequences to constrain DOM focus inside the active boundary. Disallowed nodes ([tabindex="-1"], [disabled], [aria-hidden="true"]) are safely filtered out, and focus automatically restores to the previous active element upon exit or unmount.',
          keys: 'Tab (cycles forward, wrapping last to first) · Shift+Tab (cycles backward, wrapping first to last)',
          aria: 'Query selector: a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        };
      case 'roving-tabindex':
        return {
          title: 'Keyboard Ergonomics & Roving Tabindex (useRovingTabindex)',
          summary:
            'Enforces the WAI-ARIA roving tabindex pattern: exactly one item maintains tabindex="0" while all sibling items receive tabindex="-1". Arrow keys navigate seamlessly across items, automatically bypassing disabled elements and observing dynamic DOM additions.',
          keys: 'ArrowRight / ArrowDown (next non-disabled item) · ArrowLeft / ArrowUp (previous item) · Home (first item) · End (last item)',
          aria: 'Dynamic tabindex="0" / "-1" assignment · role="toolbar" / role="radiogroup"'
        };
      case 'announcer':
        return {
          title: 'Dual-Region Assistive Broadcast (Announcer Singleton)',
          summary:
            'SSR-safe singleton managing mounted polite and assertive screen-reader live regions in document.body. Uses requestAnimationFrame text clearing to guarantee screen-reader delivery even for rapid, identical sequential status updates.',
          keys: 'Programmatic API invoked via Announcer.announce(message, "polite" | "assertive")',
          aria: 'aria-live="polite" aria-atomic="true" · aria-live="assertive" aria-atomic="true" · .sr-only styling'
        };
    }
  });

  // Telemetry inspection effect
  $effect(() => {
    if (!stageElement || typeof window === 'undefined') return;

    const inspectActiveNode = () => {
      const el = document.activeElement as HTMLElement | null;
      if (el && stageElement?.contains(el)) {
        activeElementTag = `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${el.className ? '.' + el.className.split(' ')[0] : ''}`;
        computedRole = el.getAttribute('role') ?? el.tagName.toLowerCase();

        const attrs: Record<string, string | null> = {};
        for (let i = 0; i < el.attributes.length; i++) {
          const attr = el.attributes[i];
          if (
            attr &&
            (attr.name.startsWith('aria-') || attr.name === 'tabindex' || attr.name === 'role')
          ) {
            attrs[attr.name] = attr.value;
          }
        }
        ariaState = attrs;
      } else {
        activeElementTag = 'none (outside stage)';
        computedRole = 'none';
        ariaState = {};
      }
    };

    inspectActiveNode();

    const handleFocusIn = () => inspectActiveNode();
    const handleKeyDown = (e: KeyboardEvent) => {
      lastKeyPressed = e.key === ' ' ? 'Space' : e.key;
      inspectActiveNode();
    };

    stageElement.addEventListener('focusin', handleFocusIn);
    stageElement.addEventListener('keydown', handleKeyDown);

    const observer = new MutationObserver(() => {
      inspectActiveNode();
    });

    observer.observe(stageElement, {
      attributes: true,
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
      stageElement?.removeEventListener('focusin', handleFocusIn);
      stageElement?.removeEventListener('keydown', handleKeyDown);
    };
  });

  async function copySnippet() {
    try {
      await navigator.clipboard.writeText(generatedCode);
      copied = true;
      setTimeout(() => {
        copied = false;
      }, 2000);
    } catch {
      // clipboard fallback
    }
  }
</script>

<svelte:head>
  <title>trinidad lab: headless core &amp; a11y primitives</title>
</svelte:head>

<div class="p-6 md:p-10 max-w-7xl mx-auto space-y-8 font-sans">
  <!-- Workbench Header -->
  <div
    class="border-b border-border-subtle pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4"
  >
    <div>
      <h1 class="text-3xl font-bold tracking-tight">Headless Core & A11y Primitives</h1>
    </div>

    <!-- Primitive Mode Selector Tabs -->
    <div
      class="bg-surface-elevated p-1 rounded-md border border-border-subtle flex items-center gap-1 shadow-xs font-mono text-xs"
      role="tablist"
      aria-label="Primitive preview selection"
    >
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === 'composite'}
        class="px-3 py-1.5 rounded transition-colors {activeTab === 'composite'
          ? 'bg-accent-interactive text-accent-contrast font-bold shadow-xs'
          : 'text-fg-muted hover:text-fg-primary'}"
        onclick={() => (activeTab = 'composite')}
      >
        Composite Gate
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === 'focus-trap'}
        class="px-3 py-1.5 rounded transition-colors {activeTab === 'focus-trap'
          ? 'bg-accent-interactive text-accent-contrast font-bold shadow-xs'
          : 'text-fg-muted hover:text-fg-primary'}"
        onclick={() => (activeTab = 'focus-trap')}
      >
        Focus Trap
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === 'roving-tabindex'}
        class="px-3 py-1.5 rounded transition-colors {activeTab === 'roving-tabindex'
          ? 'bg-accent-interactive text-accent-contrast font-bold shadow-xs'
          : 'text-fg-muted hover:text-fg-primary'}"
        onclick={() => (activeTab = 'roving-tabindex')}
      >
        Roving Tabindex
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === 'announcer'}
        class="px-3 py-1.5 rounded transition-colors {activeTab === 'announcer'
          ? 'bg-accent-interactive text-accent-contrast font-bold shadow-xs'
          : 'text-fg-muted hover:text-fg-primary'}"
        onclick={() => (activeTab = 'announcer')}
      >
        Live Announcer
      </button>
    </div>
  </div>

  <!-- Architectural Concept & Role of Primitives in Trinidad -->
  <div class="max-w-3xl">
    <h2 class="text-lg md:text-xl font-bold tracking-tight text-fg-primary">
      The Role of Primitives in Trinidad
    </h2>

    <p class="text-xs text-fg-muted font-sans leading-relaxed">
      In the Trinidad Design System, <strong>Primitives</strong> are low-level, headless Svelte 5
      actions and singletons that encapsulate pure interaction mechanics—focus confinement, keyboard
      roving, and live assistive broadcasting—completely decoupled from visual markup and CSS.
      Rather than hardcoding keyboard traps and ARIA attributes inside individual widgets,
      high-level components (<code class="text-fg-primary">Dialog</code>,
      <code class="text-fg-primary">Combobox</code>, <code class="text-fg-primary">DataTable</code>,
      <code class="text-fg-primary">DiffViewer</code>) compose these primitives directly. This
      guarantees deterministic, WAI-ARIA 1.2-compliant ergonomics across the entire interface while
      leaving 100% of the visual styling to the design token pipeline.
    </p>
  </div>

  <!-- Active Primitive Description & Keyboard/ARIA Contract -->
  <div class="max-w-3xl space-y-3">
    <h2 class="text-lg md:text-xl font-bold tracking-tight text-fg-primary">
      {tabExplanations.title}
    </h2>

    <p class="text-xs text-fg-muted font-sans leading-relaxed">
      {tabExplanations.summary}
    </p>

    <div class="space-y-3 pt-1">
      <div class="space-y-0.5">
        <span class="text-fg-muted block uppercase text-[10px] font-bold"
          >Active Keyboard Keys:</span
        >
        <span class="text-fg-primary font-semibold text-[11px] leading-snug"
          >{tabExplanations.keys}</span
        >
      </div>

      <div class="space-y-0.5">
        <span class="text-fg-muted block uppercase text-[10px] font-bold"
          >ARIA Contract &amp; DOM Mapping:</span
        >
        <span class="text-accent-interactive font-semibold text-[11px] leading-snug"
          >{tabExplanations.aria}</span
        >
      </div>
    </div>
  </div>

  <!-- Standardized 4-Zone Lab Workbench Layout -->
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
    <!-- Zone 1: Stage Canvas (Top-Left, 7 Cols) -->
    <section class="lg:col-span-7 space-y-4">
      <span class="text-xs font-mono text-fg-muted">Stage</span>

      <div
        bind:this={stageElement}
        class="relative min-h-[380px] border border-border-subtle p-6 flex flex-col justify-between overflow-hidden"
      >
        <!-- Live Interactive Primitive Demo Container -->
        <div class="relative z-10 w-full my-auto">
          {#if activeTab === 'composite'}
            <div class="max-w-md mx-auto space-y-4">
              <div class="flex items-center justify-between pb-2 border-b border-border-subtle">
                <span class="text-xs font-mono font-bold text-fg-primary"
                  >COMPOSITE OPERATOR GATE</span
                >
                <span
                  class="text-[10px] font-mono px-2 py-0.5 rounded font-bold {labGateOpen
                    ? 'bg-status-nominal/20 text-status-nominal border border-status-nominal/30'
                    : 'bg-surface-canvas text-fg-muted border border-border-subtle'}"
                >
                  GATE: {labGateOpen ? 'ACTIVE & CONFINED' : 'STANDBY'}
                </span>
              </div>

              {#if !labGateOpen}
                <div
                  class="p-6 bg-surface-canvas rounded border border-border-subtle text-center space-y-3"
                >
                  <p class="text-xs text-fg-muted font-mono leading-relaxed">
                    All 3 primitives (focus trap + roving tabindex + live announcer) synchronize
                    inside this modal confirmation workflow.
                  </p>
                  <button
                    type="button"
                    class="px-4 py-2 rounded bg-accent-interactive text-accent-contrast font-mono text-xs font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-interactive shadow-xs"
                    onclick={() => {
                      labGateOpen = true;
                      labGateStatus = 'Gate locked. Roving toolbar active.';
                      Announcer.announce(
                        'Diagnostic gate engaged. Focus trapped in dialog.',
                        'polite'
                      );
                    }}
                  >
                    Open Diagnostic Gate &rarr;
                  </button>
                </div>
              {:else}
                <div
                  role="dialog"
                  aria-modal="true"
                  use:useFocusTrap={() => labGateOpen}
                  tabindex="-1"
                  class="p-5 rounded-lg border-2 border-accent-interactive bg-surface-canvas space-y-4 shadow-lg focus-visible:outline-none"
                >
                  <div class="flex items-center justify-between border-b border-border-subtle pb-2">
                    <span class="text-xs font-mono font-bold text-fg-primary"
                      >Telemetry Authorization</span
                    >
                    <span
                      class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-status-nominal/20 text-status-nominal font-bold"
                    >
                      TRAP ACTIVE
                    </span>
                  </div>

                  <div
                    class="p-2.5 bg-surface-elevated rounded border border-border-subtle font-mono text-xs"
                  >
                    <span class="text-fg-muted">Status:</span>
                    <div class="text-accent-interactive font-bold mt-0.5">{labGateStatus}</div>
                  </div>

                  <div class="space-y-1">
                    <span class="text-[10px] font-mono text-fg-muted uppercase"
                      >Roving Action Toolbar (&larr; &rarr; to cycle):</span
                    >
                    <div
                      role="toolbar"
                      aria-label="Diagnostic Commands"
                      use:useRovingTabindex={{
                        selector: 'button',
                        orientation: 'horizontal',
                        loop: true
                      }}
                      class="flex flex-wrap gap-1.5 p-2 bg-surface-elevated rounded border border-border-subtle"
                    >
                      <button
                        type="button"
                        class="px-2.5 py-1 text-xs font-mono rounded bg-surface-canvas border border-border-subtle text-fg-primary hover:border-accent-interactive focus-visible:outline-2 focus-visible:outline-accent-interactive transition-colors"
                        onclick={() => {
                          labGateStatus = 'IMU calibration sequence running.';
                          Announcer.announce('IMU calibration sequence started.', 'polite');
                        }}
                      >
                        [1] Calibrate
                      </button>
                      <button
                        type="button"
                        class="px-2.5 py-1 text-xs font-mono rounded bg-surface-canvas border border-border-subtle text-fg-primary hover:border-accent-interactive focus-visible:outline-2 focus-visible:outline-accent-interactive transition-colors"
                        onclick={() => {
                          labGateStatus = 'Telemetry cache purged.';
                          Announcer.announce('Telemetry cache purged successfully.', 'polite');
                        }}
                      >
                        [2] Purge
                      </button>
                      <button
                        type="button"
                        class="px-2.5 py-1 text-xs font-mono rounded bg-surface-canvas border border-border-subtle text-fg-primary hover:border-accent-interactive focus-visible:outline-2 focus-visible:outline-accent-interactive transition-colors"
                        onclick={() => {
                          labGateOpen = false;
                          Announcer.announce('Diagnostic gate closed. Focus restored.', 'polite');
                        }}
                      >
                        [3] Dismiss Gate
                      </button>
                    </div>
                  </div>
                </div>
              {/if}
            </div>
          {:else if activeTab === 'focus-trap'}
            <div class="max-w-md mx-auto space-y-4">
              <div class="flex items-center justify-between pb-2 border-b border-border-subtle">
                <span class="text-xs font-mono font-bold text-fg-primary"
                  >MODAL / TRAP BOUNDARY</span
                >
                <span
                  class="text-[10px] font-mono px-2 py-0.5 rounded font-bold {trapEnabled
                    ? 'bg-status-nominal/20 text-status-nominal border border-status-nominal/30'
                    : 'bg-surface-canvas text-fg-muted border border-border-subtle'}"
                >
                  TRAP: {trapEnabled ? 'ACTIVE (TRAPPED)' : 'STANDBY (INACTIVE)'}
                </span>
              </div>

              <div
                use:useFocusTrap={() => trapEnabled}
                class="p-5 rounded-md border transition-all duration-200 {trapEnabled
                  ? 'bg-surface-canvas border-accent-interactive shadow-md'
                  : 'bg-surface-canvas/50 border-border-subtle'}"
              >
                <p class="text-xs text-fg-muted font-mono mb-4">
                  {#if trapEnabled}
                    Press <kbd
                      class="px-1.5 py-0.5 bg-surface-elevated border border-border-subtle rounded font-bold"
                      >Tab</kbd
                    >
                    or
                    <kbd
                      class="px-1.5 py-0.5 bg-surface-elevated border border-border-subtle rounded font-bold"
                      >Shift+Tab</kbd
                    >. Focus cycles cyclically inside this box.
                  {:else}
                    Activate the trap below or press "Toggle Trap State" to lock focus inside this
                    boundary.
                  {/if}
                </p>

                <div class="space-y-3 font-mono text-xs">
                  <div>
                    <label for="trap-input-1" class="block text-fg-muted mb-1"
                      >Telemetry Input Alpha</label
                    >
                    <input
                      id="trap-input-1"
                      type="text"
                      placeholder="Type parameters..."
                      class="w-full px-3 py-1.5 bg-surface-elevated border border-border-subtle rounded text-fg-primary focus-visible:outline-2 focus-visible:outline-accent-interactive"
                    />
                  </div>

                  <div>
                    <label for="trap-select-1" class="block text-fg-muted mb-1"
                      >Modality Channel</label
                    >
                    <select
                      id="trap-select-1"
                      class="w-full px-3 py-1.5 bg-surface-elevated border border-border-subtle rounded text-fg-primary focus-visible:outline-2 focus-visible:outline-accent-interactive"
                    >
                      <option>Channel 01 · Space Grotesk</option>
                      <option>Channel 02 · Space Mono</option>
                      <option>Channel 03 · Raw Scale</option>
                    </select>
                  </div>

                  <div class="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      class="px-3 py-1.5 rounded bg-surface-elevated border border-border-subtle text-fg-primary hover:border-accent-interactive focus-visible:outline-2 focus-visible:outline-accent-interactive transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      class="px-3 py-1.5 rounded bg-accent-interactive text-[#24422a] font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-interactive"
                      onclick={() => (trapEnabled = false)}
                    >
                      Exit Trap
                    </button>
                  </div>
                </div>
              </div>
            </div>
          {:else if activeTab === 'roving-tabindex'}
            <div class="max-w-lg mx-auto space-y-4">
              <div class="flex items-center justify-between pb-2 border-b border-border-subtle">
                <span class="text-xs font-mono font-bold text-fg-primary"
                  >ROVING TABINDEX TOOLBAR</span
                >
                <span class="text-[10px] font-mono text-fg-muted">
                  Orientation: [{rovingOrientation}] &middot; Loop: [{rovingLoop
                    ? 'true'
                    : 'false'}]
                </span>
              </div>

              <p class="text-xs text-fg-muted font-mono">
                Click or Tab into any item, then use <kbd
                  class="px-1.5 py-0.5 bg-surface-canvas border border-border-subtle rounded font-bold"
                  >ArrowLeft</kbd
                >
                /
                <kbd
                  class="px-1.5 py-0.5 bg-surface-canvas border border-border-subtle rounded font-bold"
                  >ArrowRight</kbd
                >,
                <kbd
                  class="px-1.5 py-0.5 bg-surface-canvas border border-border-subtle rounded font-bold"
                  >Home</kbd
                >, or
                <kbd
                  class="px-1.5 py-0.5 bg-surface-canvas border border-border-subtle rounded font-bold"
                  >End</kbd
                > to traverse.
              </p>

              <!-- Roving Tabindex Composite Widget -->
              <div
                role="toolbar"
                aria-label="Sensor Calibration Controls"
                use:useRovingTabindex={{
                  selector: 'button',
                  orientation: rovingOrientation,
                  loop: rovingLoop
                }}
                class="p-3 bg-surface-canvas rounded-lg border border-border-subtle flex flex-wrap items-center gap-2"
              >
                <button
                  type="button"
                  id="roving-item-1"
                  class="px-3 py-2 rounded font-mono text-xs bg-surface-elevated border border-border-subtle text-fg-primary hover:border-accent-interactive focus-visible:outline-2 focus-visible:outline-accent-interactive transition-colors"
                >
                  [01] Telemetry
                </button>
                <button
                  type="button"
                  id="roving-item-2"
                  class="px-3 py-2 rounded font-mono text-xs bg-surface-elevated border border-border-subtle text-fg-primary hover:border-accent-interactive focus-visible:outline-2 focus-visible:outline-accent-interactive transition-colors"
                >
                  [02] Actuators
                </button>
                <button
                  type="button"
                  id="roving-item-3"
                  disabled
                  class="px-3 py-2 rounded font-mono text-xs bg-surface-muted border border-border-subtle text-fg-muted opacity-40 cursor-not-allowed"
                >
                  [03] Disabled
                </button>
                <button
                  type="button"
                  id="roving-item-4"
                  class="px-3 py-2 rounded font-mono text-xs bg-surface-elevated border border-border-subtle text-fg-primary hover:border-accent-interactive focus-visible:outline-2 focus-visible:outline-accent-interactive transition-colors"
                >
                  [04] Inertial
                </button>
                <button
                  type="button"
                  id="roving-item-5"
                  class="px-3 py-2 rounded font-mono text-xs bg-surface-elevated border border-border-subtle text-fg-primary hover:border-accent-interactive focus-visible:outline-2 focus-visible:outline-accent-interactive transition-colors"
                >
                  [05] Power Bus
                </button>
              </div>
            </div>
          {:else if activeTab === 'announcer'}
            <div class="max-w-lg mx-auto space-y-4">
              <div class="flex items-center justify-between pb-2 border-b border-border-subtle">
                <span class="text-xs font-mono font-bold text-fg-primary"
                  >LIVE REGION ANNOUNCER (ARIA-LIVE)</span
                >
                <span class="text-[10px] font-mono text-status-nominal font-bold">
                  DUAL MOUNTED (POLITE + ASSERTIVE)
                </span>
              </div>

              <div
                class="p-4 bg-surface-canvas rounded-lg border border-border-subtle space-y-3 font-mono text-xs"
              >
                <div>
                  <label for="announcer-message-input" class="block text-fg-muted mb-1"
                    >Message Payload</label
                  >
                  >
                  <input
                    id="announcer-message-input"
                    type="text"
                    bind:value={announceMessage}
                    class="w-full px-3 py-1.5 bg-surface-elevated border border-border-subtle rounded text-fg-primary focus-visible:outline-2 focus-visible:outline-accent-interactive"
                  />
                </div>

                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    class="flex-1 px-3 py-1.5 rounded font-bold transition-colors bg-accent-interactive text-accent-contrast focus-visible:outline-2 focus-visible:outline-accent-interactive"
                    onclick={() => {
                      announcePoliteness = 'polite';
                      sendAnnouncement();
                    }}
                  >
                    Announce (Polite)
                  </button>
                  <button
                    type="button"
                    class="flex-1 px-3 py-1.5 rounded font-bold transition-colors bg-status-critical text-white focus-visible:outline-2 focus-visible:outline-accent-interactive"
                    onclick={() => {
                      announcePoliteness = 'assertive';
                      sendAnnouncement();
                    }}
                  >
                    Announce (Assertive)
                  </button>
                </div>
              </div>

              <!-- Recent Announcements Log -->
              <div class="space-y-1 font-mono text-xs">
                <span class="text-[10px] text-fg-muted uppercase tracking-wider"
                  >Recent Dispatch Log:</span
                >
                >
                {#if announcementLog.length === 0}
                  <div
                    class="p-3 bg-surface-canvas/60 rounded border border-border-subtle text-fg-muted text-[11px]"
                  >
                    No announcements dispatched yet. Click a button above.
                  </div>
                {:else}
                  <div class="space-y-1.5">
                    {#each announcementLog as log}
                      <div
                        class="p-2 bg-surface-canvas rounded border border-border-subtle flex items-center justify-between gap-2 text-[11px]"
                      >
                        <span class="text-fg-muted">{log.time}</span>
                        <span class="truncate flex-1 font-semibold text-fg-primary">{log.text}</span
                        >
                        <span
                          class="px-1.5 py-0.2 rounded uppercase text-[9px] font-bold {log.mode ===
                          'assertive'
                            ? 'bg-status-critical/20 text-status-critical'
                            : 'bg-accent-interactive/30 text-fg-primary'}"
                        >
                          {log.mode}
                        </span>
                      </div>
                    {/each}
                  </div>
                {/if}
              </div>
            </div>
          {/if}
        </div>
      </div>
    </section>

    <!-- Zone 2: Reactive Prop Controls (Top-Right, 5 Cols) -->
    <section class="lg:col-span-5 space-y-4">
      <span class="text-xs font-mono text-fg-muted">Controls</span>

      <div class="space-y-5 font-mono text-xs">
        {#if activeTab === 'composite'}
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-fg-primary font-bold">Operator Gate Status:</span>
              <button
                type="button"
                class="px-3 py-1 rounded transition-colors font-bold {labGateOpen
                  ? 'bg-status-nominal text-white'
                  : 'bg-surface-canvas text-fg-muted border border-border-subtle hover:text-fg-primary'}"
                onclick={() => {
                  labGateOpen = !labGateOpen;
                  if (labGateOpen) {
                    Announcer.announce('Diagnostic gate opened via reactive control.', 'polite');
                  } else {
                    Announcer.announce(
                      'Diagnostic gate closed via reactive control. Focus restored.',
                      'polite'
                    );
                  }
                }}
              >
                {labGateOpen ? 'CONFINED (LOCKED)' : 'STANDBY'}
              </button>
            </div>
            <p class="text-[11px] text-fg-muted leading-relaxed">
              Coordinates all 3 primitives: <code>useFocusTrap</code> confines the modal boundary,{' '}
              <code>useRovingTabindex</code> allows arrow-key traversal across the diagnostic
              actions, and <code>Announcer</code> reports all state changes to assistive technologies.
            </p>
          </div>
        {:else if activeTab === 'focus-trap'}
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-fg-primary font-bold">Trap Enabled:</span>
              <button
                type="button"
                class="px-3 py-1 rounded transition-colors font-bold {trapEnabled
                  ? 'bg-status-nominal text-white'
                  : 'bg-surface-canvas text-fg-muted border border-border-subtle hover:text-fg-primary'}"
                onclick={() => (trapEnabled = !trapEnabled)}
              >
                {trapEnabled ? 'ENABLED (TRUE)' : 'DISABLED (FALSE)'}
              </button>
            </div>
            <p class="text-[11px] text-fg-muted leading-relaxed">
              When enabled, <code>useFocusTrap</code> prevents the Tab key from escaping the DOM container,
              wrapping cyclically around the first and last focusable nodes. When disabled, focus is restored
              to the previous active element.
            </p>
          </div>
        {:else if activeTab === 'roving-tabindex'}
          <div class="space-y-4">
            <div>
              <span class="text-fg-primary font-bold block mb-1.5">Navigation Orientation:</span>
              <div
                class="flex items-center gap-1 bg-surface-canvas p-1 rounded border border-border-subtle"
              >
                <button
                  type="button"
                  class="flex-1 py-1 rounded text-center transition-colors {rovingOrientation ===
                  'horizontal'
                    ? 'bg-accent-interactive text-accent-contrast font-bold'
                    : 'text-fg-muted'}"
                  onclick={() => (rovingOrientation = 'horizontal')}
                >
                  Horizontal
                </button>
                <button
                  type="button"
                  class="flex-1 py-1 rounded text-center transition-colors {rovingOrientation ===
                  'vertical'
                    ? 'bg-accent-interactive text-accent-contrast font-bold'
                    : 'text-fg-muted'}"
                  onclick={() => (rovingOrientation = 'vertical')}
                >
                  Vertical
                </button>
                <button
                  type="button"
                  class="flex-1 py-1 rounded text-center transition-colors {rovingOrientation ===
                  'both'
                    ? 'bg-accent-interactive text-accent-contrast font-bold'
                    : 'text-fg-muted'}"
                  onclick={() => (rovingOrientation = 'both')}
                >
                  Both
                </button>
              </div>
            </div>

            <div class="flex items-center justify-between pt-2 border-t border-border-subtle">
              <span class="text-fg-primary font-bold">Boundary Loop:</span>
              <button
                type="button"
                class="px-3 py-1 rounded transition-colors font-bold {rovingLoop
                  ? 'bg-accent-interactive text-accent-contrast'
                  : 'bg-surface-canvas text-fg-muted border border-border-subtle'}"
                onclick={() => (rovingLoop = !rovingLoop)}
              >
                {rovingLoop ? 'LOOP: TRUE' : 'LOOP: FALSE'}
              </button>
            </div>
          </div>
        {:else if activeTab === 'announcer'}
          <div class="space-y-4">
            <div>
              <label for="control-announce-text" class="text-fg-primary font-bold block mb-1.5"
                >Default Announcement Text:</label
              >
              <input
                id="control-announce-text"
                type="text"
                bind:value={announceMessage}
                class="w-full px-3 py-1.5 bg-surface-canvas border border-border-subtle rounded text-fg-primary focus-visible:outline-2 focus-visible:outline-accent-interactive"
              />
            </div>

            <div>
              <span class="text-fg-primary font-bold block mb-1.5">Politeness Level:</span>
              <div
                class="flex items-center gap-1 bg-surface-canvas p-1 rounded border border-border-subtle"
              >
                <button
                  type="button"
                  class="flex-1 py-1 rounded text-center transition-colors {announcePoliteness ===
                  'polite'
                    ? 'bg-accent-interactive text-accent-contrast font-bold'
                    : 'text-fg-muted'}"
                  onclick={() => (announcePoliteness = 'polite')}
                >
                  Polite
                </button>
                <button
                  type="button"
                  class="flex-1 py-1 rounded text-center transition-colors {announcePoliteness ===
                  'assertive'
                    ? 'bg-status-critical text-white font-bold'
                    : 'text-fg-muted'}"
                  onclick={() => (announcePoliteness = 'assertive')}
                >
                  Assertive
                </button>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </section>

    <!-- Zone 3: Live A11y & DOM Telemetry Drawer (Bottom-Left, 7 Cols) -->
    <section class="lg:col-span-7 space-y-4">
      <span class="text-xs font-mono text-fg-muted">Telemetry</span>

      <div class="font-mono text-xs space-y-3">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div class="p-3 bg-surface-canvas rounded border border-border-subtle">
            <div class="text-fg-muted text-[10px] uppercase">activeElement</div>
            <div class="text-fg-primary font-bold mt-1 truncate" title={activeElementTag}>
              {activeElementTag}
            </div>
          </div>
          <div class="p-3 bg-surface-canvas rounded border border-border-subtle">
            <div class="text-fg-muted text-[10px] uppercase">computedRole</div>
            <div class="text-accent-interactive font-bold mt-1 truncate">
              {computedRole}
            </div>
          </div>
          <div class="p-3 bg-surface-canvas rounded border border-border-subtle">
            <div class="text-fg-muted text-[10px] uppercase">lastKeyPressed</div>
            <div class="text-status-nominal font-bold mt-1">
              {lastKeyPressed}
            </div>
          </div>
          <div class="p-3 bg-surface-canvas rounded border border-border-subtle">
            <div class="text-fg-muted text-[10px] uppercase">announcerNodes</div>
            <div class="text-fg-primary font-bold mt-1">2 Live Regions</div>
          </div>
        </div>

        <div class="p-3 bg-surface-canvas rounded border border-border-subtle space-y-1">
          <div class="text-fg-muted text-[10px] uppercase">ariaAttributes Map:</div>
          <pre
            class="text-[11px] text-fg-primary overflow-x-auto p-1 leading-relaxed">{JSON.stringify(
              ariaState,
              null,
              2
            )}</pre>
        </div>
      </div>
    </section>

    <!-- Zone 4: Dynamic Svelte 5 Code Output (Bottom-Right, 5 Cols) -->
    <section class="lg:col-span-5 space-y-4">
      <div class="flex items-center justify-between gap-2 font-mono text-xs">
        <span class="text-fg-muted">Code</span>
        <button
          type="button"
          class="text-xs text-accent-interactive hover:underline focus-visible:outline-2 focus-visible:outline-accent-interactive rounded"
          onclick={copySnippet}
        >
          {copied ? '✓ COPIED' : '[COPY SNIPPET]'}
        </button>
      </div>

      <pre
        class="p-3 bg-surface-canvas border border-border-subtle rounded text-[11px] text-fg-primary overflow-x-auto leading-relaxed">
        {generatedCode}
      </pre>
    </section>
  </div>
</div>
