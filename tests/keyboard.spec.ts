import { test, expect } from '@playwright/test';

test.describe('Keyboard Interaction & Ergonomics Suite', () => {
  test('NumberField: ArrowUp increments by step, Shift+ArrowUp increments by 10x step', async ({
    page
  }) => {
    await page.goto('/lab/number-field');
    const input = page.locator('input[role="spinbutton"]');
    await input.focus();

    const initialValStr = await input.getAttribute('aria-valuenow');
    const initialVal = parseFloat(initialValStr ?? '0');
    const step = 0.5;

    await page.keyboard.press('ArrowUp');
    await expect(input).toHaveAttribute('aria-valuenow', (initialVal + step).toString());

    await page.keyboard.press('Shift+ArrowUp');
    await expect(input).toHaveAttribute(
      'aria-valuenow',
      (initialVal + step + 10 * step).toString()
    );
  });

  test('Dialog: Focus trapped in modal, closes on Escape, restores focus to trigger', async ({
    page
  }) => {
    await page.goto('/lab/dialog');
    const trigger = page.getByRole('button', { name: /Open Operator Dialog/i });
    await trigger.click();

    const dialog = page.locator('dialog');
    await expect(dialog).toBeVisible();

    // Tab cycling remains inside modal boundary
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      const isContained = await page.evaluate(() => {
        const d = document.querySelector('dialog');
        return d ? d.contains(document.activeElement) : false;
      });
      expect(isContained).toBe(true);
    }

    // Escape closes dialog and restores focus to trigger
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();

    const isTriggerFocused = await trigger.evaluate((el) => document.activeElement === el);
    expect(isTriggerFocused).toBe(true);
  });

  test('Combobox: ArrowDown updates aria-activedescendant, Enter triggers selection', async ({
    page
  }) => {
    await page.goto('/lab/combobox');
    const input = page.locator('input[role="combobox"]');
    await input.focus();
    await input.fill('Zero');

    await page.keyboard.press('ArrowDown');
    const activeId = await input.getAttribute('aria-activedescendant');
    expect(activeId).toBeTruthy();
    expect(activeId).toContain('trinidad-option-cal-zero');

    await page.keyboard.press('Enter');
    await expect(page.locator('text=Zero-Point Sensor Calibration').first()).toBeVisible();
  });

  test('DataTable: Virtualization limits rendered rows to < 40 for 10,000 items', async ({
    page
  }) => {
    await page.goto('/lab/data-table');
    const table = page.locator('table[role="grid"]');
    await expect(table).toBeVisible();

    const rows = page.locator('tbody tr[aria-rowindex]');
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThan(40);
  });
});
