const { test, expect } = require('@playwright/test');

test('Charts - MRN', async ({ page }) => {
    await page.goto('https://practicemanager-e1.developmentmanagemy.care/charts');

    await page.locator('table').getByRole('link').first().click();

    await expect(page).toHaveURL(/patients\/dashboard\/account_identifier/);
});
