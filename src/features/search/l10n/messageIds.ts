import { m, makeMessages } from 'core/i18n/messages';

export default makeMessages('feat.search', {
  error: m('There was an error'),
  label: m('Search'),
  noResults: m('No results'),
  placeholder: m('Type to search'),
  resultCount: {
    capped: m<{ count: number }>('{count}+ results'),
    exact: m<{ count: number }>(
      '{count, plural, one {# result} other {# results}}'
    ),
    showMore: m<{ count: number }>('Show {count, plural, other {# more}}'),
  },
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
