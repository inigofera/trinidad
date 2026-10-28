import { expect, test } from '@playwright/test';

test.describe('Phase 7: Contextual Patterns & Fault Isolation', () => {
  test('ThemeScope isolates nested industrial theme inside a paper page', async ({ page }) => {
    await page.goto('/patterns');
    const htmlTheme = await page.locator('html').getAttribute('data-theme');
    expect(htmlTheme).toBe('paper');

    const scopedWidget = page.getByTestId('scoped-telemetry-widget');
    await expect(scopedWidget).toHaveAttribute('data-theme', 'industrial');
    await expect(scopedWidget).toHaveAttribute('data-density', 'compact');

    await page.getByRole('button', { name: /Invert embedded theme/i }).click();
    await expect(scopedWidget).toHaveAttribute('data-theme', 'paper');
  });

  test('HRI Triage Console synchronizes DataTable, Dialog, and DiffViewer proposal gate', async ({
    page
  }) => {
    await page.goto('/patterns');
    const reviewButtons = page.getByRole('button', { name: /\[Review AI Patch\]/i });
    await expect(reviewButtons.first()).toBeVisible();
    await reviewButtons.first().click();

    const dialog = page.locator('dialog[open]');
    await expect(dialog).toBeVisible();

    const acceptBtn = dialog.getByRole('button', { name: /Accept Proposal/i });
    await acceptBtn.click();
    await expect(dialog).toBeHidden();
  });

  test('FaultBoundary isolates runtime crash and recovers cleanly on reset', async ({ page }) => {
    await page.goto('/architecture');
    const crashBtn = page.getByRole('button', { name: /\[Inject Simulated Runtime Exception\]/i });
    await crashBtn.click();

    const alertBox = page.getByRole('alert');
    await expect(alertBox).toContainText('SUBSYSTEM FAULT ISOLATED: VISION_TELEMETRY_NODE');

    const resetBtn = alertBox.getByRole('button', { name: /\[Reset Subsystem\]/i });
    await resetBtn.click();
    await expect(
      page.getByRole('button', { name: /\[Inject Simulated Runtime Exception\]/i })
    ).toBeVisible();
  });
});
