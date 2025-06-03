import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.call', {
  activeEvents: {
    alreadyBooked: m<{ name: string }>('{name} is already booked'),
    noBookings: m<{ name: string }>('{name} has no bookings'),
    signUp: m('Sign Up'),
    undoSignUp: m('Undo Sign Up'),
  },
  instructions: {
    title: m('Instructions'),
  },
  nav: {
    backToHome: m('Back to home'),
    startCalling: m('Start calling'),
  },
  prepare: {
    activeEvents: m('Active events'),
    edit: m('Edit this information?'),
    editDescription: m(
      'If something in this tab needs changing, write a message to the organizer in the report after finishing the call.'
    ),
    noActiveEvents: m('No active events.'),
    noPreviousCalls: m('Never called'),
    noPreviousEvents: m<{ name: string }>(
      '{name} never participated in any events.'
    ),
    noSurveys: m('No surveys'),
    noTags: m('No tags'),
    previousCalls: m('There are previous calls.'),
    previousCallsOfTarget: m<{ name: string }>('Previous calls to {name}.'),
    previousEvents: m('Previous events'),
    previousEventsOfTarget: m<{
      eventTitle: string;
      name: string;
      numEvents: number;
    }>(
      '{name} participated in {numEvents} events, the most recent being {eventTitle} .'
    ),
    summary: m('Summary'),
    surveys: m('Surveys'),
    tags: m('Tags'),
    title: m('Personal info'),
  },
  report: {
    steps: {
      callBack: {
        question: {
          afterSpecificHourOptionLabel: m<{ hour: string }>('After {hour}'),
          anyTimeOptionLabel: m('Any time of day'),
          callBackButtonLabel: m<{ date: JSX.Element }>(
            'Call back after {date}'
          ),
          dateLabel: m('On what date'),
          examples: {
            nextWeek: m('Next week'),
            title: m('Shortcuts:'),
            today: m('Later today'),
            tomorrow: m('Tomorrow'),
          },
          invalidDateButtonLabel: m('Invalid date'),
          timeLabel: m('After what time'),
          title: m('When should we call back?'),
        },
        summary: {
          afterSpecificTime: m<{ time: JSX.Element }>('Call back after {time}'),
          anyTime: m<{ date: JSX.Element }>('We will call back after {date}'),
          subtitle: m<{ firstName: string }>(
            'In the meantime, {firstName} is automatically removed from the queue'
          ),
        },
      },
      callerLog: {
        question: {
          noteLabel: m('Add optional note'),
          saveWithNoteButton: m('Save with note'),
          saveWithoutNoteButton: m('Save without note'),
          shortcutHint: m(
            'When typing, press SHIFT + ENTER to save with note.'
          ),
          title: m('Do you wish to leave a note for future callers?'),
        },
        summary: {
          withNote: {
            subtitle: m<{ note: string }>(
              'Future callers will see your note: {note}'
            ),
            title: m('You wrote a note to future callers'),
          },
          withoutNote: m('You did not leave a note to future callers'),
        },
      },
      couldTalk: {
        question: {
          noButton: m('No, call back'),
          title: m<{ firstName: string }>('Could {firstName} talk?'),
          yesButton: m('Yes'),
        },
        summary: {
          couldNotTalk: {
            subtitle: m('Future callers will see that we had to call back'),
            title: m<{ firstName: string }>('{firstName} could not talk'),
          },
          couldTalk: {
            subtitle: m('Future callers will see that you were able to finish'),
            title: m<{ firstName: string }>('{firstName} could talk'),
          },
        },
      },
      failureReason: {
        question: {
          lineBusy: m('Busy'),
          noPickup: m('No pick up'),
          notAvailable: m('Not available right now'),
          title: m('Why not?'),
          wrongNumber: m('Wrong number'),
        },
        summary: {
          lineBusy: m<{ firstName: string }>('The line was busy'),
          noPickup: m<{ firstName: string }>('{firstName} did not pick up'),
          notAvailable: m<{ firstName: string }>(
            '{firstName} was not available to talk, we need to call back'
          ),
          wrongNumber: m<{ firstName: string }>(
            'We have the wrong number for {firstName}'
          ),
        },
      },
      leftMessage: {
        question: {
          noButton: m('No'),
          title: m('Did you leave a message on the answering machine?'),
          yesButton: m('Yes'),
        },
        summary: {
          didNotLeaveMessage: m('Did not leave message on answering machine'),
          leftMessage: {
            subtitle: m('Future callers will see that you left a message'),
            title: m('Left message on answering machine'),
          },
        },
      },
      organizerAction: {
        question: {
          noButton: m('No'),
          title: m(
            'Did anything happen during the call that requires action by an organizer?'
          ),
          yesButton: m('Yes'),
        },
        summary: {
          orgActionNeeded: {
            subtitle: m('An organizer will be notified'),
            title: m('You want an organizer to take a look at this call'),
          },
          orgActionNotNeeded: m('No action is neccessary'),
        },
      },
      organizerLog: {
        question: {
          messageLabel: m('Add optional message'),
          shortcutHint: m(
            'When typing, press SHIFT + ENTER to include message.'
          ),
          title: m('Explain the problem to the organizer'),
          withMessageButton: m('Include message'),
          withoutMessageButton: m('Save without message'),
          wrongNumberMessages: {
            altPhone: m<{ altPhone: string }>(
              'Alt phone number is wrong: {altPhone}'
            ),
            both: m<{ altPhone: string; phone: string }>(
              'Both phone numbers are wrong, {phone} and {altPhone}'
            ),
            phone: m<{ phone: string }>('Phone number is wrong: {phone}'),
          },
        },
        summary: {
          withMessage: {
            subtitle: m<{ message: string }>(
              'The organizers will see your message: {message}'
            ),
            title: m('You left a message to the organizers'),
          },
          withoutMessage: m('You did not leave a message to the organizers'),
        },
      },
      successOrFailure: {
        question: {
          noButton: m('No'),
          title: m<{ firstName: string }>('Did you reach {firstName}?'),
          yesButton: m('Yes'),
        },
        summary: {
          failure: {
            subtitle: m<{ firstName: string }>(
              'Future callers will see that you did not speak to {firstName}'
            ),
            title: m<{ firstName: string }>('We did not reach {firstName}'),
          },
          success: {
            subtitle: m<{ firstName: string }>(
              'Future callers will see that you spoke to {firstName}'
            ),
            title: m<{ firstName: string }>('{firstName} was reached'),
          },
        },
      },
      wrongNumber: {
        question: {
          bothButton: m('Both'),
          title: m('Which number is wrong?'),
        },
        summary: {
          phoneBoth: m<{ altPhone: string; phone: string }>(
            'Both numbers are wrong: {phone} and {altPhone}'
          ),
          phoneSingle: m<{ phone: string }>(
            'One phone number is wrong: {phone}'
          ),
        },
      },
    },
    summary: {
      editButtonLabel: m('Edit'),
    },
  },
  stats: {
    callsMade: m('calls made'),
    callsReached: m('successful calls'),
    targetMatches: m('people in target group'),
  },
});
