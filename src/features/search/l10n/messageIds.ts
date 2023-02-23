import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.search', {
  error: m('There was an error'),
  label: m('Search'),
  noResults: m('No results'),
  placeholder: m('Type to search'),
  results: {
    campaign: m('Campaign'),
    people: m('People'),
    person: m('Person'),
    task: m('Task'),
    view: m('View'),
  },
});
