const { test, expect } = require('@playwright/test')
import { LoginPage } from '../pages/LoginPage.js';
import loginData from '../data/loginData.json' assert { type: 'json' };
import * as utils from '../helpers/utils.js';


test.describe('Dashboard Tests', () => {

  test('Smoke - should land on dashboard after login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await page.goto(process.env.BASE_URL);
    console.log('Current basUrl:', process.env.BASE_URL);

    await expect(page.locator('div h1')).toHaveText('Upload Your Stock in Three Easy Steps');
    // OR
    await loginPage.verifyH1Text('Upload Your Stock in Three Easy Steps', true);
  });
});