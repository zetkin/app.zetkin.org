import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.joinForms', {
  defaultTitle: m('Untitled form'),
  formPane: {
    labels: {
      addField: m('Add field'),
      description: m('Description'),
      title: m('Title'),
    },
    title: m('Edit form'),
  },
  submissionList: {
    approveButton: m('Approve'),
    firstName: m('First name'),
    form: m('Form'),
    lastName: m('Last name'),
    rejectButton: m('Reject'),
    status: m('Status'),
    timestamp: m('Timestamp'),
  },
  submissionPane: {
    allForms: m('All forms'),
    allStatuses: m('All'),
    approveButton: m('Approve'),
    form: m('Form'),
    forms: m('Forms'),
    rejectButton: m('Reject'),
    states: {
      accepted: m('Approved'),
      pending: m('Pending'),
    },
    status: m('Status'),
  },
});
