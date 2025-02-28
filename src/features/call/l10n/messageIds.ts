import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.call', {
  instructions: {
    title: m('Instructions'),
  },
  nav: {
    backToHome: m('Back to home'),
    startCalling: m('Start calling'),
  },
  prepare: {
    activeCampaigns: m('Active campaigns'),
    arePreviousActivity: m<{
      actionTitle: string;
      activities: number;
      name: string;
    }>(
      '{name} participated in {activities} actions, the most recent being {actionTitle} {actionTime}.'
    ),
    arePreviousCalls: m('There are previous calls.'),
    edit: m('Edit this information?'),
    editDescription: m(
      'If something in this tab needs changing, write a message to the organizer in the report after finishing the call.'
    ),
    noActiveCampaigns: m('No active campaigns.'),
    noPreviousActivity: m<{ name: string }>(
      '{name} never participated in any actions.'
    ),
    noPreviousCalls: m('Never called'),
    noSurveys: m('No surveys'),
    noTags: m('No tags'),
    previousActivity: m('Previous activity'),
    previousCalls: m<{ name: string }>('Previous calls to {name}.'),
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
