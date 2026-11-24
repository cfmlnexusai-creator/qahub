const { test, expect } = require('@playwright/test');

test('Outstanding Invoices - Patient', async ({ page }) => {
    await page.goto('https://practicemanager-e1.developmentmanagemy.care/invoices/outstandingInvoices');

    await page.locator('table').getByRole('link').first().click();

    await expect(page).toHaveURL(/patients\/dashboard\/account_identifier/);
});
