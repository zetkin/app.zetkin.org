# Testing with Playwright

## Summary

Write reliable end-to-end tests with Playwright by using stable waiting patterns, locator-based interactions, and deterministic API mocking.

## Rule

- Use locator-based interactions instead of `page.click()` where possible.
- Coordinate navigation-triggering actions with `Promise.all()` to avoid race conditions.
- Mock backend dependencies with moxy to keep tests deterministic.

## Description

Playwright tests can become flaky when interactions race with rendering or navigation. Following a consistent interaction pattern improves stability and lowers maintenance cost.

Zetkin's Playwright setup isolates frontend behavior from backend volatility by using moxy. This keeps test failures focused on frontend regressions.

## Do's

```ts
await Promise.all([page.waitForNavigation(), page.click(`text=${AllMembers.title}`)]);

await page.locator('[data-testid="save-button"]').click();
```

## Don'ts

```ts
await page.click(`text=Next Page`);
await page.waitForNavigation();
```

## Exceptions

In small migration steps or quick diagnostics, temporary `page.click()` usage may be acceptable, but new or updated stable tests should prefer locators.

## References

- [Playwright locators](https://playwright.dev/docs/locators)
- [Playwright page.click() documentation](https://playwright.dev/docs/api/class-page#page-click)
- [Moxy](https://github.com/zetkin/moxy)
