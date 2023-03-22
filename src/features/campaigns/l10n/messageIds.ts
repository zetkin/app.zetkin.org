import { ReactElement } from 'react';

import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.campaigns', {
  activitiesOverview: {
    button: m('Browse all activities'),
    empty: m('Nothing on this day'),
    endsTomorrow: m('ends tomorrow'),
    extraActivities: m<{ numExtra: number }>('+ {numExtra} more'),
    goToActivities: m('See all upcoming activities.'),
    noActivities: m('There are no activities this week.'),
    nothingTomorrow: m('Nothing planned for tomorrow'),
    startsTomorrow: m('starts tomorrow'),
    subtitles: {
      endsLater: m<{ relative: ReactElement }>('Ends {relative}'),
      endsToday: m('Ends today'),
      startsLater: m<{ relative: ReactElement }>('Starts {relative}'),
      startsToday: m('Starts today'),
    },
    thisWeekCard: m('Also this week'),
    title: m('Activities'),
    todayCard: m('Today'),
    tomorrowCard: m('Tomorrow'),
  },
  all: {
    cardCTA: m('Go to project'),
    create: m('Create new project'),
    filter: {
      calls: m('Call assignments'),
      canvasses: m('Canvass assignments'),
      filter: m('Filter results'),
      standalones: m('Standalone events'),
      surveys: m('Surveys'),
    },
    heading: m('Current projects'),
    indefinite: m('Indefinite'),
    unsorted: m('Unsorted projects'),
    upcoming: m<{ numEvents: number }>('{numEvents, number} upcoming events.'),
  },
  allProjects: {
    archiveLink: m('View archives'),
    linkToSummary: m('Go to my active projects.'),
    noActivities: m("Your organization doesn't have any activities."),
    noArchivedActivities: m(
      'If your organization has any archived activities they will show up here.'
    ),
  },
  assigneeActions: m('Assignee actions'),
  calendarView: m('See all in calendar'),
  events: m('Events'),
  feedback: {
    copy: m(
      'Collecting feedback (during phonebanks or standalone) can help you work more efficiently'
    ),
    create: m('Create survey'),
    heading: m('Feedback and Surveys (none configured)'),
  },
  form: {
    createCallAssignment: {
      newCallAssignment: m('My call assignment'),
    },
    createCampaign: {
      create: m('Create project'),
      error: m('There was an error creating the project'),
      newCampaign: m('My project'),
    },
    createSurvey: {
      newSurvey: m('My survey'),
    },
    createTask: {
      title: m('Create task'),
    },
    deleteCampaign: {
      cancel: m('Cancel'),
      error: m('There was an error deleting the project'),
      submitButton: m('Confirm deletion'),
      title: m('Delete project'),
      warning: m(
        'Are you sure you want to delete this campiagn? This action is permanent.'
      ),
    },
    description: m('Description'),
    edit: m('Edit project'),
    editCampaignTitle: {
      error: m('Error updating project title'),
      success: m('Project title updated'),
    },
    manager: {
      label: m('Project manager'),
      selectSelf: m('Set yourself as manager'),
    },
    name: m('Name'),
    requestError: m('There was an error. Please try again.'),
    required: m('Required'),
    status: {
      draft: m('Draft'),
      heading: m('Status'),
      published: m('Published'),
    },
    visibility: {
      heading: m('Visibility'),
      private: m('Private'),
      public: m('Public'),
    },
  },
  indefinite: m('Indefinite timeline'),
  layout: {
    allActivities: m('All activities'),
    allCampaigns: m('All Projects'),
    archive: m('Archive'),
    calendar: m('Calendar'),
    campaignActivities: m('Activites'),
    insights: m('Insights'),
    overview: m('Overview'),
  },
  linkGroup: {
    createActivity: m('Create activity'),
    createCallAssignment: m('Create call assignment'),
    createSurvey: m('Create survey'),
    createTask: m('Create task'),
    public: m('Public Page'),
    settings: m('Edit Settings'),
  },
  mobilization: {
    copy: m(
      'Organizing a phone bank to mobilize your organization will increase participation manifold'
    ),
    create: m('Create call assignment'),
    heading: m('Mobilization and outreach (none configured)'),
  },
  noManager: m('No Project Manager'),
  singleProject: {
    archiveLink: m('View archives'),
    filterActivities: m('Type to filter'),
    noActivities: m('There are no activities in this project yet.'),
    noSearchResults: m('Your filtering yielded no results.'),
  },
  taskLayout: {
    tabs: {
      assignees: m('Assignees'),
      insights: m('Insights'),
      summary: m('Summary'),
    },
  },
  tasks: m('Tasks'),
});
