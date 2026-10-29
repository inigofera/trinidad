import { expect, test } from '@playwright/test';

test.describe('NumberField Layout Stability', () => {
  test('Invalid state with an error message does not change the control width', async ({
    page
  }) => {
    await page.goto('/lab/number-field');
    const input = page.locator('input[role="spinbutton"]');
    const controlWidth = () =>
      input.evaluate((el) => el.closest('div.inline-flex')!.getBoundingClientRect().width);

    const initialWidth = await controlWidth();

    await page.getByRole('checkbox', { name: 'Invalid' }).check();

    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(page.getByRole('alert')).toBeVisible();
    expect(await controlWidth()).toBeCloseTo(initialWidth, 0);

    await page.getByRole('checkbox', { name: 'Invalid' }).uncheck();

    await expect(input).not.toHaveAttribute('aria-invalid');
    expect(await controlWidth()).toBeCloseTo(initialWidth, 0);
  });
});
