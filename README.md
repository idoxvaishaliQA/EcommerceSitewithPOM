# Ecommerce Test (Page Object Model)

Playwright (JavaScript) end-to-end tests for the GreenKart practice shop, structured with the
Page Object Model: https://rahulshettyacademy.com/seleniumPractise/#/

This is the POM refactor of the basic `Ecommerce Test` project, which is kept unchanged.

## Setup

```bash
npm install
npx playwright install chromium
```

## Run

| Command | What it does |
|---------|--------------|
| `npm test` | Run all tests headless; the HTML report opens afterwards (press Ctrl+C to close it). |
| `npm run test:headed` | Run with a visible browser. |
| `npx playwright test tests/addToCart.spec.js --headed` | Run only `addToCart.spec.js` with a visible browser. |
| `npx playwright test tests/addToCart.spec.js -g "cart:"` | Run one test from the file, matched by part of its title. |
| `npm run report` | Reopen the last HTML report. |

## Structure

```
pages/            page objects (one class per page, locators + actions)
  BasePage.js       shared pause() helper
  HomePage.js       search, quantity, add to cart, header totals
  CartPage.js       full cart page (#/cart): rows, totals, place order
  CountryPage.js    country, terms, proceed, confirmation (#/country)
  components/
    CartPreview.js  header cart dropdown
fixtures/pages.js   extends Playwright's test with homePage, cartPage, countryPage
tests/              specs: only steps and assertions, no raw locators
```

See `CODE_EXPLANATION.md` for the step-by-step explanation.

## GitLab CI

`.gitlab-ci.yml` runs the suite on every push using the official Playwright Docker image
(keep its version in step with `@playwright/test` in `package.json`). When `CI` is set, the
config skips opening the report, retries a failed test once, and writes `results.xml`
(JUnit). The HTML report and traces are kept as job artifacts for 14 days.
