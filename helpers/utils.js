import { request, chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

/**
 * Verifies that the current URL contains the expected text.
 * @param {import('@playwright/test').Page} page
 * @param {string} expectedText - Partial text expected in the URL
 */
export async function verifyCurrentUrlContains(page, expectedText) {
  const currentUrl = page.url();
  if (!currentUrl.includes(expectedText)) {
    throw new Error(`❌ URL does not contain expected text. Expected: ${expectedText}, but got: ${currentUrl}`);
  }
  console.log(`✅ URL contains: ${expectedText}`);
}



/**
 * Verifies that the current page title contains or matches the expected text.
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} expectedText - Expected text or title to match
 * @param {boolean} exactMatch - Optional: whether to match exactly (default: false = partial match)
 */
export async function verifyPageTitle(page, expectedText, exactMatch = false) {
  const actualTitle = await page.title();

  if (exactMatch) {
    if (actualTitle !== expectedText) {
      throw new Error(`❌ Page title does not match. Expected: "${expectedText}", but got: "${actualTitle}"`);
    }
  } else {
    if (!actualTitle.includes(expectedText)) {
      throw new Error(`❌ Page title does not contain expected text. Expected to contain: "${expectedText}", but got: "${actualTitle}"`);
    }
  }

  console.log(`✅ Page title verification passed: "${actualTitle}"`);
}




export async function Login({ baseURL, email, password, storageFile = 'auth.json' }) {
  const storagePath = path.resolve(storageFile);

  // ✅ Step 1: If file exists, do a quick check if the session works
  if (fs.existsSync(storagePath)) {
    console.log('🟡 Existing session found. Verifying...');
    const browser = await chromium.launch();
    const context = await browser.newContext({ storageState: storagePath });
    const page = await context.newPage();

    await page.goto(`${baseURL}`);
    // check for some element that only appears when logged in
    const loggedIn = await page.locator('h1:has-text("Upload Your Stock in Three Easy Steps")').count();

    if (loggedIn > 0) {
      console.log('✅ Existing session is valid, skipping login.');
      await browser.close();
      return;
    }

    console.log('🔴 Existing session expired. Re-logging in...');
    await browser.close();
  }

  // ✅ Step 2: Do UI login if no valid session
  const browser = await chromium.launch({ headless: !!process.env.CI });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(`${baseURL}`);
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');

  await page.waitForURL(`${baseURL}`);
  await page.locator('h1:has-text("Upload Your Stock in Three Easy Steps")').waitFor();

  await context.storageState({ path: storagePath });
  console.log(`✅ New session saved to: ${storagePath}`);

  await browser.close();
}


/**
 * Logs the user out and clears local/session storage and cookies.
 * @param {import('@playwright/test').Page} page
 */
export async function logout(page) {
  console.log('🚪 Logging out and clearing browser storage...');

  // ✅ Make sure we're on the right origin to access localStorage
  if (!page.url().startsWith(process.env.BASE_URL)) {
    await page.goto(process.env.BASE_URL);
  }

  // ✅ Clear localStorage & sessionStorage
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  // ✅ Clear cookies
  const context = page.context();
  await context.clearCookies();

  console.log('✅ Storage & cookies cleared successfully');
}