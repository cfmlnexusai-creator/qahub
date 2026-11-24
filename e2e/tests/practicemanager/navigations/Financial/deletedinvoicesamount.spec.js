const { test, expect } = require('@playwright/test');

test('Deleted Invoices - Amount', async ({ page }) => {
    await page.goto('https://practicemanager-e1.developmentmanagemy.care/invoices/deletedInvoices');

    await page.locator('table').getByRole('link').nth(1).click();

    await expect(page).toHaveURL(/invoices\/invoiceDetail\/recordid/);
});