import { ReactElement } from 'react';

import { m, makeMessages } from 'core/i18n/messages';

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
    wasSent: m<{ datetime: ReactElement }>('Was sent at {datetime}'),
    willSend: m<{ datetime: ReactElement }>('Will send at {datetime}'),
  },
  editor: {
    readOnlyModeInfo: m(
      'This email is in read-only mode because it is scheduled for delivery, or has already been sent. If it is scheduled for delivery and you want to make changes, you need to cancel the delivery first.'
    ),
    settings: {
      tabs: {
        content: m('Content'),
        preview: {
          confirmation: m('A preview has been sent to your email address.'),
          instructions: m(
            'Here you can send this email to yourself to preview what it will look like for the recipients. '
          ),
          okButton: m('OK!'),
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
  emailFeatureIsBlocked: {
    errorMessage: m(
      'Your organization does not have access to the email feature at the moment.'
    ),
    goBackButton: m('Go back'),
  },
  insights: {
    clicked: {
      description: m(
        'Click rate is the percentage of recipients who not only opened the email but also clicked one of the links. A high rate is an indicator of a well-targeted email with convincing copy.'
      ),
      gauge: {
        header: m('Click rate'),
      },
      header: m('Clicked'),
    },
    opened: {
      chart: {
        afterSend: m('After it was sent'),
        opened: m<{ count: number }>('{count} opened'),
        spans: {
          allTime: m('All time'),
          first24: m('First 24 hours'),
          first48: m('First 48 hours'),
          firstMonth: m('First month'),
          firstWeek: m('First week'),
        },
      },
      description: m(
        'Open rate is the percentage of recipients who opened the email. A high rate is an indicator of good targeting and a compelling subject line.'
      ),
      gauge: {
        header: m('Open rate'),
      },
      header: m('Opened'),
    },
  },
  ready: {
    loading: m('Loading...'),
    lockButton: m('Lock for delivery'),
    lockDescription: m('Lock to enable email delivery'),
    locked: m('Locked'),
    scheduledDescription: m(
      'This email is scheduled for delivery. If you want to unlock the targets, cancel the delivery first.'
    ),
    sentSubtitle: m('Targets that were available for delivery'),
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
    insights: m('Insights'),
    overview: m('Overview'),
  },
  targets: {
    defineButton: m('Define target group'),
    editButton: m('Edit target group'),
    locked: m('Targets are locked for delivery'),
    sentSubtitle: m(
      'You can look at the Smart Search that was used to define the recipients of this email'
    ),
    subtitle: m('Use Smart Search to define the recipients of this email.'),
    title: m('Targets'),
    viewButton: m('View target group'),
  },
  unsubscribePage: {
    consent: m('I understand'),
    h: m<{ org: string }>('Unsubscribe from {org}'),
    info: m(
      'After you unsubscribe you will no longer receive mass email from this organization. You may still receive reminders and other email sent specifically to you as part of work you do in the organization.'
    ),
    unsubButton: m('Unsubscribe me'),
  },
  unsubscribedPage: {
    h: m('Unsubscribed!'),
    info: m<{ org: string }>(
      'You have been unsubscribed from mass email from {org}.'
    ),
  },
  varDefaults: {
    target: m('reader'),
  },
});
