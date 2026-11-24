const { test, expect } = require('@playwright/test');

test('Claim Denials - Patient Name', async ({ page }) => {
    await page.goto('https://practicemanager-e1.developmentmanagemy.care/dashboard');

    await page.locator('.dashboard-sortable-widget').filter({has: page.getByRole('heading', { name:'Claim Denials', exact: true })}).locator('tbody').getByRole('link').nth(1).click();

    await expect(page).toHaveURL(/patients\/dashboard\/account_identifier/);
});