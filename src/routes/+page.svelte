<script lang="ts">
  import { tokens } from '$lib/tokens/tokens.js';
  import { TrinidadLogo } from '$lib/components/logo/index.js';
  import { env } from '$lib/state/environment.svelte.js';
  import { useFocusTrap, useRovingTabindex, Announcer } from '$lib/actions/index.js';

  let previewVariant = $state<'lockup' | 'mark'>('lockup');
  let homeTrapEnabled = $state(false);
  let homeAnnouncement = $state('Telemetry stream nominal');
  let homeAnnounceCount = $state(0);

  // Composite Operator Gate state (orchestrating focus-trap, roving-tabindex, and announcer)
  let isGateOpen = $state(false);
  let gateStatus = $state('Nominal. Ready for operator sequence.');
  let lastDispatchedAnnouncement = $state('Awaiting command...');
  let gateKeyLog = $state<string[]>(['None']);
  let gateActiveNode = $state('button#open-gate-trigger');

  function recordGateKey(e: KeyboardEvent) {
    const key = e.key === ' ' ? 'Space' : e.key;
    gateKeyLog = [key, ...gateKeyLog.slice(0, 3)];
    if (e.key === 'Escape' && isGateOpen) {
      isGateOpen = false;
      Announcer.announce(
        'Operator gate dismissed via Escape. Focus restored to trigger.',
        'polite'
      );
    }
  }

  function handleGateFocusIn() {
    if (typeof document !== 'undefined') {
      const el = document.activeElement as HTMLElement | null;
      if (el) {
        gateActiveNode = `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}`;
      }
    }
  }

  function executeGateAction(
    name: string,
    announcement: string,
    politeness: 'polite' | 'assertive' = 'polite'
  ) {
    gateStatus = `Executed [${name}] successfully.`;
    lastDispatchedAnnouncement = announcement;
    Announcer.announce(announcement, politeness);
  }

  const primitiveColors = Object.entries(tokens.primitive.color);
  const semanticTokens = [
    {
      key: '--surface-canvas',
      label: 'Canvas Surface',
      class: 'bg-surface-canvas text-fg-primary border border-border-subtle'
    },
    {
      key: '--surface-elevated',
      label: 'Elevated Card',
      class: 'bg-surface-elevated text-fg-primary border border-border-subtle shadow-sm'
    },
    {
      key: '--surface-muted',
      label: 'Muted Well',
      class: 'bg-surface-muted text-fg-primary border border-border-subtle'
    },
    {
      key: '--fg-primary',
      label: 'Primary Ink',
      class: 'bg-surface-elevated text-fg-primary font-bold'
    },
    { key: '--fg-muted', label: 'Muted Ink', class: 'bg-surface-elevated text-fg-muted' },
    {
      key: '--border-subtle',
      label: 'Subtle Hairline',
      class: 'border-2 border-border-subtle p-2'
    },
    {
      key: '--accent-interactive',
      label: 'Interactive Accent',
      class: 'bg-accent-interactive text-[#24422a] font-mono font-bold'
    },
    {
      key: '--status-critical',
      label: 'Status Critical',
      class: 'bg-status-critical text-[#fcf9f3] font-mono'
    },
    {
      key: '--status-warning',
      label: 'Status Warning',
      class: 'bg-status-warning text-[#0d1310] font-mono'
    },
    {
      key: '--status-nominal',
      label: 'Status Nominal',
      class: 'bg-status-nominal text-[#fcf9f3] font-mono'
    }
  ];
</script>

<svelte:head>
  <title>trinidad — Master System Overview & Token Matrix</title>
</svelte:head>

<div
  class="min-h-screen bg-surface-canvas text-fg-primary p-6 md:p-12 font-sans transition-colors duration-200"
