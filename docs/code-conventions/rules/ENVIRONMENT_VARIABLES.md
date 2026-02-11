# Environment Variables

## Summary

Use Zetkin's runtime environment variable flow for values that must vary per deployment environment, and avoid direct client-side access to `process.env`.

## Rule

- New runtime variables must be added to the shared `EnvVars` type.
- Components must read runtime variables via `useEnv().vars`.
- Do not rely on build-time inlining for values that must stay configurable at runtime.

## Description

Zetkin is commonly deployed as a pre-built artifact (for example in Docker), where one build can run in multiple environments. Because of that, environment variables that affect runtime behavior must be exposed through the runtime environment flow instead of being baked into client bundles at build time.

When introducing a new variable, update `EnvVars` and wire it through the existing runtime pipeline so both app router and pages router paths remain consistent.

## Do's

```ts
const Component = () => {
  const env = useEnv();
  return <a href={env.vars.ZETKIN_GEN2_ORGANIZE_URL}>Open legacy UI</a>;
};
```

## Don'ts

```ts
const organizeUrl = process.env.NEXT_PUBLIC_ZETKIN_GEN2_ORGANIZE_URL;
```

## Exceptions

Values that are intentionally build-specific and never expected to change between runtime environments can use build-time environment handling.

## References

- [`src/core/env/Environment.ts`](../../../src/core/env/Environment.ts)
- [`src/app/layout.tsx`](../../../src/app/layout.tsx)
- [Next.js environment variables](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables)
