<script lang="ts">
  import type { Snippet } from 'svelte';
  import { Announcer } from '$lib/actions/announcer.svelte.js';

  interface Props {
    name: string;
    description: string;
    generatedCode: string;
    stage: Snippet;
    controls: Snippet;
  }

  let { name, description, generatedCode, stage, controls }: Props = $props();

  let stageNode = $state<HTMLElement | null>(null);
  let activeElement = $state<string>('none');
  let computedRole = $state<string>('none');
  let ariaAttributes = $state<Record<string, string | null>>({});
  let keyLog = $state<string[]>([]);
  let copied = $state<boolean>(false);

  function inspectElement(el: HTMLElement | null) {
    if (!el) {
      activeElement = 'none';
      computedRole = 'none';
      ariaAttributes = {};
      return;
    }

    const tag = el.tagName.toLowerCase();
    const id = el.id ? `#${el.id}` : '';
    const cls =
      el.className && typeof el.className === 'string'
        ? `.${el.className.split(' ').filter(Boolean).slice(0, 2).join('.')}`
        : '';
    activeElement = `<${tag}${id}${cls}>`;

    computedRole =
      el.getAttribute('role') ||
      (el instanceof HTMLButtonElement
        ? 'button'
        : el instanceof HTMLInputElement
          ? el.type
          : el instanceof HTMLDialogElement
            ? 'dialog'
            : el instanceof HTMLTableElement
              ? 'table'
              : tag);

    const arias: Record<string, string | null> = {};
    for (const attr of Array.from(el.attributes)) {
      if (attr.name.startsWith('aria-')) {
        arias[attr.name] = attr.value;
      }
    }
    ariaAttributes = arias;
  }

  $effect(() => {
    if (!stageNode) return;

    const handleFocusIn = (e: FocusEvent) => {
      inspectElement(e.target as HTMLElement | null);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key === ' ' ? 'Space' : e.key;
      const combo = e.shiftKey && key !== 'Shift' ? `Shift+${key}` : key;
      keyLog = [combo, ...keyLog.slice(0, 4)];
    };

    stageNode.addEventListener('focusin', handleFocusIn);
    stageNode.addEventListener('keydown', handleKeyDown);

    // Initial inspection of stage or first interactive child
    const initialTarget =
      stageNode.querySelector<HTMLElement>('button, input, [tabindex="0"], canvas') ?? stageNode;
    inspectElement(initialTarget);

    const observer = new MutationObserver(() => {
      const active = (document.activeElement as HTMLElement | null) ?? initialTarget;
      if (stageNode?.contains(active)) {
        inspectElement(active);
      }
    });

    observer.observe(stageNode, {
      attributes: true,
      subtree: true,
      childList: true
    });

    return () => {
      stageNode?.removeEventListener('focusin', handleFocusIn);
      stageNode?.removeEventListener('keydown', handleKeyDown);
      observer.disconnect();
    };
  });

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(generatedCode);
      copied = true;
      Announcer.announce(`Copied ${name} code snippet to clipboard`, 'polite');
      setTimeout(() => {
        copied = false;
      }, 2000);
    } catch {
      // Clipboard fallback
    }
  }
</script>

<svelte:head>
  <title>Trinidad Lab: {name}</title>
</svelte:head>

<div class="min-h-screen p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
  <!-- Component Title & Header Strip -->
  <header class="border-b border-border-subtle pb-5 space-y-3">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-fg-primary">{name}</h1>
        <p class="text-fg-muted font-mono text-xs md:text-sm mt-1 max-w-3xl">
          {description}
        </p>
      </div>

      <a
        href="/"
        class="px-3 py-1 text-xs font-mono rounded bg-surface-elevated border border-border-subtle text-fg-primary hover:border-accent-interactive transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-interactive"
      >
        &larr; System Overview
      </a>
    </div>
  </header>

  <!-- Standardized 4-Zone Grid Layout -->
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
    <!-- Stage -->
    <div class="lg:col-span-7 flex flex-col space-y-2">
      <span class="text-xs font-mono text-fg-muted">Stage</span>

      <div
        bind:this={stageNode}
        class="min-h-[320px] p-8 rounded-lg bg-surface-canvas border border-border-subtle flex flex-col items-center justify-center relative overflow-hidden"
      >
        {@render stage()}
      </div>
    </div>

    <!-- Controls -->
    <div class="lg:col-span-5 flex flex-col space-y-2">
      <span class="text-xs font-mono text-fg-muted">Controls</span>

      <div class="font-mono text-xs space-y-4">
        {@render controls()}
      </div>
    </div>

    <!-- Telemetry -->
    <div class="lg:col-span-6 flex flex-col space-y-2">
      <span class="text-xs font-mono text-fg-muted">Telemetry</span>

      <div class="font-mono text-xs space-y-3">
        <div class="flex items-center justify-between border-b border-border-subtle pb-2">
          <span class="text-fg-muted">activeElement:</span>
          <span class="font-bold text-fg-primary break-all">{activeElement}</span>
        </div>

        <div class="flex items-center justify-between border-b border-border-subtle pb-2">
          <span class="text-fg-muted">computedRole:</span>
          <span class="font-bold text-fg-primary">{computedRole}</span>
        </div>

        <div class="flex items-center justify-between border-b border-border-subtle pb-2">
          <span class="text-fg-muted">lastKeyPressed:</span>
          <div class="flex items-center gap-1">
            {#if keyLog.length === 0}
              <span class="text-fg-muted">None</span>
            {:else}
              {#each keyLog as k, i}
                <span
                  class="px-1.5 py-0.5 rounded text-[10px] border border-border-subtle {i === 0
                    ? 'bg-accent-interactive text-accent-contrast font-bold'
                    : 'bg-surface-canvas text-fg-muted'}"
                >
                  {k}
                </span>
              {/each}
            {/if}
          </div>
        </div>

        <div class="space-y-1.5 pt-1">
          <span class="text-fg-muted block">ariaState (Observed Attributes):</span>
          <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
          <pre
            tabindex="0"
            role="region"
            aria-label="Observed ARIA attributes"
            class="p-3 bg-surface-canvas border border-border-subtle rounded text-[11px] overflow-x-auto text-fg-primary focus-visible:outline-2 focus-visible:outline-accent-interactive">{JSON.stringify(
              ariaAttributes,
              null,
              2
            )}</pre>
        </div>
      </div>
    </div>

    <!-- Code -->
    <div class="lg:col-span-6 flex flex-col space-y-2">
      <div class="flex items-center justify-between text-xs font-mono text-fg-muted">
        <span>Code</span>
        <button
          type="button"
          onclick={copyCode}
          class="px-2.5 py-0.5 rounded bg-surface-elevated border border-border-subtle text-fg-primary hover:border-accent-interactive transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-interactive"
        >
          {copied ? '✓ Copied' : 'Copy snippet'}
        </button>
      </div>

      <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
      <pre
        tabindex="0"
        role="region"
        aria-label="Generated Svelte 5 component snippet"
        class="p-4 bg-surface-canvas border border-border-subtle rounded text-xs overflow-x-auto text-fg-primary font-mono focus-visible:outline-2 focus-visible:outline-accent-interactive">{generatedCode}
</pre>
    </div>
  </div>
</div>
