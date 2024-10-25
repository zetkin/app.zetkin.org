import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.organizations', {
  gen3: {
    description: m(
      'This is the new (generation 3) organizer web app. If you are used to the old one, you will find lots of new features and an improved user interface here. But if you want, you can still use the old organizer app for a while longer.'
    ),
    gen2Button: m('Go to the old interface'),
    title: m('Welcome to the new Zetkin!'),
  },
  notOrganizer: {
    description: m(
      'This part of Zetkin is only available to users who have been granted organizer access by another organization official. You do not currently have the sufficient level of access. If you believe that this is a mistake, please reach out to your local Zetkin officials or to Zetkin Foundation.'
    ),
    myPageButton: m('Go to activist portal'),
    title: m('You do not have organizer access'),
  },
  page: {
    title: m('Select organization:'),
  },
  sidebar: {
    allOrganizations: m('All organizations'),
    filter: {
      noResults: m('No organizations matching this filter'),
      topLevel: m('Top level organization'),
    },
    filtered: m('Filtered'),
    recent: {
      clear: m('Clear'),
      title: m('Recent organizations'),
    },
  },
});
