---
title: Jest
category: Testing
---

# Jest

## Running Jest

### Run all tests

```
npm run test
```

It can be useful to run the whole test suite if you've changed a few files as part of whatever you're working on.

### Run one test

```
npm run test src/utils/dateUtils.spec.ts
```

When you're working on one particular file, you can run its tests by putting the path to them after `npm run test`.

### Watch mode

```
npm run test --watch src/utils/dateUtils.spec.ts
```

During focused work on a single file, it can be helpful to use the `--watch` flag to re-run the tests automatically every time you change something.
