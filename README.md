# Zetkin
This is the new Zetkin front-end application, currently under development. It
will run at app.zetkin.org and replace the current www.zetk.in, call.zetk.in and
organize.zetk.in applications.

__NOTE__: This is extremely early stages of development. At the time that this
repository is published, it contains only boilerplate. The plan is to launch a
public beta in the spring of 2021.

## Technology
The new Zetkin app is built on [NEXT.js](https://nextjs.org) with TypeScript.
We develop and deploy using Docker.

## Development
Install all the dependencies using npm:

```
$ npm install
```

Then start the devserver in one of two ways:

```
$ npm run tdd           # Use this for test-driven development with Cypress
$ npm run devserver     # Use this if you don't want to do TDD
```

The dev server will tell you about code issues using eslint and typescript
in the form of warnings. No warnings are allowed in checked in code. You can
run the linter standalone like this:

```
$npm run lint
```

To avoid commiting anything that breaks linting rules, you can set up a git
pre-commit hook. The `.githooks/` directory contains such a hook, so the easiest
way to set it up is to just configure git to use hooks from there:

```
$ git config core.hooksPath .githooks
```
