const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');
const { CartPreview } = require('./components/CartPreview');

class HomePage extends BasePage {
  constructor(page) {
    super(page);
    this.searchBox = page.locator('input.search-keyword');
    this.cartIcon = page.locator('a.cart-icon');
    this.itemsCount = page.locator('.cart-info tr', { hasText: 'Items' }).locator('strong');
    this.priceTotal = page.locator('.cart-info tr', { hasText: 'Price' }).locator('strong');
    this.cartPreview = new CartPreview(page);
  }

  async open() {
    await this.page.goto('https://rahulshettyacademy.com/seleniumPractise/#/');
  }

  async search(name) {
    await this.searchBox.fill(name);
  }

  // The single product card matching the current search
  product(name) {
    return this.page.locator('.product').filter({ hasText: name });
  }

  async searchForSingleProduct(name) {
    await this.search(name);
    const product = this.product(name);
    await expect(product).toHaveCount(1);
    return product;
  }

  // Type the quantity straight into the box
  async setQuantityByTyping(name, qty) {
    const input = this.product(name).locator('input.quantity');
    await input.fill(String(qty));
    await expect(input).toHaveValue(String(qty));
  }

  // Set the quantity with the +/- stepper (typing is not always picked up by the page).
  // Retries because the page can re-render and reset the quantity to 1.
  async setQuantityWithStepper(name, qty) {
    const product = this.product(name);
    const input = product.locator('input.quantity');
    await expect(async () => {
      let current = Number(await input.inputValue());
      while (current < qty) { await product.locator('.increment').click(); current++; }
      while (current > qty) { await product.locator('.decrement').click(); current--; }
      expect(Number(await input.inputValue())).toBe(qty);
    }).toPass();
  }

  async clickAddToCart(name) {
    await this.product(name).getByRole('button', { name: 'ADD TO CART' }).click();
  }

  // Search, optionally set the quantity with the stepper, add to cart, then pause
  async addProduct(name, qty = 1) {
    await this.searchForSingleProduct(name);
    if (qty !== 1) await this.setQuantityWithStepper(name, qty);
    await this.clickAddToCart(name);
    await this.pause();
  }

  async openCart() {
    await this.cartIcon.click();
  }

  async cartTotal() {
    return Number(await this.priceTotal.innerText());
  }
}

module.exports = { HomePage };
