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
    timestamp: m('Timestamp'),
  },
});
