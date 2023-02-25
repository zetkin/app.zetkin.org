import { ReactElement } from 'react';
import { im, m, makeMessages } from 'core/i18n';

export default makeMessages('zui.timeline', {
  addNotePlaceholder: m('Enter text to leave a note'),
  email: {
    headers: {
      cc: m('CC'),
      from: m('From'),
      to: m('To'),
    },
  },
  expand: m('show full timeline'),
  filter: {
    byType: {
      all: m('All'),
      files: m('Files'),
      journey: m('Journey'),
      milestones: m('Milestones'),
      notes: m('Notes'),
      people: m('People'),
      tags: m('Tags'),
    },
    filterSelectLabel: im<{ filter: ReactElement }>('Show: {filter}'),
    warning: m(
      'The timeline is being filtered. Click here to remove the filter.'
    ),
  },
  updates: {
    any: {
      addtags: im<{ actor: ReactElement; count: number }>(
        '{actor} added {count, plural, =1 {a tag} other {# tags}}'
      ),
      removetags: im<{ actor: ReactElement; count: number }>(
        '{actor} removed {count, plural, =1 {a tag} other {# tags}}'
      ),
    },
    journeyinstance: {
      addassignee: im<{ actor: ReactElement; assignee: ReactElement }>(
        '{actor} assigned {assignee}'
      ),
      addnote: im<{ actor: ReactElement }>('{actor} added a note'),
      addsubject: im<{ actor: ReactElement; subject: ReactElement }>(
        '{actor} added {subject}'
      ),
      close: {
        header: im<{ actor: ReactElement }>('{actor} closed the journey'),
      },
      convert: im<{ actor: ReactElement; newLabel: string; oldLabel: string }>(
        '{actor} converted from {oldLabel} to {newLabel}'
      ),
      create: {
        header: im<{ actor: ReactElement }>('{actor} started a new journey'),
      },
      open: im<{ actor: ReactElement }>('{actor} opened the journey again'),
      removeassignee: im<{ actor: ReactElement; assignee: ReactElement }>(
        '{actor} unassigned {assignee}'
      ),
      removesubject: im<{ actor: ReactElement; subject: ReactElement }>(
        '{actor} removed {subject}'
      ),
      update: {
        readMore: m('Read more'),
        summary: im<{ actor: ReactElement }>('{actor} edited the summary'),
        title: im<{ actor: ReactElement }>('{actor} edited the title'),
      },
      updatemilestone: {
        complete: im<{ actor: ReactElement }>('{actor} completed a milestone'),
        deadline: im<{ actor: ReactElement }>(
          '{actor} updated a milestone deadline'
        ),
        deadlineRemove: m('deadline was removed'),
        deadlineUpdate: im<{ datetime: ReactElement }>('now due {datetime}'),
        incomplete: im<{ actor: ReactElement }>(
          '{actor} marked a milestone as incomplete'
        ),
      },
    },
  },
});
