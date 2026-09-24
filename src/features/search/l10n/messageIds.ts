import { m, makeMessages } from 'core/i18n/messages';

export default makeMessages('feat.search', {
  error: m('There was an error'),
  // Headings for each group of results, which is why they are plural
  groups: {
    callassignment: m('Call assignments'),
    campaign: m('Projects'),
    journeyinstance: m('Journeys'),
    person: m('People'),
    survey: m('Surveys'),
    task: m('Tasks'),
    view: m('Lists'),
  },
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
  showMore: m('Show more'),
});
