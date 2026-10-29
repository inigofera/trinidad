<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  export interface TocItem {
    id: string;
    label: string;
    level?: number | undefined;
  }

  export interface TableOfContentsProps extends HTMLAttributes<HTMLElement> {
    items?: TocItem[] | undefined;
    containerSelector?: string | undefined;
    title?: string | undefined;
    class?: string | undefined;
  }

  let {
    items: propItems,
    containerSelector = 'main, article',
    title = 'Contents',
    class: className = '',
    ...rest
  }: TableOfContentsProps = $props();

  let discoveredItems = $state<TocItem[]>([]);
  let activeId = $state<string>('');

  const displayItems = $derived(propItems && propItems.length > 0 ? propItems : discoveredItems);

  $effect(() => {
    if (typeof window === 'undefined') return;

    const updateItems = () => {
      if (propItems && propItems.length > 0) return;

      const container = document.querySelector(containerSelector);
      if (!container) return;

      const headings = container.querySelectorAll<HTMLHeadingElement>('h2[id], h3[id]');
      const scanned: TocItem[] = [];
      headings.forEach((h) => {
        const level = parseInt(h.tagName.replace('H', ''), 10) || 2;
        scanned.push({
          id: h.id,
          label: h.innerText.replace(/#$/, '').trim(),
          level
        });
      });
      discoveredItems = scanned;
    };

    updateItems();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            activeId = entry.target.id;
            break;
          }
        }
      },
      {
        rootMargin: '0px 0px -70% 0px',
        threshold: 0
      }
    );

    const observeHeadings = () => {
      const ids = displayItems.map((item) => item.id);
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    };

    observeHeadings();

    return () => observer.disconnect();
  });

  function scrollToSection(e: MouseEvent, id: string) {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;

    activeId = id;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });

    if (!el.hasAttribute('tabindex')) {
      el.setAttribute('tabindex', '-1');
    }
    el.focus({ preventScroll: true });
    history.replaceState(null, '', `#${id}`);
  }
</script>

<nav
  aria-label="Table of contents"
  class="rounded-[var(--radius-card)] border border-border-subtle bg-surface-elevated p-4 text-sm font-sans {className}"
  {...rest}
>
  <div
    class="font-mono text-xs font-bold uppercase tracking-wider text-fg-muted mb-3 flex items-center justify-between"
  >
    <span>[{title}]</span>
    <span class="text-[10px] text-fg-muted font-normal">
      {displayItems.length} SECTIONS
    </span>
  </div>

  <ul class="space-y-1">
    {#each displayItems as item (item.id)}
      {@const isActive = activeId === item.id}
      {@const isSub = (item.level ?? 2) > 2}
      <li class={isSub ? 'pl-3' : ''}>
        <a
          href="#{item.id}"
          onclick={(e) => scrollToSection(e, item.id)}
          aria-current={isActive ? 'location' : undefined}
          class="group flex items-center justify-between py-1 px-2 rounded-[var(--radius-control)] transition-colors {isActive
            ? 'bg-surface-muted text-accent-contrast font-semibold text-fg-primary'
            : 'text-fg-muted hover:text-fg-primary hover:bg-surface-muted'}"
        >
          <span class="truncate">
            {#if isSub}
              <span class="font-mono text-xs opacity-50 mr-1 select-none">↳</span>
            {/if}
            {item.label}
          </span>
          {#if isActive}
            <span
              class="w-1.5 h-1.5 rounded-full bg-accent-interactive shrink-0 ml-2"
              aria-hidden="true"
            ></span>
          {/if}
        </a>
      </li>
    {/each}
  </ul>
</nav>
