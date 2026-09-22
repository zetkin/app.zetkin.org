---
title: Playwright
category: Testing
---

# Playwright

## Running Playwright

### Run all tests

```
npm run e2e
```

It can be useful to run the whole playwright suite if you've changed a few features as part of whatever you're working on.

### Run one test

```
npm run e2e tests/organize/views/detail/display.spec.ts
```

When you're working on one particular feature, you can run its playwright tests by putting the path to them after `npm run e2e`.

### Skip the build

```
npm run e2e:skipbuild tests/organize/views/detail/display.spec.ts
```

The `npm run e2e` script builds the Next.js app before running the tests. This takes several minutes, and isn't useful if you're only changing test code (code in a `.spec.ts` file). You can tell playwright not to include this build step with the `e2e:skipbuild` script.

### Debug mode

```
npm run e2e:skipbuild --debug tests/organize/views/detail/display.spec.ts
```

In its default mode of execution, Playwright runs the tests in a headless browser. This means you can't see them running or interact with the browser's developer tools to debug any problems that arise. By adding the `--debug` flag, you can tell Playwright to run the tests visually in a Chrome window so you can see what's happening and debug any problems.

## Writing Playwright tests

### Test Structure

Tests live in `integrationTesting/tests/`, organized by feature area:

```
integrationTesting/
├── fixtures/
│   └── next.ts          # Custom test fixtures
├── mockData/
│   └── orgs/KPD/        # Mock data for "KPD" organization
└── tests/
    └── organize/
        ├── tags/
        ├── views/
        └── journeys/
```

Import the custom `test` fixture in every spec:

```typescript
import { expect } from '@playwright/test';
import test from '../../../fixtures/next';
import ClaraZetkin from '../../../mockData/orgs/KPD/people/ClaraZetkin';
import KPD from '../../../mockData/orgs/KPD';
```

### Fixtures

The custom `test` fixture from `integrationTesting/fixtures/next.ts` provides:

#### `login(user?, memberships?)`

Sets up mocks for authentication. Uses Rosa Luxemburg as the default user.

```typescript
test.beforeEach(({ login }) => {
  login(); // Uses default user
  // or
  login(customUser, customMemberships);
});
```

#### `logout()`

Removes authentication mocks without navigating.

```typescript
test.beforeEach(({ logout }) => {
  logout();
});
```

#### `moxy`

Mock server that intercepts API requests. See Moxy section below.

#### `appUri`

Base URL for the Next.js app (includes port).

```typescript
await page.goto(appUri + '/organize/1/people');
```

#### `setBrowserDate(date)`

Sets a fake "current date" for testing date-dependent UI.

```typescript
await setBrowserDate(new Date('1857-07-05'));
```

#### `fileServerUri`

HTTP server for serving test files from `integrationTesting/mockFiles/`.

### Moxy

