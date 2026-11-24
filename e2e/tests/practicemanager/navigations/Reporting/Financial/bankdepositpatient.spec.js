const { test, expect } = require('@playwright/test');

test('Bank Deposit (Payment Reports) - patient', async ({ page }) => {
    await page.goto('https://practicemanager-e1.developmentmanagemy.care/practiceReports/paymentreports');

    await page.locator('#choose').selectOption({ label: 'Year to date' });

    await page.getByText('Run Report', { exact: true }).click();

    await page.locator('#listpayments tbody tr').filter({ hasText: 'Cash' }).first().click();

    await page.locator('#paymentstable tbody').getByRole('link').first().click();

    await expect(page).toHaveURL(/patients\/dashboard\/account_identifier/);
});
