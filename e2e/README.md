# Playwright E2E tests

This folder is a standalone JavaScript Playwright project. Run the commands below from `e2e/`, not the repository root or `hub/`.

## Prerequisites

- Install Node.js 22 or 24 LTS, including npm.
- Have internet access to install npm packages and browser binaries.
- For application tests, have a running Patient Manager test environment and the test account/data required by each test. This project does not start Patient Manager automatically.

Check your installation:

```powershell
node --version
npm --version
```

## Install

From the repository root:

```powershell
cd e2e
npm install
npx playwright install chromium firefox webkit
```

For a repeatable installation using the committed lockfile, use `npm ci` instead of `npm install`.

On Linux or CI, install browser system dependencies as well:

```bash
npx playwright install --with-deps chromium firefox webkit
```

The `chrome` and `edge` projects use Google Chrome and Microsoft Edge installed on your machine. Install those browsers if you want to run all five configured projects. Playwright can also install them with:

```powershell
npx playwright install chrome msedge
```

You only need Chromium installed for the recommended first run below. The project named `safari` uses Playwright's WebKit engine; it does not launch the installed Apple Safari application.

## Configure the application URL

```powershell
Copy-Item .env.example .env
```

On macOS/Linux, use `cp .env.example .env`. Edit `.env` and replace the example URL with your running Patient Manager test environment:

```dotenv
BASE_URL=https://your-patient-manager-test-host.example
```

`playwright.config.js` loads `.env` through `dotenv`. Tests using `page.goto('/login')` resolve against `BASE_URL`. Tests using a complete URL ignore it.

The current example test opens Google directly, so it needs internet access but does not require `BASE_URL`, an application login or a locally running app. Keep credentials in your local environment; do not commit `.env` or passwords in test files.

## Run tests

Recommended first run, using one browser:

```powershell
npm test -- --project=chromium
```

Run all configured browsers:

```powershell
npm test
```

| Command | Purpose |
| --- | --- |
| `npm run test:smoke -- --project=chromium` | Tests tagged `@smoke` |
| `npm run test:regression -- --project=chromium` | Tests tagged `@regression` |
| `npm run test:headed -- --project=chromium` | Run with a visible browser |
| `npm run test:ui -- --project=chromium` | Open interactive Playwright UI mode |
| `npm run test:report` | Open the last HTML report |

The current example has a `@smoke` tag. Regression runs will report no matching tests until tests with `@regression` are added.

Run one file, one test name, or list tests without executing them:

```powershell
npx playwright test tests/authentication/example.spec.js --project=chromium
npx playwright test --grep "EX-001" --project=chromium
npx playwright test --list
```

Choose another configured project with `--project=chrome`, `--project=firefox`, `--project=safari` or `--project=edge`. All tests currently run with one worker and no automatic retries.

## Reports and debugging

```powershell
npm run test:report
npx playwright test tests/authentication/example.spec.js --project=chromium --debug
```

- `playwright-report/`: HTML report generated after a run; it does not open automatically.
- `test-results/`: failure artifacts. Screenshots are captured on failure and traces are retained for failed tests.
- Open a saved trace with `npx playwright show-trace path/to/trace.zip`.

## Add a test

Create a `*.spec.js` file under `tests/`. For example, a basic Patient Manager login-page check:

```javascript
const { test, expect } = require('@playwright/test');

test('PM login page shows the email field @smoke', async ({ page }) => {
  await page.goto('/login');
  await expect(page.locator('#userName')).toBeVisible();
});
```

This example requires `BASE_URL` to point to Patient Manager. The 100 `NAV-001`–`NAV-100` cases in QA Hub are manual test definitions; they are not automatically executed by this Playwright project. Implement each automated flow in a spec before expecting it to run here.

## Common setup problems

| Problem | Fix |
| --- | --- |
| `npm` is not recognized | Install Node.js with npm and reopen the terminal. |
| Browser executable is missing | Run `npx playwright install chromium firefox webkit`, or select an installed browser project. |
| Chrome or Edge project cannot launch | Install that branded browser or run `--project=chromium`. |
| Relative URL cannot be opened | Set a valid `BASE_URL` in `e2e/.env` and run commands from `e2e/`. |
| Connection refused or page unavailable | Start the target application or check its hostname, port, VPN and network access. |
| No tests found | Check the file path and tag filter. The current suite has a smoke example, not a regression suite. |
| Browsers fail after upgrading Playwright | Run the browser installation command again to download matching binaries. |

Official references: [installation](https://playwright.dev/docs/intro), [browser setup](https://playwright.dev/docs/browsers), [CLI commands](https://playwright.dev/docs/test-cli).
