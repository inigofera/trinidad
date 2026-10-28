<script lang="ts">
  import {
    Badge,
    Surface,
    Stack,
    Grid,
    ThemeScope,
    Button,
    ToggleButton,
    NumberField,
    Dialog,
    Combobox,
    Sparkline,
    DataTable,
    DiffViewer,
    Announcer,
    type DataTableColumn,
    type CommandItem
  } from '$lib';

  // --- Pattern A: Portfolio Case Study Card with Nested ThemeScope ---
  let subtreeTheme = $state<'industrial' | 'paper'>('industrial');
  let subtreeDensity = $state<'compact' | 'comfortable'>('compact');
  let pickThreshold = $state(88.5);

  let pickConfidenceData = $state<number[]>([
    89, 91, 94, 92, 88, 86, 90, 93, 95, 92, 89, 87, 85, 91, 93, 96, 94, 90, 88, 92
  ]);

  $effect(() => {
    if (typeof window === 'undefined') return;
    const interval = setInterval(() => {
      const nextVal = Number((75 + Math.random() * 24).toFixed(1));
      pickConfidenceData = [...pickConfidenceData.slice(1), nextVal];
    }, 1000);
    return () => clearInterval(interval);
  });

  // --- Pattern B: Integrated HRI & Agentic Triage Console ---
  interface TelemetryEvent {
    id: string;
    timestamp: string;
    subsystem: 'VISION' | 'KINEMATICS' | 'PLANNER' | 'SAFETY';
    latencyMs: number;
    status: 'NOMINAL' | 'WARNING' | 'CRITICAL' | 'PATCHED';
    originalConfig: string;
    proposedConfig: string;
  }

  function generateTelemetryEvents(): TelemetryEvent[] {
    const subsystems: TelemetryEvent['subsystem'][] = ['VISION', 'KINEMATICS', 'PLANNER', 'SAFETY'];
    const events: TelemetryEvent[] = [];

    for (let i = 1; i <= 1000; i++) {
      const sub = subsystems[i % subsystems.length]!;
      const status: TelemetryEvent['status'] =
        i % 5 === 0 ? 'CRITICAL' : i % 3 === 0 ? 'WARNING' : 'NOMINAL';
      const latency = 20 + ((i * 17) % 85);
      const id = `TEL-${String(i).padStart(4, '0')}`;
      const timestamp = `14:23:${String(i % 60).padStart(2, '0')}.${String((i * 37) % 1000).padStart(3, '0')}`;

      events.push({
        id,
        timestamp,
        subsystem: sub,
        latencyMs: latency,
        status,
        originalConfig: `{\n  "subsystem": "${sub}",\n  "cycleRateHz": 120,\n  "bufferDepth": 1024,\n  "dampingFactor": 0.85\n}`,
        proposedConfig: `{\n  "subsystem": "${sub}",\n  "cycleRateHz": 160,\n  "bufferDepth": 2048,\n  "dampingFactor": 0.92\n}`
      });
    }
    return events;
  }

  let telemetryEvents = $state<TelemetryEvent[]>(generateTelemetryEvents());
  let activeSubsystemFilter = $state<string>('ALL');
  let streamPaused = $state(false);
  let warnLatency = $state(45);
  let critLatency = $state(75);
  let selectedEvent = $state<TelemetryEvent | null>(null);
  let dialogOpen = $state(false);
  let diffStatus = $state<'pending' | 'accepted' | 'rejected' | 'modified'>('pending');

  let liveLatency = $state<number[]>([
    32, 38, 41, 45, 42, 39, 44, 48, 52, 49, 43, 38, 42, 47, 51, 55, 60, 58, 49, 45
  ]);

  $effect(() => {
    if (typeof window === 'undefined' || streamPaused) return;
    const interval = setInterval(() => {
      const nextVal = Math.round(25 + Math.random() * 60);
      liveLatency = [...liveLatency.slice(1), nextVal];
    }, 1000);
    return () => clearInterval(interval);
  });

  const comboboxItems: CommandItem[] = [
    {
      id: 'filter-all',
      label: 'Filter: ALL',
      group: 'Subsystems',
      onSelect: () => {
        activeSubsystemFilter = 'ALL';
        Announcer.announce('Subsystem filter set to ALL', 'polite');
      }
    },
    {
      id: 'filter-vision',
      label: 'Filter: VISION',
      group: 'Subsystems',
      onSelect: () => {
        activeSubsystemFilter = 'VISION';
        Announcer.announce('Subsystem filter set to VISION', 'polite');
      }
    },
    {
      id: 'filter-kinematics',
      label: 'Filter: KINEMATICS',
      group: 'Subsystems',
      onSelect: () => {
        activeSubsystemFilter = 'KINEMATICS';
        Announcer.announce('Subsystem filter set to KINEMATICS', 'polite');
      }
    },
    {
      id: 'filter-planner',
      label: 'Filter: PLANNER',
      group: 'Subsystems',
      onSelect: () => {
        activeSubsystemFilter = 'PLANNER';
        Announcer.announce('Subsystem filter set to PLANNER', 'polite');
      }
    },
    {
      id: 'filter-safety',
      label: 'Filter: SAFETY',
      group: 'Subsystems',
      onSelect: () => {
        activeSubsystemFilter = 'SAFETY';
        Announcer.announce('Subsystem filter set to SAFETY', 'polite');
      }
    },
    {
      id: 'action-critical-diff',
      label: 'Open Latest Critical Diff',
      group: 'Quick Actions',
      onSelect: () => {
        const crit = telemetryEvents.find((e) => e.status === 'CRITICAL');
        if (crit) openProposalModal(crit);
      }
    },
    {
      id: 'action-reset-thresholds',
      label: 'Reset Thresholds',
      group: 'Quick Actions',
      onSelect: () => {
        warnLatency = 45;
        critLatency = 75;
        Announcer.announce('Latency thresholds reset to default', 'polite');
      }
    }
  ];

  function openProposalModal(row: TelemetryEvent) {
    selectedEvent = row;
    diffStatus = row.status === 'PATCHED' ? 'accepted' : 'pending';
    dialogOpen = true;
  }

  const filteredRows = $derived(
    activeSubsystemFilter === 'ALL'
      ? telemetryEvents
      : telemetryEvents.filter((e) => e.subsystem === activeSubsystemFilter)
  );

  const columns: DataTableColumn<TelemetryEvent>[] = [
    { key: 'id', header: 'ID', width: '120px', sortable: true },
    { key: 'subsystem', header: 'Subsystem', width: '140px', sortable: true },
    { key: 'latencyMs', header: 'Latency (ms)', width: '130px', sortable: true },
    { key: 'status', header: 'Status', width: '130px', sortable: true, render: statusSnippet },
    {
      key: 'proposedConfig',
      header: 'Action',
      width: '190px',
      sortable: false,
      render: actionSnippet
    }
  ];
