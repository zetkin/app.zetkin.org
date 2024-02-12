import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.emails', {
  editor: {
    settings: {
      tabs: {
        content: m('Content'),
      },
    },
    tools: {
      button: {
        block: {
          noButtonText: m('Click to change this text!'),
        },
        settings: {
          invalidUrl: m('This is not a valid url'),
          testLink: m('Click to test link'),
          urlLabel: m('Link url'),
        },
        title: m('Button'),
      },
      libraryImage: {
        changeImage: m('Change image'),
        title: m('Image'),
      },
      link: {
        addUrl: m('Add a url'),
        invalidUrl: m('This is not a valid url'),
        testLink: m('Click to test link'),
        title: m('Link'),
      },
      paragraph: {
        invalidUrls: m(
          'There are one or more invalid URLs in this text block.'
        ),
        title: m('Text'),
      },
    },
  },
  emailActionButtons: {
    afterLock: m<{ numTargets: number }>(
      'Will schedule email for {numTargets} people'
    ),
    beforeLock: m('Lock targeting to proceed'),
    delete: m('Delete'),
    delevery: m('Delivery'),
    deliveryDate: m('Delivery date'),
    deliveryTime: m('Delivery time'),
    duplicate: m('Duplicate'),
    lockDesc: m(
      'Make sure the current exact targeting will be used during delivery'
    ),
    lockTarget: m('Lock targeting'),
    schedule: m('Schedule'),
    sendAnyway: m('Send anyway'),
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
    warning: m(
      'Are you sure you want to delete this email? This action is permanent and cannot be undone.'
    ),
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
  wasSent: m<{ time: string }>('Was sent at {time}'),
  willSend: m<{ time: string }>('Will send at {time}'),
});
