import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.areaAssignments', {
  assignees: {
    columns: {
      areas: m('Areas'),
      name: m('Name'),
    },
  },
  default: {
    title: m('Untitled area assignment'),
  },
  instructions: {
    editor: {
      confirm: m(
        'Do you want to delete all unsaved changes and go back to saved instructions?'
      ),
      editorPlaceholder: m('Add instructions for your activists'),
      revertLink: m('Revert to saved version?'),
      saveButton: m('Save'),
      savedMessage: m('Everything is up to date!'),
      savingButton: m('Saving...'),
      unsavedMessage: m('You have unsaved changes.'),
    },
    title: m('Assignee instructions'),
  },
  layout: {
    actions: {
      delete: m('Delete'),
      deleteWarningText: m<{ title: string }>(
        'Are you sure you want to delete {title}?'
      ),
      end: m('End assignment'),
      start: m('Start assignment'),
    },
    basicAssignmentStats: {
      areas: m<{ numAreas: number }>(
        '{numAreas, plural, =0 {No areas} one {1 area} other {# areas}}'
      ),
      assignees: m<{ numAssignees: number }>(
        '{numAssignees, plural, =0 {No assignees} one {1 assignee} other {# assignees}}'
      ),
    },
    tabs: {
      assignees: m('Assignees'),
      instructions: m('Instructions'),
      map: m('Map'),
      overview: m('Overview'),
      report: m('Report'),
    },
  },
  map: {
    areaInfo: {
      assignees: {
        add: m('Add assignee'),
        none: m('No assignees'),
        title: m('Assignees'),
      },
      stats: {
        households: m<{ numHouseholds: number }>(
          '{numHouseholds, plural, one {Household visited} other {Households visited}}'
        ),
        locations: m<{ numLocations: number }>(
          '{numLocations, plural, one {Location} other {Locations}}'
        ),
        successful: m<{ numSuccessfulVisits: number }>(
          '{numSuccessfulVisits, plural, one {Successful visit} other {Successful visits}}'
        ),
      },
    },
    filter: {
      assignees: {
        assigned: m('Only assigned areas'),
        label: m('Assignees'),
        unassigned: m('Only unassigned areas'),
      },
      description: m('Define what areas you see on the map'),
      header: m('Filters'),
      title: m('Add filters to decide what areas you see on the map'),
      ungroupedTags: m('Ungrouped tags'),
    },
    findArea: {
      filterPlaceHolder: m('Filter'),
      title: m('Areas'),
    },
    mapStyle: {
      area: {
        label: m('Area color'),
        options: {
          assignees: m('Assignees'),
          hidden: m('Hidden'),
          households: m('Households'),
          outlined: m('Outlined'),
          progress: m('Progress'),
        },
      },
      center: {
        label: m('Area markers'),
        options: {
          assignees: m('Assignees'),
          hidden: m('Hidden'),
          households: m('Households & locations'),
          progress: m('Progress'),
        },
      },
      markers: {
        label: m('Location markers'),
        options: {
          altDescriptions: {
            areaMarkerAssignee: m('Center area assignees'),
            areaMarkerAssignmentProgreess: m('Center area progress'),
            areaMarkerHidden: m('Center area hidden'),
            areaMarkerHouseholds: m('Center area households'),
            locationDot: m('Dot option'),
            locationHidden: m('Hide option'),
            locationHouseholds: m('Households option'),
            locationProgress: m('Progress option'),
          },
          dot: m('Point'),
          hidden: m('Hidden'),
          households: m('Households'),
          progress: m('Progress'),
        },
      },
      title: m('Data visualization'),
    },
  },
  overview: {
    empty: {
      description: m('This assignment has not been planned yet'),
      startPlanningButton: m('Plan now'),
    },
    progress: {
      headers: {
        households: m('Households visited'),
        locations: m('Locations visited'),
        successful: m('Successful visits'),
      },
      statsTitle: m('Progress'),
      unassignedVisits: {
        description: m(
          'This graph shows visits made outside the assigned areas'
        ),
        title: m('Unassigned visits'),
      },
    },
  },
  report: {
    card: {
      definesSuccess: m('Defines success'),
      delete: m('Delete'),
      description: m('No description'),
      question: m('Untitled question'),
      tooltip: m(
        'To delete this, first create a new choice question to define whether the visit was successful.'
      ),
    },
    dataCard: {
      header: m('Data precision & privacy'),
      household: m('per household (most precise)'),
      info: m('Collect data...'),
      location: m('per location (less precise, more privacy)'),
      subheader: m(
        'Configuring where to store the data is a matter of striking a balance between precision and privacy that is right for your cause'
      ),
    },
    delete: {
      cancel: m('Cancel'),
      confirm: m('Confirm'),
      deleteWarningText: m<{ title: string }>(
        'If you want to delete {title} you need to pick another choice question to be the question that defines if the visit was successful'
      ),
      dialog: m(
        'Are you sure you want to delete this question? This action is permanent and it cannot be undone.'
      ),
      select: m('Select'),
    },
    lockCard: {
      add: m('Adding questions'),
      change: m('Changing question that defines successful visit'),
      description: m(
        'This assignment has started. Editing the assignment now may cause problems with the data. Proceed with caution.'
      ),
      descriptionUnlock: m(
        'Be careful not to make changes that may cause data to be lost or corrupted.'
      ),
      fix: m('Fixing spelling'),
      header: m('Report locked'),
      headerUnlock: m('Report unlocked'),
      rename: m('Rephrasing questions in ways that change their meaning'),
      safe: m('Safe changes'),
      unsafe: m('Unsafe changes'),
    },
    metricCard: {
      choice: m('Choice question'),
      ratingDescription: m(
        ' The assignee will respond by giving a rating from 1 to 5'
      ),
      save: m('Save'),
      scale: m('Scale question'),
    },
    successCard: {
      header: m('Successful visit'),
      subheader: m(
        'Pick a question to use when counting successful visits. Answering yes to this question will count the visit as successful'
      ),
    },
    toolBar: {
      title: m('Add questions for your canvass assignment.'),
    },
  },
});
