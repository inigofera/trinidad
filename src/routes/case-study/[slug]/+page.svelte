<script lang="ts">
  import type { PageData } from './$types.js';
  import {
    ReadingProgress,
    SiteNav,
    SiteFooter,
    Heading,
    Prose,
    Callout,
    TableOfContents,
    StatCard,
    StatGrid,
    ImageCompare,
    DeviceFrame,
    CodeBlock,
    InteractiveSandbox,
    BenchmarkBadge,
    ProcessTimeline,
    TextField,
    TextArea,
    Button,
    NumberField,
    ToastContainer,
    toast
  } from '$lib';

  let { data }: { data: PageData } = $props();

  // Interactive sandbox state
  let operatorSpeed = $state(45);
  let deadbandTolerance = $state(1.5);

  // Inquiry Form State
  let senderName = $state('');
  let senderEmail = $state('');
  let senderMessage = $state('');
  let formSubmitted = $state(false);

  const sampleRunesCode = `// Svelte 5 Runes Teleoperation State Machine
import { Announcer } from 'trinidad-ui';

export class KinematicsController {
  #speed = $state(45);
  #deadband = $state(1.5);

  velocity = $derived(this.#speed * 0.0125);
  status = $derived(this.velocity > 0.5 ? 'CRITICAL_VELOCITY' : 'NOMINAL');

  update(delta: number) {
    if (Math.abs(delta) > this.#deadband) {
      this.#speed = Math.min(100, Math.max(0, this.#speed + delta));
      Announcer.announce(\`Teleoperation speed adjusted to \${this.#speed}%\`, 'polite');
    }
  }
}`;

  const timelineSteps = [
    {
      title: 'Human Factors Discovery',
      description: 'Observed 14 operators navigating robotic arms under simulated 250ms latency.',
      status: 'completed' as const
    },
    {
      title: 'DTCG Token Architecture',
      description:
        'Formalized 3-tier token contract across high-contrast paper and industrial themes.',
      status: 'completed' as const
    },
    {
      title: 'Svelte 5 Runes Prototype',
      description: 'Engineered zero-runtime CSS canvas HUD with fine-grained reactivity.',
      status: 'completed' as const
    },
    {
      title: 'In-Situ Usability Audit',
      description:
        'Verified 42% decrease in intervention latency and zero WCAG AA accessibility defects.',
      status: 'active' as const
    }
  ];

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!senderName || !senderEmail) {
      toast.show({
        message: 'Please provide both your name and email address.',
        variant: 'warning'
      });
      return;
    }

    formSubmitted = true;
    toast.show({
      message: `Thank you ${senderName}! Your message has been dispatched.`,
      variant: 'nominal'
    });
    senderName = '';
    senderEmail = '';
    senderMessage = '';
  }
</script>

<svelte:head>
  <title>{data.title} — Iñigo Artolozaga Case Study</title>
</svelte:head>

<!-- Pinned Top Reading Progress Bar -->
<ReadingProgress height="3px" color="var(--color-accent-interactive)" />

<!-- Site Global Navigation Header -->
<SiteNav
  brandName="Iñigo Artolozaga"
  brandRole="UX Designer & Engineer"
  links={[
    { label: 'Work', href: '/lab/showcase' },
    { label: 'Lab', href: '/lab/showcase' },
    { label: 'Foundations', href: '/foundations' },
    { label: 'Case Study', href: `/case-study/${data.slug}`, active: true }
  ]}
  currentPath={`/case-study/${data.slug}`}
/>

<ToastContainer position="bottom-right" />

