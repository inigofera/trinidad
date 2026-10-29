<script lang="ts">
  import WorkbenchShell from '../WorkbenchShell.svelte';
  import {
    ProjectCard,
    FilterBar,
    type FilterOption,
    SiteNav,
    SiteFooter,
    ExperienceItem,
    DeviceFrame,
    Badge,
    Button
  } from '$lib';

  // Active view tab
  let activeTab = $state<'overview' | 'project-card' | 'filter-bar' | 'site-chrome' | 'experience'>(
    'overview'
  );

  // FilterBar state
  const filterOptions: FilterOption[] = [
    { id: 'all', label: 'All Work', count: 4 },
    { id: 'ux-engineering', label: 'UX Engineering', count: 2 },
    { id: 'design-systems', label: 'Design Systems', count: 1 },
    { id: 'industrial-hri', label: 'Industrial HRI', count: 1 }
  ];
  let selectedDiscipline = $state('all');

  // ProjectCard interactive state
  let cardTitle = $state('Trinidad Teleoperation HRI Console');
  let cardDescription = $state(
    'A resilient Human-Robot Interaction design system and operator console engineered for high-consequence spatial teleoperation over high-latency WebRTC streams.'
  );
  let cardKicker = $state('2025 · INDUSTRIAL HRI');
  let cardFeatured = $state(true);
  let cardMetricValue = $state('-42% Latency');
  let cardMetricLabel = $state('Operator Intervention Delay');

  const allProjects = [
    {
      id: 'trinidad-hri',
      discipline: 'industrial-hri',
      title: 'Trinidad Teleoperation HRI Console',
      description:
        'A resilient Human-Robot Interaction design system and operator console engineered for high-consequence spatial teleoperation over high-latency WebRTC streams.',
      kicker: '2025 · INDUSTRIAL HRI',
      featured: true,
      href: '/case-study/trinidad-hri',
      metric: { value: '-42% Latency', label: 'Intervention Delay' },
      tags: ['Svelte 5', 'WebRTC', 'Human Factors', 'DTCG Tokens']
    },
    {
      id: 'telemetry-stream',
      discipline: 'ux-engineering',
      title: 'Spatial Kinematics Telemetry Stream',
      description:
        '60 FPS canvas-accelerated telemetry inspection tool rendering 10,000 real-time coordinate updates on low-power operator tablets.',
      kicker: '2024 · UX ENGINEERING',
      featured: false,
      href: '/case-study/telemetry-stream',
      metric: { value: '60.0 FPS', label: 'Render Target' },
      tags: ['WebGL', 'Svelte Runes', 'Virtualization']
    },
    {
      id: 'token-architecture',
      discipline: 'design-systems',
      title: 'Multi-Brand DTCG Token Architecture',
      description:
        'W3C design token pipeline transforming semantic color roles and tactile typography across web, embedded hardware, and Figma tokens.',
      kicker: '2024 · DESIGN SYSTEMS',
      featured: false,
      href: '/case-study/token-architecture',
      metric: { value: '0 Violations', label: 'A11y Automated' },
      tags: ['W3C DTCG', 'Zero-Runtime CSS', 'A11y']
    },
    {
      id: 'autonomous-rover',
      discipline: 'ux-engineering',
      title: 'Autonomous Rover Waypoint Planner',
      description:
        'Direct-manipulation route editor with ergonomic error-prevention guards and tactile undo/redo history trees.',
      kicker: '2023 · ERGONOMICS',
      featured: false,
      href: '/case-study/autonomous-rover',
      metric: { value: '1.2s', label: 'Path Calculation' },
      tags: ['Robotics', 'Ergonomics', 'Interactive Canvas']
    }
  ];

  const filteredProjects = $derived.by(() => {
    if (selectedDiscipline === 'all') return allProjects;
    return allProjects.filter((p) => p.discipline === selectedDiscipline);
  });

  const generatedCode = $derived.by(() => {
    switch (activeTab) {
      case 'project-card':
        return `<script lang="ts">
  import { ProjectCard, DeviceFrame } from 'trinidad-ui';
<\/script>

<ProjectCard
  title="${cardTitle}"
  description="${cardDescription}"
  kicker="${cardKicker}"
  href="/case-study/sample"
  featured={${cardFeatured}}
  metric={{ value: '${cardMetricValue}', label: '${cardMetricLabel}' }}
  tags={['Svelte 5', 'Human Factors', 'DTCG Tokens']}
>
  {#snippet media()}
    <DeviceFrame type="terminal" title="OPERATOR_HUD_V2.BIN">
      <div class="p-6 text-center font-mono text-xs text-fg-muted">
        [Live HRI Canvas Simulation]
      </div>
    </DeviceFrame>
  {/snippet}
</ProjectCard>`;

      case 'filter-bar':
        return `<script lang="ts">
  import { FilterBar, type FilterOption } from 'trinidad-ui';

  const options: FilterOption[] = [
    { id: 'all', label: 'All Work', count: 4 },
    { id: 'ux-engineering', label: 'UX Engineering', count: 2 },
    { id: 'design-systems', label: 'Design Systems', count: 1 }
  ];
  let selected = $state('all');
<\/script>

<FilterBar
  {options}
  bind:selected
  label="Filter portfolio projects"
  syncUrl={true}
/>`;

      case 'site-chrome':
        return `<script lang="ts">
  import { SiteNav, SiteFooter } from 'trinidad-ui';

  const links = [
    { label: 'Work', href: '/#work' },
    { label: 'Lab', href: '/lab' },
    { label: 'Writing', href: '/writing' },
    { label: 'About', href: '/about' }
  ];
<\/script>

<SiteNav
  brandName="Iñigo Artolozaga"
  brandRole="UX Designer & Engineer"
  {links}
  currentPath="/#work"
/>

<SiteFooter
  brandName="Iñigo Artolozaga"
  colophon="Designed in Trinidad Design System · Built with Svelte 5 & DTCG Tokens"
/>`;

      case 'experience':
        return `<script lang="ts">
  import { ExperienceItem } from 'trinidad-ui';
<\/script>

<ExperienceItem
  period="2023 — Present"
  role="Lead UX Engineer"
  organization="Autonomous Systems Research"
  location="San Francisco, CA"
  current={true}
  description="Architecting next-generation teleoperation consoles and ergonomic human-robot interfaces."
  highlights={[
    'Engineered zero-runtime token pipeline serving hardware displays and web consoles',
    'Reduced critical teleoperation intervention latency by 42%'
  ]}
  skills={['Svelte 5', 'Human Factors', 'Design Systems', 'WebRTC']}
/>`;

      default:
        return `<!-- Portfolio Structure & Discovery Suite -->
<FilterBar options={filterOptions} bind:selected={selectedDiscipline} />
<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
  {#each filteredProjects as project}
    <ProjectCard {...project} />
  {/each}
</div>`;
    }
  });
