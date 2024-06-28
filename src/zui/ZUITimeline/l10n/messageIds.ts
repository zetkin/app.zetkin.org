import { ReactElement } from 'react';

import { m, makeMessages } from 'core/i18n';

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
    filterSelectLabel: m<{ filter: ReactElement }>('Show: {filter}'),
    warning: m(
      'The timeline is being filtered. Click here to remove the filter.'
    ),
  },
  updates: {
    any: {
      addtags: m<{ actor: ReactElement; count: number }>(
        '{actor} added {count, plural, =1 {a tag} other {# tags}}'
      ),
      removetags: m<{ actor: ReactElement; count: number }>(
        '{actor} removed {count, plural, =1 {a tag} other {# tags}}'
      ),
    },
    journeyinstance: {
      addassignee: m<{ actor: ReactElement; assignee: ReactElement }>(
        '{actor} assigned {assignee}'
      ),
      addnote: m<{ actor: ReactElement }>('{actor} added a note'),
      addsubject: m<{ actor: ReactElement; subject: ReactElement }>(
        '{actor} added {subject}'
      ),
      close: {
        header: m<{ actor: ReactElement }>('{actor} closed the journey'),
      },
      convert: m<{ actor: ReactElement; newLabel: string; oldLabel: string }>(
        '{actor} converted from {oldLabel} to {newLabel}'
      ),
      create: {
        header: m<{ actor: ReactElement }>('{actor} started a new journey'),
      },
      open: m<{ actor: ReactElement }>('{actor} opened the journey again'),
      removeassignee: m<{ actor: ReactElement; assignee: ReactElement }>(
        '{actor} unassigned {assignee}'
      ),
      removesubject: m<{ actor: ReactElement; subject: ReactElement }>(
        '{actor} removed {subject}'
      ),
      update: {
        readMore: m('Read more'),
        summary: m<{ actor: ReactElement }>('{actor} edited the summary'),
        title: m<{ actor: ReactElement }>('{actor} edited the title'),
      },
      updatemilestone: {
        complete: m<{ actor: ReactElement }>('{actor} completed a milestone'),
        deadline: m<{ actor: ReactElement }>(
          '{actor} updated a milestone deadline'
        ),
        deadlineRemove: m('deadline was removed'),
        deadlineUpdate: m<{ datetime: ReactElement }>('now due {datetime}'),
        incomplete: m<{ actor: ReactElement }>(
          '{actor} marked a milestone as incomplete'
        ),
      },
    },
  },
});
