import { expect, test } from '@playwright/test';

test.describe('Header: Single "Components" Disclosure Menu', () => {
  const navSelector = 'nav[aria-label="Primary"]';

  test('opens via trigger and exposes every component route as a tabbable link', async ({
    page
  }) => {
    await page.goto('/');
    const trigger = page.getByRole('button', { name: 'Components' });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');

    // First Tab press lands inside the menu on the first component link
    await page.keyboard.press('Tab');
    const focusedHref = await page.evaluate(
      () => (document.activeElement as HTMLAnchorElement | null)?.href ?? ''
    );
    expect(focusedHref.endsWith('/lab/button')).toBe(true);

    const nav = page.locator(navSelector);
    for (const [label, href] of [
      ['Button', '/lab/button'],
      ['NumberField', '/lab/number-field'],
      ['Dialog', '/lab/dialog'],
      ['Combobox', '/lab/combobox'],
      ['Sparkline', '/lab/sparkline'],
      ['DataTable', '/lab/data-table'],
      ['DiffViewer', '/lab/diff-viewer'],
      ['Primitives', '/lab/primitives'],
      ['Logo', '/lab/logo']
    ] as const) {
      await expect(nav.getByRole('link', { name: label })).toHaveAttribute('href', href);
    }
  });

  test('primary navigation fits at the lg breakpoint without overflow or wrapped labels', async ({
    page
  }) => {
    await page.setViewportSize({ width: 1024, height: 900 });
    await page.goto('/foundations');
    await page.waitForLoadState('networkidle');
    await page.evaluate(async () => {
      await document.fonts.ready;
    });

    const nav = page.locator(navSelector);
    for (const label of ['Overview', 'Foundations', 'In the Wild', 'Contracts']) {
      await expect(nav.getByRole('link', { name: label })).toBeVisible();
    }
    await expect(nav.getByRole('button', { name: 'Components' })).toBeVisible();

    const wildHeight = await nav
      .getByRole('link', { name: 'In the Wild' })
      .evaluate((el) => el.getBoundingClientRect().height);
    expect(wildHeight).toBeLessThan(30);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test('Escape closes the menu and restores focus to the trigger', async ({ page }) => {
    await page.goto('/');
    const trigger = page.getByRole('button', { name: 'Components' });
    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await page.keyboard.press('Escape');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator(`${navSelector} a[href="/lab/button"]`)).toHaveCount(0);

    const focusRestored = await trigger.evaluate((el) => document.activeElement === el);
    expect(focusRestored).toBe(true);
  });

  test('item click navigates with state reset; outside click dismisses without navigating', async ({
    page
  }) => {
    await page.goto('/');
    const trigger = page.getByRole('button', { name: 'Components' });

    // Menu item navigation (layout persists across client-side nav, so state must not leak)
    await trigger.click();
    await page.locator(navSelector).getByRole('link', { name: 'Sparkline' }).click();
    await expect(page).toHaveURL(/\/lab\/sparkline/);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    // Reopen and dismiss with an outside click that does not navigate.
    // The heading is a full-width block, so its center sits beneath the open
    // panel; click near its left edge instead (clear of the dropdown).
    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await page.getByRole('heading', { level: 1 }).click({ position: { x: 8, y: 24 } });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
});
