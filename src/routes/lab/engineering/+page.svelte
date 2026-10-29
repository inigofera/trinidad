<script lang="ts">
  import WorkbenchShell from '../WorkbenchShell.svelte';
  import {
    CodeBlock,
    InteractiveSandbox,
    BenchmarkBadge,
    type BenchmarkMetric,
    type BenchmarkStatus,
    Tooltip,
    type TooltipPosition,
    Kbd,
    Button,
    NumberField
  } from '$lib';

  // Interactive controls
  let activeTab = $state<'overview' | 'code-block' | 'sandbox' | 'badge' | 'tooltip'>('overview');

  // CodeBlock props
  let codeLanguage = $state<'svelte' | 'typescript' | 'json' | 'css' | 'bash'>('svelte');
  let codeFilename = $state('TelemetryStream.svelte');
  let lineNumbers = $state(true);
  let highlightedLine = $state(4);

  // BenchmarkBadge props
  let badgeMetric = $state<BenchmarkMetric>('fps');
  let badgeValue = $state('60.0 FPS');
  let badgeLabel = $state('Target: 60Hz');
  let badgeStatus = $state<BenchmarkStatus>('nominal');

  // Tooltip props
  let tooltipPosition = $state<TooltipPosition>('top');
  let tooltipText = $state('Calibrated at 60Hz Retina refresh rate');
  let tooltipShortcut = $state('⌘K');

  // Sandbox demo state
  let sampleThreshold = $state(88.5);

  const sampleSvelteCode = `<script lang="ts">
  import { Sparkline, Button } from 'trinidad-ui';
  let threshold = $state(88.5);
  const stream = [89, 91, 94, 92, 88, 86, 90, 93];
<\/script>

<div class="space-y-4">
  <Sparkline data={stream} label="Confidence Score" unit="%" />
  <Button variant="primary" shortcut="⌘S">
    Apply Calibration
  </Button>
</div>`;

  const generatedCode = $derived.by(() => {
    switch (activeTab) {
      case 'code-block':
        return `<script lang="ts">
  import { CodeBlock } from 'trinidad-ui';
<\/script>

<CodeBlock
  code={sourceCode}
  language="${codeLanguage}"
  filename="${codeFilename}"
  lineNumbers={${lineNumbers}}
  highlightLines={[${highlightedLine}]}
/>`;

      case 'sandbox':
        return `<script lang="ts">
  import { InteractiveSandbox, NumberField, Button } from 'trinidad-ui';
  let threshold = $state(88.5);
<\/script>

<InteractiveSandbox
  title="Kinematics Calibration Gate"
  kicker="LIVE PROTOTYPE"
  code={sourceSnippet}
>
  {#snippet children()}
    <div class="text-center font-mono">
      <span>Confidence: </span>
      <span class="text-accent-interactive font-bold">{threshold}%</span>
    </div>
  {/snippet}

  {#snippet controls()}
    <NumberField bind:value={threshold} label="Calibration Target" min={0} max={100} step={0.5} unit="%" />
  {/snippet}
</InteractiveSandbox>`;

      case 'badge':
        return `<script lang="ts">
  import { BenchmarkBadge } from 'trinidad-ui';
<\/script>

<BenchmarkBadge
  metric="${badgeMetric}"
  value="${badgeValue}"
  label="${badgeLabel}"
  status="${badgeStatus}"
/>`;

      case 'tooltip':
        return `<script lang="ts">
  import { Tooltip, Button } from 'trinidad-ui';
<\/script>

<Tooltip
  text="${tooltipText}"
  position="${tooltipPosition}"
  shortcut="${tooltipShortcut}"
>
  <Button variant="secondary">Hover or Focus Me</Button>
</Tooltip>`;

      default:
        return `<script lang="ts">
  import { CodeBlock, InteractiveSandbox, BenchmarkBadge, Tooltip, Kbd } from 'trinidad-ui';
<\/script>

<BenchmarkBadge metric="fps" value="60 FPS" status="nominal" />
<Tooltip text="Hardware accelerated" shortcut="⌘K">
  <Kbd key="⌘K" />
</Tooltip>`;
    }
  });
</script>

<WorkbenchShell
  name="UX Engineering & Sandbox Primitives"
  description="Syntax-highlighted code blocks with line highlighting, embeddable interactive component sandboxes with local ThemeScope inverters, benchmark audit badges, and accessible tooltips."
  {generatedCode}
