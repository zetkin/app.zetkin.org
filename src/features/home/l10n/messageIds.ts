import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.home', {
  activityList: {
    actions: {
      call: m('Start calling'),
      canvass: m('Start canvassing'),
      signUp: m('Sign up'),
      undoSignup: m('Undo signup'),
    },
    needed: m('You are needed'),
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