Zetkins Playwright tests isolate the Next.js app from the back end very thoroughly by using [moxy](https://github.com/zetkin/moxy) to set up placeholder responses. This means the tests can run without the app ever actually communicating with the real back end. The purpose of this is to make the tests more deterministic, which means they should only break because of a problem with the code, because nobody can break them by mistake by changing something in the dev server's database that they depend on.

Moxy intercepts HTTP requests to the Zetkin API and returns mock responses.

#### Basic Usage

```typescript
const mock = moxy.setZetkinApiMock('/orgs/1/people', 'get', people);
// Returns a mock object with .log() and .removeMock()
```

#### Checking API Calls

```typescript
const createRequest = moxy.setZetkinApiMock(
  '/orgs/1/people/tags',
  'post',
  newTag
);

// Later in test:
await page.click('data-testid=SubmitButton');

// Wait until API gets called using expect.poll()
await expect.poll(() => createRequest.log().length).toBe(1);
// Verify that the returned data is correct
expect(createRequest.log()[0].data).toEqual({ title: 'Activist' });
```

#### Removing Mocks

```typescript
moxy.removeMock('/users/me', 'get');
```

#### Error Responses

```typescript
moxy.setZetkinApiMock('/api/path', 'post', null, 500); // 500 status
```

#### Cleanup

Always call `moxy.teardown()` in `afterEach`:

```typescript
test.afterEach(({ moxy }) => {
  moxy.teardown();
});
```

### Selectors

#### data-testid

```typescript
page.locator('data-testid=SubmitCancelButtons-submitButton');
page.locator('data-testid=TagManager-TagDialog-titleField');
```

Add `data-testid` to components for stable test selectors.

#### Text Selectors

```typescript
page.click('text=Add tag');
page.locator('text=Add tag').click();
```

#### Compound Selectors

```typescript
// Chain with >>
page.click(
  'div[aria-label="timeline update"] >> [data-testid=ZUIEllipsisMenu-menuActivator]'
);

// :below() for relative positioning
page.click('[data-slate-editor=true]:below(:text("added a note"))');
```

#### nth

```typescript
page.locator('input[name="options"] >> nth=0');
```

### waitForNavigation

A common step in a Playwright test is to trigger a click on a link and then continue after the page load has completed. The intuitive way to write this code would be like so.

```typescript
await page.click(`text=Next Page`);
await page.waitForNavigation();
```

You won't find any examples of code written that way in Zetkin though. The problem with writing it like that is that the navigation can sometimes complete before the `await page.waitForNavigation()` has even happened, leaving the test stranded waiting for a navigation that's already happened. Instead, we set up both steps simultaneously like this.

```typescript
await Promise.all([
  page.waitForURL(appUri + '/expected-url'),
  page.click('text=View Details'),
]);
```

### Locators

Browser automation tests like these are notorious for sometimes failing randomly. It's difficult to avoid making subtle mistakes and introducing race conditions like the `waitForNavigation` issue above. One general-purpose technique that can help with this is to prefer using [locators](https://playwright.dev/docs/locators) instead of `page.click()`. The first thing Playwright's own [documentation for `page.click`](https://playwright.dev/docs/api/class-page#page-click) says is not to use it.

> **Discouraged**<br />
> Use locator-based [locator.click()](https://playwright.dev/docs/api/class-locator#locator-click) instead. Read more about [locators](https://playwright.dev/docs/locators).

Using locators instead of `page.click()` maximizes our chances of Playwright's auto-waiting and auto-retrying saving us from a meaningless random test failure resulting from a race condition.

```typescript
// Avoid
await page.click('text=Submit');

// Prefer
await page.locator('text=Submit').click();
```

There are lots of examples to learn from in the [code search results for `page.locator`](https://github.com/search?q=repo%3Azetkin%2Fapp.zetkin.org%20page.locator&type=code).

### Mock Data

Mock data lives in `integrationTesting/mockData/` and is organized by entity type:

```typescript
import ClaraZetkin from '../../../mockData/orgs/KPD/people/ClaraZetkin';
import KPD from '../../../mockData/orgs/KPD';
import ActivistTag from '../../../mockData/orgs/KPD/tags/Activist';
```

Use existing mock data objects or create new ones following the pattern:

```typescript
import { ZetkinPerson } from 'utils/types/zetkin';

const ClaraZetkin: ZetkinPerson = {
  id: 1,
  first_name: 'Clara',
  last_name: 'Zetkin',
  // ... other fields
};

export default ClaraZetkin;
```

### Assertions

#### expect.poll()

Polls until a condition is true. Essential for async operations like API calls.

```typescript
await expect.poll(() => mock.log().length).toBe(1);
```

#### Standard Assertions

```typescript
await expect(page.locator('data-testid=ErrorMessage')).toBeVisible();
await expect(page.locator('input[name="value"]')).toHaveValue('expected');
await expect(page.locator('input[name="value"]')).toBeChecked();
```

### Basic Test Pattern

```typescript
test.describe('Feature name', () => {
  test.beforeEach(async ({ page, appUri, moxy, login }) => {
    login();
    moxy.setZetkinApiMock('/orgs/1', 'get', KPD);
    moxy.setZetkinApiMock(
      `/orgs/1/people/${ClaraZetkin.id}`,
      'get',
      ClaraZetkin
    );
    await page.goto(appUri + `/organize/1/people/${ClaraZetkin.id}`);
  });

  test.afterEach(({ moxy }) => {
    moxy.teardown();
  });

  test('does something', async ({ page, moxy }) => {
    // Test code here
  });
});
```

### Debugging Failed Tests

Playwright captures screenshots, videos, and traces on failure.

```bash
# Open HTML report
npx playwright show-report
```

The GitHub Actions also attach the report as an artifact.

## Best Practices

1. **Always cleanup in afterEach** - Call `moxy.teardown()` to reset mocks
2. **Use data-testid** - Add test IDs to components for stable selectors
3. **Prefer locators** - Use `page.locator().click()` over `page.click()`
4. **Use expect.poll()** - For checking async conditions like API calls
5. **Wrap navigation** - Use `Promise.all()` when clicking and waiting for navigation
6. **Wait for elements** - Don't assume elements are ready; wait for them
7. **Keep tests isolated** - Each test should set up its own mocks
8. **Use mock data** - Import from `mockData/` rather than creating ad-hoc objects

See the [Playwright Best Practices](https://playwright.dev/docs/best-practices) for more.