>
  {#snippet stage()}
    <div class="w-full max-w-3xl mx-auto space-y-8">
      {#if activeTab === 'overview' || activeTab === 'code-block'}
        <div>
          <div class="text-xs font-mono text-fg-muted uppercase tracking-wider mb-2">
            [CodeBlock with Token Highlighting & One-Click Copy]
          </div>
          <CodeBlock
            code={sampleSvelteCode}
            language={codeLanguage}
            filename={codeFilename}
            {lineNumbers}
            highlightLines={[highlightedLine]}
          />
        </div>
      {/if}

      {#if activeTab === 'overview' || activeTab === 'sandbox'}
        <div>
          <div class="text-xs font-mono text-fg-muted uppercase tracking-wider mb-2">
            [Embedded Interactive Component Sandbox]
          </div>
          <InteractiveSandbox
            title="Kinematics Calibration Gate"
            kicker="PROPOSAL CONFIRMATION GATE"
          >
            {#snippet children()}
              <div class="flex flex-col items-center gap-3 font-mono">
                <div class="text-xs text-fg-muted uppercase tracking-wider">
                  Real-time Subtree State
                </div>
                <div class="text-3xl font-bold text-fg-primary">
                  {sampleThreshold.toFixed(1)}%
                </div>
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-status-nominal"></span>
                  <span class="text-xs text-status-nominal font-bold">NOMINAL CONFIDENCE</span>
                </div>
              </div>
            {/snippet}

            {#snippet controls()}
              <div class="max-w-xs mx-auto">
                <NumberField
                  bind:value={sampleThreshold}
                  label="Scrub Confidence Threshold"
                  min={0}
                  max={100}
                  step={0.5}
                  unit="%"
                />
              </div>
            {/snippet}

            {#snippet codeSnippet()}
              <CodeBlock
                code={sampleSvelteCode}
                language="svelte"
                filename="SandboxPreview.svelte"
              />
            {/snippet}
          </InteractiveSandbox>
        </div>
      {/if}

      {#if activeTab === 'overview' || activeTab === 'badge'}
        <div>
          <div class="text-xs font-mono text-fg-muted uppercase tracking-wider mb-2">
            [Performance & Verification Badges]
          </div>
          <div class="flex items-center gap-3 flex-wrap">
            <BenchmarkBadge
              metric={badgeMetric}
              value={badgeValue}
              label={badgeLabel}
              status={badgeStatus}
            />
            <BenchmarkBadge
              metric="bundle"
              value="16.1 kB gzip"
              label="Budget: < 18 kB"
              status="nominal"
            />
            <BenchmarkBadge
              metric="a11y"
              value="0 Violations"
              label="WCAG 2.1 AA"
              status="nominal"
            />
          </div>
        </div>
      {/if}

      {#if activeTab === 'overview' || activeTab === 'tooltip'}
        <div>
          <div class="text-xs font-mono text-fg-muted uppercase tracking-wider mb-2">
            [Accessible Tooltips & Kbd Shortcuts]
          </div>
          <div class="flex items-center gap-4 flex-wrap">
            <Tooltip text={tooltipText} position={tooltipPosition} shortcut={tooltipShortcut}>
              <Button variant="secondary">Inspect Calibration</Button>
            </Tooltip>

            <div class="flex items-center gap-1.5 text-xs font-mono text-fg-muted">
              <span>Quick command:</span>
              <Kbd key="⌘K" />
            </div>

            <div class="flex items-center gap-1.5 text-xs font-mono text-fg-muted">
              <span>Exit modal:</span>
              <Kbd key="Esc" />
            </div>
          </div>
        </div>
      {/if}
    </div>
  {/snippet}

  {#snippet controls()}
    <div class="space-y-5 font-mono text-xs">
      <div class="space-y-1">
        <label for="ctrl-eng-tab" class="text-fg-muted font-bold block">Focus Component</label>
        <select
          id="ctrl-eng-tab"
          bind:value={activeTab}
          class="w-full bg-surface-canvas text-fg-primary border border-border-subtle rounded-[var(--radius-control)] px-2 py-1.5"
        >
          <option value="overview">Full Composition Overview</option>
          <option value="code-block">CodeBlock & Token Highlighting</option>
          <option value="sandbox">Interactive Component Sandbox</option>
          <option value="badge">Benchmark & Audit Badges</option>
          <option value="tooltip">Tooltips & Kbd Keys</option>
        </select>
      </div>

      {#if activeTab === 'code-block' || activeTab === 'overview'}
        <div class="pt-3 border-t border-border-subtle space-y-3">
          <div class="text-fg-primary font-bold">[CodeBlock Props]</div>
          <div class="space-y-1">
            <label for="ctrl-code-lang" class="text-fg-muted block">Language</label>
            <select
              id="ctrl-code-lang"
              bind:value={codeLanguage}
              class="w-full bg-surface-canvas text-fg-primary border border-border-subtle rounded-[var(--radius-control)] px-2 py-1"
            >
              <option value="svelte">Svelte 5</option>
              <option value="typescript">TypeScript</option>
              <option value="json">W3C Tokens JSON</option>
              <option value="css">Tailwind CSS</option>
              <option value="bash">Terminal Bash</option>
            </select>
          </div>
          <div class="space-y-1">
            <label for="ctrl-code-file" class="text-fg-muted block">Filename Header</label>
            <input
              id="ctrl-code-file"
              type="text"
              bind:value={codeFilename}
              class="w-full bg-surface-canvas text-fg-primary border border-border-subtle rounded-[var(--radius-control)] px-2 py-1"
            />
          </div>
          <div class="space-y-1">
            <label for="ctrl-code-hl" class="text-fg-muted block">Highlight Line</label>
            <input
              id="ctrl-code-hl"
              type="number"
              min="1"
              max="15"
              bind:value={highlightedLine}
              class="w-full bg-surface-canvas text-fg-primary border border-border-subtle rounded-[var(--radius-control)] px-2 py-1"
            />
          </div>
          <label class="flex items-center gap-2 cursor-pointer pt-1">
            <input type="checkbox" bind:checked={lineNumbers} class="accent-accent-interactive" />
            <span>Show Line Numbers</span>
          </label>
        </div>
      {/if}

      {#if activeTab === 'badge' || activeTab === 'overview'}
        <div class="pt-3 border-t border-border-subtle space-y-3">
          <div class="text-fg-primary font-bold">[BenchmarkBadge Props]</div>
          <div class="space-y-1">
            <label for="ctrl-badge-metric" class="text-fg-muted block">Metric Type</label>
            <select
              id="ctrl-badge-metric"
              bind:value={badgeMetric}
              class="w-full bg-surface-canvas text-fg-primary border border-border-subtle rounded-[var(--radius-control)] px-2 py-1"
            >
              <option value="fps">Frame Rate (FPS)</option>
              <option value="bundle">Bundle Weight (gzip)</option>
              <option value="vitals">Web Vitals</option>
              <option value="a11y">Accessibility</option>
              <option value="custom">Custom Audit</option>
            </select>
          </div>
          <div class="space-y-1">
            <label for="ctrl-badge-val" class="text-fg-muted block">Value</label>
            <input
              id="ctrl-badge-val"
              type="text"
              bind:value={badgeValue}
              class="w-full bg-surface-canvas text-fg-primary border border-border-subtle rounded-[var(--radius-control)] px-2 py-1"
            />
          </div>
          <div class="space-y-1">
            <label for="ctrl-badge-status" class="text-fg-muted block">Status Tone</label>
            <select
              id="ctrl-badge-status"
              bind:value={badgeStatus}
              class="w-full bg-surface-canvas text-fg-primary border border-border-subtle rounded-[var(--radius-control)] px-2 py-1"
            >
              <option value="nominal">Nominal (Green)</option>
              <option value="warning">Warning (Amber)</option>
              <option value="critical">Critical (Crimson)</option>
            </select>
          </div>
        </div>
      {/if}

      {#if activeTab === 'tooltip' || activeTab === 'overview'}
        <div class="pt-3 border-t border-border-subtle space-y-3">
          <div class="text-fg-primary font-bold">[Tooltip Props]</div>
          <div class="space-y-1">
            <label for="ctrl-tip-pos" class="text-fg-muted block">Position</label>
            <select
              id="ctrl-tip-pos"
              bind:value={tooltipPosition}
              class="w-full bg-surface-canvas text-fg-primary border border-border-subtle rounded-[var(--radius-control)] px-2 py-1"
            >
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
          </div>
          <div class="space-y-1">
            <label for="ctrl-tip-txt" class="text-fg-muted block">Tooltip Text</label>
            <input
              id="ctrl-tip-txt"
              type="text"
              bind:value={tooltipText}
              class="w-full bg-surface-canvas text-fg-primary border border-border-subtle rounded-[var(--radius-control)] px-2 py-1"
            />
          </div>
          <div class="space-y-1">
            <label for="ctrl-tip-sc" class="text-fg-muted block">Shortcut Hint</label>
            <input
              id="ctrl-tip-sc"
              type="text"
              bind:value={tooltipShortcut}
              class="w-full bg-surface-canvas text-fg-primary border border-border-subtle rounded-[var(--radius-control)] px-2 py-1"
            />
          </div>
        </div>
      {/if}
    </div>
  {/snippet}
</WorkbenchShell>
