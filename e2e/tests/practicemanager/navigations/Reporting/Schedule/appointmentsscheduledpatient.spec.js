const { test, expect } = require('@playwright/test');

test('Appointments Scheduled - patient', async ({ page }) => {
    await page.goto('https://practicemanager-e1.developmentmanagemy.care/practiceReports/appointmentScheduleReports');

    await page.locator('#choose').selectOption({ label: 'Year to date' });

    await page.getByText('Run Report', { exact: true }).click();

    await page.locator('#appointmentsReportTable').locator('.userDetails').first().click();
    await page.locator('#patientLevelAppointmentDetails').getByRole('link').first().click();

    await expect(page).toHaveURL(/patients\/dashboard\/account_identifier/);
});