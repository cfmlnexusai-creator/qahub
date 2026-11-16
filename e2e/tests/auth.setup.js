import { test as setup, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const BASE_URL = process.env.BASE_URL;
const authFile = path.join(__dirname, './auth/user.json');

// // Returns true when user.json exists and the site still accepts its session
setup('authenticate', async ({ page, browser }) => {

     if (fs.existsSync(authFile)) return false;


    const userNameValue = process.env.USER_NAME;
    const passwordValue = process.env.USER_PASSWORD;
    if (!userNameValue || !passwordValue) {
        throw new Error('USER_NAME or USER_PASSWORD is missing. Check the .env file in the repo root.');
    }

    await page.goto(BASE_URL);

    const userName = page.locator('#userName');
    await userName.fill(userNameValue);

    const password = page.locator('.userPasscode');
    await password.fill(passwordValue);

    await page.getByRole('button', { name: 'GO' }).click();

    // Wait until the site leaves the start page after clicking GO.
    await page.waitForURL(url => url.pathname !== '/', { timeout: 30000 });
    await page.waitForLoadState('networkidle');
    await page.context().storageState({ path: authFile });

});
