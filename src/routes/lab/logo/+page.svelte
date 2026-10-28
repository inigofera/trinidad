<script lang="ts">
  import { TrinidadLogo } from '$lib/components/logo/index.js';
  // Reactive props
  let size = $state<number>(32);
  let variant = $state<'mark' | 'lockup'>('lockup');
  let customClass = $state<string>('');

  // Telemetry state
  let stageElement = $state<HTMLElement | null>(null);
  let activeElementTag = $state<string>('none');
  let computedRole = $state<string>('img');
  let ariaState = $state<Record<string, string | null>>({});
  let lastKeyPressed = $state<string>('None');
  let copied = $state(false);

  // Dynamic code snippet computation
  const generatedCode = $derived.by(() => {
    const props: string[] = [];
    if (size !== 32) props.push(`size={${size}}`);
    if (variant !== 'lockup') props.push(`variant="${variant}"`);
    if (customClass.trim()) props.push(`class="${customClass.trim()}"`);

    if (props.length === 0) {
      return `<TrinidadLogo />`;
    }
    return `<TrinidadLogo\n  ${props.join('\n  ')}\n/>`;
  });

  // Observe stage element mutations and interactions
  $effect(() => {
    if (!stageElement || typeof window === 'undefined') return;

    const inspectDOM = () => {
      const svg = stageElement?.querySelector('svg');
      if (svg) {
        computedRole = svg.getAttribute('role') ?? 'img';
        const attrs: Record<string, string | null> = {};
        for (let i = 0; i < svg.attributes.length; i++) {
          const attr = svg.attributes[i];
          if (attr && (attr.name.startsWith('aria-') || attr.name === 'role')) {
            attrs[attr.name] = attr.value;
          }
        }
        ariaState = attrs;
      }
    };

    inspectDOM();

    const observer = new MutationObserver(() => {
      inspectDOM();
    });

    observer.observe(stageElement, {
      attributes: true,
      childList: true,
      subtree: true
    });

    const handleFocusIn = () => {
      const el = document.activeElement;
      activeElementTag = el ? `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}` : 'none';
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      lastKeyPressed = e.key === ' ' ? 'Space' : e.key;
    };

    stageElement.addEventListener('focusin', handleFocusIn);
    stageElement.addEventListener('keydown', handleKeyDown);

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
      // clipboard write fallback
    }
  }
</script>

<svelte:head>
  <title>trinidad lab: logo &amp; calibration mark component</title>
</svelte:head>

