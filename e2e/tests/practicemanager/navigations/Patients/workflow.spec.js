const { test, expect } = require('@playwright/test');

test('Patients Workflow - Patient Name', async ({ page }) => {
    await page.goto('https://practicemanager-e1.developmentmanagemy.care/workflowpatientTasks');

    const pageEvent = page.waitForEvent('popup');

    await page.locator('table').getByRole('link').first().click();

    const newPage = await pageEvent;

    await expect(newPage).toHaveURL(/patients\/dashboard\/account_identifier/);
});