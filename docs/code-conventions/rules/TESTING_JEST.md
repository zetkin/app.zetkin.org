# Testing with Jest

## Summary

Use Jest for fast feedback during development and run relevant test scope before opening or updating a pull request.

## Rule

- Run Jest tests for the code you changed.
- Use focused runs during iteration and broader runs before review when changes are wide.
- Keep tests runnable through standard project scripts.

## Description

Jest is the primary test runner for many unit and integration tests in this repository. A predictable command workflow helps contributors validate changes quickly and helps reviewers trust that updates are safe.

Use file-scoped commands for focused work and run larger scopes when your changes affect multiple files or shared utilities.

## Do's

- Run all tests with `yarn test` before requesting review for broader changes.
- Run focused tests with `yarn test <path-to-spec>` while working on a specific area.
- Use watch mode with `yarn test --watch <path-to-spec>` during rapid iteration.

## Exceptions

Pure documentation or metadata-only changes that do not affect runtime behavior may not require running Jest.

## References

- [Jest documentation](https://jestjs.io/docs/getting-started)
