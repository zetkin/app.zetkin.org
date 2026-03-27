# Equality Operator

## Summary

Use strict equality operators (`===` and `!==`) by default. They make comparisons explicit, avoid JavaScript type coercion, and reduce the risk of unexpected runtime behavior when values do not match their intended types.

## Rule

- Code must use `===` and `!==` by default.
- Code must not use `==` or `!=` for general value comparisons.
- Comparisons should match the actual intent of the check.
- When checking for a missing or falsy value, code should use `!value` or `!!value` as appropriate.
- When checking specifically for `null` and `undefined`, code should use an explicit nullish check instead of a general falsy check.
- When checking for missing, empty, or whitespace-only strings, code should use an explicit string check instead of relying on equality operators alone.
- When comparing values from external boundaries such as APIs, user input, query params, storage, or third-party libraries, code should prefer explicit narrowing or validation before branching on equality.

## Description

Strict equality should be the default because it compares values without implicit type coercion. This makes code easier to read, easier to review, and less likely to behave unexpectedly when runtime values differ from their declared types.

In TypeScript, types help prevent many incorrect comparisons at compile time, but runtime mismatches can still occur at boundaries, through type assertions, or through third-party code. Using strict equality does not solve invalid runtime data, but it avoids adding JavaScript coercion on top of already-wrong inputs.

The goal of this rule is not to ban every use of loose equality. The goal is to make comparisons intentional. If the intent is to check for one exact value, use strict equality. If the intent is to check for a missing or generally falsy value, use a falsy check. If the intent is to check specifically for `null` or `undefined`, make that nullish intent explicit.

## Do's

```ts
if (status === 'open') {
  handleOpen();
}

if (count !== 0) {
  renderCount(count);
}

if (!email) {
  openMissingEmailDialog();
}

if (!email?.trim()) {
  openMissingEmailDialog();
}

if (value === null || value === undefined) {
  handleMissingValue();
}

const page = Number(searchParams.get('page'));
if (Number.isFinite(page) && page === 0) {
  handleFirstPage();
}
```

## Don'ts

```ts
if (status == 'open') {
  handleOpen();
}

if (count != 0) {
  renderCount(count);
}

if (email == null) {
  openMissingEmailDialog();
}

if (email === undefined) {
  // too narrow if the real intent is "missing or empty"
  openMissingEmailDialog();
}

if (value == 0) {
  // true for 0, "0", false, and ""
  handleZero();
}

if (payload.value === 0) {
  // avoid branching on unvalidated boundary data without narrowing first
  handleZero();
}
```

## Exceptions

- Use explicit nullish checks such as `value === null || value === undefined` when the intent is specifically to distinguish `null`/`undefined` from other falsy values like `''`, `0`, or `false`.
- Loose equality may be used in rare cases where coercion is explicitly intended and improves clarity, but this should be exceptional and easy to justify in review.

## References

- [ESLint: `eqeqeq` rule](https://eslint.org/docs/latest/rules/eqeqeq)
- [TypeScript Handbook: Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [MDN: Equality comparisons and sameness](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Equality_comparisons_and_sameness)
