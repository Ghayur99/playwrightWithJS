import loginData from '../data/loginData.json' assert { type: 'json' };
import { expect } from '@playwright/test';

export class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailField = "[name='email']";
    this.passwordField = "[name='password']";
    this.loginButton = "[type='submit']";
    this.h1Heading = 'div h1';
  }

   async GetEmailField() {
    return this.page.getByRole('textbox', { name: 'Email' });
  }

  async navigateToLogin() {
    await this.page.goto(process.env.BASE_URL + 'auth/login');
  }

  async enterEmail(email) {
    await this.page.fill(this.emailField, email);
  }

  async enterPassword(password) {
    await this.page.fill(this.passwordField, password);
  }

  async clickLogin() {
    await this.page.click(this.loginButton);
  }

  async verifydashboardPage() {
    await this.page.click(this.loginButton);
  }

  async verifyH1Text(expectedText, exactMatch = false) {
    const actualText = await this.page.locator(this.h1Heading).innerText();
    console.log(expectedText)
    console.log(actualText)
    if (exactMatch) {
      expect(actualText.trim()).toBe(expectedText.trim());
    } else {
      expect(actualText).toContain(expectedText);
    }

    console.log(`✅ H1 verified: "${actualText}"`);
  }

  async getEmailValidationMessage() {
    const message = await this.page.locator(this.emailField)
      .evaluate(el => el.validationMessage);
    return message;
  }
}