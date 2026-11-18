import { test, expect } from '@playwright/test';

test('Upcoming Appointment Page Check', async ({ page }) => {

    await page.goto('http://www.dev.practicemanager.local:45521/appointment/upcoming');
    await expect(page.getByLabel('Show upcoming appointments')).toBeVisible();
    await page.goto('http://www.dev.practicemanager.local:45521/dashboard');
});

test('Schedule View search patients field check', async ({ page }) => {

    await page.goto('http://www.dev.practicemanager.local:45521/appointment/ScheduleView');
    await page.locator('button.headerToggleBtn').click();
    await expect(page.locator('#searchAppointment')).toBeVisible();
    await page.goBack();
});

test('To check the patient>>image page', async ({ page }) => {

    const response = await page.goto('http://www.dev.practicemanager.local:45521/dashboard');
    expect(response.status()).toBeLessThan(400);
    await page.locator('.patients').click();
    await page.locator('.charts').click();
    await expect(page.locator('#accessedPatientsList')).toBeVisible();
    await page.goto('http://www.dev.practicemanager.local:45521/patients/dashboard/account_identifier/b7464669-1ca9-4541-8d16-6007d3f0d609');
    await page.locator('.patientImages').click();
    await page.locator('.submenu_link.images').click();
    await expect(page.locator('#uploadImage')).toBeVisible();
    await expect(page.locator('#imageTypeTable')).toBeVisible();
    await page.goBack();
});





