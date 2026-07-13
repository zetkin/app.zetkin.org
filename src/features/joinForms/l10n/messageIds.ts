import { m, makeMessages } from 'core/i18n/messages';

export default makeMessages('feat.joinForms', {
  defaultTitle: m('Untitled form'),
  deleteJoinForm: {
    success: m<{ title: string }>('{title} was deleted'),
    title: m('Delete join form'),
    warning: m<{ title: string }>('Are you sure you want to delete "{title}"?'),
  },
  embedding: {
    copyLink: m('Copy embed URL'),
    delete: m('Delete'),
    formSubmitted: m('Form submitted'),
    linkCopied: m('Embed URL copied.'),
    openLink: m('Visit now'),
    submitButton: m('Submit'),
  },
  formPane: {
    labels: {
      addField: m('Add field'),
      description: m('Description'),
      requireEmailVerification: m('Require e-mail verification'),
      shareWithSuborgs: m('Share with sub-organizations'),
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
  submissionVerifiedPage: {
    h: m('Thank you!'),
    info: m<{ org: string }>(
      'Your submission has been verified and organizers in {org} will review it shortly.'
    ),
  },
  submitToken: {
    copySubmitToken: m('Copy submit token'),
    submitTokenCopied: m('Submit token copied.'),
  },
});
