# Zetkin

This is the new Zetkin front-end application, currently under development. It
will run at app.zetkin.org and replace the current www.zetk.in, call.zetk.in and
organize.zetk.in applications.

## Technology

The new Zetkin app is built on [NEXT.js](https://nextjs.org) with TypeScript.

## Contributing
Do you want to contribute to this project and become part of a community of people
that use their coding skills to help the international left? We try to make the
process as easy and transparent as possible. Read all about it in the separate
[CONTRIBUTING.md](./CONTRIBUTING.md) file.

## Instructions

Install all the dependencies using [`yarn` (Classic)](https://classic.yarnpkg.com):

```
$ yarn install
```

Then start the devserver:

```
$ yarn devserver
```

You should now be able to access the app on http://localhost:3000. It will
communicate with the Zetkin API running on our public development server.

### Integration tests

Integration tests are run with [Playwright](https://playwright.dev/docs/intro). To run tests:

```
yarn playwright
```

This will also build the next.js application. You can save time and not rebuild the application (if only working on tests, for example), using:

```
yarn playwright:skipbuild
```

### Unit tests

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

## Development server login credentials

You can log in using the dummy user accounts to access dummy data from the
development server.

Hint: when in doubt, use **Administrator**

| Role/access   | Username               | Password | SMS code |
| ------------- | ---------------------- | -------- | -------- |
| Administrator | testadmin@example.com  | password | 999999   |
| Caller        | testcaller@example.com | password | 999999   |
| Basic user    | testuser@example.com   | password | 999999   |

The SMS one-time password is only required in some parts of the app.
