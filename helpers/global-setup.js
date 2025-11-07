import fs from 'fs';
import path from 'path';
import { chromium } from '@playwright/test';

// ✅ Global setup runs once before all tests
export default async () => {
  // 1️⃣ Load environment variables dynamically
  const envName = process.env.ENV || 'stage';
  const envPath = path.resolve(`./env/${envName}.json`);

  if (fs.existsSync(envPath)) {
    const envConfig = JSON.parse(fs.readFileSync(envPath, 'utf-8'));

    process.env.BASE_URL = process.env.BASE_URL || envConfig.baseURL;
    process.env.BASE_URL_API = process.env.BASE_URL_API || envConfig.baseURLApi;
    process.env.USER_EMAIL = process.env.USER_EMAIL || envConfig.email;
    process.env.USER_PASSWORD = process.env.USER_PASSWORD || envConfig.password;
  } else {
    console.warn(`⚠️ Environment file not found for: ${envName}`);
  }

  // 2️⃣ Manage session for UI tests
  const storageFile = path.resolve('auth.json');
  const baseURL = process.env.BASE_URL;
  const email = process.env.USER_EMAIL;
  const password = process.env.USER_PASSWORD;

  if (fs.existsSync(storageFile)) {
    console.log('🟡 Existing session found. Validating...');
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ storageState: storageFile });
    const page = await context.newPage();

    await page.goto(baseURL);
    const loggedIn = await page.locator('h1:has-text("Upload Your Stock in Three Easy Steps")').count();

    if (loggedIn > 0) {
      console.log('✅ Existing session is valid. Using saved auth.json');
      await browser.close();
      return;
    }

    console.log('🔴 Session expired. Re-authenticating...');
    await browser.close();
  }

  // 3️⃣ Perform login and save new session
  const browser = await chromium.launch({ headless: !!process.env.CI });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log(`🔐 Logging into ${baseURL} as ${email}`);
  await page.goto(baseURL);
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL(baseURL);
  await page.locator('h1:has-text("Upload Your Stock in Three Easy Steps")').waitFor();

  await context.storageState({ path: storageFile });
  console.log(`✅ New session saved to: ${storageFile}`);

  await browser.close();
};
