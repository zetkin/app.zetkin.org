import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.home', {
  actions: {
    call: m('Start calling'),
    canvass: m('Start canvassing'),
    signUp: m('Sign up'),
    undoSignup: m('Undo signup'),
  },
  defaultTitles: {
    callAssignment: m('Untitled call assignment'),
    canvassAssignment: m('Untitled canvass assignment'),
    event: m('Untitled event'),
    noLocation: m('No physical location'),
  },
  tabs: {
    feed: m('All events'),
    home: m('My activities'),
  },
});
