const { test, expect } = require('@playwright/test')
import { LoginPage } from '../pages/LoginPage.js';
import loginData from '../data/loginData.json' assert { type: 'json' };
import * as utils from '../helpers/utils.js';

test.describe('test discribe', () => {


  

    test.beforeEach(async ({ page }) => {
    });

    test('Login with valid credantials', async ({ page }) => {

        let loginPage = new LoginPage(page);
        await loginPage.navigateToLogin();

        await loginPage.enterEmail(loginData.valid.email)
        await loginPage.enterPassword(loginData.valid.password)
        await loginPage.clickLogin()

        await loginPage.verifyH1Text('Upload Your Stock in Three Easy Steps', true)

    });

    test('Login with invalid credantials', async ({ page }) => {

        let loginPage = new LoginPage(page);
        await loginPage.navigateToLogin();

        await loginPage.enterEmail(loginData.invalid.email)
        await loginPage.enterPassword(loginData.invalid.password)
        await loginPage.clickLogin()

        await loginPage.verifyErrorMessage('Invalid email or password.')

        

    });
});