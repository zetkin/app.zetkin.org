---
title: Jest
category: Testing
---

## Running Jest

### Run all tests

```
yarn test
```

It can be useful to run the whole test suite if you've changed a few files as part of whatever you're working on.

### Run one test

```
yarn test src/utils/dateUtils.spec.ts
```

When you're working on one particular file, you can run its tests by putting the path to them after `yarn test`.

### Watch mode

```
yarn test --watch src/utils/dateUtils.spec.ts
```

During focused work on a single file, it can be helpful to use the `--watch` flag to re-run the tests automatically every time you change something.
