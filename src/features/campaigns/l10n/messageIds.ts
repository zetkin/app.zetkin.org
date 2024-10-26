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
      sentEarlier: m<{ relative: ReactElement }>('Was sent {relative}'),
      sentLater: m<{ relative: ReactElement }>('To be sent {relative}'),
      startsLater: m<{ relative: ReactElement }>('Starts {relative}'),
      startsToday: m('Starts today'),
    },
    thisWeekCard: m('Also this week'),
    title: m('Upcoming activities'),
    todayCard: m('Today'),
    tomorrowCard: m('Tomorrow'),
  },
  activityList: {
    eventItem: {
      contact: m('No contact person has been assigned'),
      locations: m<{ count: number }>('{count} locations'),
      reminders: m<{ numMissing: number }>(
        '{numMissing, plural, =1 {One participant} other {# participants}} have not yet received reminders'
      ),
      signups: m('There are pending signups'),
    },
  },
  all: {
    cardCTA: m('Go to project'),
    create: m('Create new project'),
    filter: {
      calls: m('Call assignments'),
      canvasses: m('Canvass assignments'),
      emails: m('Emails'),
      filter: m('Filter results'),
      standalones: m('Standalone events'),
      surveys: m('Surveys'),
    },
    heading: m('All projects'),
    indefinite: m('Indefinite'),
    unsorted: m('Unsorted projects'),
    upcoming: m<{ numEvents: number }>('{numEvents, number} upcoming events.'),
  },
  allProjects: {
    noActivities: m(
      'If your organization has activities that do not belong to a project they will show up here.'
    ),
    viewArchive: m('View archive'),
  },
  assigneeActions: m('Assignee actions'),
  calendarView: m('See all in calendar'),
  createButton: {
    createActivity: m('Create'),
    createCallAssignment: m('Call assignment'),
    createCanvassAssignment: m('Canvass assignment'),
    createEmail: m('Email'),
    createEvent: m('Event'),
    createSurvey: m('Survey'),
    createTask: m('Task'),
  },
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
    createEmail: {
      newEmail: m('Untitled email'),
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
        'Are you sure you want to delete this project? This action is permanent.'
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
    allCampaigns: m('All Projects & Activities'),
    archive: m('Archive'),
    calendar: m('Calendar'),
    insights: m('Insights'),
    overview: m('Overview'),
  },
  linkGroup: {
    createActivity: m('Create'),
    createCallAssignment: m('Call assignment'),
    createCanvassAssignment: m('Canvass assignment'),
    createEmail: m('Email'),
    createEvent: m('Event'),
    createSurvey: m('Survey'),
    createTask: m('Task'),
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
  shared: {
    cta: m('Go to project'),
    noActivities: m(
      'All ongoing activities shared with your organization will appear here.'
    ),
    noArchives: m(
      'All expired activities that have been shared with your organization will appear here.'
    ),
    title: m('Shared with us'),
  },
  sharedLayout: {
    alertMsg: m(
      'This project contains only activities shared from other organizations and you can view it but not change it.'
    ),
    subtitle: m<{ numOfActivities: number }>(
      '{numOfActivities, plural, =1 {1 activity} other {# activities}}'
    ),
    tabs: {
      activities: m('Activities'),
      archive: m('Archive'),
      overview: m('Overview'),
    },
    title: m('Shared with us'),
  },
  singleProject: {
    filterActivities: m('Type to filter'),
    noActivities: m('There are no activities in this project yet.'),
    noSearchResults: m('Your filtering yielded no results.'),
    showPublicPage: m('Show public sign-up page'),
    viewArchive: m('View archive'),
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
