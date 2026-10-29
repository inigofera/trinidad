<script lang="ts">
  import { ThemeScope } from '$lib';
  import { tokens } from '$lib/tokens/tokens.js';

  const primitiveColors = Object.entries(tokens.primitive.color) as Array<[string, string]>;

  const semanticTokenNames = [
    'surface-canvas',
    'surface-elevated',
    'surface-muted',
    'fg-primary',
    'fg-muted',
    'border-subtle',
    'accent-interactive',
    'status-critical',
    'status-warning',
    'status-nominal',
    'brand-primary'
  ] as const;

  const densityTokenNames = [
    'control-height',
    'control-px',
    'control-py',
    'row-height',
    'font-size-ui',
    'gap-ui'
  ] as const;

  const comfortable = tokens.density.comfortable;
  const compact = tokens.density.compact;

  const fontSizes = Object.entries(tokens.primitive['font-size']) as Array<[string, string]>;

  const textClass: Record<string, string> = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl'
  };

  const fontWeights = Object.entries(tokens.primitive['font-weight']) as Array<[string, number]>;

  const weightClass: Record<string, string> = {
    regular: 'font-regular',
    medium: 'font-medium',
    bold: 'font-bold'
  };

  const spacing = Object.entries(tokens.primitive.spacing) as Array<[string, string]>;

  const spacingRows = spacing.map(([name, value]) => {
    const rem = Number.parseFloat(value);
    return { name, value, px: Math.round(rem * 16), pct: (rem / 4) * 100 };
  });

  const densityMetrics = densityTokenNames.map((name) => {
    const comfortableValue = comfortable[name];
    const compactValue = compact[name];
    const delta = Math.round(
      (Number.parseFloat(compactValue) / Number.parseFloat(comfortableValue) - 1) * 100
    );
    return { name, comfortableValue, compactValue, delta };
  });

  const densityModes = [
    { name: 'comfortable', label: 'Comfortable' },
    { name: 'compact', label: 'Compact' }
  ] as const;

  const densityRows = [
    {
      label: 'Axis load',
      value: '4.82 kN',
      status: 'Nominal',
      tone: 'text-status-nominal'
    },
    {
      label: 'Torque drift',
      value: '0.12 Nm',
      status: 'Warning',
      tone: 'text-status-warning'
    },
    {
      label: 'Encoder lock',
      value: 'Engaged',
      status: 'Nominal',
      tone: 'text-status-nominal'
    }
  ];

  const fontFamilies = [
    {
      token: '--font-sans',
      stack: tokens.primitive.font.sans,
      note: 'Body copy, headings, and telemetry'
    },
    {
      token: '--font-mono',
      stack: tokens.primitive.font.mono,
      note: 'Alias of --font-sans, not a second family'
    }
  ];

  const radii = [
    {
      token: '--radius-control',
      className: 'rounded-control',
      value: tokens.primitive.dimension['radius-control'],
      usage: 'Controls'
    },
    {
      token: '--radius-card',
      className: 'rounded-card',
      value: tokens.primitive.dimension['radius-card'],
      usage: 'Surfaces'
    }
  ];

  const statuses = [
    {
      token: '--status-critical',
      label: 'Critical',
      meaning: 'Error state / destructive action',
      dotClass: 'bg-status-critical'
    },
    {
      token: '--status-warning',
      label: 'Warning',
      meaning: 'Threshold breached / attention required',
      dotClass: 'bg-status-warning'
    },
    {
      token: '--status-nominal',
      label: 'Nominal',
      meaning: 'System operating within parameters',
      dotClass: 'bg-status-nominal'
    }
  ];

  const scopes = [
    {
      label: 'Paper',
      densityLabel: 'Comfortable',
      theme: 'paper' as const,
      density: 'comfortable' as const
    },
    {
      label: 'Industrial',
      densityLabel: 'Compact',
      theme: 'industrial' as const,
      density: 'compact' as const
    }
  ];
</script>

