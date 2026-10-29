<script lang="ts">
  import WorkbenchShell from '../WorkbenchShell.svelte';
  import { ImageCompare, DeviceFrame, type DeviceFrameVariant, MediaFigure, Carousel } from '$lib';

  // Interactive controls
  let activeTab = $state<
    'overview' | 'image-compare' | 'device-frame' | 'media-figure' | 'carousel'
  >('overview');

  // ImageCompare props
  let splitPosition = $state(50);
  let beforeLabel = $state('Legacy Terminal');
  let afterLabel = $state('Trinidad HRI');

  // DeviceFrame props
  let deviceVariant = $state<DeviceFrameVariant>('browser');
  let browserUrl = $state('https://artolozaga.dev/work/depalletizer');
  let terminalStatus = $state<'nominal' | 'warning' | 'critical' | 'offline'>('nominal');

  // Carousel props
  let carouselAutoplay = $state(false);
  let carouselLoop = $state(true);

  const sampleSlides = [
    {
      title: 'Field Inquiry: Warehouse Floor',
      kicker: 'RESEARCH // ARTIFACT 01',
      description:
        'Documenting operator cognitive hesitation under high ambient industrial illumination.'
    },
    {
      title: 'Low-Fidelity Ergonomic Wireframes',
      kicker: 'DESIGN // ARTIFACT 02',
      description: 'Rapid card sorting and step modifier layouts tested on physical touch monitors.'
    },
    {
      title: 'W3C Token Hierarchy Definition',
      kicker: 'SYSTEMS // ARTIFACT 03',
      description:
        'Dual-theme contrast mapping ensuring WCAG AA conformance across unbleached paper and slate.'
    }
  ];

  const generatedCode = $derived.by(() => {
    switch (activeTab) {
      case 'image-compare':
        return `<script lang="ts">
  import { ImageCompare } from 'trinidad-ui';
<\/script>

<ImageCompare
  beforeSrc="/logo-banner.svg"
  beforeAlt="Legacy interface wireframe"
  beforeLabel="${beforeLabel}"
  afterSrc="/logo-banner.svg"
  afterAlt="Trinidad redesigned HRI console"
  afterLabel="${afterLabel}"
  initialPosition={${splitPosition}}
  aspectRatio="video"
/>`;

      case 'device-frame':
        return `<script lang="ts">
  import { DeviceFrame } from 'trinidad-ui';
<\/script>

<DeviceFrame
  variant="${deviceVariant}"
  ${deviceVariant === 'browser' ? `url="${browserUrl}"` : ''}
  ${deviceVariant === 'terminal' ? `status="${terminalStatus}" title="OPERATOR_CONSOLE // TRINIDAD_V2"` : ''}
>
  <div class="p-8 bg-surface-canvas text-center">
    <p class="font-bold text-fg-primary">Interactive Embedded Case Study Viewport</p>
  </div>
</DeviceFrame>`;

      case 'media-figure':
        return `<script lang="ts">
  import { MediaFigure } from 'trinidad-ui';
<\/script>

<MediaFigure
  src="/logo-banner.svg"
  alt="Calibration marks and dual-axis telemetry"
  kicker="FIG 01 // CALIBRATION"
  caption="Trinidad dual-axis geometric calibration grid rendered under Swiss proportions."
  attribution="Iñigo Artolozaga Design Archive"
  zoomable={true}
  aspectRatio="video"
/>`;

      case 'carousel':
        return `<script lang="ts">
  import { Carousel } from 'trinidad-ui';
  const slides = [...];
<\/script>

<Carousel
  items={slides}
  autoplay={${carouselAutoplay}}
  loop={${carouselLoop}}
  aspectRatio="video"
>
  {#snippet children(slide, index)}
    <div class="h-full w-full flex flex-col justify-center items-center p-8 bg-surface-canvas text-center">
      <span class="font-mono text-xs text-fg-muted mb-2">[{slide.kicker}]</span>
      <h3 class="text-xl font-bold text-fg-primary mb-2">{slide.title}</h3>
      <p class="text-sm text-fg-muted max-w-md">{slide.description}</p>
    </div>
  {/snippet}
</Carousel>`;

      default:
        return `<script lang="ts">
  import { ImageCompare, DeviceFrame, MediaFigure, Carousel } from 'trinidad-ui';
<\/script>

<DeviceFrame variant="browser" url="${browserUrl}">
  <ImageCompare
    beforeSrc="/logo-banner.svg"
    beforeAlt="Legacy UI"
    afterSrc="/logo-banner.svg"
    afterAlt="Redesigned UI"
  />
</DeviceFrame>`;
    }
  });