</script>

<WorkbenchShell
  name="Portfolio Structure & Discovery"
  description="High-impact case study teaser cards with hover elevation and media slots, multi-axis URL-synced filter pills with roving tabindex, portfolio navigation shell, and experience milestones."
  {generatedCode}
>
  {#snippet stage()}
    <div class="w-full max-w-4xl mx-auto space-y-10">
      <!-- Filter Bar Section -->
      {#if activeTab === 'overview' || activeTab === 'filter-bar'}
        <div class="space-y-3">
          <div class="text-xs font-mono text-fg-muted uppercase tracking-wider">
            [Multi-Axis Discipline Filter Bar with Keyboard Navigation]
          </div>
          <FilterBar
            options={filterOptions}
            bind:selected={selectedDiscipline}
            label="Filter case studies by discipline"
          />
        </div>
      {/if}

      <!-- Project Cards Section -->
      {#if activeTab === 'overview' || activeTab === 'project-card'}
        <div id="project-preview" class="space-y-6">
          <div class="text-xs font-mono text-fg-muted uppercase tracking-wider">
            [ProjectCard Grid ({filteredProjects.length} matching)]
          </div>

          <!-- Featured Card Sample -->
          {#if filteredProjects.length > 0}
            <ProjectCard
              title={cardTitle}
              description={cardDescription}
              kicker={cardKicker}
              href="#project-preview"
              featured={cardFeatured}
              metric={{ value: cardMetricValue, label: cardMetricLabel }}
              tags={['Svelte 5', 'WebRTC', 'Human Factors', 'DTCG Tokens']}
            >
              {#snippet media()}
                <div class="p-2 sm:p-4 bg-surface-muted h-full flex items-center justify-center">
                  <DeviceFrame
                    variant="terminal"
                    title="OPERATOR_HUD_V2.BIN"
                    class="w-full shadow-subtle"
                  >
                    <div class="p-4 sm:p-6 text-center font-mono text-xs space-y-2 select-none">
                      <div class="text-status-nominal font-bold">● TELEOPERATION STREAM ACTIVE</div>
                      <div class="text-fg-muted">Frame: 60.0 FPS · Latency: 24ms · Loss: 0.0%</div>
                    </div>
                  </DeviceFrame>
                </div>
              {/snippet}
            </ProjectCard>
          {/if}

          <!-- Grid Cards -->
          {#if filteredProjects.length > 1}
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {#each filteredProjects.slice(1) as proj}
                <ProjectCard
                  title={proj.title}
                  description={proj.description}
                  kicker={proj.kicker}
                  href="#project-preview"
                  metric={proj.metric}
                  tags={proj.tags}
                >
                  {#snippet media()}
                    <div
                      class="aspect-video w-full bg-surface-elevated flex items-center justify-center p-6 border-b border-border-subtle"
                    >
                      <div class="text-center font-mono text-xs space-y-1 text-fg-muted">
                        <div class="font-bold text-fg-primary">[{proj.kicker}]</div>
                        <div>Interactive Case Study Media</div>
                      </div>
                    </div>
                  {/snippet}
                </ProjectCard>
              {/each}
            </div>
          {/if}
        </div>
      {/if}

      <!-- Experience Milestones Section -->
      {#if activeTab === 'overview' || activeTab === 'experience'}
        <div class="space-y-4">
          <div class="text-xs font-mono text-fg-muted uppercase tracking-wider">
            [ExperienceTimeline & Milestone Items]
          </div>
          <div
            class="rounded-[var(--radius-card)] border border-border-subtle bg-surface-canvas p-6 sm:p-8"
          >
            <ExperienceItem
              period="2023 — Present"
              role="Lead UX Engineer & Design Systems Architect"
              organization="Autonomous Robotics & Spatial Computing"
              location="San Francisco, CA"
              current={true}
              description="Directing the design engineering architecture for mission-critical robotic teleoperation, operator consoles, and cross-platform design token engines."
              highlights={[
                'Engineered zero-runtime W3C token pipeline unifying hardware instrument displays and responsive web dashboards',
                'Decreased high-consequence teleoperation intervention latency by 42% through direct manipulation interfaces',
                'Maintained 100% WCAG 2.1 AA accessibility compliance across light and dark operator environments'
              ]}
              skills={['Svelte 5 Runes', 'Human Factors', 'DTCG Tokens', 'WebRTC', 'A11y']}
            />

            <ExperienceItem
              period="2020 — 2023"
              role="Senior UX Engineer"
              organization="Human Interface & Design Systems Group"
              location="New York, NY"
              current={false}
              description="Spearheaded design system component architectures, accessibility auditing pipelines, and high-fidelity interactive prototypes."
              highlights={[
                'Designed and scaled component library adopted across 14 product squads',
                'Built automated continuous-integration accessibility test harness reducing regression bugs to zero'
              ]}
              skills={['TypeScript', 'Accessibility', 'Interaction Design', 'Playwright']}
            />
          </div>
        </div>
      {/if}

      <!-- Site Navigation & Footer Preview Section -->
      {#if activeTab === 'overview' || activeTab === 'site-chrome'}
        <div class="space-y-4">
          <div class="text-xs font-mono text-fg-muted uppercase tracking-wider">
            [SiteNav & SiteFooter Portfolio Chrome Preview]
          </div>
          <div
            class="rounded-[var(--radius-card)] border border-border-subtle overflow-hidden bg-surface-canvas"
          >
            <SiteNav
              brandName="Iñigo Artolozaga"
              brandRole="UX Designer & Engineer"
              links={[
                { label: 'Work', href: '/lab/showcase', active: true },
                { label: 'Lab', href: '/lab/showcase' },
                { label: 'Writing', href: '/lab/showcase' },
                { label: 'About', href: '/lab/showcase' }
              ]}
              sticky={false}
            />

            <div
              class="p-8 text-center font-mono text-xs text-fg-muted bg-surface-elevated/40 border-b border-border-subtle"
            >
              [Simulated Page Body Viewport]
            </div>

            <SiteFooter
              brandName="Iñigo Artolozaga"
              colophon="Designed with Trinidad Design System · Svelte 5 · DTCG Tokens"
              backToTop={false}
            />
          </div>
        </div>
      {/if}
    </div>
  {/snippet}

  {#snippet controls()}
    <div class="space-y-5 font-mono text-xs">
      <div class="space-y-1">
        <label for="ctrl-sc-tab" class="text-fg-muted font-bold block">Focus Component</label>
        <select
          id="ctrl-sc-tab"
          bind:value={activeTab}
          class="w-full bg-surface-canvas text-fg-primary border border-border-subtle rounded-[var(--radius-control)] px-2 py-1.5"
        >
          <option value="overview">Full Composition Overview</option>
          <option value="project-card">ProjectCard Teaser</option>
          <option value="filter-bar">FilterBar Navigation</option>
          <option value="experience">Experience Milestone Item</option>
          <option value="site-chrome">SiteNav & SiteFooter Chrome</option>
        </select>
      </div>

      {#if activeTab === 'project-card' || activeTab === 'overview'}
        <div class="pt-3 border-t border-border-subtle space-y-3">
          <div class="text-fg-primary font-bold">[ProjectCard Props]</div>
          <div class="space-y-1">
            <label for="ctrl-pc-title" class="text-fg-muted block">Title</label>
            <input
              id="ctrl-pc-title"
              type="text"
              bind:value={cardTitle}
              class="w-full bg-surface-canvas text-fg-primary border border-border-subtle rounded-[var(--radius-control)] px-2 py-1"
            />
          </div>
          <div class="space-y-1">
            <label for="ctrl-pc-kicker" class="text-fg-muted block">Kicker</label>
            <input
              id="ctrl-pc-kicker"
              type="text"
              bind:value={cardKicker}
              class="w-full bg-surface-canvas text-fg-primary border border-border-subtle rounded-[var(--radius-control)] px-2 py-1"
            />
          </div>
          <div class="space-y-1">
            <label for="ctrl-pc-metric-val" class="text-fg-muted block">Metric Value</label>
            <input
              id="ctrl-pc-metric-val"
              type="text"
              bind:value={cardMetricValue}
              class="w-full bg-surface-canvas text-fg-primary border border-border-subtle rounded-[var(--radius-control)] px-2 py-1"
            />
          </div>
          <div class="space-y-1">
            <label for="ctrl-pc-metric-lbl" class="text-fg-muted block">Metric Label</label>
            <input
              id="ctrl-pc-metric-lbl"
              type="text"
              bind:value={cardMetricLabel}
              class="w-full bg-surface-canvas text-fg-primary border border-border-subtle rounded-[var(--radius-control)] px-2 py-1"
            />
          </div>
          <label class="flex items-center gap-2 cursor-pointer pt-1">
            <input type="checkbox" bind:checked={cardFeatured} class="accent-accent-interactive" />
            <span>Featured Layout (Wide)</span>
          </label>
        </div>
      {/if}

      {#if activeTab === 'filter-bar' || activeTab === 'overview'}
        <div class="pt-3 border-t border-border-subtle space-y-3">
          <div class="text-fg-primary font-bold">[FilterBar State]</div>
          <div class="text-fg-muted">
            Active: <span class="text-fg-primary font-bold">{selectedDiscipline}</span>
          </div>
        </div>
      {/if}
    </div>
  {/snippet}
</WorkbenchShell>
