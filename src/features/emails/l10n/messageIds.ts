import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.emails', {
  emailActionButtons: {
    delevery: m('Delivery'),
    deliveryDate: m('Delivery date'),
    deliveryTime: m('Delivery time'),
    duplicate: m('Duplicate'),
    schedule: m('Schedule'),
    sendLater: m('Send later'),
    sendNow: m('Send now'),
    timeZone: m('Timezone'),
  },
  state: {
    draft: m('Draft'),
    scheduled: m('Scheduled'),
    sent: m('Sent'),
  },
  stats: {
    targets: m<{ numTargets: number }>(
      '{numTargets, plural, =0 {No targets} one {1 target} other {# targets}}'
    ),
  },
  tabs: {
    design: m('Design'),
    overview: m('Overview'),
  },
  targets: {
    title: m('Targets'),
  },
});
