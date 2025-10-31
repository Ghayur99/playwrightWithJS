const { test, expect } = require('@playwright/test')
import { LoginPage } from '../pages/LoginPage.js';
import loginData from '../data/loginData.json' assert { type: 'json' };
import * as utils from '../helpers/utils.js';


test.describe('Dashboard Tests', () => {

  test.beforeAll(async () => {
    await utils.Login({
      baseURL: process.env.BASE_URL,
      email: process.env.USER_EMAIL,
      password: process.env.USER_PASSWORD,
    });
  });

  test.use({ storageState: 'auth.json' });
  test('should land on dashboard after login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await page.goto(process.env.BASE_URL);;  // use your frontend base URL here

    await expect(page.locator('div h1')).toHaveText('Upload Your Stock in Three Easy Steps');
    // OR
    await loginPage.verifyH1Text('Upload Your Stock in Three Easy Steps', true);
  });
});