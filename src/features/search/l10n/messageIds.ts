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
    project: m('Project'),
  },
  showOnly: {
    callassignment: m('Only show call assignments'),
    campaign: m('Only show projects'),
    journeyinstance: m('Only show journeys'),
    person: m('Only show people'),
    survey: m('Only show surveys'),
    task: m('Only show tasks'),
    view: m('Only show lists'),
  },
});