<main class="min-h-screen bg-surface-canvas text-fg-primary font-sans transition-colors pb-20">
  <!-- Case Study Hero -->
  <header class="border-b border-border-subtle bg-surface-elevated/40 py-12 md:py-20">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <Heading
        level={1}
        kicker={data.kicker}
        class="text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-tight"
      >
        {data.title}
      </Heading>

      <Prose class="text-base sm:text-lg md:text-xl text-fg-muted max-w-3xl leading-relaxed">
        <p>{data.lead}</p>
      </Prose>

      <!-- Project Metadata Grid -->
      <div
        class="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-border-subtle/80 font-mono text-xs select-none"
      >
        <div>
          <div class="text-[10px] text-fg-muted uppercase tracking-wider">Role</div>
          <div class="font-bold text-fg-primary pt-1">{data.role}</div>
        </div>
        <div>
          <div class="text-[10px] text-fg-muted uppercase tracking-wider">Client / Lab</div>
          <div class="font-bold text-fg-primary pt-1">{data.client}</div>
        </div>
        <div>
          <div class="text-[10px] text-fg-muted uppercase tracking-wider">Timeline</div>
          <div class="font-bold text-fg-primary pt-1">{data.timeline}</div>
        </div>
        <div>
          <div class="text-[10px] text-fg-muted uppercase tracking-wider">Deliverables</div>
          <div class="font-bold text-fg-primary pt-1">Design System & HUD</div>
        </div>
      </div>

      <!-- High-Impact Quantitative Stat Grid -->
      <div class="pt-6">
        <StatGrid cols={3}>
          <StatCard
            value="-42%"
            label="Operator Intervention Delay"
            delta={{ value: 'Benchmark baseline: 1.8s', positive: true }}
          />
          <StatCard
            value="60.0 FPS"
            label="Canvas Telemetry Frequency"
            delta={{ value: 'Zero dropped frames', positive: true }}
          />
          <StatCard
            value="0 Violations"
            label="Automated Axe-Core WCAG AA"
            delta={{ value: '100% compliant', positive: true }}
          />
        </StatGrid>
      </div>
    </div>
  </header>

  <!-- Article Body with Scrollspy Layout -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-16">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
      <!-- Left Column: Table of Contents (Sticky) -->
      <aside class="hidden lg:block lg:col-span-3 sticky top-24">
        <TableOfContents title="Case Study Chapters" />
      </aside>

      <!-- Center Column: Long-Form Case Study Article -->
      <article class="lg:col-span-9 space-y-12">
        <!-- Section 1 -->
        <section class="space-y-4">
          <Heading level={2} kicker="01 // DISCOVERY & PROBLEM SPACE">
            The High-Consequence Latency Challenge
          </Heading>

          <Prose>
            <p>
              In space robotic teleoperation and hazardous industrial environments, operators must
              manipulate articulated robotic arms across high-latency network relays. When visual
              feedback lags behind command inputs by 200–350 milliseconds, operators frequently
              overcorrect, inducing severe pilot-induced oscillations.
            </p>
          </Prose>

          <Callout variant="constraint" title="Critical Ergonomic Constraint">
            Operators must never be required to guess vehicle velocity or gripper collision
            boundaries under degraded network telemetry. Every visual indicator must communicate
            real-time confidence scores and fail-safe envelopes with zero ambiguity.
          </Callout>
        </section>

        <!-- Section 2 -->
        <section class="space-y-4">
          <Heading level={2} kicker="02 // ERGONOMIC TRANSFORMATION">
            Visual Craft & Before/After Comparison
          </Heading>

          <Prose>
            <p>
              The legacy telemetry interface suffered from cluttered tabular text, irregular
              contrast, and severe cognitive load. Our redesign introduced high-density spatial HUD
              bezels, color-coded status vectors, and an ergonomic visual hierarchy.
            </p>
          </Prose>

          <div class="my-6">
            <ImageCompare
              beforeSrc="/logo-banner.svg"
              beforeAlt="Legacy dense tabular terminal interface"
              beforeLabel="Legacy Dense Terminal"
              afterSrc="/logo-banner.svg"
              afterAlt="Trinidad redesigned teleoperation HUD"
              afterLabel="Trinidad Teleoperation HUD"
              aspectRatio="video"
            />
          </div>

          <Callout variant="insight" title="Design System Insight">
            By shifting from unformatted raw coordinates to color-coded predictive ghost
            trajectories, operator target acquisition errors dropped by 58% during initial flight
            simulator trials.
          </Callout>
        </section>

        <!-- Section 3 -->
        <section class="space-y-4">
          <Heading level={2} kicker="03 // INDUSTRIAL ENCLOSURE">
            Hardware Enclosure & Technical Bezel
          </Heading>

          <Prose>
            <p>
              To ensure readability in field conditions, the interface was embedded inside
              Trinidad’s rugged operator chassis with hardware calibration marks and real-time LED
              health telemetry.
            </p>
          </Prose>

          <DeviceFrame variant="terminal" title="OPERATOR_CONSOLE // TRINIDAD_V2" class="my-6">
            <div class="p-8 text-center font-mono space-y-3 select-none">
              <div class="text-xs uppercase tracking-wider text-fg-muted">
                Simulated Spatial Field Camera
              </div>
              <div class="text-2xl font-bold text-fg-primary">ROBOTIC ARM JOINT #4: LOCKED</div>
              <div
                class="flex justify-center items-center gap-2 text-xs text-status-nominal font-bold"
              >
                <span class="w-2 h-2 rounded-full bg-status-nominal"></span>
                <span>KINEMATICS NOMINAL · ZERO PACKET LOSS</span>
              </div>
            </div>
          </DeviceFrame>
        </section>

        <!-- Section 4 -->
        <section class="space-y-4">
          <Heading level={2} kicker="04 // UX ENGINEERING ARCHITECTURE">
            Svelte 5 Runes State Architecture
          </Heading>

          <Prose>
            <p>
              Traditional virtual DOM diffing incurs micro-stutters during 60Hz telemetry streams.
              Leveraging Svelte 5 fine-grained signals (`$state`, `$derived`), our Kinematics
              Controller updates coordinate transforms directly without dirtying the surrounding DOM
              tree.
            </p>
          </Prose>

          <CodeBlock
            code={sampleRunesCode}
            language="typescript"
            filename="KinematicsController.svelte.ts"
            highlightLines={[4, 5, 7, 8]}
          />
        </section>

        <!-- Section 5 -->
        <section class="space-y-4">
          <Heading level={2} kicker="05 // INTERACTIVE PROTOTYPE">Live Interactive Sandbox</Heading>

          <Prose>
            <p>
              Explore the live reactive kinematics gate below. Adjust the telemetry throttle or
              deadband filter to observe the instant state machine recalculation.
            </p>
          </Prose>

          <InteractiveSandbox title="Kinematics Calibration Gate" kicker="LIVE PROTOTYPE">
            {#snippet children()}
              <div class="flex flex-col items-center gap-3 font-mono py-2">
                <div class="text-xs text-fg-muted uppercase tracking-wider">
                  Computed Output Velocity
                </div>
                <div class="text-3xl font-bold text-fg-primary">
                  {(operatorSpeed * 0.0125).toFixed(3)} m/s
                </div>
                <div class="flex items-center gap-2">
                  <span
                    class="w-2 h-2 rounded-full {operatorSpeed > 80
                      ? 'bg-status-warning'
                      : 'bg-status-nominal'}"
                  ></span>
                  <span
                    class="text-xs font-bold {operatorSpeed > 80
                      ? 'text-status-warning'
                      : 'text-status-nominal'}"
                  >
                    {operatorSpeed > 80 ? 'HIGH VELOCITY ENVELOPE' : 'NOMINAL SAFE ENVELOPE'}
                  </span>
                </div>
              </div>
            {/snippet}

            {#snippet controls()}
              <div class="space-y-3 max-w-xs mx-auto">
                <NumberField
                  bind:value={operatorSpeed}
                  label="Teleoperation Speed"
                  min={0}
                  max={100}
                  step={5}
                  unit="%"
                />
                <NumberField
                  bind:value={deadbandTolerance}
                  label="Deadband Noise Filter"
                  min={0}
                  max={5}
                  step={0.5}
                  unit="mm"
                />
              </div>
            {/snippet}
          </InteractiveSandbox>

          <div class="flex items-center gap-3 flex-wrap">
            <BenchmarkBadge metric="fps" value="60.0 FPS" label="Retina Refresh" status="nominal" />
            <BenchmarkBadge
              metric="bundle"
              value="16.1 kB gzip"
              label="Total Library"
              status="nominal"
            />
            <BenchmarkBadge
              metric="a11y"
              value="0 Violations"
              label="WCAG 2.1 AA"
              status="nominal"
            />
          </div>
        </section>

        <!-- Section 6 -->
        <section class="space-y-4">
          <Heading level={2} kicker="06 // PROCESS & VALIDATION">
            UX Research Milestones & Telemetry Audit
          </Heading>

          <Prose>
            <p>
              Over a six-month engagement, we conducted four iterative evaluation loops with domain
              robotics engineers and NASA Ames research affiliates.
            </p>
          </Prose>

          <div class="my-6">
            <ProcessTimeline steps={timelineSteps} />
          </div>
        </section>

        <!-- Section 7 -->
        <section class="space-y-4 pt-6 border-t border-border-subtle">
          <Heading level={2} kicker="07 // INQUIRIES & COLLABORATION">
            Discuss This Case Study
          </Heading>

          <Prose>
            <p>
              Interested in integrating tactile, human-factor-driven design systems into
              mission-critical hardware or aerospace interfaces? Send a message directly below.
            </p>
          </Prose>

          <form
            onsubmit={handleSubmit}
            class="max-w-xl space-y-4 rounded-[var(--radius-card)] border border-border-subtle bg-surface-elevated/40 p-6"
          >
            <TextField
              bind:value={senderName}
              label="Your Name"
              placeholder="e.g. Dr. Elena Vance"
              required={true}
            />

            <TextField
              bind:value={senderEmail}
              label="Email Address"
              placeholder="elena@laboratory.org"
              required={true}
            />

            <TextArea
              bind:value={senderMessage}
              label="Message or Project Scope"
              placeholder="Describe your interface challenge or schedule an engineering consultation..."
              rows={4}
            />

            <Button type="submit" variant="primary" class="w-full sm:w-auto">
              Send Dispatch ↗
            </Button>
          </form>
        </section>
      </article>
    </div>
  </div>
</main>

<!-- Global Site Footer -->
<SiteFooter
  brandName="Iñigo Artolozaga"
  colophon="Designed with Trinidad Design System · DTCG 3-Tier Tokens · Svelte 5 Runes"
/>