</script>

<WorkbenchShell
  name="Visual Media & Artifact Primitives"
  description="Before/after comparison sliders with pointer scrub and keyboard stepping, realistic browser and industrial device frames, zoomable lightbox figures, and accessible carousels."
  {generatedCode}
>
  {#snippet stage()}
    <div class="w-full max-w-3xl mx-auto space-y-8">
      {#if activeTab === 'overview' || activeTab === 'image-compare'}
        <div>
          <div class="text-xs font-mono text-fg-muted uppercase tracking-wider mb-2">
            [Before / After Comparison Slider]
          </div>
          <ImageCompare
            beforeSrc="/logo-banner.svg"
            beforeAlt="Legacy warehouse interface"
            {beforeLabel}
            afterSrc="/logo-banner.svg"
            afterAlt="Trinidad redesigned HRI console"
            {afterLabel}
            initialPosition={splitPosition}
            aspectRatio="video"
          />
          <p class="text-xs text-fg-muted mt-2 font-mono">
            Drag the handle or focus and press Left/Right Arrow keys (Shift+Arrow for 10x steps).
          </p>
        </div>
      {/if}

      {#if activeTab === 'overview' || activeTab === 'device-frame'}
        <div>
          <div class="text-xs font-mono text-fg-muted uppercase tracking-wider mb-2">
            [Device Frame: {deviceVariant.toUpperCase()}]
          </div>
          <DeviceFrame
            variant={deviceVariant}
            url={browserUrl}
            status={terminalStatus}
            title="DEPALLETIZER_OPERATOR // UNIT_04"
          >
            <div
              class="p-6 md:p-8 bg-surface-canvas flex flex-col items-center justify-center text-center space-y-3"
            >
              <div
                class="font-mono text-xs uppercase px-2 py-0.5 rounded-[var(--radius-control)] bg-accent-interactive text-accent-contrast font-bold"
              >
                Viewport Render Stage
              </div>
              <h3 class="text-lg md:text-xl font-bold text-fg-primary">
                Robotic Point-Cloud Depalletizing Stream
              </h3>
              <p class="text-xs md:text-sm text-fg-muted max-w-md leading-relaxed">
                Rendered with zero layout shifts inside an accessible device frame conforming to
                Trinidad's Swiss proportions.
              </p>
            </div>
          </DeviceFrame>
        </div>
      {/if}

      {#if activeTab === 'overview' || activeTab === 'media-figure'}
        <div>
          <div class="text-xs font-mono text-fg-muted uppercase tracking-wider mb-2">
            [Zoomable Media Figure with Lightbox]
          </div>
          <MediaFigure
            src="/logo-banner.svg"
            alt="Trinidad calibration geometry"
            kicker="FIGURE 01.2"
            caption="Trinidad dual-axis geometric mark establishing the horizontal calibration baseline."
            attribution="Iñigo Artolozaga Design Archive"
            zoomable={true}
            aspectRatio="video"
          />
        </div>
      {/if}

      {#if activeTab === 'overview' || activeTab === 'carousel'}
        <div>
          <div class="text-xs font-mono text-fg-muted uppercase tracking-wider mb-2">
            [Artifact Carousel & Storyboard]
          </div>
          <Carousel
            items={sampleSlides}
            autoplay={carouselAutoplay}
            loop={carouselLoop}
            aspectRatio="video"
          >
            {#snippet children(slide, index)}
              <div
                class="h-full w-full flex flex-col justify-center items-center p-8 bg-surface-canvas text-center"
              >
                <span class="font-mono text-xs text-fg-muted uppercase mb-2">[{slide.kicker}]</span>
                <h3 class="text-lg md:text-xl font-bold text-fg-primary mb-2">{slide.title}</h3>
                <p class="text-xs md:text-sm text-fg-muted max-w-md leading-relaxed">
                  {slide.description}
                </p>
              </div>
            {/snippet}
          </Carousel>
        </div>
      {/if}
    </div>
  {/snippet}

  {#snippet controls()}
    <div class="space-y-5 font-mono text-xs">
      <div class="space-y-1">
        <label for="ctrl-media-tab" class="text-fg-muted font-bold block">Focus Component</label>
        <select
          id="ctrl-media-tab"
          bind:value={activeTab}
          class="w-full bg-surface-canvas text-fg-primary border border-border-subtle rounded-[var(--radius-control)] px-2 py-1.5"
        >
          <option value="overview">Full Composition Overview</option>
          <option value="image-compare">ImageCompare Slider</option>
          <option value="device-frame">DeviceFrame Chassis</option>
          <option value="media-figure">MediaFigure & Lightbox</option>
          <option value="carousel">Carousel & Storyboard</option>
        </select>
      </div>

      {#if activeTab === 'image-compare' || activeTab === 'overview'}
        <div class="pt-3 border-t border-border-subtle space-y-3">
          <div class="text-fg-primary font-bold">[ImageCompare Props]</div>
          <div class="space-y-1">
            <label for="ctrl-split-pos" class="text-fg-muted block"
              >Split Position: {splitPosition}%</label
            >
            <input
              id="ctrl-split-pos"
              type="range"
              min="0"
              max="100"
              bind:value={splitPosition}
              class="w-full accent-accent-interactive"
            />
          </div>
          <div class="space-y-1">
            <label for="ctrl-before-lbl" class="text-fg-muted block">Before Label</label>
            <input
              id="ctrl-before-lbl"
              type="text"
              bind:value={beforeLabel}
              class="w-full bg-surface-canvas text-fg-primary border border-border-subtle rounded-[var(--radius-control)] px-2 py-1"
            />
          </div>
          <div class="space-y-1">
            <label for="ctrl-after-lbl" class="text-fg-muted block">After Label</label>
            <input
              id="ctrl-after-lbl"
              type="text"
              bind:value={afterLabel}
              class="w-full bg-surface-canvas text-fg-primary border border-border-subtle rounded-[var(--radius-control)] px-2 py-1"
            />
          </div>
        </div>
      {/if}

      {#if activeTab === 'device-frame' || activeTab === 'overview'}
        <div class="pt-3 border-t border-border-subtle space-y-3">
          <div class="text-fg-primary font-bold">[DeviceFrame Props]</div>
          <div class="space-y-1">
            <label for="ctrl-device-var" class="text-fg-muted block">Variant</label>
            <select
              id="ctrl-device-var"
              bind:value={deviceVariant}
              class="w-full bg-surface-canvas text-fg-primary border border-border-subtle rounded-[var(--radius-control)] px-2 py-1"
            >
              <option value="browser">Browser Window Chrome</option>
              <option value="mobile">Mobile Smartphone Shell</option>
              <option value="terminal">Industrial Operator Rugged Terminal</option>
            </select>
          </div>
          {#if deviceVariant === 'browser'}
            <div class="space-y-1">
              <label for="ctrl-browser-url" class="text-fg-muted block">Address Bar URL</label>
              <input
                id="ctrl-browser-url"
                type="text"
                bind:value={browserUrl}
                class="w-full bg-surface-canvas text-fg-primary border border-border-subtle rounded-[var(--radius-control)] px-2 py-1"
              />
            </div>
          {/if}
          {#if deviceVariant === 'terminal'}
            <div class="space-y-1">
              <label for="ctrl-term-status" class="text-fg-muted block">LED Status</label>
              <select
                id="ctrl-term-status"
                bind:value={terminalStatus}
                class="w-full bg-surface-canvas text-fg-primary border border-border-subtle rounded-[var(--radius-control)] px-2 py-1"
              >
                <option value="nominal">Nominal (Green)</option>
                <option value="warning">Warning (Amber)</option>
                <option value="critical">Critical (Crimson)</option>
                <option value="offline">Offline (Muted)</option>
              </select>
            </div>
          {/if}
        </div>
      {/if}

      {#if activeTab === 'carousel' || activeTab === 'overview'}
        <div class="pt-3 border-t border-border-subtle space-y-3">
          <div class="text-fg-primary font-bold">[Carousel Props]</div>
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" bind:checked={carouselLoop} class="accent-accent-interactive" />
            <span>Enable Infinite Loop</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              bind:checked={carouselAutoplay}
              class="accent-accent-interactive"
            />
            <span>Autoplay Slides</span>
          </label>
        </div>
      {/if}
    </div>
  {/snippet}
</WorkbenchShell>