</script>

<svelte:head>
  <title>Contextual Patterns // Trinidad Design System</title>
</svelte:head>

{#snippet statusSnippet(row: TelemetryEvent)}
  {#if row.status === 'PATCHED'}
    <Badge variant="nominal">PATCHED</Badge>
  {:else if row.status === 'CRITICAL'}
    <Badge variant="critical">CRITICAL</Badge>
  {:else if row.status === 'WARNING'}
    <Badge variant="warning">WARNING</Badge>
  {:else}
    <Badge variant="nominal">NOMINAL</Badge>
  {/if}
{/snippet}

{#snippet actionSnippet(row: TelemetryEvent)}
  <Button variant="secondary" onclick={() => openProposalModal(row)}>[Review AI Patch]</Button>
{/snippet}

<div class="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-10">
  <!-- Page Header -->
  <header class="border-b border-border-subtle pb-6">
    <div class="font-mono text-xs uppercase tracking-widest text-fg-muted mb-2 select-none">
      // CONTEXTUAL COMPOSITION · IN THE WILD
    </div>
    <h1 class="text-3xl font-mono font-bold text-fg-primary tracking-tight mb-3">
      Production Patterns
    </h1>
    <p class="text-sm text-fg-muted max-w-3xl leading-relaxed">
      Demonstrating how Trinidad primitives combine across editorial portfolio layouts and
      high-frequency operator consoles. Featuring nested ThemeScope subtrees, 60fps streaming
      telemetry, and synchronized agentic triage workflows.
    </p>
  </header>

  <!-- Pattern 01: Portfolio Case Study Card with Nested ThemeScope -->
  <Surface
    elevation="elevated"
    padding="lg"
    kicker="01 // PORTFOLIO CASE STUDY ARTIFACT (OUTER PAPER SCOPE)"
  >
    <Grid cols={2} gap="lg">
      <!-- Left Column: Narrative Metadata -->
      <Stack direction="vertical" gap="md">
        <div>
          <h2 class="text-xl font-mono font-bold text-fg-primary mb-2">
            Vision AI Depalletizing Operator Console
          </h2>
          <Stack direction="horizontal" gap="xs" wrap={true} class="mb-4">
            <Badge variant="accent">Svelte 5 Runes</Badge>
            <Badge variant="nominal" pulse={true}>60fps Telemetry</Badge>
            <Badge variant="neutral">WCAG 2.1 AA</Badge>
          </Stack>
          <p class="text-sm text-fg-muted leading-relaxed">
            Non-technical warehouse operators monitor 3D point-cloud pick confidence scores in real
            time. Embedded high-density operator scopes withstand industrial ambient lighting while
            the surrounding portfolio article preserves editorial warmth and typography.
          </p>
        </div>

        <div>
          <Button
            variant="secondary"
            onclick={() => {
              subtreeTheme = subtreeTheme === 'industrial' ? 'paper' : 'industrial';
              subtreeDensity = subtreeDensity === 'compact' ? 'comfortable' : 'compact';
            }}
          >
            [Invert Embedded Subtree: {subtreeTheme.toUpperCase()} / {subtreeDensity.toUpperCase()}]
          </Button>
        </div>
      </Stack>

      <!-- Right Column: Scoped Telemetry Widget -->
      <ThemeScope
        theme={subtreeTheme}
        density={subtreeDensity}
        class="p-4 border border-border-subtle"
        data-testid="scoped-telemetry-widget"
      >
        <div class="font-mono text-xs text-fg-muted mb-3 font-bold select-none">
          SUBTREE SCOPE: data-theme="{subtreeTheme}" · data-density="{subtreeDensity}"
        </div>

        <Stack direction="vertical" gap="md">
          <Sparkline
            data={pickConfidenceData}
            min={60}
            max={100}
            warnThreshold={pickThreshold}
            criticalThreshold={80}
            unit="%"
            label="Pick Confidence Stream"
          />

          <NumberField
            bind:value={pickThreshold}
            min={70}
            max={98}
            step={0.5}
            unit="%"
            label="Confidence Warning Gate"
          />
        </Stack>
      </ThemeScope>
    </Grid>
  </Surface>

  <!-- Pattern 02: Unified HRI & Agentic Triage Console -->
  <Surface elevation="elevated" padding="lg" kicker="02 // UNIFIED HRI & AGENTIC TRIAGE CONSOLE">
    <Stack direction="vertical" gap="md">
      <!-- Toolbar: Combobox + ToggleButton + Filters -->
      <div
        class="flex flex-wrap items-center justify-between gap-4 p-3 bg-surface-canvas border border-border-subtle"
      >
        <div class="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <div class="w-80 max-w-full">
            <Combobox
              items={comboboxItems}
              onSelect={(item) => item.onSelect?.()}
              placeholder="Search subsystem commands... [↑↓ / Enter]"
            />
          </div>
          <ToggleButton bind:pressed={streamPaused} variant="secondary">
            {streamPaused ? 'Stream Paused' : 'Stream Active'}
          </ToggleButton>
        </div>

        <div class="flex items-center gap-2 font-mono text-xs text-fg-muted">
          <span>Active Filter:</span>
          <Badge variant={activeSubsystemFilter === 'ALL' ? 'neutral' : 'accent'}>
            {activeSubsystemFilter}
          </Badge>
          <span class="text-fg-muted">({filteredRows.length} events)</span>
        </div>
      </div>

      <!-- Calibration Rail: Sparkline + Dual NumberFields -->
      <div class="p-4 bg-surface-canvas border border-border-subtle">
        <Grid cols={3} gap="md">
          <div class="col-span-1 md:col-span-2">
            <Sparkline
              data={liveLatency}
              min={0}
              max={100}
              warnThreshold={warnLatency}
              criticalThreshold={critLatency}
              unit="ms"
              label="Real-time Subsystem Latency Bus"
            />
          </div>
          <Stack direction="vertical" gap="sm">
            <NumberField
              bind:value={warnLatency}
              min={20}
              max={60}
              step={1}
              unit="ms"
              label="Warn Latency Gate"
            />
            <NumberField
              bind:value={critLatency}
              min={60}
              max={100}
              step={1}
              unit="ms"
              label="Critical Latency Gate"
            />
          </Stack>
        </Grid>
      </div>

      <!-- Telemetry DataTable -->
      <DataTable rows={filteredRows} {columns} height="400px" />
    </Stack>
  </Surface>

  <!-- Atomic Proposal Modal Dialog -->
  <Dialog
    bind:open={dialogOpen}
    title="Agentic Calibration Patch Proposal"
    description="Review atomic configuration diff before committing to robotic cell controller."
  >
    {#if selectedEvent}
      <DiffViewer
        original={selectedEvent.originalConfig}
        modified={selectedEvent.proposedConfig}
        title="cell-calibration.json"
        bind:status={diffStatus}
        onResolve={({ status: newStatus }) => {
          if (selectedEvent) {
            selectedEvent.status = newStatus === 'accepted' ? 'PATCHED' : 'CRITICAL';
            const idx = telemetryEvents.findIndex((e) => e.id === selectedEvent!.id);
            if (idx !== -1 && telemetryEvents[idx]) {
              telemetryEvents[idx] = { ...telemetryEvents[idx]!, status: selectedEvent.status };
            }
            Announcer.announce(
              `Telemetry patch ${newStatus} for event ${selectedEvent.id}`,
              'polite'
            );
          }
          diffStatus = newStatus;
          dialogOpen = false;
        }}
      />
    {/if}
  </Dialog>
</div>
