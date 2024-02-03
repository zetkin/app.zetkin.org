# Testing
This file contains information and instructions about our automated testing.

## Integration tests
Integration tests are run with [Playwright](https://playwright.dev/docs/intro). To run tests:

```
yarn playwright
```

This will also build the next.js application. You can save time and not rebuild the application (if only working on tests, for example), using:

```
yarn playwright:skipbuild
```

## Unit tests

Unit tests are run on functions and on components when we don't need to test component integrations. We use [Jest](https://jestjs.io/docs/getting-started) with [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/). To run unit tests:

```
yarn test // To run tests once.

yarn test --verbose // Include this flag to always include console.log output.

yarn test --watchAll // To run tests in interactive watch mode.
```

We override the default `render()` function from `@testing-library/react` in the file `src/test-utils/index.ts` in order to automatically apply context providers. All `@testing-library/react` functions are exposed from the custom `test-utils` module, so import from there instead of `@testing-library/react`.

```js
import { render, fireEvent } from 'test-utils';

/// Then use render as is documented in the docs for @testing-library/react.
```

The `react-intl` setup in tests does not render the text in the components and instead **renders the i18n string id**. When attempting to target strings in tests, search for the id that you expect, not the translated text.