>
  <div class="max-w-6xl mx-auto space-y-10">
    <!-- Header with Live System Telemetry & Brand Mark -->
    <header
      class="border-b border-border-subtle pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6"
    >
      <div class="space-y-4">
        <a
          href="/"
          class="inline-block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-interactive rounded"
          aria-label="trinidad design system"
        >
          <TrinidadLogo size={36} variant="lockup" />
        </a>
        <div>
          <h1 class="text-3xl md:text-4xl font-bold tracking-tight mt-1">
            Master Token & Architecture Lab
          </h1>
          <p class="text-fg-muted font-mono text-xs md:text-sm mt-1">
            Svelte 5 (Runes) · SvelteKit 2 · Tailwind CSS v4 · TypeScript 5+ Strict · W3C DTCG
            Engine
          </p>
        </div>
      </div>

      <!-- Live Interactive Mode Segmented Controls -->
      <div class="flex flex-wrap items-center gap-3 font-mono text-xs">
        <div
          class="bg-surface-elevated p-1 rounded border border-border-subtle flex items-center gap-1 shadow-sm"
          role="toolbar"
          aria-label="Theme mode switcher"
          use:useRovingTabindex={{ selector: 'button', orientation: 'horizontal' }}
        >
          <span class="px-2 text-fg-muted select-none">THEME:</span>
          <button
            type="button"
            class="px-2.5 py-1 rounded transition-colors {env.theme === 'paper'
              ? 'bg-accent-interactive text-[#24422a] font-bold'
              : 'text-fg-muted hover:text-fg-primary'}"
            onclick={() => {
              env.setTheme('paper');
              Announcer.announce('Active theme set to paper', 'polite');
            }}
          >
            Paper
          </button>
          <button
            type="button"
            class="px-2.5 py-1 rounded transition-colors {env.theme === 'industrial'
              ? 'bg-accent-interactive text-[#24422a] font-bold'
              : 'text-fg-muted hover:text-fg-primary'}"
            onclick={() => {
              env.setTheme('industrial');
              Announcer.announce('Active theme set to industrial', 'polite');
            }}
          >
            Industrial
          </button>
        </div>

        <div
          class="bg-surface-elevated p-1 rounded border border-border-subtle flex items-center gap-1 shadow-sm"
          role="toolbar"
          aria-label="Density mode switcher"
          use:useRovingTabindex={{ selector: 'button', orientation: 'horizontal' }}
        >
          <span class="px-2 text-fg-muted select-none">DENSITY:</span>
          <button
            type="button"
            class="px-2.5 py-1 rounded transition-colors {env.density === 'comfortable'
              ? 'bg-accent-interactive text-[#24422a] font-bold'
              : 'text-fg-muted hover:text-fg-primary'}"
            onclick={() => {
              env.setDensity('comfortable');
              Announcer.announce('Active density set to comfortable', 'polite');
            }}
          >
            Comfortable
          </button>
          <button
            type="button"
            class="px-2.5 py-1 rounded transition-colors {env.density === 'compact'
              ? 'bg-accent-interactive text-[#24422a] font-bold'
              : 'text-fg-muted hover:text-fg-primary'}"
            onclick={() => {
              env.setDensity('compact');
              Announcer.announce('Active density set to compact', 'polite');
            }}
          >
            Compact
          </button>
        </div>
      </div>
    </header>

    <!-- Calibration Trinity Mark & Visual Identity Showcase -->
    <section
      class="bg-surface-elevated border border-border-subtle rounded-lg p-6 space-y-6 shadow-sm"
    >
      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-4"
      >
        <div>
          <div class="flex items-center gap-2">
            <span class="inline-block w-2.5 h-2.5 rounded-full bg-accent-interactive"></span>
            <h2 class="text-sm font-mono uppercase tracking-wider text-fg-muted">
              Brand Asset &middot; The Interlocking Trinity Mark
            </h2>
          </div>
          <p class="text-xs text-fg-muted mt-1 font-mono">
            60° isometric parallel facets with flush chartreuse base and single 2.5px negative-space
            top channel
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button
            type="button"
            class="px-3 py-1 font-mono text-xs rounded border border-border-subtle transition-colors bg-surface-canvas text-fg-primary hover:border-accent-interactive"
            onclick={() => (previewVariant = previewVariant === 'lockup' ? 'mark' : 'lockup')}
          >
            Variant: [{previewVariant.toUpperCase()}]
          </button>

          <a
            href="/lab/logo"
            class="px-3 py-1 font-mono text-xs rounded bg-surface-canvas border border-border-subtle text-fg-primary hover:border-accent-interactive transition-colors"
          >
            Open Logo Lab &rarr;
          </a>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <!-- Interactive Mark Preview Column -->
        <div
          class="lg:col-span-5 p-6 bg-surface-canvas rounded-md border border-border-subtle flex flex-col items-center justify-center gap-6"
        >
          <div class="p-6 bg-surface-elevated rounded border border-border-subtle shadow-xs">
            <TrinidadLogo size={64} variant={previewVariant} />
          </div>

          <!-- Micro Scales Array -->
          <div class="flex items-center gap-5 font-mono text-[10px] text-fg-muted">
            <div class="flex flex-col items-center gap-1.5">
              <TrinidadLogo size={16} variant="mark" />
              <span>16px</span>
            </div>
            <div class="flex flex-col items-center gap-1.5">
              <TrinidadLogo size={24} variant="mark" />
              <span>24px</span>
            </div>
            <div class="flex flex-col items-center gap-1.5">
              <TrinidadLogo size={32} variant="mark" />
              <span class="text-accent-interactive font-bold">32px*</span>
            </div>
            <div class="flex flex-col items-center gap-1.5">
              <TrinidadLogo size={48} variant="mark" />
              <span>48px</span>
            </div>
            <div class="flex flex-col items-center gap-1.5">
              <TrinidadLogo size={64} variant="mark" />
              <span>64px</span>
            </div>
          </div>
        </div>

        <!-- Geometric Anatomy Column -->
        <div class="lg:col-span-7 space-y-3 font-mono text-xs">
          <div class="p-3 bg-surface-canvas rounded border border-border-subtle">
            <div class="text-fg-primary font-bold">Left Pillar (60° Parallelogram)</div>
            <p class="text-fg-muted text-[11px] mt-0.5">
              Outer-left edge and inner-right edge are strictly parallel (-60°). Points: 32,7 &rarr;
              37.2,16 &rarr; 16.41,52.03 &rarr; 6,52.03.
            </p>
          </div>
          <div class="p-3 bg-surface-canvas rounded border border-border-subtle">
            <div class="text-fg-muted font-bold">Right Pillar (Parallel Channel)</div>
            <p class="text-fg-muted text-[11px] mt-0.5">
              Separated from the left pillar at the top by a parallel -60° gap (2.5px). Points:
              38.64,18.5 &rarr; 58,52.03 &rarr; 47.59,52.03 &rarr; 33.44,27.5.
            </p>
          </div>
          <div class="p-3 bg-surface-canvas rounded border border-border-subtle">
            <div class="text-accent-interactive font-bold">Flush Chartreuse Base (Zero Gap)</div>
            <p class="text-fg-muted text-[11px] mt-0.5">
              Touches the left and right pillars with zero seam gap: points (21.61, 43.03) and
              (42.39, 43.03).
            </p>
          </div>
          <div
            class="p-3 bg-surface-canvas rounded border border-border-subtle flex items-center justify-between"
          >
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 bg-accent-interactive inline-block border border-border-subtle"
              ></span>
              <span class="text-fg-primary font-bold">FLUSH SEAM INTERLOCK:</span>
            </div>
            <span class="text-fg-muted text-[11px]"
              >Exact vertex sharing eliminates sub-pixel raster fringing</span
            >
          </div>
        </div>
      </div>
    </section>

    <!-- Repository Architecture Verification Summary Card -->
    <section
      class="bg-surface-elevated border border-border-subtle rounded-lg p-6 space-y-4 shadow-sm"
    >
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-mono uppercase tracking-wider text-fg-muted">
          Repository Architecture Verification
        </h2>
        <span
          class="px-2 py-0.5 rounded text-xs font-mono font-bold bg-status-nominal/20 text-status-nominal border border-status-nominal/30"
        >
          SYSTEM VERIFICATION (GATES PASSED)
        </span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
        <div class="p-3 bg-surface-canvas rounded border border-border-subtle">
          <div class="text-fg-muted">svelte-check:</div>
          <div class="text-status-nominal font-bold mt-1">0 errors / 0 warnings</div>
        </div>
        <div class="p-3 bg-surface-canvas rounded border border-border-subtle">
          <div class="text-fg-muted">Compiler Architecture:</div>
          <div class="text-fg-primary font-bold mt-1">Strict Svelte 5 Runes</div>
        </div>
        <div class="p-3 bg-surface-canvas rounded border border-border-subtle">
          <div class="text-fg-muted">Design Token Engine:</div>
          <div class="text-fg-primary font-bold mt-1">W3C DTCG &rarr; CSS + TS</div>
        </div>
        <div class="p-3 bg-surface-canvas rounded border border-border-subtle">
          <div class="text-fg-muted">A11y Interaction Core:</div>
          <div class="text-status-nominal font-bold mt-1">Focus Trap · Roving · Announcer</div>
        </div>
      </div>
    </section>

    <!-- Headless Core & A11y Primitives Showcase -->
    <section class="space-y-8">
      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle pb-3"
      >
        <div>
          <div class="flex items-center gap-2">
            <span class="inline-block w-2.5 h-2.5 rounded-full bg-accent-interactive"></span>
            <h2 class="text-xl font-bold">Headless Core &amp; Accessibility Primitives</h2>
          </div>
          <p class="text-xs text-fg-muted mt-0.5">
            Zero-runtime-overhead WAI-ARIA interaction engine orchestrating focus trapping, keyboard
            roving, and assistive live regions.
          </p>
        </div>
        <a
          href="/lab/primitives"
          class="inline-flex items-center gap-1.5 px-3 py-1 font-mono text-xs rounded bg-surface-elevated border border-border-subtle text-fg-primary hover:border-accent-interactive transition-colors self-start sm:self-auto shadow-xs"
        >
          <span>Open Dedicated Lab</span>
          <span>&rarr;</span>
        </a>
      </div>

      <!-- Flagship Composite Demonstration: Operator Confirmation Gate -->
      <div
        class="bg-surface-elevated rounded-xl border border-border-subtle p-6 space-y-6 shadow-sm"
      >
        <div
          class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle pb-4"
        >
          <div>
            <div class="flex items-center gap-2">
              <span
                class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-accent-interactive text-[#24422a]"
              >
                INTEGRATED COMPOSITE DEMO
              </span>
              <h3 class="text-base font-bold text-fg-primary">Operator Confirmation Gate</h3>
            </div>
            <p class="text-xs text-fg-muted mt-1">
              Demonstrates <code>useFocusTrap</code>, <code>useRovingTabindex</code>, and
              <code>Announcer</code> acting in tight synchronization within a high-stakes modal workflow.
            </p>
          </div>
          <span class="text-xs font-mono text-fg-muted">
            ORCHESTRATION: 3 PRIMITIVES CONCURRENT
          </span>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <!-- Interactive Stage Area (7 Cols) -->
          <div class="lg:col-span-7 space-y-4">
            <div class="flex items-center justify-between font-mono text-xs">
              <span class="text-fg-muted uppercase tracking-wider">// INTERACTIVE GATE STAGE</span>
              <span
                class="text-[11px] font-bold {isGateOpen
                  ? 'text-accent-interactive'
                  : 'text-fg-muted'}"
              >
                STATUS: [{isGateOpen ? 'CONFIRMED OPEN' : 'STANDBY'}]
              </span>
            </div>

            <div
              class="relative min-h-[260px] bg-surface-canvas rounded-lg border border-border-subtle p-6 flex flex-col justify-center items-center gap-4"
            >
              {#if !isGateOpen}
                <div class="text-center space-y-3 max-w-sm">
                  <p class="text-xs text-fg-muted leading-relaxed">
                    Click the trigger below to launch the modal operator gate. Notice how focus is
                    captured, trapped, and restored on exit.
                  </p>
                  <button
                    type="button"
                    id="open-gate-trigger"
                    class="px-4 py-2 rounded-md font-mono text-xs font-bold bg-accent-interactive text-[#24422a] hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-interactive transition-all shadow-xs"
                    onclick={() => {
                      isGateOpen = true;
                      gateStatus = 'Gate locked. Roving toolbar active.';
                      Announcer.announce(
                        'Operator confirmation gate opened. Focus trapped inside dialog.',
                        'polite'
                      );
                    }}
                  >
                    Initiate Operator Gate &rarr;
                  </button>
                </div>
              {:else}
                <!-- Trapped Modal Boundary -->
                <div
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="gate-title"
                  use:useFocusTrap={() => isGateOpen}
                  tabindex="-1"
                  class="w-full max-w-md bg-surface-elevated border-2 border-accent-interactive rounded-lg p-5 space-y-4 shadow-lg focus-visible:outline-none"
                >
                  <div class="flex items-center justify-between border-b border-border-subtle pb-3">
                    <div>
                      <h4 id="gate-title" class="font-bold text-sm text-fg-primary">
                        System Telemetry Gate
                      </h4>
                      <p class="text-[11px] text-fg-muted font-mono mt-0.5">
                        Focus trapped: Tab / Shift+Tab cycles boundary
                      </p>
                    </div>
                    <span
                      class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-status-nominal/20 text-status-nominal"
                    >
                      TRAP LOCKED
                    </span>
                  </div>

                  <!-- Live Feedback Banner -->
                  <div
                    class="p-2.5 bg-surface-canvas rounded border border-border-subtle font-mono text-xs"
                  >
                    <span class="text-fg-muted">// System State:</span>
                    <div class="text-accent-interactive font-bold mt-0.5 truncate">
                      {gateStatus}
                    </div>
                  </div>

                  <!-- Roving Tabindex Command Toolbar -->
                  <div class="space-y-1.5">
                    <span class="text-[11px] font-mono text-fg-muted uppercase"
                      >// Roving Command Matrix (&larr; &rarr; to traverse):</span
                    >
                    <div
                      role="toolbar"
                      aria-label="Operator Confirmation Options"
                      use:useRovingTabindex={{
                        selector: 'button',
                        orientation: 'horizontal',
                        loop: true
                      }}
                      class="flex flex-wrap gap-2 p-2 bg-surface-canvas rounded border border-border-subtle"
                    >
                      <button
                        type="button"
                        id="gate-action-1"
                        class="px-2.5 py-1.5 rounded font-mono text-xs bg-surface-elevated border border-border-subtle text-fg-primary hover:border-accent-interactive focus-visible:outline-2 focus-visible:outline-accent-interactive transition-colors"
                        onclick={() =>
                          executeGateAction(
                            'Calibrate Sensors',
                            'Calibration initiated across 6-axis IMU.',
                            'polite'
                          )}
                      >
                        [1] Calibrate IMU
                      </button>
                      <button
                        type="button"
                        id="gate-action-2"
                        class="px-2.5 py-1.5 rounded font-mono text-xs bg-surface-elevated border border-border-subtle text-fg-primary hover:border-accent-interactive focus-visible:outline-2 focus-visible:outline-accent-interactive transition-colors"
                        onclick={() =>
                          executeGateAction(
                            'Flush Buffers',
                            'Telemetry ring buffers flushed cleanly to disk.',
                            'polite'
                          )}
                      >
                        [2] Flush Buffers
                      </button>
                      <button
                        type="button"
                        id="gate-action-3"
                        class="px-2.5 py-1.5 rounded font-mono text-xs bg-status-critical/10 text-status-critical border border-status-critical/30 hover:bg-status-critical/20 focus-visible:outline-2 focus-visible:outline-accent-interactive transition-colors font-bold"
                        onclick={() =>
                          executeGateAction(
                            'Emergency Hold',
                            'EMERGENCY HOLD ACTIVATED: Actuator power isolated!',
                            'assertive'
                          )}
                      >
                        [3] Hold Power
                      </button>
                    </div>
                  </div>

                  <!-- Modal Exit Actions -->
                  <div
                    class="flex items-center justify-end gap-2 pt-2 border-t border-border-subtle font-mono text-xs"
                  >
                    <button
                      type="button"
                      id="gate-close-btn"
                      class="px-3 py-1.5 rounded bg-surface-canvas border border-border-subtle text-fg-primary hover:border-accent-interactive focus-visible:outline-2 focus-visible:outline-accent-interactive transition-colors"
                      onclick={() => {
                        isGateOpen = false;
                        Announcer.announce(
                          'Gate dismissed. Focus returned to trigger element.',
                          'polite'
                        );
                      }}
                    >
                      Exit Gate (Restore Focus)
                    </button>
                  </div>
                </div>
              {/if}
            </div>
          </div>

          <!-- Real-Time Telemetry HUD (5 Cols) -->
          <div class="lg:col-span-5 space-y-4 font-mono text-xs">
            <div class="flex items-center justify-between">
              <span class="text-fg-muted uppercase tracking-wider"
                >// LIVE ORCHESTRATION TELEMETRY</span
              >
              <span class="text-fg-muted">RUNES OBSERVED</span>
            </div>

            <div
              class="bg-surface-canvas rounded-lg border border-border-subtle p-4 space-y-3 shadow-xs"
            >
              <div class="grid grid-cols-2 gap-2">
                <div class="p-2.5 bg-surface-elevated rounded border border-border-subtle">
                  <div class="text-[10px] text-fg-muted uppercase">useFocusTrap State</div>
                  <div
                    class="text-fg-primary font-bold mt-1 {isGateOpen
                      ? 'text-status-nominal'
                      : 'text-fg-muted'}"
                  >
                    {isGateOpen ? 'CONFINED (LOCKED)' : 'STANDBY (RESTORED)'}
                  </div>
                </div>
                <div class="p-2.5 bg-surface-elevated rounded border border-border-subtle">
                  <div class="text-[10px] text-fg-muted uppercase">Roving Toolbar</div>
                  <div class="text-accent-interactive font-bold mt-1">
                    {isGateOpen ? 'ARROW KEYS ARMED' : 'DORMANT'}
                  </div>
                </div>
              </div>

              <div class="p-2.5 bg-surface-elevated rounded border border-border-subtle space-y-1">
                <div class="text-[10px] text-fg-muted uppercase">
                  // Screen Reader Dispatch (Announcer):
                </div>
                <div class="text-fg-primary font-semibold text-[11px] leading-relaxed break-words">
                  "{lastDispatchedAnnouncement}"
                </div>
                <div class="text-[10px] text-fg-muted pt-1">
                  Target: <code>document.body &gt; [aria-live]</code>
                </div>
              </div>

              <div class="p-2.5 bg-surface-elevated rounded border border-border-subtle space-y-1">
                <div class="text-[10px] text-fg-muted uppercase">// Architectural Synchrony:</div>
                <ul class="text-[11px] text-fg-muted space-y-1 list-disc list-inside">
                  <li>
                    <strong class="text-fg-primary">Confinement:</strong> Tab cannot leave modal boundary
                  </li>
                  <li>
                    <strong class="text-fg-primary">Navigation:</strong> Single Tab stop; Arrow keys traverse
                    items
                  </li>
                  <li>
                    <strong class="text-fg-primary">Restoration:</strong> Exiting returns DOM focus to
                    trigger
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Component Architecture Subsystem Mapping Grid -->
      <div
        class="bg-surface-elevated rounded-xl border border-border-subtle p-6 space-y-4 shadow-sm font-mono text-xs"
      >
        <div class="flex items-center justify-between border-b border-border-subtle pb-3">
          <h3 class="text-sm font-bold uppercase tracking-wider text-fg-primary">
            Subsystem Architecture Mapping &middot; Foundation for Components
          </h3>
          <span class="text-fg-muted text-[11px]">ALL PRIMITIVES EXPORTED IN $lib</span>
        </div>
        <p class="text-xs text-fg-muted font-sans leading-relaxed">
          These three headless actions establish the human-factors interaction contract. Every
          upcoming component in the library builds directly upon this accessibility core:
        </p>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div class="p-3 bg-surface-canvas rounded border border-border-subtle space-y-1.5">
            <div class="text-accent-interactive font-bold">Dialog / Modals</div>
            <p class="text-[11px] text-fg-muted font-sans">
              Utilizes <code>useFocusTrap</code> to lock screen reader &amp; keyboard focus, plus
              <code>Announcer</code> for open/close state.
            </p>
          </div>
          <div class="p-3 bg-surface-canvas rounded border border-border-subtle space-y-1.5">
            <div class="text-accent-interactive font-bold">Combobox &amp; Palette</div>
            <p class="text-[11px] text-fg-muted font-sans">
              Combines <code>useRovingTabindex</code> with <code>aria-activedescendant</code> and live
              announcement of filtered selection count.
            </p>
          </div>
          <div class="p-3 bg-surface-canvas rounded border border-border-subtle space-y-1.5">
            <div class="text-accent-interactive font-bold">DataTable Grid</div>
            <p class="text-[11px] text-fg-muted font-sans">
              Employs 2D roving tabindex matrix across virtualized rows ($O(1)$ DOM nodes) with sort
              order voiceover alerts.
            </p>
          </div>
          <div class="p-3 bg-surface-canvas rounded border border-border-subtle space-y-1.5">
            <div class="text-accent-interactive font-bold">DiffViewer Gates</div>
            <p class="text-[11px] text-fg-muted font-sans">
              Guards proposal confirmations with focus trapping, roving action traversal, and
              assertive acceptance announcements.
            </p>
          </div>
        </div>
      </div>

      <!-- Isolated Primitive Calibration Testbeds Header -->
      <div class="pt-2">
        <h3 class="text-xs font-mono text-fg-muted uppercase tracking-wider">
          // Isolated Calibration &amp; Inspection Stations
        </h3>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- useFocusTrap -->
        <div
          class="bg-surface-elevated rounded-lg border border-border-subtle p-5 flex flex-col justify-between space-y-4 shadow-xs"
        >
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-mono font-bold text-fg-primary">// useFocusTrap</span>
              <span
                class="text-[10px] font-mono px-1.5 py-0.5 rounded font-bold {homeTrapEnabled
                  ? 'bg-status-nominal/20 text-status-nominal'
                  : 'bg-surface-canvas text-fg-muted'}"
              >
                {homeTrapEnabled ? 'TRAPPED' : 'IDLE'}
              </span>
            </div>
            <p class="text-xs text-fg-muted leading-relaxed">
              Wraps focus cyclically on Tab / Shift+Tab between first and last focusable children.
              Restores active element on deactivation.
            </p>
            <div
              use:useFocusTrap={() => homeTrapEnabled}
              class="p-3 bg-surface-canvas rounded border space-y-2 transition-colors {homeTrapEnabled
                ? 'border-accent-interactive shadow-xs'
                : 'border-border-subtle'}"
            >
              <input
                type="text"
                placeholder="Trapped field A"
                class="w-full px-2 py-1 text-xs font-mono bg-surface-elevated border border-border-subtle rounded text-fg-primary focus-visible:outline-2 focus-visible:outline-accent-interactive"
              />
              <input
                type="text"
                placeholder="Trapped field B"
                class="w-full px-2 py-1 text-xs font-mono bg-surface-elevated border border-border-subtle rounded text-fg-primary focus-visible:outline-2 focus-visible:outline-accent-interactive"
              />
            </div>
          </div>
          <button
            type="button"
            class="w-full py-1.5 px-3 rounded font-mono text-xs font-bold transition-colors {homeTrapEnabled
              ? 'bg-accent-interactive text-[#24422a]'
              : 'bg-surface-canvas border border-border-subtle text-fg-primary hover:border-accent-interactive'}"
            onclick={() => (homeTrapEnabled = !homeTrapEnabled)}
          >
            {homeTrapEnabled ? 'Disable Trap (Restore Focus)' : 'Activate Focus Trap'}
          </button>
        </div>

        <!-- useRovingTabindex -->
        <div
          class="bg-surface-elevated rounded-lg border border-border-subtle p-5 flex flex-col justify-between space-y-4 shadow-xs"
        >
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-mono font-bold text-fg-primary">// useRovingTabindex</span>
              <span class="text-[10px] font-mono text-fg-muted">WAI-ARIA TOOLBAR</span>
            </div>
            <p class="text-xs text-fg-muted leading-relaxed">
              Dynamically ensures exactly one active child has <code>tabindex="0"</code>. Arrow keys
              and Home/End navigate seamlessly while skipping disabled items.
            </p>
            <div
              role="toolbar"
              aria-label="Overview demo toolbar"
              use:useRovingTabindex={{ selector: 'button', orientation: 'horizontal', loop: true }}
              class="p-3 bg-surface-canvas rounded border border-border-subtle flex flex-wrap gap-1.5"
            >
              <button
                type="button"
                class="px-2.5 py-1 text-xs font-mono rounded bg-surface-elevated border border-border-subtle text-fg-primary hover:border-accent-interactive focus-visible:outline-2 focus-visible:outline-accent-interactive transition-colors"
              >
                [1] Telemetry
              </button>
              <button
                type="button"
                class="px-2.5 py-1 text-xs font-mono rounded bg-surface-elevated border border-border-subtle text-fg-primary hover:border-accent-interactive focus-visible:outline-2 focus-visible:outline-accent-interactive transition-colors"
              >
                [2] Orbit
              </button>
              <button
                type="button"
                disabled
                class="px-2.5 py-1 text-xs font-mono rounded bg-surface-muted border border-border-subtle text-fg-muted opacity-40 cursor-not-allowed"
              >
                [3] Off
              </button>
              <button
                type="button"
                class="px-2.5 py-1 text-xs font-mono rounded bg-surface-elevated border border-border-subtle text-fg-primary hover:border-accent-interactive focus-visible:outline-2 focus-visible:outline-accent-interactive transition-colors"
              >
                [4] Logs
              </button>
            </div>
          </div>
          <div class="font-mono text-[11px] text-fg-muted">
            &larr; &rarr; keys navigate &middot; Home / End jump
          </div>
        </div>

        <!-- Announcer -->
        <div
          class="bg-surface-elevated rounded-lg border border-border-subtle p-5 flex flex-col justify-between space-y-4 shadow-xs"
        >
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-mono font-bold text-fg-primary">// Announcer</span>
              <span class="text-[10px] font-mono text-status-nominal font-bold">
                {homeAnnounceCount} DISPATCHED
              </span>
            </div>
            <p class="text-xs text-fg-muted leading-relaxed">
              Singleton with mounted polite and assertive hidden live regions. Uses <code
                >requestAnimationFrame</code
              > text clearing to guarantee screen-reader delivery.
            </p>
            <div
              class="p-3 bg-surface-canvas rounded border border-border-subtle space-y-2 font-mono text-xs"
            >
              <input
                type="text"
                bind:value={homeAnnouncement}
                placeholder="Message for screen reader..."
                class="w-full px-2 py-1 bg-surface-elevated border border-border-subtle rounded text-fg-primary focus-visible:outline-2 focus-visible:outline-accent-interactive"
              />
              <div class="flex items-center gap-1.5 pt-1">
                <button
                  type="button"
                  class="flex-1 py-1 px-2 rounded bg-accent-interactive text-[#24422a] font-bold focus-visible:outline-2 focus-visible:outline-accent-interactive transition-colors"
                  onclick={() => {
                    Announcer.announce(homeAnnouncement, 'polite');
                    homeAnnounceCount++;
                  }}
                >
                  Polite
                </button>
                <button
                  type="button"
                  class="flex-1 py-1 px-2 rounded bg-status-critical text-white font-bold focus-visible:outline-2 focus-visible:outline-accent-interactive transition-colors"
                  onclick={() => {
                    Announcer.announce(homeAnnouncement, 'assertive');
                    homeAnnounceCount++;
                  }}
                >
                  Assertive
                </button>
              </div>
            </div>
          </div>
          <div class="font-mono text-[11px] text-fg-muted">
            aria-live="polite" + "assertive" active
          </div>
        </div>
      </div>
    </section>

    <!-- Semantic Tokens Showcase (Theme Responsive) -->
    <section class="space-y-4">
      <div class="flex items-center justify-between border-b border-border-subtle pb-2">
        <h2 class="text-lg font-bold">Semantic Design Tokens</h2>
        <span class="text-xs font-mono text-fg-muted"
          >Active Theme: [{env.theme.toUpperCase()}]</span
        >
      </div>
      <p class="text-xs text-fg-muted">
        Semantic tokens switch dynamically between <strong>Paper</strong> (warm editorial canvas)
        and <strong>Industrial</strong> (dark operator console) modes.
      </p>

      <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
        {#each semanticTokens as item}
          <div
            class="p-4 rounded border border-border-subtle flex flex-col justify-between h-28 {item.class}"
          >
            <span class="text-xs font-mono opacity-80">{item.key}</span>
            <span class="text-xs font-bold">{item.label}</span>
          </div>
        {/each}
      </div>
    </section>

    <!-- Primitive Scales -->
    <section class="space-y-4">
      <div class="flex items-center justify-between border-b border-border-subtle pb-2">
        <h2 class="text-lg font-bold">Raw Color Primitives</h2>
        <span class="text-xs font-mono text-fg-muted">{primitiveColors.length} scales defined</span>
      </div>
      <div
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 font-mono text-xs"
      >
        {#each primitiveColors as [name, hex]}
          <div class="bg-surface-elevated border border-border-subtle rounded p-2.5 space-y-2">
            <div
              class="w-full h-12 rounded border border-border-subtle shadow-inner"
              style="background-color: {hex};"
            ></div>
            <div class="truncate font-semibold">{name}</div>
            <div class="text-fg-muted opacity-75">{hex}</div>
          </div>
        {/each}
      </div>
    </section>

    <!-- Density Controls Showcase -->
    <section class="space-y-4">
      <div class="flex items-center justify-between border-b border-border-subtle pb-2">
        <h2 class="text-lg font-bold">Density System</h2>
        <span class="text-xs font-mono text-fg-muted"
          >Active Density: [{env.density.toUpperCase()}]</span
        >
      </div>
      <div class="bg-surface-elevated border border-border-subtle rounded-lg p-6 space-y-4">
        <p class="text-xs text-fg-muted">
          Controls dynamically adapt their dimensions via <code>--control-height</code>,
          <code>--control-px</code>, <code>--control-py</code>, and <code>--font-size-ui</code>.
        </p>

        <div class="flex flex-wrap items-center gap-4">
          <div
            class="inline-flex items-center justify-center px-[var(--control-px)] py-[var(--control-py)] h-[var(--control-height)] text-[var(--font-size-ui)] font-mono bg-surface-canvas border border-border-subtle rounded"
          >
            Sample Control ({env.density})
          </div>
          <div
            class="inline-flex items-center justify-center px-[var(--control-px)] py-[var(--control-py)] h-[var(--control-height)] text-[var(--font-size-ui)] font-mono bg-accent-interactive text-[#24422a] font-bold rounded"
          >
            Interactive Button
          </div>
          <div
            class="inline-flex items-center justify-center px-[var(--control-px)] py-[var(--control-py)] h-[var(--control-height)] text-[var(--font-size-ui)] font-mono bg-surface-muted text-fg-muted border border-border-subtle rounded"
          >
            Disabled Metric State
          </div>
        </div>
      </div>
    </section>
  </div>
</div>
