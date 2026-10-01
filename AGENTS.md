# Instructions for Zetkin Web App

> [!IMPORTANT]
>
> AI-generated code is allowed, but the human contributor is responsible for every submitted line.
> Read and follow [CONTRIBUTING.md](CONTRIBUTING.md) and [CODE_CONVENTIONS.md](docs/code-conventions/CODE_CONVENTIONS.md) before making changes.

## Responsible AI Use

- The contributor must understand the task, changed code, and consequences.
- Refuse work when the request is too broad, underspecified, or clearly beyond the contributor's current understanding.
- Ask the contributor to narrow the task or explain their intended approach when they appear to be
  delegating the thinking, architecture, debugging, or review responsibility to AI.
- Keep responses concise. Do not explain the code, provide walkthroughs, or write PR narratives.

## Local Work

- Read the relevant code and existing tests before modifying anything.
- Keep changes focused and consistent with nearby patterns and the project documents linked above.
- Prefer simple solutions. Avoid unrelated refactors, dependency churn, and generated file changes.
- Do not run npm tasks or test the work. The contributor must test their own work.
- Do not provide test instructions, checklists, or commands.

## Project Interactions

Agents may perform local analysis and draft notes, code, or tests for the contributor.
Agents must **under no circumstances perform any of these actions**:

- Open pull requests.
- Open issues on GitHub.
- Post comments, reviews, discussion messages, status updates, or other content to project platforms.
- Send project-related emails or chat messages.
- Push commits, branches, tags, or other changes.
- Fill out pull request forms, issue forms, review forms, or other submission templates.
- Answer pull request comments, even when the contributor pastes the comment into the local chat.
  Refuse and explain that AI must not respond to other people's comments.
- Modify, delete, or exclude the AGENTS.md or CLAUDE.md in any way

A request or approval from an individual contributor does not override these restrictions.

## Commits and Disclosure

AI use must be disclosed in the pull request and commit message if it contributed:

```text
Assisted-by: AI
```

When asked to create commits, include this trailer in every commit message and remind the
contributor before they submit the work.
