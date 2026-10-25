# Code Explanation

Playwright (JavaScript, CommonJS) tests for the Rahul Shetty Academy practice shop, written with
the Page Object Model (POM): https://rahulshettyacademy.com/seleniumPractise/#/

This project is the POM version of the basic `Ecommerce Test` project (kept unchanged as the
baseline). The scenarios and assertions are the same; only the structure differs.

## Project layout

| File | Purpose |
|------|---------|
| `playwright.config.js` | Test folder `./tests`, Chromium only. Locally: HTML report opens after every run, no retries. With `CI` set (GitLab): list + HTML (`open: 'never'`) + JUnit (`results.xml`), 1 retry, `forbidOnly`. |
| `pages/BasePage.js` | Base class: holds `page` and `pause(ms)` (default 3000 ms, the requested visible wait). |
| `pages/HomePage.js` | Home/shop page: `open`, `search`, `product(name)`, `searchForSingleProduct`, `setQuantityByTyping`, `setQuantityWithStepper`, `clickAddToCart`, `addProduct(name, qty)`, `openCart`, `cartTotal`; header locators `itemsCount`, `priceTotal`. |
| `pages/components/CartPreview.js` | The header cart dropdown: items, names, line amounts, unit price, quantity, `remove`, `proceedToCheckout`. |
| `pages/CartPage.js` | Cart page (`#/cart`): `rows`, `productNames`, `lineTotals`, `displayedTotal`, `placeOrder`. |
| `pages/CountryPage.js` | Country page (`#/country`): `selectCountry`, `acceptTerms`, `proceed`, `confirmation`, `goHome`. |
| `fixtures/pages.js` | Extends Playwright `test` with the fixtures `homePage`, `cartPage`, `countryPage`; re-exports `expect`. |
| `tests/addToCart.spec.js` | The two tests (see below). |
| `package.json`, `.gitlab-ci.yml`, `.gitignore`, `README.md` | npm scripts, GitLab pipeline, git excludes, usage notes. |
| `CODE_EXPLANATION.md` | This file. |

## Running

- All tests: `npx playwright test`
- One file, visible browser: `npx playwright test tests/addToCart.spec.js --headed`
- The HTML report opens automatically after each local run (Ctrl+C to exit); reopen with `npx playwright show-report`

## How POM is applied

- **Page objects** own the locators and the actions on one page. Specs never contain raw selectors.
- **Fixtures** create the page objects per test, so a spec just asks for `{ homePage, cartPage, countryPage }`.
- **Assertions stay in the specs**, so a failure points at the test step. Page objects only return data (names, totals) or locators for `expect`.
- **Waits**: the 3s pauses are explicit calls to `pause()` in the specs (and inside `addProduct`, which pauses 3s after each add to cart). Both tests set `test.setTimeout(60000)` because these pauses exceed the 30s default.

## tests/addToCart.spec.js

### Test 1: search Pumpkin, set quantity 2 and add to cart, then add Cucumber, Carrot and Potato

| Step | Page object call | What it does |
|------|------------------|--------------|
| 1 | `homePage.open()`, `pause()` | Opens the home page, waits 3s. |
| 2 | (no code) | The `qa-career-accelerator-job-ready` link is deliberately never interacted with. |
| 3 | `homePage.searchForSingleProduct('Pumpkin')`, `pause()` | Types in the search box, asserts exactly one match, waits 3s. |
| 4 | `homePage.setQuantityByTyping('Pumpkin', 2)` | Fills quantity 2 and asserts the value. |
| 5 | `homePage.clickAddToCart('Pumpkin')`, `pause()` | Adds Pumpkin, waits 3s. |
| 6-8 | `homePage.addProduct(name)` for Cucumber, Carrot, Potato | Search, add with quantity 1, wait 3s each. |
| Verify | `homePage.itemsCount` = `4`; `openCart()`, `pause()`; `cartPreview.names()` | 4 distinct products; all four names are in the cart preview. |
| 9 | `homePage.pause(4000)` | Waits 4 seconds. |
| 10 | `cartPreview.proceedToCheckout()`, `toHaveURL(/#\/cart/)` | Goes to the cart page. |
| 11 | `cartPage.rows` count 4, `cartPage.productNames()` | All four products are listed. |
| 12 | `cartPage.lineTotals()` summed vs `cartPage.displayedTotal()` | Total Amount equals the sum of the line totals. |
| 13 | `cartPage.placeOrder()` | Goes to the country page. |
| 14 | `countryPage.selectCountry('Argentina')` | Chooses Argentina and asserts the value. |
| 15-16 | `countryPage.acceptTerms()`, `countryPage.proceed()` | Accepts terms and submits. |
| 17 | `countryPage.confirmation` `toContainText(regex)` | Validates the "Thank you, your order has been placed successfully / You'll be redirected to Home page shortly!!" message (regex allows the line break). |
| 18 | `countryPage.goHome()`, `toHaveURL` | Clicks Home and checks the home URL. |

### Test 2: cart: list items, change quantity, validate price, proceed to checkout

| Step | What the test does |
|------|--------------------|
| Setup | Opens site, waits 3s, `addProduct('Pumpkin', 2)` and `addProduct('Carrot', 1)` (stepper, retried until the quantity sticks). |
| 1 | `openCart()`, wait 3s. |
| 2 | Asserts 2 cart rows, logs and checks the names, and that the header total equals the sum of line amounts. |
| 3 | Waits 2s, then removes Carrot with `cartPreview.remove`, asserts 1 row left and the total dropped by the Carrot line amount; waits 3s. |
| 4 | Waits 2s, then adds 2 more Pumpkin, asserts the total rose by 2 x unit price and the cart line shows quantity 4; waits 3s. |
| 5 | `homePage.pause(4000)` waits 4 seconds, then `cartPreview.proceedToCheckout()` and asserts the URL contains `#/cart`. |

## Change log

- 2026-10-25: Test 2 in `tests/addToCart.spec.js` now waits 2 seconds before each cart update (remove Carrot, add 2 more Pumpkin).
- 2026-10-25: Test 2 in `tests/addToCart.spec.js` now waits 4 seconds before proceeding to checkout (step 5).
- 2026-10-25: Created this project as a Page Object Model refactor of `Ecommerce Test` (pages, CartPreview component, fixtures, `addToCart.spec.js` with the same two tests, config, package.json, GitLab CI, README).
