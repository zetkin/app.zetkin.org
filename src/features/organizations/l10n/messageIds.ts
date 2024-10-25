import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.organizations', {
  notOrganizer: {
    description: m(
      'This part of Zetkin is only available to users who have been granted organizer access my another organization official. You do not currently have the sufficient level of access. If you believe that this is a mistake, please reach out to your local Zetkin officials or to Zetkin Foundation.'
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
