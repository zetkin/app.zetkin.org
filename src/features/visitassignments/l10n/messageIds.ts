import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.visitAssignments', {
  assignees: {
    actions: {
      customize: m('Customize queue'),
      remove: m('Remove from assignment'),
    },
    add: {
      alreadyAdded: m('Already added'),
      placeholder: m('Start typing to search or add a new assignee'),
    },
    columns: {
      name: m('Name'),
      visits: m('Visits'),
    },
    customize: {
      exclude: {
        h: m('Excluded tags'),
        intro: m('Never call targets with these tags.'),
      },
      prioritize: {
        h: m('Prioritized tags'),
        intro: m('First call targets with these tags.'),
      },
      title: m<{ name: string }>('Customize Queue for {name}'),
    },
    customizeButton: m('Customize'),
    excludedTagsColumn: m('Excluded tags'),
    nameColumn: m('Name'),
    prioritizedTagsColumn: m('Prioritized tags'),
    searchBox: m('Search'),
    title: m('Assignees'),
  },
  default: {
    title: m('Untitled visit assignment'),
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
      assignees: m<{ numAssignees: number }>(
        '{numAssignees, plural, =0 {No assignees} one {1 assignee} other {# assignees}}'
      ),
      visits: m<{ numVisits: number }>(
        '{numVisits, plural, =0 {No visits} one {1 visit} other {# visits}}'
      ),
    },
    tabs: {
      assignees: m('Assignees'),
      instructions: m('Instructions'),
      map: m('Map'),
      report: m('Report'),
      target: m('Target'),
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
        locations: m('Locations visited'),
        successful: m('Successful visits'),
        visits: m('Persons visited'),
      },
      statsTitle: m('Progress'),
      unassignedVisits: {
        description: m(
          'This graph shows visits made outside the assigned target'
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
      safe: m('Safe'),
      unsafe: m('Unsafe'),
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
      title: m('Add questions for your visit assignment.'),
    },
  },
  stats: {
    assignees: m<{ numAssignees: number }>(
      '{numAssignees, plural, =0 {No assignees} one {1 assignee} other {# assignees}}'
    ),
    targets: m<{ numTargets: number }>(
      '{numTargets, plural, =0 {No targets} one {1 targets} other {# targets}}'
    ),
  },
  targets: {
    defineButton: m('Define target group'),
    editButton: m('Edit target group'),
    subtitle: m('Use smart search to define target group for this assignment.'),
    title: m('Targets'),
  },
});
