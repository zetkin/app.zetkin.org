# Zetkin
This is the new Zetkin front-end application, currently under development. It
will run at app.zetkin.org and replace the current www.zetk.in, call.zetk.in and
organize.zetk.in applications.

__NOTE__: This is extremely early stages of development. The plan is to launch a
public beta in the spring of 2021.

## Technology
The new Zetkin app is built on [NEXT.js](https://nextjs.org) with TypeScript.

## Development
Install all the dependencies using [`yarn` (Classic)](https://classic.yarnpkg.com):

```
$ yarn install
```

Then start the devserver in one of two ways:

```
$ yarn tdd           # Use this for test-driven development with Cypress
$ yarn devserver     # Use this if you don't want to do TDD
```

You should now be able to access the app on http://localhost:3000. It will
communicate with the Zetkin API running on our public development server.

## Development server login credentials
You can log in using the dummy user accounts to access dummy data from the
development server.

Role/access    | Username                | Password  | SMS code
---------------|-------------------------|-----------|--------------
Administrator  | testadmin@example.com   | password  | 999999
Caller         | testcaller@example.com  | password  | 999999
Basic user     | testuser@example.com    | password  | 999999

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
