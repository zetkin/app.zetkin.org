import { ReactElement } from 'react';

import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.tags', {
  dialog: {
    colorErrorText: m('Please enter a valid hex code'),
    colorLabel: m('Color'),
    createTagButton: m('Create'),
    createTitle: m('Create tag'),
    deleteButtonLabel: m('Delete'),
    deleteWarning: m(
      'Are you sure you want to delete this tag? Deleting a tag cannot be undone.'
    ),
    editTitle: m('Edit tag'),
    groupCreatePrompt: m<{ groupName: string }>('Add "{groupName}"'),
    groupLabel: m('Group'),
    groupSelectPlaceholder: m('Type to search or create a group'),
    titleErrorText: m('Tag name is required'),
    titleLabel: m('Tag name'),
    typeLabel: m('Tag type'),
    types: {
      none: m('Basic (no values)'),
      text: m('Text values'),
    },
    updateTagButton: m('Update'),
  },
  editGroupDialog: {
    deleteButton: m('Delete group'),
    deleteTitle: m('Delete group'),
    deleteWarning: m(
      'Are you sure you want to delete this group? Deleting a group cannot be undone.'
    ),
    editButton: m('Edit'),
    editTitle: m('Edit group'),
    titleLabel: m('Group name'),
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
    createTagButton: m('Create'),
    noTags: m('Your organization does not have any tags yet'),
    overviewTabLabel: m('Overview'),
    title: m('Tags'),
    ungroupedHeader: m('No group'),
  },
});
