import { ReactElement } from 'react';

import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.tasks', {
  assignees: {
    completedStates: {
      completed: m<{ time: ReactElement }>('Completed {time}'),
      ignored: m<{ time: ReactElement }>('Ignored {time}'),
      notCompleted: m('Not yet completed'),
    },
    links: {
      create: m('Create Smart Search'),
      edit: m('Edit Smart Search'),
      readOnly: m('View Smart Search'),
    },
    queryStates: {
      assigned: m(
        'This task has been assigned to all people that match the targeting Smart Search query.'
      ),
      editable: m(
        'When published, this task will be assigned to the people matching the targeting Smart Search query.'
      ),
      new: m(
        'This task will be targeted to people matching a Smart Search query. Before you can publish, you must create a target group using Smart Search.'
      ),
      published: m(
        'This task is currently being assigned to all that match the targeting Smart Search query...'
      ),
    },
    title: m<{ numPeople: number }>(
      'Assigned to {numPeople, plural, one {# person} other {# people}}'
    ),
  },
  common: {
    notSet: m('Not set'),
  },
  configs: {
    collectDemographics: {
      fields: {
        demographic: m('Data to request'),
        dempographicOptions: {
          city: m('City'),
          country: m('Country'),
          email: m('Email Address'),
          gender: m('Gender Identity'),
          streetAddress: m('Street Address'),
          zipCode: m('Postcode'),
        },
      },
      title: m('Collect Demographics Config'),
    },
    shareLink: {
      fields: {
        defaultMessage: m('Default message user will send'),
        url: m('URL to share'),
      },
      title: m('Share Link Config'),
    },
    visitLink: {
      fields: {
        url: m('URL to visit'),
      },
      title: m('Visit Link Config'),
    },
  },
  deleteTask: {
    cancel: m('Cancel'),
    error: m('There was an error deleting the task'),
    submitButton: m('Confirm deletion'),
    title: m('Delete task'),
    warning: m(
      'Are you sure you want to delete this task? This action is permanent and cannot be undone.'
    ),
  },
  editTask: {
    title: m('Edit task'),
  },
  form: {
    fields: {
      campaign: m('Campaign'),
      deadline: m('Completion Deadline'),
      expires: m('Expiration Date'),
      instructions: m('Instructions'),
      published: m('Publish Time'),
      reassignInterval: m('Reassign after completion'),
      reassignIntervalOptions: {
        days: m<{ days: number }>(
          '{days, plural, =1 {The next day} other {after # days}}'
        ),
        hours: m<{ hours: number }>(
          'After {hours, plural, =1 {one hour} other {# hours}}'
        ),
        noReassign: m('Never reassign'),
      },
      reassignLimit: m('Maximum number of (re)assigns:'),
      timeEstimate: m('Estimated time to complete'),
      timeEstimateOptions: {
        hoursAndMinutes: m<{ hours: number; minutes: number }>(
          '{hours, plural, =0{} one{# hour} other{# hours}} {minutes, plural, =0{} one {# minute} other {# minutes}}'
        ),
        lessThanOneMinute: m('Less than one minute'),
        noEstimate: m('No estimate'),
      },
      timeValidationErrors: {
        deadlineNotSecond: m(
          'This must be scheduled after the Published Date, and before the Expiry Date'
        ),
        expiresNotThird: m('This must be scheduled last'),
        publishedNotFirst: m('This must be scheduled first'),
      },
      title: m('Title'),
      type: m('Task Type'),
      types: {
        demographic: m('Collect Demographics'),
        offline: m('Offline'),
        share_link: m('Share Link'),
        visit_link: m('Visit Link'),
        watch_video: m('Watch Video'),
      },
    },
    invalidUrl: m('Please enter a valid URL'),
    requestError: m('There was an error. Please try again.'),
    required: m('Required'),
    title: m('Create new task'),
  },
  noTasksCreatePrompt: m('No tasks... Click here to create one.'),
  publishButton: {
    publish: m('Publish'),
    tooltip: {
      alreadyPublished: m('Already Published'),
      missingAssignees: m('Missing assignees'),
      missingFields: m('Missing required fields'),
      missingFieldsAndAssignees: m('Missing required fields and assignees'),
    },
  },
  publishTask: {
    cancel: m('Cancel'),
    submitButton: m('Publish task now'),
    title: m('Publish task'),
    warning: m(
      'Please confirm you are ready to publish this task. It will be sent to all assignees.'
    ),
  },
  showExpiredTasksPrompt: m('Show expired tasks...'),
  statuses: {
    active: m('Active'),
    closed: m('Closed'),
    draft: m('Draft'),
    expired: m('Expired'),
    scheduled: m('Scheduled'),
  },
  taskDetails: {
    deadlineTime: m('Deadline Time'),
    editButton: m('Edit'),
    expiresTime: m('Expires Time'),
    instructionsLabel: m('Instructions'),
    publishedTime: m('Publish Time'),
    reassignInterval: {
      label: m('Reassign interval'),
      value: m<{ value: number }>(
        'Reassigns {value, plural, =1{one hour} other{# hours}} after completion'
      ),
    },
    reassignLimit: {
      label: m('Reassign limit'),
      value: m<{ value: number }>(
        'Repeats at most {value, plural, =1{one time} other{# times}} per person'
      ),
    },
    statusLabel: m('Status'),
    timeEstimateLabel: m('Estimated time to complete'),
    title: m('Task Details'),
    titleLabel: m('Title'),
    typeLabel: m('Type'),
  },
  taskLayout: {
    tabs: {
      assignees: m('Assignees'),
      insights: m('Insights'),
      summary: m('Summary'),
    },
  },
  taskListItem: {
    relativeTimes: {
      active: m<{ time: ReactElement }>('Deadline {time}'),
      closed: m<{ time: ReactElement }>('Closed {time}'),
      expired: m<{ time: ReactElement }>('Expired {time}'),
      expires: m<{ time: ReactElement }>('Expires {time}'),
      indefinite: m<{ time: ReactElement }>('Published {time}'),
      scheduled: m<{ time: ReactElement }>('Will be published {time}'),
    },
  },
  taskPreview: {
    addImage: m('Add cover image'),
    sectionTitle: m('Preview'),
    timeEstimate: m<{ minutes: number }>(
      '{minutes, plural, =0 {Less than one minute} =1 {One minute} other {# minutes}}'
    ),
  },
  taskTypeDetails: {
    demographic: {
      title: m('Collect Demographics Settings'),
    },
    share_link: {
      title: m('Share Link Settings'),
    },
    visit_link: {
      title: m('Visit Link Settings'),
    },
  },
  types: {
    demographic: m('Collect Demographics'),
    offline: m('Offline'),
    share_link: m('Share Link'),
    visit_link: m('Visit Link'),
    watch_video: m('Watch Video'),
  },
});
