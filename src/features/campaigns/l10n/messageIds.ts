import { ReactElement } from 'react';

import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.campaigns', {
  activitiesCard: {
    button: m('Browse activities'),
    endsTomorrow: m('ends tomorrow'),
    extraActivities: m<{ numExtra: number }>('+ {numExtra} more'),
    noActivities: m('There are no activities in this campaign yet'),
    nothingToday: m('Nothing more to do today'),
    nothingTomorrow: m('Nothing planned for tomorrow'),
    startsTomorrow: m('starts tomorrow'),
    subtitles: {
      endsLater: m<{ relative: ReactElement }>('Ends {relative}'),
      endsToday: m('Ends today'),
      startsLater: m<{ relative: ReactElement }>('Starts {relative}'),
      startsToday: m('Starts today'),
    },
    thisWeekCard: m('Also this week'),
    title: m('Campaign activities'),
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
    linkToSummary: m('Go to my active projects.'),
    noActivities: m(
      'If your organization has activities that do not belong to a project they will show up here.'
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
    createCampaign: {
      create: m('Create project'),
      error: m('There was an error creating the project'),
      newCampaign: m('My project'),
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
    activities: m('Activities'),
    allCampaigns: m('All Projects'),
    archive: m('Archive'),
    calendar: m('Calendar'),
    insights: m('Insights'),
    overview: m('Overview'),
  },
  linkGroup: {
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
