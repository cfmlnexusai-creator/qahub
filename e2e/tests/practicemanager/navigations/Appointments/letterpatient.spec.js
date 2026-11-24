const { test, expect } = require('@playwright/test');

test('Letter - patient', async ({ page }) => {
    await page.goto('https://practicemanager-e1.developmentmanagemy.care/letters');

    await page.locator('table').getByRole('link').first().click();

    await expect(page).toHaveURL(/patients\/dashboard\/account_identifier/);
});
