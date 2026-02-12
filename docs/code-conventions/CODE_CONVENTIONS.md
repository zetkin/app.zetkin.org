# CODE CONVENTIONS

This directory contains the project's agreed coding conventions. It serves as a practical reference for consistent, readable, and maintainable code across the codebase.

## Contents

### Current Rules

- [`EQUALITY_OPERATOR.md`](./rules/EQUALITY_OPERATOR.md)
- [`IMPORT_PATHS.md`](./rules/IMPORT_PATHS.md)
- [`NULL_AND_TRUTHY_CHECKS.md`](./rules/NULL_AND_TRUTHY_CHECKS.md)
- [`TEMPLATE.md`](./TEMPLATE.md) (for creating new rule files)

### In This Document

- [`Reasoning`](#reasoning)
- [`Contribution`](#contribution)

## Reasoning

This documentation is a living source of truth for binding coding conventions. It provides a clear baseline for implementation decisions and review discussions.

If you disagree with an existing rule or think a rule is missing, open a pull request, actively own the proposal, and follow the process in [`Contribution`](#contribution).

This is work in progress and intentionally iterative. It does not claim to be complete at any stage.

## Contribution

Pull requests are welcome for new rules and changes to existing rules.

- Open changes as **DRAFT PRs**.
- The PR author owns the process end to end:
  - Actively drive the discussion.
  - Provide a clear description of the proposal.
  - Address feedback and open concerns.
  - Push the proposal to a clear decision.
- Start code and linter implementation only after alignment is reached to avoid unnecessary work.
- Convention updates, code changes, and linter updates must be delivered in the same PR.
- The PR leaves **DRAFT** status only when the agreed convention is fully implemented in code and tooling in that same PR.
