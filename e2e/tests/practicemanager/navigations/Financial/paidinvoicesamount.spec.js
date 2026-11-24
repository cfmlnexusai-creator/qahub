const { test, expect } = require('@playwright/test');

test('Paid Invoices - Amount Invoiced', async ({ page }) => {
    await page.goto('https://practicemanager-e1.developmentmanagemy.care/invoices');

    await page.locator('table').getByRole('link').nth(2).click();

    await expect(page).toHaveURL(/invoices\/invoiceDetail\/recordid/);
});
