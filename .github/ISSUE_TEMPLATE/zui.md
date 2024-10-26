---
name: ZUI design system
about: Components for the ZUI design system library
title: '🧱 ZUI: '
labels: '🧱 ZUI'
assignees: ''
---

## Description

## Screenshots

## Figma link

You need to be logged into a Figma account to properly view the Figma content.

## Requirements

- [ ] Requirement 1

## Open questions

## Workflow

### Git

The main git branch for the work on the new design system is `undocumented/new-design-system`. Unless otherwise instructed, do your work on a new branch branched off from this branch.

Name your branch `issue-number/zui-name`, ex: `issue-928/zui-button` for a branch where work is done that is documented in the issue with number 928, where a button component is being made.

### Storybook

Use [Storybook](https://storybook.js.org/) to develop the new design system components. If you are not familiar with working with Storybook, please ask and Ziggi or someone else will be happy to introduce you!
When you have checked out the branch `undocumented/new-design-system` (and, as always when checking out a branch just to be sure, run `yarn install`), run `yarn storybook` in the terminal. This starts Storybook locally, and should open your browser to `localhost:6006` where you see all the components. Note that you want to only look at the ones under the "New design system" headline.

### Files

Create a folder in `src/zui/newDesignSystem` and give it a name for your component, like `ZUIButton`. Inside that folder, create one file `index.tsx` (this is where you write your component) and one `index.stories.tsx` (this is where you write your Storybook stories). Look at the components in `src/zui/newDesignSystem` for inspiration/reference!
