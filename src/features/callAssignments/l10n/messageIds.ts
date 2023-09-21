import { ReactElement } from 'react';
import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.callAssignments', {
  actions: {
    end: m('End assignment'),
    start: m('Start assignment'),
  },
  blocked: {
    callBackLater: m('Asked us to call back later'),
    calledTooRecently: m('Called too recently'),
    cooldownHelperText: m(
      'Set the minimum time between attempts to reach a target'
    ),
    cooldownLabel: m('Cooldown time in hours'),
    hours: m<{ cooldown: number }>(
      '{cooldown, plural, =0 {None} =1 {# hour} other {# hours}}'
    ),
    missingPhoneNumber: m('Missing phone number'),
    organizerActionNeeded: m('Organizer action needed'),
    subtitle: m('Targets not ready to be called'),
    title: m('Blocked'),
    viewSheetButton: m('View sheet'),
  },
  callers: {
    actions: {
      customize: m('Customize queue'),
      remove: m('Remove from assignment'),
    },
    add: {
      alreadyAdded: m('Already added'),
      placeholder: m('Add caller'),
    },
    customize: {
      exclude: {
        h: m('Excluded tags'),
        intro: m('Never call targets with these tags.'),
      },
      prioritize: {
        h: m('Prioritized tags'),
        intro: m('First call targets with these tags.'),
      },
      title: m<{ name: string }>('Customize Queue for {name}'),
    },
    customizeButton: m('Customize'),
    excludedTagsColumn: m('Excluded tags'),
    nameColumn: m('Name'),
    prioritizedTagsColumn: m('Prioritized tags'),
    searchBox: m('Search'),
    title: m('Callers'),
  },
  conversation: {
    instructions: {
      confirm: m(
        'Do you want to delete all unsaved changes and go back to saved instructions?'
      ),
      editorPlaceholder: m('Add instructions for your callers'),
      revertLink: m('Revert to saved version?'),
      saveButton: m('Save'),
      savedMessage: m('Everything is up to date!'),
      savingButton: m('Saving...'),
      title: m('Caller instructions'),
      unsavedMessage: m('You have unsaved changes.'),
    },
    settings: {
      notes: {
        message: m(
          'Disabling caller notes may increase the call rate but could lead to important information being lost.'
        ),
        title: m('Allow caller to make notes'),
      },
      targetData: {
        message: m(
          'Target name and phone number are always visible to callers. Enabling additional target data will share all person fields with callers.'
        ),
        title: m('Show additional target data'),
      },
      title: m('Conversation settings'),
    },
  },
  done: {
    defineButton: m('Edit done criteria'),
    subtitle: m('Targets that meet the done criteria'),
    title: m('Done'),
  },
  insightsHeader: m('Calls and conversations'),
  organizerActionPane: {
    markAsSolved: m('Mark as solved'),
    markAsUnsolved: m('Mark as unsolved'),
    messagePlaceholder: m('Caller did not leave a message'),
    noteByCaller: m<{ person: ReactElement; time: ReactElement }>(
      'Note by {person} {time}'
    ),
    subtitle: m<{ person: ReactElement }>('Notes on {person}'),
    title: m('Organizer Action Needed'),
  },
  ready: {
    allocated: m('Targets allocated to caller'),
    queue: m('Targets in queue'),
    subtitle: m('Targets to be called'),
    title: m('Ready'),
  },
  state: {
    active: m('Active'),
    closed: m('Closed'),
    draft: m('Draft'),
    open: m('Open'),
    scheduled: m('Scheduled'),
  },
  stats: {
    callers: m<{ numCallers: number }>(
      '{numCallers, plural, =0 {No callers} one {1 caller} other {# callers}}'
    ),
    targets: m<{ numTargets: number }>(
      '{numTargets, plural, =0 {No targets} one {1 targets} other {# targets}}'
    ),
  },
  statusSectionTitle: m('Status'),
  tabs: {
    callers: m('Callers'),
    conversation: m('Conversation'),
    insights: m('Insights'),
    overview: m('Overview'),
  },
  targets: {
    defineButton: m('Define target group'),
    editButton: m('Edit target group'),
    subtitle: m('Use smart search to define target group for this assignment.'),
    title: m('Targets'),
  },
});
