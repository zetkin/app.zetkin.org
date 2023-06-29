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

Also see [TESTING.md](./TESTING.md) for details about automated testing.

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
