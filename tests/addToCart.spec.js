const { test, expect } = require('../fixtures/pages');

const PRODUCTS = ['Pumpkin', 'Cucumber', 'Carrot', 'Potato', 'Brocolli'];

test('search Pumpkin, set quantity 2 and add to cart, then add Cucumber, Carrot and Potato', async ({ page, homePage, cartPage, countryPage }) => {
  test.setTimeout(60000); // fixed 3s waits add up to more than the 30s default

  // 1. Open home page and wait 3 seconds
  await homePage.open();
  await homePage.pause();

  // 2. The qa-career-accelerator-job-ready link is intentionally not interacted with

  // 3. Search for "Pumpkin"
  await homePage.searchForSingleProduct('Pumpkin');
  await homePage.pause(); // search results filter after typing

  // 4. Set quantity to 2 and 5. add to cart
  await homePage.setQuantityByTyping('Pumpkin', 2);
  await homePage.clickAddToCart('Pumpkin');
  await homePage.pause();

  await homePage.searchForSingleProduct('Brocolli');
  await homePage.pause();// search results filter after typing
 // 4. Set quantity to 2 and 5. add to cart
  await homePage.setQuantityByTyping('Brocolli', 2);
  await homePage.clickAddToCart('Brocolli');
  await homePage.pause();

  // 6-8. Cucumber, Carrot and Potato with the default quantity
  for (const name of ['Cucumber', 'Carrot', 'Potato']) {
    await homePage.addProduct(name);
  }

  // Cart shows 5 distinct products
  await expect(homePage.itemsCount).toHaveText('5');

  // All five are listed in the cart preview
  await homePage.openCart();
  await homePage.pause();
  const previewNames = await homePage.cartPreview.names();
  for (const n of PRODUCTS) {
    expect(previewNames.some(x => x.includes(n))).toBe(true);
  }

  // 1. Wait 4 seconds
  await homePage.pause(4000);

  // 2. Proceed to checkout
  await homePage.cartPreview.proceedToCheckout();
  await expect(page).toHaveURL(/#\/cart/);

  // 3. Cart items are listed on the checkout page
  await expect(cartPage.rows).toHaveCount(5);
  const checkoutNames = await cartPage.productNames();
  for (const n of PRODUCTS) {
    expect(checkoutNames.some(x => x.includes(n))).toBe(true);
  }

  // 4. Total amount equals the sum of the line totals
  const expectedTotal = (await cartPage.lineTotals()).reduce((a, b) => a + b, 0);
  expect(await cartPage.displayedTotal()).toBe(expectedTotal);

  // 5. Place order
  await cartPage.placeOrder();

  // 6. Country page: select Argentina
  await expect(page).toHaveURL(/#\/country/);
  await countryPage.selectCountry('Argentina');
  await expect(countryPage.countrySelect).toHaveValue('Argentina');

  // 7. Accept terms and conditions, 8. proceed
  await countryPage.acceptTerms();
  await countryPage.proceed();

  // 9. Validate the confirmation message
  await expect(countryPage.confirmation).toContainText(
    /Thank you, your order has been placed successfully\s*You'll be redirected to Home page shortly!!/
  );

  // 10. Click the Home link
  await countryPage.goHome();
  await expect(page).toHaveURL(/seleniumPractise\/#\/$/);
});

test('cart: list items, change quantity, validate price, proceed to checkout', async ({ page, homePage }) => {
  test.setTimeout(60000); // fixed 3s waits add up to more than the 30s default
  const preview = homePage.cartPreview;

  await homePage.open();
  await homePage.pause();

  // Setup: Pumpkin x2, Brocolli x2 and Carrot x1
  await homePage.addProduct('Pumpkin', 2);
  await homePage.addProduct('Brocolli', 2);
  await homePage.addProduct('Carrot', 1);

  // 1. Click on cart
  await homePage.openCart();
  await homePage.pause();

  // 2. Display all items added in a list
  await expect(preview.items).toHaveCount(3);
  const names = await preview.names();
  console.log('Cart items:', names);
  expect(names.some(n => n.includes('Pumpkin'))).toBe(true);
  expect(names.some(n => n.includes('Brocolli'))).toBe(true);
  expect(names.some(n => n.includes('Carrot'))).toBe(true);

  // Header total must equal the sum of the line amounts
  const sum = (await preview.lineAmounts()).reduce((a, b) => a + b, 0);
  expect(await homePage.cartTotal()).toBe(sum);

  // 3. Remove Carrot and validate the price drops
  const before = await homePage.cartTotal();
  const carrotAmount = await preview.amountOf('Carrot');
  await homePage.pause(2000); // wait before updating the cart
  await preview.remove('Carrot');
  await expect(preview.items).toHaveCount(2);
  expect(await homePage.cartTotal()).toBe(before - carrotAmount);
  await homePage.pause();

  // 4. Increase qty by 2: add 2 more Pumpkin and validate the price increases
  const pumpkinPrice = await preview.unitPriceOf('Pumpkin');
  const beforeIncrease = await homePage.cartTotal();
  await homePage.pause(2000); // wait before updating the cart
  await homePage.addProduct('Pumpkin', 2);
  await expect.poll(() => homePage.cartTotal()).toBe(beforeIncrease + 2 * pumpkinPrice);
  await homePage.openCart();
  await expect(preview.quantityOf('Pumpkin')).toContainText('4');
  await homePage.pause();

  // 5. Wait 4 seconds, then proceed to checkout
  await homePage.pause(4000);
  await preview.proceedToCheckout();
  await expect(page).toHaveURL(/#\/cart/);
});
