const base = require('@playwright/test');
const { HomePage } = require('../pages/HomePage');
const { CartPage } = require('../pages/CartPage');
const { CountryPage } = require('../pages/CountryPage');
const { NewPage } = require('../pages/HomePage');

// Extends Playwright's `test` so specs can ask for page objects by name
const test = base.test.extend({
  homePage: async ({ page }, use) => use(new HomePage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  countryPage: async ({ page }, use) => use(new CountryPage(page)),
  NewPage:async ({ page }, use) => use (new NewPage(page)),
});

module.exports = { test, expect: base.expect };
