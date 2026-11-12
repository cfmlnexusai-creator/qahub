// @ts-check
const { test, expect } = require('@playwright/test');

test('EX-001 Google home page loads @smoke', async ({ page }) => {
  await page.goto('https://www.google.com/');



  await expect(page).toHaveTitle(/Google/);
  await expect(page).toHaveURL(/google\./);
  await expect(page.locator('textarea[name="q"], input[name="q"]').first()).toBeVisible();
});