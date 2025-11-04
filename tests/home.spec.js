import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import loginData from '../data/loginData.json' assert { type: 'json' };
import * as utils from '../helpers/utils.js';

// ✅ 1. Describe for tests that need stored session
test.describe('Tests with stored session', () => {
  test.beforeAll(async () => {
    await utils.Login({
      baseURL: process.env.BASE_URL,
      email: process.env.USER_EMAIL,
      password: process.env.USER_PASSWORD,
    });
  });

  test.use({ storageState: 'auth.json' });
  test('Sanity - test 2 (uses login session)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await page.goto(process.env.BASE_URL);
    await loginPage.verifyH1Text('Upload Your Stock in Three Easy Steps', true);
  });
});

// ✅ 2. Describe for tests without stored session
test.describe('Tests without stored session', () => {
  test.use({ storageState: undefined }); // or null

  test('Regression - Login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await page.goto(process.env.BASE_URL);
    await loginPage.navigateToLogin();
    await loginPage.enterEmail(loginData.valid.email);
    await loginPage.enterPassword(loginData.valid.password);
    await loginPage.clickLogin();
    await loginPage.verifyH1Text('Upload Your Stock in Three Easy Steps', true);
    await page.locator(loginPage.emailField).isHidden();
  });

});
