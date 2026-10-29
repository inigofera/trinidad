<script lang="ts">
  import WorkbenchShell from '../WorkbenchShell.svelte';
  import {
    Heading,
    type HeadingLevel,
    Prose,
    Callout,
    type CalloutVariant,
    TableOfContents,
    StatCard,
    StatGrid,
    ProcessTimeline,
    type TimelineStep,
    ReadingProgress,
    Sparkline
  } from '$lib';

  // Interactive controls
  let activeTab = $state<'overview' | 'heading' | 'callout' | 'stat' | 'timeline'>('overview');
  let headingLevel = $state<HeadingLevel>(2);
  let headingKicker = $state('01 // HCI SPECIFICATION');
  let headingText = $state('Cognitive Ergonomics & Operator Bandwidth');
  let headingAnchor = $state(true);

  let calloutVariant = $state<CalloutVariant>('insight');
  let calloutTitle = $state('');
  let calloutAttribution = $state('Dr. Elena Vance, Senior Robotics Ergonomist');

  let statValue = $state('-42.8%');
  let statLabel = $state('Mean Operator Reaction Latency');
  let statDeltaValue = $state('18.2ms');
  let statPositive = $state(true);
  let statSparkline = $state(true);

  const sampleSparklineData = [45, 42, 38, 35, 33, 29, 28, 25, 24, 22, 21, 20];

  const sampleTimelineSteps: TimelineStep[] = [
    {
      title: 'Human Factors & Task Analysis',
      kicker: 'PHASE 01',
      subtitle: 'Q1 2026',
      description:
        'Operator contextual inquiry in 3 fulfillment centers. Modeled cognitive load ceilings.',
      status: 'completed'
    },
    {
      title: 'W3C Token Architecture & Swiss Typographic System',
      kicker: 'PHASE 02',
      subtitle: 'Q2 2026',
      description: 'Formalized 3-tier DTCG token pipeline with dual-theme high-contrast palettes.',
      status: 'completed'
    },
    {
      title: 'Svelte 5 Runes State Machines & Canvas Telemetry',
      kicker: 'PHASE 03',
      subtitle: 'Q3 2026',
      description:
        'Engineered 60fps telemetry tiles, LCS diff confirmation gate, and virtualized logs.',
      status: 'active'
    },
    {
      title: 'In-Situ Warehouse Validation & WCAG AA Audit',
      kicker: 'PHASE 04',
      subtitle: 'Q4 2026',
      description:
        'Automated Axe-Core verification and production operator trial on low-power tablets.',
      status: 'upcoming'
    }
  ];

  const generatedCode = $derived.by(() => {
    switch (activeTab) {
      case 'heading':
        return `<script lang="ts">
  import { Heading } from 'trinidad-ui';
<\/script>

<Heading
  level={${headingLevel}}
  id="section-ergonomics"
  kicker="${headingKicker}"
  showAnchor={${headingAnchor}}
>
  ${headingText}
</Heading>`;

      case 'callout':
        return `<script lang="ts">
  import { Callout } from 'trinidad-ui';
<\/script>

<Callout
  variant="${calloutVariant}"
  ${calloutTitle ? `title="${calloutTitle}"` : ''}
  ${calloutVariant === 'quote' ? `attribution="${calloutAttribution}"` : ''}
>
  Non-technical warehouse operators showed a 3.4x faster recovery rate from kinematics faults
  when warning thresholds were rendered via high-contrast visual telemetry.
</Callout>`;

      case 'stat':
        return `<script lang="ts">
  import { StatCard, Sparkline } from 'trinidad-ui';
  const sparkData = [45, 42, 38, 35, 33, 29, 28, 25, 24, 22, 21, 20];
<\/script>

<StatCard
  value="${statValue}"
  label="${statLabel}"
  kicker="TELEMETRY // AUDIT"
  delta={{ value: "${statDeltaValue}", positive: ${statPositive} }}
  description="Measured against the legacy Java Swing warehouse terminal across 10,000 pallet cycles."
>
  {#snippet sparkline()}
    <Sparkline data={sparkData} label="Latency Stream" unit="ms" />
  {/snippet}
</StatCard>`;

      case 'timeline':
        return `<script lang="ts">
  import { ProcessTimeline } from 'trinidad-ui';
<\/script>

<ProcessTimeline steps={steps} orientation="vertical" />`;

      default:
        return `<script lang="ts">
  import { Prose, Heading, Callout, StatCard, TableOfContents } from 'trinidad-ui';
<\/script>

<div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
  <aside class="lg:col-span-1">
    <TableOfContents />
  </aside>

  <article class="lg:col-span-3">
    <Prose>
      <Heading level={2} id="ergonomics">Cognitive Ergonomics</Heading>
      <p class="lead">Eliminating translation loss between prototype and production.</p>
      <Callout variant="insight">Every state transition is bounded.</Callout>
    </Prose>
  </article>
</div>`;
    }
  });