<div class="p-6 md:p-10 max-w-7xl mx-auto space-y-8 font-sans">
  <!-- Workbench Header -->
  <div
    class="border-b border-border-subtle pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4"
  >
    <h1 class="text-3xl font-bold tracking-tight text-fg-primary lowercase">trinidad logo</h1>
  </div>

  <!-- Standardized Workbench Layout -->
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
    <!-- Stage Canvas (Top-Left, 8 Cols) -->
    <div class="lg:col-span-8 flex flex-col space-y-3">
      <div class="text-xs font-mono text-fg-muted">
        <span>Stage Canvas</span>
      </div>

      <div
        bind:this={stageElement}
        role="region"
        aria-label="Component preview stage"
        class="relative min-h-[360px] rounded border border-border-subtle flex items-center justify-center p-8 overflow-hidden select-none"
      >
        <!-- Rendered Component -->
        <div class="relative z-10 transition-transform duration-150">
          <TrinidadLogo {size} {variant} class={customClass} />
        </div>
      </div>
    </div>

    <!-- Reactive Prop Controls (Top-Right, 4 Cols) -->
    <div class="lg:col-span-4 flex flex-col space-y-3">
      <div class="text-xs font-mono text-fg-muted">
        <span>Reactive Prop Controls</span>
      </div>

      <div class="space-y-5 font-mono text-xs">
        <!-- Size Control -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label for="prop-size" class="text-fg-muted font-bold">Size (px)</label>
            <span class="text-accent-interactive font-bold">[{size}px]</span>
          </div>
          <input
            id="prop-size"
            type="range"
            min="16"
            max="128"
            step="2"
            bind:value={size}
            class="w-full accent-accent-interactive cursor-pointer"
          />
          <div class="flex flex-wrap gap-1.5 pt-1">
            {#each [16, 24, 32, 48, 64, 96] as presetSize}
              <button
                type="button"
                class="px-2 py-0.5 rounded border border-border-subtle text-[10px] {size ===
                presetSize
                  ? 'bg-accent-interactive text-accent-contrast font-bold'
                  : 'bg-surface-canvas text-fg-muted hover:text-fg-primary'}"
                onclick={() => (size = presetSize)}
              >
                {presetSize}px
              </button>
            {/each}
          </div>
        </div>

        <!-- Variant Control -->
        <div class="space-y-2" role="group" aria-labelledby="label-variant">
          <span id="label-variant" class="text-fg-muted font-bold block">Variant</span>
          <div class="grid grid-cols-2 gap-2">
            <button
              type="button"
              class="py-1.5 px-3 rounded border border-border-subtle text-center transition-colors {variant ===
              'lockup'
                ? 'bg-accent-interactive text-accent-contrast font-bold'
                : 'bg-surface-canvas text-fg-muted hover:text-fg-primary'}"
              onclick={() => (variant = 'lockup')}
              aria-pressed={variant === 'lockup'}
            >
              'lockup'
            </button>
            <button
              type="button"
              class="py-1.5 px-3 rounded border border-border-subtle text-center transition-colors {variant ===
              'mark'
                ? 'bg-accent-interactive text-accent-contrast font-bold'
                : 'bg-surface-canvas text-fg-muted hover:text-fg-primary'}"
              onclick={() => (variant = 'mark')}
              aria-pressed={variant === 'mark'}
            >
              'mark'
            </button>
          </div>
        </div>

        <!-- Custom Class Input -->
        <div class="space-y-1.5">
          <label for="prop-class" class="text-fg-muted font-bold block">Class</label>
          <input
            id="prop-class"
            type="text"
            placeholder="e.g. opacity-75 hover:scale-105"
            bind:value={customClass}
            class="w-full px-2.5 py-1.5 bg-surface-canvas text-fg-primary border border-border-subtle rounded focus-visible:outline-2 focus-visible:outline-accent-interactive"
          />
        </div>
      </div>
    </div>

    <!-- Live A11y & DOM Telemetry Drawer (Bottom-Left, 6 Cols) -->
    <div class="lg:col-span-6 flex flex-col space-y-3">
      <div class="text-xs font-mono text-fg-muted">
        <span>Live A11y &amp; DOM Telemetry Drawer</span>
      </div>

      <div class="font-mono text-xs space-y-3">
        <div class="flex items-center justify-between border-b border-border-subtle pb-2">
          <span class="text-fg-muted">activeElement:</span>
          <span class="font-bold text-fg-primary">{activeElementTag}</span>
        </div>

        <div class="flex items-center justify-between border-b border-border-subtle pb-2">
          <span class="text-fg-muted">computedRole:</span>
          <span class="font-bold text-status-nominal">{computedRole}</span>
        </div>

        <div class="flex items-center justify-between border-b border-border-subtle pb-2">
          <span class="text-fg-muted">lastKeyPressed:</span>
          <span
            class="px-1.5 py-0.5 rounded bg-surface-canvas border border-border-subtle text-accent-interactive font-bold"
          >
            {lastKeyPressed}
          </span>
        </div>

        <div class="space-y-1 pt-1">
          <span class="text-fg-muted block">ariaState (Live SVG DOM Attributes):</span>
          <pre
            class="p-3 bg-surface-canvas border border-border-subtle rounded text-[11px] overflow-x-auto text-fg-primary">{JSON.stringify(
              ariaState,
              null,
              2
            )}</pre>
        </div>
      </div>
    </div>

    <!-- Dynamic Svelte 5 Code Output (Bottom-Right, 6 Cols) -->
    <div class="lg:col-span-6 flex flex-col space-y-3">
      <div class="flex items-center justify-between text-xs font-mono text-fg-muted">
        <span>Dynamic Svelte 5 Code Output</span>
        <button
          type="button"
          class="px-2.5 py-1 rounded bg-surface-elevated border border-border-subtle text-fg-primary hover:border-accent-interactive transition-colors flex items-center gap-1.5 cursor-pointer"
          onclick={copySnippet}
        >
          <span>{copied ? '✓ COPIED!' : 'COPY SNIPPET'}</span>
        </button>
      </div>

      <div class="space-y-4">
        <pre
          class="p-4 bg-surface-canvas border border-border-subtle rounded text-xs overflow-x-auto text-accent-interactive flex-1">{generatedCode}</pre>

        <div
          class="pt-4 text-[11px] text-fg-muted border-t border-border-subtle mt-4 flex items-center justify-between"
        >
          <span>Package: <code>trinidad-ui</code></span>
          <span>Runtime: Zero-overhead Svelte 5</span>
        </div>
      </div>
    </div>
  </div>
</div>
