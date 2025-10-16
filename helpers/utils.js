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