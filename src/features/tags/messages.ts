import { ReactElement } from 'react';

import { im, m, messages } from 'core/i18n';

export default messages('feat.tags', {
  dialog: {
    colorErrorText: m('Please enter a valid hex code'),
    colorLabel: m('Color'),
    createTitle: m('Create tag'),
    editTitle: m('Edit tag'),
    groupCreatePrompt: im<{ groupName: string }>('Add "{groupName}"'),
    groupLabel: m('Group'),
    groupSelectPlaceholder: m('Type to search or create a group'),
    submitCreateTagButton: m('Create and apply'),
    titleErrorText: m('Tag name is required'),
    titleLabel: m('Tag name'),
    typeLabel: m('Tag type'),
    types: {
      none: m('Basic (no values)'),
      text: m('Text values'),
    },
  },
  manager: {
    addTag: m('Add tag'),
    addValue: im<{ tag: string }>('Add value for "{tag}"'),
    createNamedTag: im<{ name: ReactElement }>('Create tag: {name}'),
    createTag: m('New Tag'),
    groupTags: m('Group tags!'),
    title: m('Tags'),
    ungroupedHeader: m('No group'),
    valueTagForm: {
      typeHint: im<{ type: string | null }>(
        '{type, select, text {Enter some text} other {Enter a value}} to go along with the tag.'
      ),
    },
  },
});
