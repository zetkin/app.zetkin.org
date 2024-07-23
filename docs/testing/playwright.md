---
title: Playwright
category: Testing
---

## Running Playwright

### Run all tests

```
yarn playwright
```

It can be useful to run the whole playwright suite if you've changed a few features as part of whatever you're working on.

### Run one test

```
yarn playwright tests/organize/views/detail/display.spec.ts
```

When you're working on one particular feature, you can run its playwright tests by putting the path to them after `yarn playwright`.

### Skip the build

```
yarn playwright:skipbuild tests/organize/views/detail/display.spec.ts
```

The `yarn playwright` script builds the Next.js app before running the tests. This takes several minutes, and isn't useful if you're only changing test code (code in a `.spec.ts` file). You can tell playwright not to include this build step with the `playwright:skipbuild` script.

### Debug mode

```
yarn playwright:skipbuild --debug tests/organize/views/detail/display.spec.ts
```

In its default mode of execution, Playwright runs the tests in a headless browser. This means you can't see them running or interact with the browser's developer tools to debug any problems that arise. By adding the `--debug` flag, you can tell Playwright to run the tests visually in a Chrome window so you can see what's happening and debug any problems.

## Writing Playwright tests

### Moxy

Zetkins Playwright tests isolate the Next.js app from the back end very thoroughly by using [moxy](https://github.com/zetkin/moxy) to set up placeholder responses. This means the tests can run without the app ever actually communicating with the real back end. The purpose of this is to make the tests more deterministic, which means they should only break because of a problem with the code, because nobody can break them by mistake by changing something in the dev server's database that they depend on.

The [code search results for `moxy.setZetkinApiMock`](https://github.com/search?q=repo%3Azetkin%2Fapp.zetkin.org%20moxy.setZetkinApiMock&type=code) are a great starting point to learn about setting up these API mocks.

### waitForNavigation

A common step in a Playwright test is to trigger a click on a link and then continue after the page load has completed. The intuitive way to write this code would be like so.

```typescript
await page.click(`text=Next Page`);
await page.waitForNavigation();
```

You won't find any examples of code written that way in Zetkin though. The problem with writing it like that is that the navigation can sometimes complete before the `await page.waitForNavigation()` has even happened, leaving the test stranded waiting for a navigation that's already happened. Instead, we set up both steps simultaneously like this.

```typescript
await Promise.all([
  page.waitForNavigation(),
  page.click(`text=${AllMembers.title}`),
]);
```

### Locators

Browser automation tests like these are notorious for sometimes failing randomly. It's difficult to avoid making subtle mistakes and introducing race conditions like the `waitForNavigation` issue above. One general-purpose technique that can help with this is to prefer using [locators](https://playwright.dev/docs/locators) instead of `page.click()`. The first thing Playwright's own [documentation for `page.click`](https://playwright.dev/docs/api/class-page#page-click) says is not to use it.

> **Discouraged**<br />
> Use locator-based [locator.click()](https://playwright.dev/docs/api/class-locator#locator-click) instead. Read more about [locators](https://playwright.dev/docs/locators).

Using locators instead of `page.click()` maximizes our chances of Playwright's auto-waiting and auto-retrying saving us from a meaningless random test failure resulting from a race condition.

There are lots of examples to learn from in the [code search results for `page.locator`](https://github.com/search?q=repo%3Azetkin%2Fapp.zetkin.org%20page.locator&type=code).