</script>

<ReadingProgress />

<WorkbenchShell
  name="Editorial & Portfolio Primitives"
  description="Swiss-grid typography, copyable anchor headings, admonitions, scrollspy table of contents, quantitative impact cards, and process steppers for UX case studies."
  {generatedCode}
>
  {#snippet stage()}
    <div class="w-full max-w-3xl mx-auto space-y-8">
      {#if activeTab === 'overview' || activeTab === 'heading'}
        <div class="border-b border-border-subtle pb-6">
          <Heading
            level={headingLevel}
            id="ergonomics-spec"
            kicker={headingKicker || undefined}
            showAnchor={headingAnchor}
          >
            {headingText}
          </Heading>
          <p class="text-sm text-fg-muted mt-2">
            Hover over the heading to reveal the tactile permalink anchor link button. Click it to
            copy the section URL with screen-reader announcement.
          </p>
        </div>
      {/if}

      {#if activeTab === 'overview' || activeTab === 'callout'}
        <div>
          <div class="text-xs font-mono text-fg-muted uppercase tracking-wider mb-2">
            [Admonition Callout Preview]
          </div>
          <Callout
            variant={calloutVariant}
            title={calloutTitle || undefined}
            attribution={calloutVariant === 'quote' ? calloutAttribution : undefined}
          >
            {#if calloutVariant === 'quote'}
              "The single biggest bottleneck in our warehouse workflow was not robotic actuator
              velocity, but operator hesitation when reviewing AI confidence thresholds."
            {:else}
              Non-technical operators demonstrated 3.4x faster recovery times when warning zones
              were visually separated using high-contrast tokenized palettes.
            {/if}
          </Callout>
        </div>
      {/if}

      {#if activeTab === 'overview' || activeTab === 'stat'}
        <div>
          <div class="text-xs font-mono text-fg-muted uppercase tracking-wider mb-2">
            [Quantitative Impact Grid]
          </div>
          <StatGrid cols={2}>
            <StatCard
              value={statValue}
              label={statLabel}
              kicker="LATENCY REDUCTION"
              delta={{ value: statDeltaValue, positive: statPositive }}
              description="Benchmark over 10,000 depalletizing pick cycles."
            >
              {#snippet sparkline()}
                {#if statSparkline}
                  <Sparkline data={sampleSparklineData} label="Latency Stream" unit="ms" />
                {/if}
              {/snippet}
            </StatCard>

            <StatCard
              value="100%"
              label="WCAG 2.1 AA Compliance"
              kicker="ACCESSIBILITY"
              delta={{ value: '0 Violations', positive: true }}
              description="Audited across both Editorial Paper and Industrial Dark palettes."
            />
          </StatGrid>
        </div>
      {/if}

      {#if activeTab === 'overview' || activeTab === 'timeline'}
        <div>
          <div class="text-xs font-mono text-fg-muted uppercase tracking-wider mb-2">
            [Engineering Process Timeline]
          </div>
          <ProcessTimeline steps={sampleTimelineSteps} orientation="vertical" />
        </div>
      {/if}
    </div>
  {/snippet}

  {#snippet controls()}
    <div class="space-y-5 font-mono text-xs">
      <div class="space-y-1">
        <label for="ctrl-tab" class="text-fg-muted font-bold block">Focus Component</label>
        <select
          id="ctrl-tab"
          bind:value={activeTab}
          class="w-full bg-surface-canvas text-fg-primary border border-border-subtle rounded-[var(--radius-control)] px-2 py-1.5"
        >
          <option value="overview">Full Composition Overview</option>
          <option value="heading">Heading (Anchor & Kicker)</option>
          <option value="callout">Callout (Admonition)</option>
          <option value="stat">StatCard & Impact Grid</option>
          <option value="timeline">Process Timeline</option>
        </select>
      </div>

      {#if activeTab === 'heading' || activeTab === 'overview'}
        <div class="pt-3 border-t border-border-subtle space-y-3">
          <div class="text-fg-primary font-bold">[Heading Props]</div>
          <div class="space-y-1">
            <label for="ctrl-h-level" class="text-fg-muted block">Level (1-6)</label>
            <select
              id="ctrl-h-level"
              bind:value={headingLevel}
              class="w-full bg-surface-canvas text-fg-primary border border-border-subtle rounded-[var(--radius-control)] px-2 py-1"
            >
              <option value={1}>H1 (Hero / Article Masthead)</option>
              <option value={2}>H2 (Major Section Title)</option>
              <option value={3}>H3 (Sub-section Title)</option>
              <option value={4}>H4 (Minor Header)</option>
            </select>
          </div>

          <div class="space-y-1">
            <label for="ctrl-h-text" class="text-fg-muted block">Heading Text</label>
            <input
              id="ctrl-h-text"
              type="text"
              bind:value={headingText}
              class="w-full bg-surface-canvas text-fg-primary border border-border-subtle rounded-[var(--radius-control)] px-2 py-1"
            />
          </div>

          <div class="space-y-1">
            <label for="ctrl-h-kicker" class="text-fg-muted block">Kicker Eyebrow</label>
            <input
              id="ctrl-h-kicker"
              type="text"
              bind:value={headingKicker}
              class="w-full bg-surface-canvas text-fg-primary border border-border-subtle rounded-[var(--radius-control)] px-2 py-1"
            />
          </div>

          <label class="flex items-center gap-2 cursor-pointer pt-1">
            <input type="checkbox" bind:checked={headingAnchor} class="accent-accent-interactive" />
            <span>Show Copyable Anchor Link</span>
          </label>
        </div>
      {/if}

      {#if activeTab === 'callout' || activeTab === 'overview'}
        <div class="pt-3 border-t border-border-subtle space-y-3">
          <div class="text-fg-primary font-bold">[Callout Props]</div>
          <div class="space-y-1">
            <label for="ctrl-callout-var" class="text-fg-muted block">Variant</label>
            <select
              id="ctrl-callout-var"
              bind:value={calloutVariant}
              class="w-full bg-surface-canvas text-fg-primary border border-border-subtle rounded-[var(--radius-control)] px-2 py-1"
            >
              <option value="insight">Insight (Chartreuse accent)</option>
              <option value="constraint">Constraint (Warning amber)</option>
              <option value="decision">Decision (Primary ink)</option>
              <option value="quote">Quote (Attributed editorial)</option>
              <option value="warning">Warning (Critical crimson)</option>
            </select>
          </div>
        </div>
      {/if}

      {#if activeTab === 'stat' || activeTab === 'overview'}
        <div class="pt-3 border-t border-border-subtle space-y-3">
          <div class="text-fg-primary font-bold">[StatCard Props]</div>
          <div class="space-y-1">
            <label for="ctrl-stat-val" class="text-fg-muted block">Value</label>
            <input
              id="ctrl-stat-val"
              type="text"
              bind:value={statValue}
              class="w-full bg-surface-canvas text-fg-primary border border-border-subtle rounded-[var(--radius-control)] px-2 py-1"
            />
          </div>
          <div class="space-y-1">
            <label for="ctrl-stat-lbl" class="text-fg-muted block">Label</label>
            <input
              id="ctrl-stat-lbl"
              type="text"
              bind:value={statLabel}
              class="w-full bg-surface-canvas text-fg-primary border border-border-subtle rounded-[var(--radius-control)] px-2 py-1"
            />
          </div>
          <label class="flex items-center gap-2 cursor-pointer pt-1">
            <input type="checkbox" bind:checked={statSparkline} class="accent-accent-interactive" />
            <span>Embed Mini Sparkline</span>
          </label>
        </div>
      {/if}
    </div>
  {/snippet}
</WorkbenchShell>
