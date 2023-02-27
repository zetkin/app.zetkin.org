import { ReactElement } from 'react';

import { im, m, makeMessages } from 'core/i18n';

export default makeMessages('feat.journeys', {
  instance: {
    addAssigneeButton: m('Add assignee'),
    addSubjectButton: m('Add person'),
    addSubjectLabel: m('Add person'),
    assignPersonLabel: m('Assign person'),
    closeButton: {
      dialog: {
        outcomeFieldPlaceholder: im<{ singularLabel: string }>(
          'Describe the outcome of the {singularLabel}'
        ),
        outcomeLabel: m('Outcome'),
        outcomeTagsDescription: m('Add any tags that describe the outcome.'),
        outcomeTagsLabel: m('Outcome tags'),
      },
      error: im<{ singularLabel: string }>(
        'There was an error closing the {singularLabel}'
      ),
      label: im<{ singularLabel: string }>('Close {singularLabel}'),
    },
    collapseButton: m('Collapse'),
    created: im<{ relative: ReactElement }>('Created {relative}'),
    deadlineLabel: im<{ date: ReactElement }>('(Was due {date})'),
    dueDateInputClear: m('Clear'),
    dueDateInputLabel: m('Due date'),
    editButton: m('Edit'),
    ellipsisMenu: {
      convert: m('Convert to...'),
    },
    expandButton: m('Expand'),
    markedCompleteLabel: im<{ relativeTime: ReactElement }>(
      'Marked complete {relativeTime}'
    ),
    newInstance: {
      draft: m('Draft'),
      openingNote: m('Opening note'),
      submitLabel: im<{ journey: string }>('Create new {journey}'),
      title: im<{ journey: string }>('New {journey}'),
    },
    noMilestones: m('There are no milestones.'),
    noOutcomeDetails: m('No outcome details provided.'),
    percentComplete: im<{ percentComplete: number }>(
      '{percentComplete}% complete'
    ),
    reopenButton: {
      error: im<{ singularLabel: string }>(
        'There was an error reopening the {singularLabel}'
      ),
      label: im<{ singularLabel: string }>('Reopen {singularLabel}'),
    },
    sections: {
      assigned: m('Assigned to'),
      members: m('Members'),
      milestones: m('Milestones'),
      outcome: im<{ journeyTitle: string }>('This {journeyTitle} is closed.'),
      summary: m('Summary'),
      timeline: m('Notes'),
    },
    summaryPlaceholder: im<{ journeyTitle: string }>(
      'Enter a brief description of the status of this {journeyTitle}.'
    ),
    updated: im<{ relative: ReactElement }>('last activity {relative}'),
  },
  instances: {
    columns: {
      assignees: m('Assigned'),
      created: m('Created'),
      id: m('ID'),
      nextMilestoneDeadline: m('Next milestone deadline'),
      nextMilestoneTitle: m('Next milestone'),
      outcome: m('Outcome notes'),
      subjects: m('People'),
      summary: m('Summary'),
      tagsFree: m('Tags'),
      title: m('Title'),
      updated: m('Last updated'),
    },
    export: {
      headers: {
        assignees: m('Assignees'),
        closed: m('Closed'),
        created: m('Created'),
        id: m('ID'),
        journey: m('Journey'),
        nextMilestone: m('Next milestone'),
        nextMilestoneDeadline: m('Next milestone deadline'),
        outcome: m('Outcome'),
        subjects: m('Subjects'),
        summary: m('Summary'),
        title: m('Title'),
        unsortedTags: m('Ungrouped Tags'),
        updated: m('Updated'),
      },
    },
    filters: {
      doesNotHaveOperator: m('does not have'),
      doesNotIncludeOperator: m('does not include'),
      hasOperator: m('has'),
      includesOperator: m('includes'),
      isEmptyOperator: m('is empty'),
      isNotOperator: m('is not'),
      isOperator: m('is'),
      milestoneLabel: m('Milestone'),
      personLabel: m('Person'),
      tagLabel: m('Tag'),
    },
    menu: {
      downloadCsv: im<{ pluralLabel: string }>('Download {pluralLabel} as CSV'),
      downloadXlsx: im<{ pluralLabel: string }>(
        'Download {pluralLabel} as Excel'
      ),
    },
  },
  journeys: {
    buttonClose: m('Close'),
    buttonOpen: m('Open'),
    cardCTA: m('View all'),
    closedCount: im<{ numberClosed: number }>('{numberClosed} closed'),
    conversionSnackbar: {
      error: m('Something went wrong in converting the journey.'),
      success: m('Journey conversion successful!'),
    },
    editJourneyTitleAlert: {
      error: m('Error. Title not updated.'),
      success: m('Updated title!'),
    },
    lastActivity: m('Last activity'),
    menu: {
      downloadCsv: m('Download all as CSV'),
      downloadXlsx: m('Download all as Excel'),
    },
    nextMilestone: m('Next milestone'),
    openCount: im<{ numberOpen: number }>('{numberOpen} open'),
    overview: {
      overviewTitle: m('All journeys'),
    },
    statusClosed: m('Closed'),
    statusOpen: m('Open'),
    tabs: {
      closed: m('Closed'),
      manage: m('Manage'),
      milestones: m('Milestones'),
      open: m('Open'),
      overview: m('Overview'),
      timeline: m('Timeline'),
    },
    title: m('Journeys'),
  },
});
