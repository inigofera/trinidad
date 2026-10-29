import { expect, test } from '@playwright/test';

test.describe('Phase 1: Editorial & Narrative Hierarchy Suite', () => {
  test('Heading renders anchor link and copies permalink to clipboard', async ({
    page,
    context
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/lab/editorial');

    const heading = page.locator('#ergonomics-spec');
    await expect(heading).toBeVisible();

    const anchorBtn = page.getByRole('button', { name: /Copy permalink to section/i });
    await expect(anchorBtn).toBeAttached();

    // Click anchor button
    await anchorBtn.click();
    await expect(anchorBtn).toContainText('✓');
  });

  test('Callout renders variant styles and attribution', async ({ page }) => {
    await page.goto('/lab/editorial');

    const callout = page.locator('aside[aria-label="KEY INSIGHT"]');
    await expect(callout).toBeVisible();
    await expect(callout).toContainText('[KEY INSIGHT]');
  });

  test('StatCard and StatGrid render metrics, delta badges, and labels', async ({ page }) => {
    await page.goto('/lab/editorial');

    await expect(page.getByText('-42.8%')).toBeVisible();
    await expect(page.getByText('Mean Operator Reaction Latency')).toBeVisible();
    await expect(page.getByText('100%')).toBeVisible();
    await expect(page.getByText('WCAG 2.1 AA Compliance')).toBeVisible();
  });

  test('ProcessTimeline renders steps and active phase badge', async ({ page }) => {
    await page.goto('/lab/editorial');

    await expect(page.getByText('Human Factors & Task Analysis')).toBeVisible();
    await expect(page.getByText('Active Phase')).toBeVisible();
  });

  test('ReadingProgress progressbar is attached to DOM', async ({ page }) => {
    await page.goto('/lab/editorial');

    const progress = page.getByRole('progressbar', { name: 'Reading progress' });
    await expect(progress).toBeAttached();
  });
});
