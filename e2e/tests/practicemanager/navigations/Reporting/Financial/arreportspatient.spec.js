const { test, expect } = require('@playwright/test');

test('Accounts Receivable Reports (AR) - patient', async ({ page }) => {
    await page.goto('https://practicemanager-e1.developmentmanagemy.care/practiceReports/arReports');

    await page.getByText('Run Report', { exact: true }).click();

    await page.locator('.arReportDetails').locator('.providerDetails').first().click();
    await page.locator('.arPatientsReportDetails').getByRole('link').first().click();

    await expect(page).toHaveURL(/patients\/dashboard\/account_identifier/);
});