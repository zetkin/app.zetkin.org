import { ReactElement } from 'react';

import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.tags', {
  dialog: {
    colorErrorText: m('Please enter a valid hex code'),
    colorLabel: m('Color'),
    createTitle: m('Create tag'),
    deleteButtonLabel: m('Delete'),
    deleteWarning: m(
      'Are you sure you want to delete this tag? Deleting a tag cannot be undone.'
    ),
    editTitle: m('Edit tag'),
    groupCreatePrompt: m<{ groupName: string }>('Add "{groupName}"'),
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
    addValue: m<{ tag: string }>('Add value for "{tag}"'),
    createNamedTag: m<{ name: ReactElement }>('Create tag: {name}'),
    createTag: m('New Tag'),
    groupTags: m('Group tags'),
    title: m('Tags'),
    ungroupedHeader: m('No group'),
    valueTagForm: {
      typeHint: m<{ type: string | null }>(
        '{type, select, text {Enter some text} other {Enter a value}} to go along with the tag.'
      ),
    },
  },
  tagsPage: {
    overviewTabLabel: m('Overview'),
    title: m('Tags'),
  },
});
