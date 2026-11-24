const { test, expect } = require('@playwright/test');

test('Cancelations - patient', async ({ page }) => {
    await page.goto('https://practicemanager-e1.developmentmanagemy.care/practiceReports/cancelationsReports');

    await page.locator('#choose').selectOption({ label: 'Year to date' });

    await page.getByText('Run Report', { exact: true }).click();

    await page.locator('#canceledDetails').locator('.canceledLocationDetails').first().click();
    await page.locator('#patientLevelCanceledDetails').getByRole('link').first().click();

    await expect(page).toHaveURL(/patients\/dashboard\/account_identifier/);
});