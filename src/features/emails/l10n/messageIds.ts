import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.emails', {
  emailActionButtons: {
    afterLock: m<{ numTargets: number }>(
      'Will schedule email for {numTargets} people'
    ),
    beforeLock: m('Lock targeting to proceed'),
    delevery: m('Delivery'),
    deliveryDate: m('Delivery date'),
    deliveryTime: m('Delivery time'),
    duplicate: m('Duplicate'),
    lockDesc: m(
      'Make sure the current exact targeting will be used during delivery'
    ),
    lockTarget: m('Lock targeting'),
    schedule: m('Schedule'),
    sendLater: m('Send later'),
    sendNow: {
      alert: {
        desc: m(
          'There may be a better time of day to send. Scheduled sending also give fellow organizers a chance to coordinate with your plans.'
        ),
        title: m('Sending right now might not be optimal'),
      },
      header: m('Send now'),
    },
    setDate: m('Set delivery date to proceed'),
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
    compose: m('Compose'),
    overview: m('Overview'),
  },
  targets: {
    defineButton: m('Define target group'),
    editButton: m('Edit target group'),
    locked: m('Targets are locked for delivery'),
    subtitle: m('Use smart search to define the recipients of this mail.'),
    title: m('Targets'),
    viewButton: m('View target group'),
  },
});
