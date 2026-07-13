import { ReactElement } from 'react';

import { m, makeMessages } from 'core/i18n/messages';

export default makeMessages('feat.canvass', {
  default: {
    description: m('Empty description'),
    floor: m('Unknown floor'),
    location: m('Untitled location'),
  },
  households: {
    bulkEditHouseholds: {
      floorLabel: m('Edit floor'),
      header: m<{ numHouseholds: number }>(
        'Edit {numHouseholds, plural, one {1 household} other {# households}}'
      ),
      saveButtonLabel: m<{ numHouseholds: number }>(
        'Save {numHouseholds, plural, one {1 household} other {# households}}'
      ),
    },
    colorPicker: {
      colorNames: {
        black: m('Black'),
        darkAqua: m('Dark aqua'),
        darkBlue: m('Dark blue'),
        darkGreen: m('Dark green'),
        darkIndigo: m('Dark indigo'),
        darkLime: m('Dark lime'),
        darkOrange: m('Dark orange'),
        darkPink: m('Dark pink'),
        darkPurple: m('Dark purple'),
        darkRed: m('Dark red'),
        darkTurqouise: m('Dark turqouise'),
        darkYellow: m('Dark yellow'),
        grey: m('Grey'),
        lightAqua: m('Light aqua'),
        lightBlue: m('Light blue'),
        lightGreen: m('Light green'),
        lightIndigo: m('Light indigo'),
        lightLime: m('Light lime'),
        lightOrange: m('Light orange'),
        lightPink: m('Light pink'),
        lightPurple: m('Light purple'),
        lightRed: m('Light red'),
        lightTurquoise: m('Light turquoise'),
        lightYellow: m('Light yellow'),
        mediumAqua: m('Medium aqua'),
        mediumBlue: m('Medium blue'),
        mediumGreen: m('Medium green'),
        mediumIndigo: m('Medium indigo'),
        mediumLime: m('Medium lime'),
        mediumOrange: m('Medium orange'),
        mediumPink: m('Medium pink'),
        mediumPurple: m('Medium purple'),
        mediumRed: m('Medium red'),
        mediumTurqouise: m('Medium turqouise'),
        mediumYellow: m('Medium yellow'),
      },
      inputLabel: m('Edit household color'),
      noColor: m('No color'),
    },
    createMultiple: {
      createButtonLabel: m<{ numHouseholds: number }>(
        'Create {numHouseholds, plural, one {1 household} other {# households}}'
      ),
      header: m('Create households'),
      numberOfFloorsInput: m('Number of floors'),
      numberOfHouseholdsInput: m('Households per floor'),
    },
    delete: {
      title: m('Delete household'),
      warningText: m(
        'Are you sure you want to delete the household? It can not be undone.'
      ),
    },
    editSingleHousehold: {
      floorLabel: m('Edit floor'),
      header: m<{ title: string }>('Edit {title}'),
      saveButtonLabel: m('Save'),
      titleLabel: m('Edit title'),
    },
    householdDefaultTitle: m<{ householdNumber: number }>(
      'Household {householdNumber}'
    ),
    page: {
      empty: m('This location does not have any households yet'),
      header: m('Households'),
    },
    single: {
      logVisitButtonLabel: m('Log visit'),
      subtitle: m<{ floorNumber: number }>('Floor {floorNumber}'),
      wasVisited: m('This household has been visited in this assignment'),
    },
    stackItem: {
      detailsButtonLabel: m('Details'),
      visitButtonLabel: m('Visit'),
    },
  },
  instructions: {
    areas: m('Areas'),
    instructionsHeader: m('Instructions'),
    ready: m('You are ready to go'),
    selectArea: m('Select area'),
    start: m('Begin assignment'),
    visitedHouseholds: m('Households visited'),
    visitedLocations: m('Locations visited'),
  },
  location: {
    edit: {
      descriptionLabel: m('Edit description'),
      header: m<{ title: string }>('Edit {title}'),
      saveButtonLabel: m('Save'),
      titleLabel: m('Edit title'),
    },
    header: m<{ numHouseholds: number; numVisitedHouseholds: number }>(
      '{numVisitedHouseholds}/{numHouseholds} {numHouseholds, plural, one {household} other {households}} visited'
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
    subheader: m<{ successfulVisits: number }>(
      '{successfulVisits, plural, one {1 successful visit} other {# successful visits}}'
    ),
  },
  map: {
    addLocation: {
      add: m('Add location'),
      cancel: m('Cancel'),
      create: m('Create location'),
      inputPlaceholder: m('Give the location a name'),
    },
    initializationError: m(
      'There was an error initializing the map. Please check if your browser supports WebGL and it is enabled.'
    ),
  },
  selectArea: {
    noAreas: m('No areas available'),
  },
  sidebar: {
    instructions: {
      title: m('Instructions'),
    },
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
        householdsSuccessful: m('Successfully visited'),
        householdsVisited: m('Visited households'),
        locations: m('Locations'),
        successfulVisits: m('Successful Visits'),
        title: m('Progress'),
        visits: m('Visits'),
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
