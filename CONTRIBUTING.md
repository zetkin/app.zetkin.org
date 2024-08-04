# Contributing
We are a growing community of contributors who help the international left by
contributing code to the Zetkin Platform. In this document we try to collect the
information you need to have a smooth experience contributing.

1. How and when to contribute
2. Code style and formatting
3. Git conventions
4. Handling text (and i18n)
5. Submitting your contribution
6. Summary (checklist)

## 1. How and when to contribute
You can contribute whenever and however you like (but it helps to follow the guidelines
in this file). Some contributors work from home and submit code in their own time, while
others attend our events and focus their efforts there.

### Join us on Slack
it's easier to contribute, and more fun, when you're part of the community. Email us at
[info@zetkin.org](mailto:info@zetkin.org) to be added to our Slack. We post the most
urgent issues and advertise our events there.

### Events
We usually run one-day **hackathons** every other weekend where you can attend in person
or remotely, and full-weekend **Code Camps** where we assemble a group of volunteers in
a summer camp type facility in the woods. It's a lot of fun to meet other leftist coders
and a good way to contribute.

### Contributing in your own time
If you are unable to attend our events or if you prefer to get started right away you are
very welcome to do so by taking on an issue.

In the [issues](https://github.com/zetkin/app.zetkin.org/issues) section of our GitHub
repo you can find tasks and known bugs. Look for the "entry-level" and "small" labels
if you're just getting started.

When you take on an issue, write a short comment on the issue to let others know that
you're working on it, so that it isn't taken on by someone else as well.

## 2. Code style and formatting
In order to keep things consistent we try to automate as much as possible when it comes
to code style and formatting.

### Linting
The CI server will run eslint and typescript to verify type safety and code
style. You can run the linter yourself like this:

```
$ yarn lint
```

### Automatic formatting with Prettier
The linting script also runs [Prettier](https://prettier.io) so make sure you run Prettier before you commit, or your work won't pass CI. Some IDEs support Prettier as standard and for some you need to download a plugin.

For VSCode, install the [plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode), then

- Go to `extension settings / workspace` and set **Prettier: Config Path** to ".prettierrc.json"
- Set **Prettier: Ignore Path** to ".prettierignore"
- Check the box next to **Prettier: Require Config**
- Uncheck the box next to **Prettier: Use Editor Config**
- Go to `Settings / Text Editor` and change the **Editor: Default Formatter** to "Prettier"
- Go to `Settings / Text Editor / Formatting` and check **Editor: Format On Save**

### Pre-commit hook
To avoid commiting anything that breaks linting rules, you can set up a git
pre-commit hook. The `.githooks/` directory contains such a hook, so the easiest
way to set it up is to just configure git to use hooks from there:

```
$ git config core.hooksPath .githooks
```

## 3. Git conventions
Although some of us care deeply about this kind of thing, you don't have to. But if you do
want to follow the same conventions that the core team does, here's a distilled version:

* When you start working on a new issue, branch off of the `main` branch and do your work
  in the new branch
* Name branches `issue-N/some-description` where `N` is the number of the issue on GitHub,
  and `some-description` is your own "slugified" short description of the issue.
* Name branches `undocumented/some-description` if there is no issue for the thing that you
  want to contribute (e.g. an update to a README, config or whatever)
* As a general style, we write our commit messages as short sentences in
[imperative mood](https://en.wikipedia.org/wiki/Imperative_mood), e.g. "_Add_
MyList component" rather than "_Added_ MyList component".

## 4. Handling text (and i18n)
The Zetkin codebase is internationalized and is continuously translated to multiple
languages. For that purpose, we never use statically defined ("hard-coded") strings
in UI components.

Localized strings are called "messages" and are defined in `messageIds` modules that
exist for all features (e.g. `src/features/surveys/l01n/messageIds.ts`) and the ZUI design
system components (`src/zui/l10n/messageIds.ts`). The messages have an ID derived
from their object structure, and a default (English) string.

### Adding new strings
Some tasks will require you to add a new piece of text, like a button label or a default
value for some input field. To add new text, first find the suitable `messageIds` module.
In that module you will find a large object literal with a structure that in some way
represents the structure of that part of the app, and with messages defined in that
object. Add your own message (or sub-object of multiple messages) where each message is
defined using the `m()` function.

### How it works
Translations are stored in YAML files in `src/locale`. These files are not created by
humans. The English "translations" are generated from the `messageIds`, and any other
language is generated by [our translation interface](https://translate.zetkin.org).

When the GUI is rendered, translations take precedence. This means that **if you want
to change a string** that already exists, you need to update it in `messageIds` and
then re-generate the English YAML file. You can do that with `yarn make-yaml`.

Changes to the YAML files should only ever happen using `yarn make-yaml`. But you do
not need to do this.

More information about how our internationalization system works can be found in
[the PR that introduced it](https://github.com/zetkin/app.zetkin.org/pull/1048).

## 5. Submitting your contribution
Once you're ready to submit your contribution you will need to create a pull request
that will then be reviewed by some other contributor, usually someone from the core
team.

### Creating a pull request
You will have already created a branch (probably named something like
`issue-99/event-component`) and the first step to sharing your work is to push that
branch to GitHub. If you don't yet have write access to the repository, you can
create a fork on your own GitHub and submit the PR from there.

You can then [create a pull request](https://github.com/zetkin/app.zetkin.org/compare)
by picking your branch as the "compare" branch (and leaving `main` as the "base").

When you click "Create pull request" you will be presented with a template where you
should write a short description, include a screenshot etc. [Here's an example](https://github.com/zetkin/app.zetkin.org/pull/1434)

### Make sure CI (will) pass
Pull requests have automated tests ("Continuous Integration" or "CI") that runs to
try to assess whether the changes to the code break anything.

When you submit your first PR, our CI will need to be approved by a core team member
before it runs.

You can be quite certain that CI will pass if you run `yarn suite` locally and it
passes on your machine.

### Review process
Within a few days someone should review your code and give you feedback. Most PRs
require some changes before they're merged, even the ones coming from the core team.

If at any point you find that you don't have time, just let us know, and someone
else will finish the PR for you.

## 6. Checklist
Here's a list of all the steps to contribute, in summary:

- [ ] Clone and run the project locally (see [README](./README.md) for details)
- [ ] Configure your development environment (Prettier, pre-commit hooks etc)
- [ ] Find a suitable issue from the [issues list](https://github.com/zetkin/app.zetkin.org/issues)
- [ ] Write a comment on the issue saying something like "I'm giving this a try!" and include your questions if you have any
- [ ] Create a branch according to naming convention, e.g. `issue-1234/month-calendar-view`
- [ ] Work on the task
- [ ] Run `yarn lint` to verify code style and formatting
- [ ] Make a commits according to conventions, e.g. "Render grid of 7 days by 6 weeks"
- [ ] Push your branch
- [ ] Create a pull request and wait for review
- [ ] Be prepared to answer questions or make changes as raised during the review

Thank you so much for contributing and being part of this movement!