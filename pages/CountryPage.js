const { BasePage } = require('./BasePage');

// Country selection, terms and order confirmation (#/country)
class CountryPage extends BasePage {
  constructor(page) {
    super(page);
    this.countrySelect = page.locator('select');
    this.termsCheckbox = page.locator('input[type=checkbox]');
    this.proceedButton = page.getByRole('button', { name: 'Proceed' });
    this.confirmation = page.locator('.wrapperTwo > span');
    this.homeLink = page.getByRole('link', { name: 'Home' });
  }

  async selectCountry(country) {
    await this.countrySelect.selectOption(country);
  }

  async acceptTerms() {
    await this.termsCheckbox.check();
  }

  async proceed() {
    await this.proceedButton.click();
  }

  async goHome() {
    await this.homeLink.click();
  }
}

module.exports = { CountryPage };
