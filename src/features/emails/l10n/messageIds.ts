import { ReactElement } from 'react';

import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.emails', {
  blocked: {
    blacklisted: m('Blacklisted'),
    missingEmail: m('Missing email'),
    subtitle: m('Unavaliable targets.'),
    title: m('Blocked'),
    unsubscribed: m('Unsubscribed'),
  },
  deliveryProblems: {
    contentError: m(
      'There are problems in the content of your email. Go to the editor in the Compose tab and correct them.'
    ),
    empty: m('Your email is empty. Go to the Compose tab to add some content.'),
    noSubject: m(
      'Your email has no subject line. Go to Settings in the Compose tab to add one.'
    ),
    notTargeted: m(
      'Your email has no targets. Go to the Targets section in the Overview tab to create a Smart Search that defines your targets.'
    ),
    targetsNotLocked: m(
      'The targets are not locked. Go to the Ready section in the Overview tab to do this.'
    ),
  },
  deliveryStatus: {
    notLocked: m('Not locked, not scheduled'),
    notScheduled: m('Not scheduled'),
    wasSent: m<{ date: ReactElement; time: string }>(
      'Was sent at {time}, {date}'
    ),
    willSend: m<{ date: ReactElement; time: string }>(
      'Will send at {time}, {date}'
    ),
  },
  editor: {
    readOnlyModeInfo: m(
      'This email is in read-only mode since it is scheduled for delivery. If you want to edit the content you need to cancel the delivery first.'
    ),
    settings: {
      tabs: {
        content: m('Content'),
        preview: {
          instructions: m(
            'Here you can send this email to yourself to preview what it will look like for the recipients. '
          ),
          sendButton: m('Send'),
          sendTo: m('The email will be sent to this address:'),
          title: m('Preview'),
        },
        settings: {
          senderAddressInputLabel: m('Sender address'),
          senderNameInputLabel: m('Sender name'),
          subjectInputLabel: m('Subject'),
          title: m('Settings'),
        },
      },
    },
    tools: {
      button: {
        block: {
          noButtonText: m('Click to change this text!'),
        },
        settings: {
          invalidUrl: m('This is not a valid link'),
          testLink: m('Click to test link'),
          urlLabel: m('Link url'),
        },
        title: m('Button'),
      },
      header: {
        title: m('Header'),
      },
      libraryImage: {
        changeImage: m('Change image'),
        title: m('Image'),
      },
      link: {
        addUrl: m('Add a link'),
        invalidUrl: m('This is not a valid link'),
        testLink: m('Click to test link'),
        title: m('Link'),
      },
      paragraph: {
        invalidUrls: m(
          'There are one or more invalid link in this text block.'
        ),
        title: m('Text'),
      },
      variable: {
        title: m('Variable'),
      },
    },
  },
  emailActionButtons: {
    cancel: m('Cancel'),
    delete: m('Delete'),
    delivery: m('Delivery'),
    deliveryDate: m('Delivery date'),
    deliveryTime: m('Delivery time'),
    duplicate: m('Duplicate'),
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
  orgHasNoEmail: {
    errorMessage: m(
      'Your organization can not use the email feature since it does not have a registered email address.'
    ),
    goBackButton: m('Go back'),
  },
  ready: {
    loading: m('Loading...'),
    lockButton: m('Lock for delivery'),
    lockDescription: m('Lock to enable email delivery'),
    locked: m('Locked'),
    scheduledDescription: m(
      'This email is scheduled for delivery. If you want to unlock the targets, cancel the delivery first.'
    ),
    subtitle: m('Targets currently available for delivery'),
    title: m('Ready'),
    unlockButton: m('Unlock'),
    unlockDescription: m(
      'Proceed to delivery or unlock recipients to edit targeting. Unlocking may add or remove some targets depending on what results the Smart Search will produce.'
    ),
  },
  state: {
    draft: m('Draft'),
    scheduled: m('Scheduled'),
    sent: m('Sent'),
  },
  stats: {
    lockedTargets: m<{ numLocked: number }>(
      '{numLocked, plural, =0 {No locked targets} one {1 locked target} other {# locked targets}}'
    ),
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
    subtitle: m('Use Smart Search to define the recipients of this mail.'),
    title: m('Targets'),
    viewButton: m('View target group'),
  },
});
