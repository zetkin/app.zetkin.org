import { ReactElement } from 'react';
import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.import', {
  actionButtons: {
    back: m('Back'),
    close: m('Close'),
    configure: m('Configure'),
    done: m('Done'),
    import: m('Import'),
    restart: m('Restart'),
    validate: m('Validate'),
  },
  configuration: {
    configure: {
      ids: {
        configExplanation: m(
          'Importing with IDs allows Zetkin (now or in the future) to update existing people in the database instead of creating duplicates.'
        ),
        externalID: m('External ID'),
        externalIDExplanation: m(
          'The values in this column are IDs from our main member system (not Zetkin).'
        ),
        header: m('Configure IDs'),
        showOrganizationSelectButton: m('Map to...'),
        wrongIDFormatWarning: m(
          'The values in this column does not look like Zetkin IDs. A Zetkin ID only contains numbers. If some cells are empty or contain f.x. letters, it can not be used as Zetkin IDs.'
        ),
        zetkinID: m('Zetkin ID'),
        zetkinIDExplanation: m(
          'The values in this column are based on an export from Zetkin.'
        ),
      },
      orgs: {
        header: m('Map values to organizations'),
        organizations: m('Organization'),
        status: m('Status'),
      },
      tags: {
        empty: m('Empty'),
        header: m('Map values to tags'),
        numberOfRows: m<{ numRows: number }>(
          '{numRows, plural, =1 {1 row} other {# rows}}'
        ),
        tagsHeader: m('Tags'),
      },
    },
    hide: m('Hide'),
    mapping: {
      configButton: m('Configure'),
      defaultColumnHeader: m<{ columnIndex: number }>('Column {columnIndex}'),
      emptyStateMessage: m('Start by mapping file columns.'),
      fileHeader: m('File'),
      finishedMappingIds: m<{
        idField: 'ext_id' | 'id';
        numValues: number;
      }>(
        'Mapping {numValues, plural, =1 {1 value} other {# values}} to {idField, select, id {Zetkin ID} other {external ID}}'
      ),
      finishedMappingOrganizations: m<{
        numMappedTo: number;
        numPeople: number;
      }>(
        '{numPeople, plural, =1 {1 person} other {# people}} mapped to {numMappedTo, plural, =1 {1 organization} other {# organizations}}'
      ),
      finishedMappingTags: m<{
        numMappedTo: number;
        numRows: number;
      }>(
        'Mapping {numRows, plural, =1 {1 row} other {# rows}} to {numMappedTo, plural, =1 {1 tag} other {# tags}}'
      ),
      header: m('Mapping'),
      id: m('ID'),
      mapValuesButton: m('Map values'),
      messages: {
        manyValuesAndEmpty: m<{
          firstValue: string | number;
          numEmpty: number;
          numMoreValues: number;
          secondValue: string | number;
          thirdValue: string | number;
        }>(
          '{firstValue}, {secondValue}, {thirdValue}, {numMoreValues, plural, =1 {one other value} other {# other values}} and {numEmpty, plural, =1 {one empty row} other {# empty rows}}.'
        ),
        manyValuesNoEmpty: m<{
          firstValue: string | number;
          numMoreValues: number;
          secondValue: string | number;
          thirdValue: string | number;
        }>(
          '{firstValue}, {secondValue}, {thirdValue} and {numMoreValues, plural, =1 {one other value} other {# other values}}.'
        ),
        oneValueAndEmpty: m<{ firstValue: string | number; numEmpty: number }>(
          '{firstValue} and {numEmpty, plural, =1 {one empty row} other {# empty rows}}.'
        ),
        oneValueNoEmpty: m<{ firstValue: string | number }>('{firstValue}.'),
        onlyEmpty: m<{ numEmpty: number }>(
          '{numEmpty, plural, =1 {one empty row} other {# empty rows}}.'
        ),

        threeValuesAndEmpty: m<{
          firstValue: string | number;
          numEmpty: number;
          secondValue: string | number;
          thirdValue: string | number;
        }>(
          '{firstValue}, {secondValue}, {thirdValue} and {numEmpty, plural, =1 {one empty row} other {# empty rows}}.'
        ),
        threeValuesNoEmpty: m<{
          firstValue: string | number;
          secondValue: string | number;
          thirdValue: string | number;
        }>('{firstValue}, {secondValue} and {thirdValue}.'),
        twoValuesAndEmpty: m<{
          firstValue: string | number;
          numEmpty: number;
          secondValue: string | number;
        }>(
          '{firstValue}, {secondValue} and {numEmpty, plural, =1 {one empty row} other {# empty rows}}.'
        ),
        twoValuesNoEmpty: m<{
          firstValue: string | number;
          secondValue: string | number;
        }>('{firstValue} and {secondValue}.'),
      },
      needsConfig: m('You need to configure the IDs'),
      needsMapping: m('You need to map values'),
      organization: m('Organization'),
      selectZetkinField: m('Import as...'),
      tags: m('Tags'),
      zetkinHeader: m('Zetkin'),
    },
    preview: {
      columnHeader: {
        org: m('Organization'),
        tags: m('Tags'),
      },
      next: m('Next'),
      noOrg: m('No organization'),
      noTags: m('No tags'),
      noValue: m('No value'),
      previous: m('Previous'),
      title: m('Mapping preview'),
    },
    settings: {
      firstRowIsHeaders: m('First row is headers'),
      header: m('Settings'),
      sheetSelectHelpText: m(
        'Your file has multiple sheets, select which one to use.'
      ),
      sheetSelectLabel: m('Sheet'),
    },
    show: m('Show'),
    statusMessage: {
      done: m<{ numConfiguredPeople: number }>(
        'Configures import of {numConfiguredPeople, plural, =1 {1 person} other {# people}}'
      ),
      notDone: m('Your configuration is incomplete'),
    },
    title: m('Import people'),
  },
  importStatus: {
    completed: {
      desc: m('Your data has been imported to Zetkin'),
      title: m('Import completed'),
    },
    completedChanges: m('Completed changes'),
    error: {
      desc: m('No data was imported to Zetkin'),
      title: m('Import failed'),
    },
    loadingState: m('Importing'),
    scheduled: {
      desc: m(
        'You can safely close this dialog and we will send you an email when the import is done.'
      ),
      title: m(
        'This is a big import that will take a while to get into Zetkin!'
      ),
    },
  },
  preflight: {
    messages: {
      common: {
        fewRows: m<{ commaRows: string; lastRow: number }>(
          'This problem exists on rows {commaRows} and {lastRow}.'
        ),
        manyRows: m<{ additionalRows: number; commaRows: string }>(
          'This problem exists on rows {commaRows} and {additionalRows} additional rows.'
        ),
        singleRow: m<{ row: number }>('This problem exists on row {row}.'),
      },
      invalidFormat: {
        title: m<{ field: string }>('Wrong format for field: {field}'),
      },
      majorChange: {
        description: m('Make sure you have configured the columns correctly'),
        title: m<{ field: string }>(
          "This import will overwrite lots of people's {field}"
        ),
      },
    },
  },
  steps: {
    configure: m('Configure'),
    import: m('Import'),
    upload: m('Upload'),
    validate: m('Validate'),
  },
  uploadDialog: {
    dialogButtons: {
      configure: m('Configure'),
      restart: m('Restart'),
    },
    instructions: m<{ link: ReactElement }>('{link} or drag and drop'),
    loading: m('Loading file...'),
    release: m('Release the file here'),
    selectClick: m('Click to upload'),
    types: m('CSV, XLS or XLSX'),
    unsupportedFile: m('Unsupported file format.'),
  },
  validation: {
    alerts: {
      back: m('Go back'),
      checkbox: m('I understand'),
      errors: {
        altPhone: {
          description: m(
            'Some of the values in the alternate phone number column are not valid phone numbers.'
          ),
          title: m('Invalid alternate phone number formats'),
        },
        date: {
          description: m(
            'Some of the values in a date column are not valid dates.'
          ),
          title: m('Invalid date formats'),
        },
        email: {
          description: m(
            'Some of the values in your email column are not valid email addresses.'
          ),
          title: m('Invalid email address formats'),
        },
        empty: {
          description: m(
            'This import would not update or import anything so you can not proceed. Please go back and check that the configurations you made are correct or select a new file to upload.'
          ),
          title: m('This import would not change anything'),
        },
        gender: {
          description: m(
            'Some of the values in the gender column are incompatible with Zetkin gender formats. The values need to be either one of the letters f, m or o, or an empty cell.'
          ),
          title: m('Invalid gender formats'),
        },
        id: {
          description: m(
            'Some of the values in the Zetkin ID column are not numbers. Zetkin IDs are always only numbers.'
          ),
          title: m('Zetkin IDs are not in correct format'),
        },
        idValueMissing: {
          description: m(
            'Some of the values in the Zetkin ID column are empty.'
          ),
          title: m('Missing Zetkin IDs'),
        },
        longCoAddress: {
          description: m(
            'Some values in the C/O Address column are too long, please check that they are no longer than 200 characters.'
          ),
          title: m('Too long values in C/O Address column'),
        },
        longCountry: {
          description: m(
            'Some values in the Country column are too long, please check that they are no longer than 60 characters.'
          ),
          title: m('Too long values in Country column'),
        },
        longExtId: {
          description: m(
            'Some values in the external ID column are too long, please check that they are no longer than 96 characters.'
          ),
          title: m('Too long values in external ID column'),
        },
        longFirstName: {
          description: m(
            'Some values in the First Name column are too long, please check that they are no longer than 50 characters.'
          ),
          title: m('Too long values in First Name column'),
        },
        longLastName: {
          description: m(
            'Some values in the Last Name column are too long, please check that they are no longer than 50 characters.'
          ),
          title: m('Too long values in Last Name column'),
        },
        longStreetAddress: {
          description: m(
            'Some values in the Street Address column are too long, please check that they are no longer than 200 characters.'
          ),
          title: m('Too long values in Street Address column'),
        },
        noIdentifier: {
          description: m(
            'To make it possible to import you need to select either both first and last name columns, or an ID column'
          ),
          title: m('There is nothing to identify the data you want to import'),
        },
        notSelectedIdType: {
          description: m(
            'You need to select if your ID column is Zetkin IDs or external IDs.'
          ),
          title: m('Unfinished ID configuration'),
        },
        phone: {
          description: m(
            'Some of the values in the phone number column are not valid phone numbers.'
          ),
          title: m('Invalid phone number formats'),
        },
        postCode: {
          description: m(
            'Some of the values in the post code column are not valid post codes.'
          ),
          title: m('Invalid post code formats'),
        },
        url: {
          description: m(
            'Some of the values in the URL column are not valid URLS'
          ),
          title: m('Invalid URL formats'),
        },
      },
      info: {
        desc: m('The data you want to upload looks good!'),
        title: m('Ready for import'),
      },
      warning: {
        manyChanges: {
          desc: m(
            'If this is not intentional you should go back and check the configuration.'
          ),
          title: m<{ fieldName: string }>(
            "This import will overwrite a lot of people's {fieldName}"
          ),
        },
        unselectedId: {
          desc: m(
            'This will create new records for every person, even if that results in duplicates, and can make updating people in Zetkin difficult. This is not recommended.'
          ),
          title: m('You have not chosen an ID column'),
        },
      },
    },
    messages: m('Messages'),
    pendingChanges: m('Pending changes'),
    people: m<{ numPeople: number }>(
      '{numPeople, plural, =1 {person} other {people}}'
    ),
    statusMessages: {
      create: m<{ numCreated: number }>(
        'This import will create {numCreated, plural, =1 {1 person} other {# people}}.'
      ),
      createAndUpdate: m<{ numCreated: number; numUpdated: number }>(
        'This import will create {numCreated, plural, =1 {1 person} other {# people}} and update {numUpdated, plural, =1 {1 person} other {# people}}.'
      ),
      error: m('This import will error.'),
      update: m<{ numUpdated: number }>(
        'This import will update {numUpdated, plural, =1 {1 person} other {# people}}.'
      ),
    },
    updateOverview: {
      created: m<{ numPeople: number; number: ReactElement }>(
        '{number} new {numPeople, plural, =1 {person} other {people}} will be created'
      ),
      defaultDesc: m<{ field: ReactElement; numPeople: ReactElement }>(
        '{numPeople} will recieve changes to their {field}'
      ),
      organization: m('Organization'),
      orgs: m<{ numPeople: ReactElement; org: ReactElement }>(
        '{numPeople} will be added to an {org}'
      ),
      people: m<{ numPeople: number; number: ReactElement }>(
        '{number} {numPeople, plural, =1 {person} other {people}}'
      ),
      tags: m('Tags'),
      tagsDesc: m<{ numPeople: ReactElement; tags: ReactElement }>(
        '{numPeople} will have {tags} added'
      ),
      updated: m<{ numPeople: number; number: ReactElement }>(
        '{number} {numPeople, plural, =1 {person} other {people}} will be updated'
      ),
    },
  },
});
