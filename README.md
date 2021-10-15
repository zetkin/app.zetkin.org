# Zetkin

This is the new Zetkin front-end application, currently under development. It
will run at app.zetkin.org and replace the current www.zetk.in, call.zetk.in and
organize.zetk.in applications.

**NOTE**: This is extremely early stages of development. The plan is to launch a
public beta in the spring of 2021.

## Technology

The new Zetkin app is built on [NEXT.js](https://nextjs.org) with TypeScript.

## Development

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

yarn test --verbose // Include this flat to always include console.log output.

yarn test --watchAll // To run tests in interactive watch mode.
```

We override the default `render()` function from `@testing-library/react` in the file `src/test-utils/index.ts` in order to automatically apply context providers. All `@testing-library/react` functions are exposed from the custom `test-utils` module, so import from there instead of `@testing-library/react`.

```js
import { render, fireEvent } from "test-utils";

/// Then use render as is documented in the docs for @testing-library/react.
```

The `react-i18n` setup in tests does not render the text in the components and instead **renders the i18n string id**. When attempting to target strings in tests, search for the id that you expect, not the translated text.

## Development server login credentials

You can log in using the dummy user accounts to access dummy data from the
development server.

| Role/access   | Username               | Password | SMS code |
| ------------- | ---------------------- | -------- | -------- |
| Administrator | testadmin@example.com  | password | 999999   |
| Caller        | testcaller@example.com | password | 999999   |
| Basic user    | testuser@example.com   | password | 999999   |

The SMS one-time password is only required in some parts of the app.

## Contributing

This repository has an `.editorconfig` file which can automatically configure
your editor to the correct style. Make sure [your editor supports](https://editorconfig.org/#pre-installed)
`.editorconfig` files, or [install a plugin](https://editorconfig.org/#download).

The CI server will run eslint and typescript to verify type safety and code
style. You can run the linter yourself like this:

```
$ yarn lint
```

To avoid commiting anything that breaks linting rules, you can set up a git
pre-commit hook. The `.githooks/` directory contains such a hook, so the easiest
way to set it up is to just configure git to use hooks from there:

```
$ git config core.hooksPath .githooks
```

## Submit your contribution

If you don't yet have write access to the repository, you can create a fork
on your own GitHub and work there.

Pick an issue from [the list](https://github.com/zetkin/app.zetkin.org/issues)
and write a short message on the issue to let us know that you intened to work
on it.

Create a git branch for your work named `issue-<number>/some-description`, e.g.
`issue-99/event-component` for [issue #99](https://github.com/zetkin/app.zetkin.org/issues/99).

As a general style, we write our commit messages as short sentences in
[imperative mood](https://en.wikipedia.org/wiki/Imperative_mood), e.g. "_Add_
MyList component" rather than "_Added_ MyList component".

When you're ready, create a pull request and expect it to be reviewed within
a few days.
