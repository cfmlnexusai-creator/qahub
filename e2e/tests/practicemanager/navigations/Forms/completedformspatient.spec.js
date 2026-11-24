const { test, expect } = require('@playwright/test');

test('Countersign Forms(Completed Forms) - Patient', async ({ page }) => {
    await page.goto('https://practicemanager-e1.developmentmanagemy.care/Forms/completedForm');

    await page.locator('table').getByRole('link').nth(1).click();

    await expect(page).toHaveURL(/patients\/dashboard\/account_identifier/);
});