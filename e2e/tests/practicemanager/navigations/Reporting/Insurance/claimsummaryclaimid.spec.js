const { test, expect } = require('@playwright/test');

test('Claim Summary By Carrier - claim', async ({ page }) => {
    await page.goto('https://practicemanager-e1.developmentmanagemy.care/practiceReports/claimSummaryByCarrier');

    await page.locator('#choose').selectOption({ label: 'Year to date' });

    await page.getByText('Run Report', { exact: true }).click();

    await page.locator('#claimSummaryTable').locator('.claimSummaryDetailLink').first().click();

    const pageEvent = page.waitForEvent('popup');

    await page.locator('#claimDetailTable').getByRole('link').nth(1).click();

    const newPage = await pageEvent;

    await expect(newPage).toHaveURL(/patients\/patientClaims\/account_identifier/);
});
