import { ReactElement } from 'react';

import { im, m, makeMessages } from 'core/i18n';

export default makeMessages('feat.sruveys', {
  addBlocks: {
    choiceQuestionButton: m('Choice question'),
    openQuestionButton: m('Open question'),
    textButton: m('Text'),
    title: m('Choose a block type to add more content to your survey'),
  },
  blocks: {
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
  layout: {
    actions: {
      publish: m('Publish survey'),
      unpublish: m('Unpublish survey'),
    },
    stats: {
      questions: im<{ numQuestions: number }>(
        '{numQuestions, plural, one {1 question} other {# questions}}'
      ),
      submissions: im<{ numSubmissions: number }>(
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
      im<{ date: ReactElement; person: ReactElement }>('{person} {date}'),
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
});
