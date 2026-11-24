const { test, expect } = require('@playwright/test');

test('Production/Collection - patient', async ({ page }) => {
    await page.goto('https://practicemanager-e1.developmentmanagemy.care/practiceReports/productionCollectionReports');

    await page.locator('#choose').selectOption({ label: 'Year to date' });

    await page.getByText('Run Report', { exact: true }).click();

    await page.locator('.productionDetails').locator('.providerDetails').first().click();
    await page.locator('.patientDetails').getByRole('link').first().click();

    await expect(page).toHaveURL(/patients\/dashboard\/account_identifier/);
});