<svelte:head>
  <title>Foundations · Trinidad Design System</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-12">
  <header class="border-b border-border-subtle pb-6">
    <h1 class="text-3xl font-mono font-bold text-fg-primary tracking-tight">Foundations</h1>
  </header>

  <section>
    <h2 class="text-xl font-mono font-bold text-fg-primary mb-4">The token engine</h2>
    <p class="text-sm text-fg-muted leading-relaxed max-w-3xl">
      Every visual decision resolves from three tiers: raw primitives for color, type, spacing, and
      radius; semantic roles for surfaces, text, borders, accents, and status; and environmental
      axes for theme, density, and motion. Values live in
      <code class="font-mono text-fg-primary">tokens.json</code> and compile to CSS custom properties
      and TypeScript constants, so Tailwind utilities and component code read the same source.
    </p>
  </section>

  <section>
    <h2 class="text-xl font-mono font-bold text-fg-primary mb-4">Color</h2>
    <p class="text-sm text-fg-muted leading-relaxed max-w-3xl mb-6">
      Primitives are fixed raw values. Semantic roles map them to jobs that resolve per theme; the
      status samples below follow the active theme set in the header.
    </p>

    <h3 class="text-sm font-mono font-bold text-fg-primary mb-3">Primitive palette</h3>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {#each primitiveColors as [name, value]}
        <div class="p-2 rounded-card border border-border-subtle bg-surface-elevated space-y-2">
          <div
            class="h-12 rounded-control border border-border-subtle"
            style:background-color={`var(--raw-${name})`}
            aria-hidden="true"
          ></div>
          <div class="space-y-0.5 font-mono text-[10px]">
            <div class="text-fg-primary break-all">--raw-{name}</div>
            <div class="text-fg-muted">{value}</div>
          </div>
        </div>
      {/each}
    </div>

    <h3 class="text-sm font-mono font-bold text-fg-primary mt-8 mb-3">Semantic roles</h3>
    <div class="overflow-x-auto">
      <table class="w-full text-left font-mono text-xs border border-border-subtle">
        <caption class="sr-only"
          >Semantic color tokens across the paper and industrial themes</caption
        >
        <thead class="bg-surface-canvas text-fg-primary border-b border-border-subtle text-[11px]">
          <tr>
            <th scope="col" class="p-3 border-r border-border-subtle">Token</th>
            <th scope="col" class="p-3 border-r border-border-subtle">Paper</th>
            <th scope="col" class="p-3">Industrial</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border-subtle/60 bg-surface-elevated">
          {#each semanticTokenNames as name}
            <tr>
              <th scope="row" class="p-3 border-r border-border-subtle font-bold text-fg-primary">
                --{name}
              </th>
              <td class="p-3 border-r border-border-subtle">
                <span class="inline-flex items-center gap-2">
                  <span
                    class="w-4 h-4 shrink-0 rounded-sm border border-border-subtle"
                    style:background-color={tokens.semantic.paper[name]}
                    aria-hidden="true"
                  ></span>
                  <span class="text-fg-primary">{tokens.semantic.paper[name]}</span>
                </span>
              </td>
              <td class="p-3">
                <span class="inline-flex items-center gap-2">
                  <span
                    class="w-4 h-4 shrink-0 rounded-sm border border-border-subtle"
                    style:background-color={tokens.semantic.industrial[name]}
                    aria-hidden="true"
                  ></span>
                  <span class="text-fg-primary">{tokens.semantic.industrial[name]}</span>
                </span>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <h3 class="text-sm font-mono font-bold text-fg-primary mt-8 mb-3">Status colors</h3>
    <div class="overflow-x-auto">
      <table class="w-full text-left font-mono text-xs border border-border-subtle">
        <caption class="sr-only">Status color tokens and their meanings</caption>
        <thead class="bg-surface-canvas text-fg-primary border-b border-border-subtle text-[11px]">
          <tr>
            <th scope="col" class="p-3 border-r border-border-subtle">Token</th>
            <th scope="col" class="p-3 border-r border-border-subtle">State</th>
            <th scope="col" class="p-3 border-r border-border-subtle">Meaning</th>
            <th scope="col" class="p-3">Sample</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border-subtle/60 bg-surface-elevated">
          {#each statuses as status}
            <tr>
              <th scope="row" class="p-3 border-r border-border-subtle font-bold text-fg-primary">
                {status.token}
              </th>
              <td class="p-3 border-r border-border-subtle text-fg-primary">{status.label}</td>
              <td class="p-3 border-r border-border-subtle text-fg-muted">{status.meaning}</td>
              <td class="p-3">
                <span class="inline-block w-3 h-3 rounded-full {status.dotClass}" aria-hidden="true"
                ></span>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>

  <section>
    <h2 class="text-xl font-mono font-bold text-fg-primary mb-4">Typography</h2>
    <p class="text-sm text-fg-muted leading-relaxed max-w-3xl mb-6">
      Manrope is the only typeface. The sans and mono tokens resolve to the same stack; size and
      weight tiers establish hierarchy without introducing a second family.
    </p>

    <h3 class="text-sm font-mono font-bold text-fg-primary mb-3">Families</h3>
    <div class="overflow-x-auto">
      <table class="w-full text-left font-mono text-xs border border-border-subtle">
        <caption class="sr-only">Font family tokens and specimens</caption>
        <thead class="bg-surface-canvas text-fg-primary border-b border-border-subtle text-[11px]">
          <tr>
            <th scope="col" class="p-3 border-r border-border-subtle">Token</th>
            <th scope="col" class="p-3 border-r border-border-subtle">Specimen</th>
            <th scope="col" class="p-3">Stack</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border-subtle/60 bg-surface-elevated">
          {#each fontFamilies as family}
            <tr>
              <th
                scope="row"
                class="p-3 border-r border-border-subtle font-bold text-fg-primary align-top"
              >
                <span class="block">{family.token}</span>
                <span class="mt-1 block text-[10px] font-regular text-fg-muted">{family.note}</span>
              </th>
              <td
                class="p-3 border-r border-border-subtle text-fg-primary align-top"
                style:font-family={family.stack}
              >
                <span class="text-base leading-relaxed">
                  The quick brown fox jumps over the lazy dog — 0123456789
                </span>
              </td>
              <td class="p-3 text-fg-muted align-top break-words">{family.stack}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <h3 class="text-sm font-mono font-bold text-fg-primary mt-8 mb-3">Scale</h3>
    <div class="overflow-x-auto">
      <table class="w-full text-left font-mono text-xs border border-border-subtle">
        <caption class="sr-only">Font size tokens, Tailwind utilities, and specimens</caption>
        <thead class="bg-surface-canvas text-fg-primary border-b border-border-subtle text-[11px]">
          <tr>
            <th scope="col" class="p-3 border-r border-border-subtle">Token</th>
            <th scope="col" class="p-3 border-r border-border-subtle">Size</th>
            <th scope="col" class="p-3 border-r border-border-subtle">Utility</th>
            <th scope="col" class="p-3">Specimen</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border-subtle/60 bg-surface-elevated">
          {#each fontSizes as [name, size]}
            <tr>
              <th
                scope="row"
                class="p-3 border-r border-border-subtle font-bold text-fg-primary align-top"
              >
                --font-size-{name}
              </th>
              <td class="p-3 border-r border-border-subtle text-fg-muted align-top">{size}</td>
              <td class="p-3 border-r border-border-subtle text-fg-muted align-top">
                text-{name}
              </td>
              <td class="p-3 text-fg-primary align-top">
                <span class={textClass[name] ?? ''}>The quick brown fox</span>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <h3 class="text-sm font-mono font-bold text-fg-primary mt-8 mb-3">Weights</h3>
    <div class="overflow-x-auto">
      <table class="w-full text-left font-mono text-xs border border-border-subtle">
        <caption class="sr-only">Font weight tokens, Tailwind utilities, and specimens</caption>
        <thead class="bg-surface-canvas text-fg-primary border-b border-border-subtle text-[11px]">
          <tr>
            <th scope="col" class="p-3 border-r border-border-subtle">Token</th>
            <th scope="col" class="p-3 border-r border-border-subtle">Value</th>
            <th scope="col" class="p-3 border-r border-border-subtle">Utility</th>
            <th scope="col" class="p-3">Specimen</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border-subtle/60 bg-surface-elevated">
          {#each fontWeights as [name, weight]}
            <tr>
              <th
                scope="row"
                class="p-3 border-r border-border-subtle font-bold text-fg-primary align-top"
              >
                --font-weight-{name}
              </th>
              <td class="p-3 border-r border-border-subtle text-fg-muted align-top">{weight}</td>
              <td class="p-3 border-r border-border-subtle text-fg-muted align-top">
                font-{name}
              </td>
              <td class="p-3 text-fg-primary align-top">
                <span class={weightClass[name] ?? ''}>The quick brown fox</span>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <h3 class="text-sm font-mono font-bold text-fg-primary mt-8 mb-3">Body measure</h3>
    <p class="text-base text-fg-primary leading-relaxed max-w-prose">
      Body copy is set at a comfortable measure for sustained reading. Manrope is a
      geometric-humanist sans with a warm, industrial character;
      <code class="font-mono text-sm">--font-sans</code> and
      <code class="font-mono text-sm">--font-mono</code> resolve to the same stack, so body text and telemetry
      labels share one voice.
    </p>
  </section>

  <section>
    <h2 class="text-xl font-mono font-bold text-fg-primary mb-4">Spacing &amp; density</h2>
    <p class="text-sm text-fg-muted leading-relaxed max-w-3xl mb-6">
      A 4px-based spacing scale governs layout rhythm. The density axis swaps six control and row
      metrics without changing markup, structure, or component APIs.
    </p>

    <h3 class="text-sm font-mono font-bold text-fg-primary mb-1">Density comparator</h3>
    <p class="text-xs text-fg-muted leading-relaxed max-w-3xl mb-4">
      The same telemetry card rendered under each density mode. Control height, row rhythm, padding,
      type size, and gaps all compress from one attribute.
    </p>

    <div class="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
      {#each densityModes as mode}
        <div class="overflow-hidden rounded-card border border-border-subtle bg-surface-elevated">
          <div
            class="flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle bg-surface-canvas px-4 py-2.5"
          >
            <span class="flex items-center gap-2 font-mono text-[11px] font-bold text-fg-primary">
              <span class="h-2 w-2 rounded-full bg-accent-interactive" aria-hidden="true"></span>
              {mode.label}
            </span>
            <code class="font-mono text-[10px] text-fg-muted">data-density="{mode.name}"</code>
          </div>

          <div data-density={mode.name} class="bg-surface-elevated p-[var(--control-px)]">
            <div
              class="overflow-hidden rounded-control border border-border-subtle bg-surface-canvas"
            >
              <div
                class="flex h-[var(--row-height)] items-center justify-between gap-2 border-b border-border-subtle px-[var(--control-px)]"
              >
                <span
                  class="truncate font-mono text-[length:var(--font-size-ui)] font-bold tracking-wide text-fg-primary"
                >
                  CH-04 / Arm servo
                </span>
                <span
                  class="inline-flex shrink-0 items-center gap-1.5 font-mono text-[10px] text-status-nominal"
                >
                  <span class="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true"></span>
                  Nominal
                </span>
              </div>

              <div class="flex items-center gap-[var(--gap-ui)] p-[var(--control-px)]">
                <div
                  class="flex h-[var(--control-height)] min-w-0 flex-1 items-center justify-between gap-2 border border-border-subtle bg-surface-elevated px-[var(--control-px)]"
                >
                  <span class="truncate font-mono text-[10px] text-fg-muted"> Torque limit </span>
                  <span
                    class="shrink-0 font-mono text-[length:var(--font-size-ui)] text-fg-primary"
                  >
                    12.5 <span class="text-[0.75em] text-fg-muted">Nm</span>
                  </span>
                </div>
                <span
                  class="inline-flex h-[var(--control-height)] shrink-0 items-center justify-center rounded-control border border-transparent bg-accent-interactive px-[var(--control-px)] font-mono text-[length:var(--font-size-ui)] font-bold text-accent-contrast"
                >
                  Arm
                </span>
              </div>

              <div class="border-t border-border-subtle">
                {#each densityRows as row}
                  <div
                    class="flex h-[var(--row-height)] items-center gap-[var(--gap-ui)] border-b border-border-subtle px-[var(--control-px)] last:border-b-0"
                  >
                    <span
                      class="min-w-0 flex-1 truncate font-mono text-[length:var(--font-size-ui)] text-fg-primary"
                    >
                      {row.label}
                    </span>
                    <span class="hidden font-mono text-[10px] text-fg-muted sm:inline">
                      {row.value}
                    </span>
                    <span
                      class="inline-flex shrink-0 items-center gap-1 font-mono text-[10px] {row.tone}"
                    >
                      <span class="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true"></span>
                      {row.status}
                    </span>
                  </div>
                {/each}
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>

    <div class="mt-8 mb-3 flex flex-wrap items-baseline justify-between gap-2">
      <h3 class="text-sm font-mono font-bold text-fg-primary">Density token deltas</h3>
      <span class="font-mono text-[10px] text-fg-muted">comfortable → compact</span>
    </div>
    <div class="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
      {#each densityMetrics as metric}
        <div class="rounded-card border border-border-subtle bg-surface-elevated p-3">
          <div class="flex items-baseline justify-between gap-2">
            <code class="truncate font-mono text-[10px] text-fg-muted">--{metric.name}</code>
            <span class="shrink-0 font-mono text-[10px] font-bold text-fg-primary">
              {metric.delta}%
            </span>
          </div>
          <div class="mt-1.5 flex items-baseline justify-between gap-1 font-mono">
            <span class="text-[10px] text-fg-muted">{metric.comfortableValue}</span>
            <span class="text-[9px] text-fg-muted" aria-hidden="true">→</span>
            <span class="text-[11px] font-bold text-fg-primary">{metric.compactValue}</span>
          </div>
        </div>
      {/each}
    </div>

    <h3 class="text-sm font-mono font-bold text-fg-primary mt-8 mb-1">Spacing scale</h3>
    <p class="text-xs text-fg-muted leading-relaxed max-w-3xl mb-4">
      Each step lands on the 4px grid. Bars are drawn at 2× scale so the progression from hairline
      gap to section break stays legible.
    </p>

    <div class="overflow-hidden rounded-card border border-border-subtle bg-surface-elevated">
      <div
        class="flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle bg-surface-canvas px-4 py-2.5"
      >
        <span class="font-mono text-[10px] font-bold text-fg-primary"> 4px base rhythm </span>
        <span class="font-mono text-[10px] text-fg-muted">
          0 – 64px · <code class="text-fg-primary">--spacing-*</code>
        </span>
      </div>

      <div class="overflow-x-auto">
        <div class="min-w-[680px] p-4">
          <div class="flex gap-3">
            <div
              class="flex h-32 w-10 shrink-0 flex-col justify-between pb-0 text-right font-mono text-[10px] text-fg-muted"
              aria-hidden="true"
            >
              <span>64px</span>
              <span>48</span>
              <span>32</span>
              <span>16</span>
              <span>0</span>
            </div>

            <div class="flex flex-1 items-end gap-2">
              {#each spacingRows as row}
                <div class="group flex min-w-0 flex-1 flex-col">
                  <div class="flex h-32 items-end">
                    <div
                      class="w-full rounded-t-sm border border-b-0 border-accent-interactive/40 bg-accent-interactive/50 transition-colors group-hover:bg-accent-interactive/80"
                      style:height={`${row.pct}%`}
                      title={`--spacing-${row.name}: ${row.value} (${row.px}px)`}
                    ></div>
                  </div>
                  <div class="mt-2 border-t border-border-subtle pt-2 text-center font-mono">
                    <div class="text-[11px] font-bold text-fg-primary">{row.name}</div>
                    <div class="text-[10px] text-fg-muted">{row.value}</div>
                    <div class="text-[10px] text-fg-muted">{row.px}px</div>
                    <div class="mt-0.5 text-[10px] text-fg-muted">p-{row.name}</div>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </div>
      </div>
    </div>

    <h3 class="text-sm font-mono font-bold text-fg-primary mt-8 mb-3">Radius</h3>
    <div class="flex flex-wrap gap-6">
      {#each radii as radius}
        <div class="flex items-center gap-3">
          <div
            class="w-16 h-16 shrink-0 border border-border-subtle bg-surface-elevated {radius.className}"
            aria-hidden="true"
          ></div>
          <div class="font-mono text-[10px] space-y-0.5">
            <div class="text-fg-primary font-bold">{radius.token}</div>
            <div class="text-fg-muted">{radius.value} · {radius.usage}</div>
          </div>
        </div>
      {/each}
    </div>
  </section>

  <section>
    <h2 class="text-xl font-mono font-bold text-fg-primary mb-4">Theme scopes</h2>
    <p class="text-sm text-fg-muted leading-relaxed max-w-3xl mb-6">
      The header switches set the document root. A scoped subtree can carry its own theme and
      density, so a paper article can embed a compact industrial console without changing the page
      around it.
    </p>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {#each scopes as scope}
        <div class="space-y-2">
          <div class="flex flex-wrap items-baseline justify-between gap-2">
            <h3 class="text-sm font-mono font-bold text-fg-primary">
              {scope.label} / {scope.densityLabel}
            </h3>
            <code class="text-[10px] font-mono text-fg-muted">
              data-theme="{scope.theme}" · data-density="{scope.density}"
            </code>
          </div>

          <ThemeScope
            theme={scope.theme}
            density={scope.density}
            class="border border-border-subtle p-4 space-y-3"
          >
            <p class="text-sm leading-relaxed">
              Surface, text, accent, and status colors resolve from this subtree. The control height
              and padding read the scoped density metrics.
            </p>

            <div class="flex flex-wrap items-center gap-2">
              <span
                class="inline-flex items-center h-[var(--control-height)] px-[var(--control-px)] rounded-control bg-accent-interactive text-accent-contrast font-mono text-[10px] font-bold"
              >
                Control
              </span>

              {#each statuses as status}
                <span
                  class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-control border border-border-subtle bg-surface-elevated font-mono text-[10px] text-fg-muted"
                >
                  <span class="w-2 h-2 rounded-full {status.dotClass}" aria-hidden="true"></span>
                  {status.label}
                </span>
              {/each}
            </div>
          </ThemeScope>
        </div>
      {/each}
    </div>
  </section>
</div>
