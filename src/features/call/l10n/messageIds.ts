import { m, makeMessages } from 'core/i18n/messages';

export default makeMessages('feat.call', {
  about: {
    events: m<{ numEvents: number }>('{numEvents} events'),
    noParticipation: m<{ name: string }>(
      '{name} never participated in any events.'
    ),
    participation: m<{
      events: JSX.Element;
      name: string;
      titleAndTime: JSX.Element;
    }>('{name} participated in {events}, the most recent being {titleAndTime}'),
    previousActivityHeader: m('Previous activity'),
    tagsHeader: m('Tags'),
    title: m<{ name: string }>('About {name}'),
  },
  activities: {
    description: m<{ name: string }>('Acting as {name}'),
    filters: {
      basic: {
        alreadyIn: m('Already in'),
        events: m('Events'),
        surveys: m('Surveys'),
        thisCall: m('This call'),
      },
      events: {
        thisWeek: m('This week'),
        today: m('Today'),
        tomorrow: m('Tomorrow'),
      },
      organizations: {
        noSelected: m('Organizations'),
        selected: m<{ numOrgs: number }>(
          '{numOrgs, plural, =1{1 org} other{# orgs}}'
        ),
      },
      projects: m<{ numProjects: number }>(
        '{numProjects, plural, =0{Context} =1{1 project} other{# projects}}'
      ),
    },
    projects: {
      wihoutProjectLabel: m('No project'),
    },

    title: m('Activities'),
  },
  callLog: {
    openCallLogButton: m('Call log'),
    previousCall: {
      logNew: m('Log another call'),
    },
    searchLabel: m('Type to find'),
    title: m('Call log'),
    unfinishedCall: {
      abandon: m('Abandon'),
      switch: m('Switch to'),
    },
  },
  callingInfo: {
    title: m('How to call with Zetkin'),
    tutorial: {
      call: {
        description: m(
          'Depending on how you phonebank, you will either call using your regular phone or through the computer.'
        ),
        title: m('Make the phonecall'),
      },
      oldCalls: {
        description: m(
          'If you click the "Call log" button you can report a new call with a person you called before. It is particularly useful if someone calls you back.'
        ),
        title: m('Previous calls'),
      },
      personInfo: {
        description: m(
          "You will see the person's previous activities and details on the page."
        ),
        title: m('Get to know the person'),
      },
      report: {
        description: m(
          'After you have talked to the person you fill in the call report.'
        ),
        title: m('Report the call'),
      },
      start: {
        description: m(
          'You are about to start a calling. Read the assignment instructions and prepare. Then click "Call" to begin your first call.'
        ),
        title: m('Start calling'),
      },
    },
  },
  error: {
    description: m(
      'Try refreshing the page. If error persists - try logging out and then in again. If error still persists, contact support.'
    ),
    title: m('An unexpected error occured.'),
  },
  header: {
    primaryButton: {
      [0]: m('Call'),
      [1]: m('Finish & report'),
      [2]: m('Send report'),
      [3]: m('Next call'),
    },
    secondaryButton: {
      [0]: m('Quit'),
      [1]: m('Skip'),
      [2]: m('Skip'),
      [3]: m('Take a break'),
    },
  },
  instructions: {
    noInstructions: m('This assignment does not have any instructions.'),
    title: m('Instructions'),
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
    title: m('Report'),
  },
  skipCallDialog: {
    cancelButton: m('No, resume call'),
    confirmButton: m<{ name: string }>('Yes, skip {name}?'),
    title: m<{ name: string }>('Skip call with {name}?'),
  },
  stats: {
    callsMade: m('calls made'),
    description: m('This is how the assignment is going'),
    inTargetGroup: m('people in target group'),
    successful: m('successful'),
    successfulCalls: m('successful calls'),
    targets: m('targets'),
    title: m('Assignment stats'),
  },
  summary: {
    title: m('Woop woop!'),
    unfinishedCallsMessage: m(
      'But, before you move on: you have unfinished calls, deal with them!'
    ),
  },
  switchedAssignmentsAlert: {
    message: m<{ assignmentTitle: string }>(
      'Switched assignments. You are now calling in {assignmentTitle}'
    ),
  },
});
