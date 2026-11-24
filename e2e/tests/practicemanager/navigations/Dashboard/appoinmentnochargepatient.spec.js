const { test, expect } = require('@playwright/test');

test('Appointments No Charges - Patient Name', async ({ page }) => {
    await page.goto('https://practicemanager-e1.developmentmanagemy.care/dashboard');

    await page.locator('.dashboard-sortable-widget').filter({has: page.getByRole('heading', { name:'Appointments No Charges', exact: true })}).locator('tbody').getByRole('link').first().click();

    await expect(page).toHaveURL(/patients\/dashboard\/account_identifier/);
});