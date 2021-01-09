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
Run the deveopment build using [Docker Compose](https://docs.docker.com/compose/).

```
$ docker-compose up --build
```

To avoid commiting anything that breaks linting rules, you can set up a git
pre-commit hook. The `.githooks/` directory contains such a hook, so the easiest
way to set it up is to just configure git to use hooks from there:

```
$ git config core.hooksPath .githooks
```
