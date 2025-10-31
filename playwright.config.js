// @ts-check
import { defineConfig, devices } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load .env file only if running locally
const envFilePath = path.resolve(__dirname, '.env');
if (fs.existsSync(envFilePath)) {
  console.log('✅ Loading environment from .env file');
  dotenv.config({ path: envFilePath });
} else {
  console.log('⚙️ Using environment variables from system (e.g. GitHub Actions)');
}

// Determine environment name dynamically
const envName = process.env.ENV || 'stage';
const envPath = path.resolve(`./env/${envName}.json`);
const envConfig = JSON.parse(fs.readFileSync(envPath, 'utf-8'));

// Set up environment variables globally
process.env.BASE_URL = process.env.BASE_URL || envConfig.baseURL;
process.env.USER_EMAIL = process.env.USER_EMAIL || envConfig.email;
process.env.USER_PASSWORD = process.env.USER_PASSWORD || envConfig.password;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  globalSetup: './helpers/global-setup.js',
  timeout: 30000,
  expect: {
    timeout: 30000
  },
  use: {
    baseURL: process.env.BASE_URL,
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
