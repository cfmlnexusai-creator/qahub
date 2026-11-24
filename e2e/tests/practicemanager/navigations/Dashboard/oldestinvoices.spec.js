const { test, expect } = require('@playwright/test');

test('Oldest Invoices - action', async ({ page }) => {
    await page.goto('https://practicemanager-e1.developmentmanagemy.care/dashboard');

    await page.locator('.dashboard-sortable-widget').filter({has: page.getByRole('heading', { name:'Oldest Invoices', exact: true })}).locator('tbody').getByRole('link').first().click();

    await expect(page).toHaveURL(/invoices\/invoiceDetail\/recordid/);
});