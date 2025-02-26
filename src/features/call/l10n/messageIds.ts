import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.call', {
  instructions: {
    title: m('Instructions'),
  },
  nav: {
    backToHome: m('Back to home'),
    startCalling: m('Start calling'),
  },
  stats: {
    callsMade: m('calls made'),
    callsReached: m('successful calls'),
    targetMatches: m('people in target group'),
  },
});
