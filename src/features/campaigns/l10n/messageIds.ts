import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.campaigns', {
  all: {
    cardCTA: m('Go to campaign'),
    create: m('Create new campaign'),
    filter: {
      calls: m('Call assignments'),
      canvasses: m('Canvass assignments'),
      filter: m('Filter results'),
      standalones: m('Standalone events'),
      surveys: m('Surveys'),
    },
    heading: m('Current campaigns'),
    indefinite: m('Indefinite'),
    unsorted: m('Unsorted projects'),
    upcoming: m<{ numEvents: number }>('{numEvents, number} upcoming events.'),
  },
  assigneeActions: m('Assignee actions'),
  calendarView: m('See all in calendar'),
  campaignManager: m('Campaign Manager'),
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
      create: m('Create campaign'),
      error: m('There was an error creating the campaign'),
      newCampaign: m('My campaign'),
    },
    deleteCampaign: {
      cancel: m('Cancel'),
      error: m('There was an error deleting the campaign'),
      submitButton: m('Confirm deletion'),
      title: m('Delete campaign'),
      warning: m(
        'Are you sure you want to delete this campiagn? This action is permanent.'
      ),
    },
    description: m('Description'),
    edit: m('Edit campaign'),
    manager: {
      label: m('Campaign manager'),
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
    allCampaigns: m('All Campaigns'),
    archive: m('Archive'),
    calendar: m('Calendar'),
    insights: m('Insights'),
    summary: m('Summary'),
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
  noManager: m('No Campaign Manager'),
  taskLayout: {
    tabs: {
      assignees: m('Assignees'),
      insights: m('Insights'),
      summary: m('Summary'),
    },
  },
  tasks: m('Tasks'),
});
