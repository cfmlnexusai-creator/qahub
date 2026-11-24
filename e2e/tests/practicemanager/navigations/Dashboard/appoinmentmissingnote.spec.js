const { test, expect } = require('@playwright/test');

test('Appointments Missing Clinical Note - Patient Name', async ({ page }) => {
    await page.goto('https://practicemanager-e1.developmentmanagemy.care/dashboard');

    await page.locator('.dashboard-sortable-widget').filter({has: page.getByRole('heading', { name:'Appointments Missing Clinical Note', exact: true })}).locator('tbody').getByRole('link').first().click();

    await expect(page).toHaveURL(/patients\/dashboard\/account_identifier/);
});