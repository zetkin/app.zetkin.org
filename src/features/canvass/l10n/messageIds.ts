import { ReactElement } from 'react';

import { m, makeMessages } from 'core/i18n';

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
        '#000000': m('Black'),
        '#014F77': m('Dark blue'),
        '#0284C7': m('Medium blue'),
        '#187F81': m('Dark aqua'),
        '#1F7F5C': m('Dark turqouise'),
        '#28D4D7': m('Medium aqua'),
        '#2F2A89': m('Dark indigo'),
        '#34D399': m('Medium turqouise'),
        '#478837': m('Dark green'),
        '#4F46E5': m('Medium indigo'),
        '#661B86': m('Dark purple'),
        '#6D6D6D': m('Grey'),
        '#73851A': m('Dark lime'),
        '#77E25B': m('Medium green'),
        '#831747': m('Dark pink'),
        '#841717': m('Dark red'),
        '#8C3507': m('Dark orange'),
        '#93E9EB': m('Light aqua'),
        '#977316': m('Dark yellow'),
        '#99E9CC': m('Light turquoise'),
        '#AA2DDF': m('Medium purple'),
        '#B3DAEE': m('Light blue'),
        '#BBF1AD': m('Light green'),
        '#C0DE2B': m('Medium lime'),
        '#CAC7F7': m('Light indigo'),
        '#DB2777': m('Medium pink'),
        '#DC2626': m('Medium red'),
        '#DFEF95': m('Light lime'),
        '#E5C0F5': m('Light purple'),
        '#EA580C': m('Medium orange'),
        '#F1A8A8': m('Light red'),
        '#F1A9C9': m('Light pink'),
        '#F7BC9E': m('Light orange'),
        '#FBBF24': m('Medium yellow'),
        '#FDDF91': m('Light yellow'),
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
