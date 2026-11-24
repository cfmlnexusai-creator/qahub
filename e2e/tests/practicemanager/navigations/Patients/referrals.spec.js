const { test, expect } = require('@playwright/test');

test('Referrals - Patient', async ({ page }) => {
    await page.goto('https://practicemanager-e1.developmentmanagemy.care/patientReferrals');

    await page.locator('table').getByRole('link').first().click();

    await expect(page).toHaveURL(/viewReferrals\/referral_identifier/);
});
