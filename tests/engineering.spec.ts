import { expect, test } from '@playwright/test';

test.describe('Phase 3: UX Engineering & Interactive Sandboxes Suite', () => {
  test('CodeBlock renders tokens, line numbers, and copies to clipboard', async ({
    page,
    context
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/lab/engineering');

    const codeRegion = page.getByRole('region', { name: /Code snippet/i });
    await expect(codeRegion).toBeVisible();

    // Verify Svelte runes and keywords
    await expect(codeRegion).toContainText('let threshold = $state(88.5);');

    // Copy to clipboard
    const copyBtn = page.getByRole('button', { name: 'Copy code to clipboard' });
    await copyBtn.click();
    await expect(copyBtn).toContainText('✓ Copied');
  });

  test('InteractiveSandbox toggles local theme and density scopes and mutates state', async ({
    page
  }) => {
    await page.goto('/lab/engineering');

    const sandbox = page.getByRole('region', { name: /sandbox/i });
    await expect(sandbox).toBeVisible();

    // Toggle local Theme
    const themeBtn = sandbox.getByRole('button', { name: /Theme:/i });
    await expect(themeBtn).toContainText('industrial');
    await themeBtn.click();
    await expect(themeBtn).toContainText('paper');

    // Toggle local Density
    const densityBtn = sandbox.getByRole('button', { name: /Density:/i });
    await expect(densityBtn).toContainText('compact');
    await densityBtn.click();
    await expect(densityBtn).toContainText('comfortable');

    // Mutate state via NumberField
    const numberInput = sandbox.getByRole('spinbutton', { name: /Scrub Confidence Threshold/i });
    await expect(numberInput).toBeVisible();
    await numberInput.focus();
    await page.keyboard.press('ArrowUp');
    await expect(sandbox.getByText('89.0%')).toBeVisible();
  });

  test('BenchmarkBadge renders status dots and target audit labels', async ({ page }) => {
    await page.goto('/lab/engineering');

    await expect(page.getByText('[FRAME_RATE]')).toBeVisible();
    await expect(page.getByText('60.0 FPS')).toBeVisible();
    await expect(page.getByText('Target: 60Hz')).toBeVisible();
    await expect(page.getByText('[GZIP_WEIGHT]')).toBeVisible();
    await expect(page.getByText('[ACCESSIBILITY]')).toBeVisible();
  });

  test('Tooltip displays on focus/hover and dismisses on Escape', async ({ page }) => {
    await page.goto('/lab/engineering');

    const trigger = page.getByRole('button', { name: 'Inspect Calibration' });
    await expect(trigger).toBeVisible();

    // Focus triggers tooltip
    await trigger.focus();
    const tooltip = page.getByRole('tooltip');
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText('Calibrated at 60Hz Retina refresh rate');

    // Escape key dismisses tooltip
    await page.keyboard.press('Escape');
    await expect(tooltip).toBeHidden();
  });

  test('Kbd renders tactile shortcut keys', async ({ page }) => {
    await page.goto('/lab/engineering');

    await expect(page.getByText('[⌘K]')).toBeVisible();
    await expect(page.getByText('[Esc]')).toBeVisible();
  });
});
