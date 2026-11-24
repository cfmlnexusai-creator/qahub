const { test, expect } = require('@playwright/test');

test('Sent Forms - patient', async ({ page }) => {
    await page.goto('https://practicemanager-e1.developmentmanagemy.care/Forms/sendFormDetail');

    await page.locator('table').getByRole('link').first().click();

    await expect(page).toHaveURL(/patients\/dashboard\/account_identifier/);
});