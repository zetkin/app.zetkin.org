---
title: Environment Variables
category: Environment Variables
---

# Environment Variables

## Build-Time vs Runtime Environment Variables

Next.js is designed around Vercel's Platform-as-a-Service (PaaS) hosting
business. Apps on Vercel can have multiple deployment environments such as
staging and production, and a different build of the app is compiled for each
environment. Next.js includes functionality to support Vercel's
one-environment-per-build deployment model, where any environment variables
needed by client-side code are [inlined directly into the compiled JavaScript](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables#bundling-environment-variables-for-the-browser)
bundle at build time.

Outside of Vercel's hosting platform, Docker images are a common way to
distribute and deploy software. Self-hosted open source software is often
distributed as pre-built Docker images whose operators apply environment
variables to them at runtime. This is a deployment model with multiple
environments per build, where environment variables cannot be known at build
time. It also happens to be Zetkin's deployment model.

The emphasis that Next.js places on the Vercel platform's deployment
model in its architecture and documentation can easily lead to confusion when
working on an app like Zetkin with a different deployment model. The fact that
handling runtime environment variables looks different under the newer app
router paradigm compared to the older pages router code also adds to the sense
of complexity here. So here's how Zetkin's runtime environment variables work in
both Next.js routing paradigms.

## Runtime Environment Variables In App Router Code

The `<RootLayout>` component in `src/app/layout.tsx` makes a set of runtime
environment variables from the Node.js process on the server available to
client-side code by adding them as values to a `ClientContext` provider.

The [`ClientContextEnvVars`](../types/ClientContextEnvVars.html) type alias is a good starting point
when adding a new runtime environment variable to app router code. Add your
variable there and then fix any resulting type errors and you'll be up and
running.

## Runtime Environment Variables In Pages Router Code

Just about every page component in `src/pages/` uses the `scaffold()` function
to generate its [`getServerSideProps()`](https://nextjs.org/docs/pages/building-your-application/data-fetching/get-server-side-props) function.

The [`ClientContextEnvVars`](../types/ScaffoldedEnvVars.html) type alias is also
the place to look first when adding a new runtime environment variable to pages
router code.

## Further Reading

Zetkin's far from the only project to have solved this problem.

- [NextJS on Docker: Managing Environment Variables Across Different Environments](https://medium.com/@ihcnemed/nextjs-on-docker-managing-environment-variables-across-different-environments-972b34a76203)
- [Next.js with Public Environment Variables in Docker](https://dev.to/vorillaz/nextjs-with-public-environment-variables-in-docker-4ogf)
- [Runtime Environment Variables in Next.js](https://notes.dt.in.th/NextRuntimeEnv)
