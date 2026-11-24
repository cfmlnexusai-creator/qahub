const { test, expect } = require('@playwright/test');

test('Unlocked Notes - Patient Name', async ({ page }) => {
    await page.goto('https://practicemanager-e1.developmentmanagemy.care/dashboard');

    await page.locator('.dashboard-sortable-widget').filter({has: page.getByRole('heading', { name:'Unlocked Notes', exact: true })}).locator('tbody a[href*="/patients/dashboard/account_identifier"]').first().click();

    await expect(page).toHaveURL(/patients\/dashboard\/account_identifier/);
});