import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.emails', {
  emailActionButtons: {
    delevery: m('Delivery'),
    duplicate: m('Duplicate'),
  },
  state: {
    draft: m('Draft'),
    scheduled: m('Scheduled'),
    sent: m('Sent'),
  },
  tabs: {
    design: m('Design'),
    overview: m('Overview'),
  },
});
