import { m, makeMessages } from 'core/i18n/messages';

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
  scope: {
    // "Project: My project"
    label: m<{ title: string; type: string }>('{type}: {title}'),
    // Keys match SCOPE_TYPE
    types: {
      callassignment: m('Call assignment'),
      event: m('Event'),
      folder: m('Folder'),
      journey: m('Journey'),
      journeyinstance: m('Journey'),
      list: m('List'),
      person: m('Person'),
      project: m('Project'),
      survey: m('Survey'),
      task: m('Task'),
    },
    undo: m('Put back the scope'),
  },
  // Keys match SEARCH_DATA_TYPE, where a project is still called a campaign
  types: {
    callassignment: m('Call assignments'),
    campaign: m('Projects'),
    // Not a SEARCH_DATA_TYPE: the API cannot search events yet
    event: m('Events'),
    eventsUnavailable: m('Events cannot be searched yet'),
    journeyinstance: m('Journeys'),
    person: m('People'),
    survey: m('Surveys'),
    task: m('Tasks'),
    view: m('Lists'),
  },
});
