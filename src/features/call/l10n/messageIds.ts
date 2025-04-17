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
  stats: {
    callsMade: m('calls made'),
    callsReached: m('successful calls'),
    targetMatches: m('people in target group'),
  },
});
