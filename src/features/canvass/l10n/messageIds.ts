import { ReactElement } from 'react';

import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.canvass', {
  default: {
    assignment: m('Untitled area assignment'),
    description: m('Empty description'),
    floor: m('Unknown floor'),
    household: m('Untitled household'),
    location: m('Untitled location'),
  },
  households: {
    createMultiple: {
      createButtonLabel: m<{ numHouseholds: number }>(
        'Create {numHouseholds, plural, one {1 household} other {# households}}'
      ),
      header: m('Create households'),
      householdDefaultTitle: m<{ householdNumber: number }>(
        'Household {householdNumber}'
      ),
      numberOfFloorsInput: m('Number of floors'),
      numberOfHouseholdsInput: m('Households per floor'),
    },
    edit: {
      floorLabel: m('Edit floor'),
      header: m<{ title: string }>('Edit {title}'),
      saveButtonLabel: m('Save'),
      titleLabel: m('Edit title'),
    },
    page: {
      empty: m('This location does not have any households yet'),
      header: m('Households'),
    },
    single: {
      logVisitButtonLabel: m('Log visit'),
      subtitle: m<{ floorTitle: string }>('Floor {floorTitle}'),
      wasVisited: m('This household has been visited in this assignment'),
    },
  },
  location: {
    edit: {
      descriptionLabel: m('Edit description'),
      header: m<{ title: string }>('Edit {title}'),
      saveButtonLabel: m('Save'),
      titleLabel: m('Edit title'),
    },
    header: m<{ numHouseholds: number; numVisitedHouseholds: number }>(
      '{numVisitedHouseholds}/{numHouseholds} {numHouseholds, plural,one {household} other {households} visited}'
    ),
    page: {
      historySectionHeader: m('History'),
      householdVisitedStatLabel: m('households visited'),
      householdsButtonLabel: m('Households'),
      householdsVisitedStat: m<{
        numHouseholds: number;
        numVisitedHouseholds: number;
      }>('{numVisitedHouseholds} of {numHouseholds}'),
      noHouseholds: m('No households registered here yet'),
      numberOfHouseholds: m<{ numHouseholds: number }>(
        '{numHouseholds, plural, one {1 household} other {# households}}'
      ),
      quickReportButtonLabel: m('Quick report'),
    },
  },
  map: {
    addLocation: {
      add: m('Add location'),
      cancel: m('Cancel'),
      create: m('Create location'),
      inputPlaceholder: m('Give the location a name'),
    },
  },
  sidebar: {
    menuOptions: {
      home: m('My activities'),
      logOut: m('Log out'),
    },
    progress: {
      allTime: {
        title: m('All time'),
      },
      header: {
        households: m('Households'),
        locations: m('Locations'),
        title: m('Progress'),
      },
      session: {
        team: m('Team'),
        title: m('Session (today)'),
        you: m('You'),
      },
      sync: {
        label: {
          hasLoaded: m<{ timestamp: ReactElement }>('Synced {timestamp}'),
          neverLoaded: m('Never loaded'),
        },
        syncButton: {
          label: m('Sync now'),
          loading: m('Syncing'),
        },
      },
    },
  },
  visit: {
    household: {
      header: m<{ householdTitle: string }>('{householdTitle}: Log visit'),
      noButtonLabel: m('No'),
      skipButtonLabel: m('Skip this question'),
      submitReportButtonLabel: m('Submit report'),
      yesButtonLabel: m('Yes'),
    },
    location: {
      average: m<{ avgFixed: string; numHouseholds: number }>(
        '{numHouseholds, plural,one {1 household} other {# households}}, {avgFixed} average'
      ),
      completed: m<{ numHouseholds: number; numYes: number }>(
        '{numHouseholds, plural,one {1 household} other {# households}}, {numYes} yes'
      ),
      header: m('Report visits here'),
      noInputLabel: m('No'),
      proceedButtonLabel: m('Proceed'),
      submitButtonLabel: m('Submit'),
      yesInputLabel: m('Yes'),
    },
  },
});
