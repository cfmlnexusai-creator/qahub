const { test, expect } = require('@playwright/test');

test('Appointment Request - patient', async ({ page }) => {
    await page.goto('https://practicemanager-e1.developmentmanagemy.care/appointment/requests');

    await page.locator('table').getByRole('link').nth(1).click();

    await expect(page).toHaveURL(/viewAppointmentRequest\/appointment_request_identifier/);
});