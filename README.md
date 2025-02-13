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

### Getting the code

The code is [hosted on GitHub](https://github.com/zetkin/app.zetkin.org) (likely
where you are currently reading this information). If you are unfamiliar with
Git and/or GitHub, here's some recommended reading from the GitHub Docs:

- [About GitHub and Git](https://docs.github.com/en/get-started/start-your-journey/about-github-and-git)
- [Set up Git](https://docs.github.com/en/get-started/getting-started-with-git/set-up-git)
  (We recommend either the Git command-line interface or a plugin for your IDE)
- [Contributing to a project](https://docs.github.com/en/get-started/exploring-projects-on-github/contributing-to-a-project)
  explains how you can submit your first PR to a project like Zetkin

You can use any editor or IDE to edit the code, but most of us use [VSCode](https://code.visualstudio.com/).

### Running the code (normal)

The Zetkin web app is a NEXT.js app that runs in the Node.js JavaScript runtime.
If you don't have it already, you must [install Node.js](https://nodejs.org/)
first.

We use [`yarn` (Classic)](https://classic.yarnpkg.com) to manage our code
dependencies. Once you have installed `yarn` you can install all other
dependencies like so:

```
$ yarn install
```

With dependencies installed, you can start the development server:

```
$ yarn devserver
```

You should now be able to access the app on http://localhost:3000. It will
communicate with the Zetkin API running on our public development server. See
below for login credentials.

### Running the code (Docker)

As **an alternative to the normal development setup**, you can also run the provided
Docker Compose setup.

- Requires Docker Compose v2+
- Backend development: Run local production (after building, it starts very fast)
  and access the organizations directly on http://localhost:3000/organizations/.

  ```
  $ docker compose -f dev.yml --profile static up
  ```

- Frontend development: Similar to the normal yarn setup documented here.

  ```
  $ docker compose -f dev.yml --profile dev up
  ```

- Linting: You can run lint commands from within a container, too:

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

### Debugging

If you want to debug this applications you can do so through VS Code or JetBrains IDE's (as IntelliJ or WebStorm).

#### VS Code

For VS Code there are 2 debugging configurations within [`./.vscode/launch.json`](./.vscode/launch.json). 
One for debugging with chrome and one for firefox.

1. Start the devserver via `yarn devserver`
2. In the sidebar on the left go to `Run and Debug`
3. Select and run `Next.js: debug client-side (Chrome)` or `Next.js: debug client-side (Firefox)` (note that you need to have the [Debugger for Firefox Extension](https://marketplace.visualstudio.com/items?itemName=firefox-devtools.vscode-firefox-debug) installed as referenced in [`./.vscode/extensions.json`](./.vscode/extensions.json))
4. A browser window should open itself. Navigate to the page that you need to debug (don't forget to set your breakpoints first)

#### JetBrains IDE's

For JetBrains IDE's unfortunately there's only a debug configuration for chrome available ([`./.idea/launch.json`](./.idea/launch.json)).

1. Start the devserver via `yarn devserver`
2. In the top bar select the run configuration `Next.js: debug client-side (Chrome)` 
3. Run that selected configuration in the debug mode by clicking on the bug icon.
4. A chrome window should open itself. Navigate to the page that you need to debug (don't forget to set your breakpoints first)


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
