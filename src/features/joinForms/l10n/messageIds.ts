import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.joinForms', {
  defaultTitle: m('Untitled form'),
  embedding: {
    copyLink: m('Copy embed URL'),
    formSubmitted: m('Form submitted'),
    linkCopied: m('Embed URL copied.'),
    openLink: m('Visit now'),
    submitButton: m('Submit'),
  },
  formPane: {
    labels: {
      addField: m('Add field'),
      description: m('Description'),
      title: m('Title'),
    },
    title: m('Edit form'),
  },
  forms: m('Forms'),
  states: {
    accepted: m('Approved'),
    pending: m('Pending'),
  },
  status: m('Status'),
  submissionList: {
    approveButton: m('Approve'),
    firstName: m('First name'),
    form: m('Form'),
    lastName: m('Last name'),
    noFilteringResults: m('Your filtering yielded no results.'),
    rejectButton: m('Reject'),
    timestamp: m('Timestamp'),
  },
  submissionPane: {
    allForms: m('All forms'),
    allStatuses: m('All'),
    approveButton: m('Approve'),
    form: m('Form'),
    rejectButton: m('Reject'),
  },
});
