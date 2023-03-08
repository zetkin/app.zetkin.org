import { ReactElement } from 'react';

import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.sruveys', {
  addBlocks: {
    choiceQuestionButton: m('Choice question'),
    openQuestionButton: m('Open question'),
    textButton: m('Text'),
    title: m('Choose a block type to add more content to your survey'),
  },
  blocks: {
    choice: {
      addOption: m('Add option'),
      description: m('Description'),
      emptyDescription: m('Description'),
      emptyOption: m('Empty option'),
      emptyQuestion: m('Title'),
      question: m('Question'),
      widget: m('Widget'),
      widgets: {
        checkbox: m('Multi-choice (checkboxes)'),
        radio: m('Single-choice (radio buttons)'),
        select: m('Single-choice (drop-down)'),
      },
    },
    open: {
      description: m('Description'),
      empty: m('Untitled open question'),
      fieldTypePreview: m('text field'),
      label: m('Title'),
      multiLine: m('Multi-line'),
      singleLine: m('Single-line'),
      textFieldType: m('Text field type'),
    },
    text: {
      content: m('Description'),
      empty: m('Untitled block'),
      header: m('Title'),
    },
  },
  chart: {
    header: m('Survey Submissions'),
    placeholder: m('Start collecting submissions to see progress here'),
    subheader: m<{ days: number }>(
      'Accumulated submissions over the last {days, plural, =1 {day} other {# days}}'
    ),
    tooltip: {
      submissions: m<{ count: number }>(
        '{count, plural, =1 {1 submission} other {# submissions}}'
      ),
    },
  },
  layout: {
    actions: {
      publish: m('Publish survey'),
      unpublish: m('Unpublish survey'),
    },
    stats: {
      questions: m<{ numQuestions: number }>(
        '{numQuestions, plural, one {1 question} other {# questions}}'
      ),
      submissions: m<{ numSubmissions: number }>(
        '{numSubmissions, plural, one {1 submission} other {# submissions}}'
      ),
    },
  },
  overview: {
    noQuestions: {
      button: m('Create questions'),
      title: m('There are no questions in this survey yet'),
    },
  },
  state: {
    draft: m('Draft'),
    published: m('Published'),
    scheduled: m('Scheduled'),
    unpublished: m('Unpublished'),
  },
  submissionPane: {
    anonymous: m('Anonymous'),
    subtitle:
      m<{ date: ReactElement; person: ReactElement }>('{person} {date}'),
  },
  submissions: {
    dateColumn: m('Date'),
    emailColumn: m('Email'),
    firstNameColumn: m('First name'),
    lastNameColumn: m('Last name'),
    personRecordColumn: m('Person record'),
  },
  tabs: {
    overview: m('Overview'),
    questions: m('Questions'),
    submissions: m('Submissions'),
  },
  urlCard: {
    nowAccepting: m('Now accepting submissions at this link'),
    open: m('Open for submissions'),
    preview: m('Preview survey'),
    previewPortal: m('Preview survey in activist portal'),
    visitPortal: m('Visit survey in activist portal'),
    willAccept: m('Will accept submissions at this link'),
  },
});
