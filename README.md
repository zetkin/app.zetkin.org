# Zetkin Web App

This is the current-generation (Gen3) web interface for the Zetkin Platform. It
is gradually replacing the older (Gen2) web apps that can be found elsewhere.

The Zetkin Platform is software for organizing activism, developed by staff and
volunteers at [Zetkin Foundation](https://zetkin.org) and used by organizations
within the international left.

## Contributing
Do you want to contribute to this project and become part of a community of people
that use their coding skills to help the international left? We try to make the
process as easy and transparent as possible. Read all about it in the separate
[CONTRIBUTING.md](./CONTRIBUTING.md) file.

Also see [TESTING.md](./TESTING.md) for details about automated testing.

## Instructions

### Windows

1. Fork zetkin/app.zetking.org into your personal GitHub account.
1. Install Git for Windows from https://git-scm.com/download/win
2. Generate an SSH key, for example with
   Git Gui / Help / Show SSH Key / Generate Key
3. Add your key to GitHub by copying the public part of it to
   your GitHub settings at https://github.com/settings/keys
4. Install Visual Studio Code.
5. In Visual Studio Code use Clone Repository and from GitHub, connect your
   installation of Visual Studio Code to your GitHub account, and then clone
   your fork from GitHub. Note that you will be prompted for the passphrase of
   your private key if you chose to use one when you created your SSH Key.

### Common

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

### Docker

As **an alternative to the normal development setup**,
you can also run the provided Docker Compose setup.

* Requires Docker Compose v2+
* Backend development: Run local production (after building, it starts very fast)
  and access the organizations directly on http://localhost:3000/organizations/.

  ```
  $ docker compose -f dev.yml --profile static up
  ```

* Frontend development: Similar to the normal yarn setup documented here.

  ```
  $ docker compose -f dev.yml --profile dev up
  ```

* Linting: You can run lint commands from within a container, too:

  ```
  $ # Default: Run .githooks/precommit
  $ docker compose -f dev.yml run lint
  $ # Run prettier, checking for errors
  $ docker compose -f dev.yml run lint npx prettier . --check
  $ # Run prettier in write-mode
  $ docker compose -f dev.yml run lint npx prettier . --write
  ```

Note: If you are running the backend locally and things like `dev.zetkin.org` resolve to `127.0.0.1`,
then this only works on Linux-based systems, due to the nature of `127.0.0.1` pointing to the host on Linux
(but not on Windows/Mac, where it points to the container itself).

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
