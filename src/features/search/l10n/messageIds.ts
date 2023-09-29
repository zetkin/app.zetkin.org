import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.search', {
  error: m('There was an error'),
  label: m('Search'),
  noResults: m('No results'),
  placeholder: m('Type to search'),
  results: {
    callassignment: m('Call assignment'),
    people: m('People'),
    person: m('Person'),
    project: m('Project'),
    survey: m('Survey'),
    task: m('Task'),
    view: m('List'),
  },
});
