import { ReactElement } from 'react';

import { m, makeMessages } from 'core/i18n/messages';

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
  fileUploadErrorMessage: m('Unable to add note. It might be too long'),
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
    filterSelectLabel: m<{ filter: ReactElement<any> }>('Show: {filter}'),
    warning: m(
      'The timeline is being filtered. Click here to remove the filter.'
    ),
  },
  updates: {
    any: {
      addtags: m<{ actor: ReactElement<any>; count: number }>(
        '{actor} added {count, plural, =1 {a tag} other {# tags}}'
      ),
      removetags: m<{ actor: ReactElement<any>; count: number }>(
        '{actor} removed {count, plural, =1 {a tag} other {# tags}}'
      ),
    },
    journeyinstance: {
      addassignee: m<{ actor: ReactElement<any>; assignee: ReactElement<any> }>(
        '{actor} assigned {assignee}'
      ),
      addnote: m<{ actor: ReactElement<any> }>('{actor} added a note'),
      addsubject: m<{ actor: ReactElement<any>; subject: ReactElement<any> }>(
        '{actor} added {subject}'
      ),
      close: {
        header: m<{ actor: ReactElement<any> }>('{actor} closed the journey'),
      },
      convert: m<{ actor: ReactElement<any>; newLabel: string; oldLabel: string }>(
        '{actor} converted from {oldLabel} to {newLabel}'
      ),
      create: {
        header: m<{ actor: ReactElement<any> }>('{actor} started a new journey'),
      },
      open: m<{ actor: ReactElement<any> }>('{actor} opened the journey again'),
      removeassignee: m<{ actor: ReactElement<any>; assignee: ReactElement<any> }>(
        '{actor} unassigned {assignee}'
      ),
      removesubject: m<{ actor: ReactElement<any>; subject: ReactElement<any> }>(
        '{actor} removed {subject}'
      ),
      update: {
        readMore: m('Read more'),
        summary: m<{ actor: ReactElement<any> }>('{actor} edited the summary'),
        title: m<{ actor: ReactElement<any> }>('{actor} edited the title'),
      },
      updatemilestone: {
        complete: m<{ actor: ReactElement<any> }>('{actor} completed a milestone'),
        deadline: m<{ actor: ReactElement<any> }>(
          '{actor} updated a milestone deadline'
        ),
        deadlineRemove: m('deadline was removed'),
        deadlineUpdate: m<{ datetime: ReactElement<any> }>('now due {datetime}'),
        incomplete: m<{ actor: ReactElement<any> }>(
          '{actor} marked a milestone as incomplete'
        ),
      },
    },
  },
});
