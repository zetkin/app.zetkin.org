import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.organizations', {
  page: {
    title: m('Select organization:'),
  },
  sidebar: {
    allOrganizations: m('All organizations'),
    recent: {
      clear: m('Clear'),
      title: m('Recent organizations'),
    },
  },
});
