// @ts-check
import { defineConfig, devices } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

/* ---------------------------------------------
   Load .env file for local runs
--------------------------------------------- */
const envFilePath = path.resolve(__dirname, '.env');
if (fs.existsSync(envFilePath)) {
  console.log('✅ Loading environment from .env file');
  dotenv.config({ path: envFilePath });
} else {
  console.log('⚙️ Using environment variables from system (e.g. CI/CD)');
}

/* ---------------------------------------------
   Load environment JSON file (like /env/stage.json)
--------------------------------------------- */
const envName = process.env.ENV || 'stage';
const envPath = path.resolve(`./env/${envName}.json`);

/**
 * @typedef {Object} EnvConfig
 * @property {string} [baseURL]
 * @property {string} [baseURLApi]
 * @property {string} [email]
 * @property {string} [password]
 */

/** @type {EnvConfig} */
let envConfig = {};

if (fs.existsSync(envPath)) {
  console.log(`✅ Using environment file: ${envPath}`);
  envConfig = JSON.parse(fs.readFileSync(envPath, 'utf-8'));
} else {
  console.warn(`⚠️ No environment file found at ${envPath}. Falling back to system vars.`);
}

/* ---------------------------------------------
   Merge JSON + process.env values
--------------------------------------------- */
process.env.BASE_URL = process.env.BASE_URL || envConfig.baseURL || '';
process.env.BASE_URL_API = process.env.BASE_URL_API || envConfig.baseURLApi || '';
process.env.USER_EMAIL = process.env.USER_EMAIL || envConfig.email || '';
process.env.USER_PASSWORD = process.env.USER_PASSWORD || envConfig.password || '';

/* ---------------------------------------------
   Playwright Configuration
--------------------------------------------- */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined, // run sequentially in CI
  reporter: 'html',

  // Global setup (for UI login session)
  globalSetup: './helpers/global-setup.js',

  // ⏱️ Timeouts
  timeout: 180000, // 3 minutes max per test
  expect: {
    timeout: 30000, // 30s for expect assertions
  },

  use: {
    headless: false,
    baseURL: process.env.BASE_URL,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    storageState: 'auth.json',
    actionTimeout: 30000, // 30s max for clicks, fills, etc.
    navigationTimeout: 30000, // 30s for page.goto
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
