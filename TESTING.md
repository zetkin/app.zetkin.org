# Testing

This file contains information and instructions about our automated testing.

## Integration tests

Integration tests are run with [Playwright](https://playwright.dev/docs/intro). To run tests:

```
npm run e2e
```

This will also build the next.js application. You can save time and not rebuild the application (if only working on tests, for example), using:

```
npm run e2e:skipbuild
```

### Investigating failures

When a test fails (locally or in CI), Playwright captures screenshots, videos, and
traces. Run `npx playwright show-report` to open the HTML report in your browser.

To view the report from the latest CI run for your branch (requires [GitHub CLI](https://cli.github.com/)):

```
npm run e2e:ci:report
```

If your local branch name doesn't match the remote (e.g. when checking out from a fork), specify the branch explicitly:

```
npm run e2e:ci:report -- feat/my-branch
```

## Unit tests

Unit tests are run on functions and on components when we don't need to test component integrations. We use [Jest](https://jestjs.io/docs/getting-started) with [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/). To run unit tests:

```
npm run test // To run tests once.

npm run test --verbose // Include this flag to always include console.log output.

npm run test --watchAll // To run tests in interactive watch mode.
```

We override the default `render()` function from `@testing-library/react` in the file `src/test-utils/index.ts` in order to automatically apply context providers. All `@testing-library/react` functions are exposed from the custom `test-utils` module, so import from there instead of `@testing-library/react`.

```js
import { render, fireEvent } from 'test-utils';

/// Then use render as is documented in the docs for @testing-library/react.
```

The `react-intl` setup in tests does not render the text in the components and instead **renders the i18n string id**. When attempting to target strings in tests, search for the id that you expect, not the translated text.

## Further Reading

- [Jest Testing](docs/testing/jest.md) - Unit test patterns and conventions
- [Playwright Testing](docs/testing/playwright.md) - Integration test patterns and conventions
