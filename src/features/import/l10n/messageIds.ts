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
          'If the file you are importing is from another system than Zetkin, we can save your IDs to each person. Or, if your file is based on a sheet you exported from Zetkin, we can use the Zetkin IDs to match each row with a person in Zetkin.'
        ),
        externalID: m('External ID'),
        externalIDExplanation: m(
          'The values in this column are IDs, but they do not come from Zetkin.'
        ),
        externalIDFile: m('File is from another system.'),
        header: m('Configure IDs'),
        wrongIDFormatWarning: m(
          'The values in this column does not look like Zetkin IDs. A Zetkin ID only contains numbers. If some cells are empty or contain f.x. letters, it can not be used as Zetkin IDs.'
        ),
        zetkinID: m('Zetkin ID'),
        zetkinIDExplanation: m('The values in this column are Zetkin IDs.'),
        zetkinIDFile: m('File is from a Zetkin export.'),
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
        messages: {
          email: m(
            'Some of the values in your email column are not valid email addresses.'
          ),
          empty: m(
            'Nothing will be imported. Please go back and check that the configurations you made are correct or select a new file to upload.'
          ),
          gender: m(
            'Some of the values in the gender column are incompatible with Zetkin gender formats. The values need to be either one of the letters f, m or o, or an empty cell.'
          ),
          id: m(
            'Some of the values in the Zetkin ID column are not numbers. Zetkin IDs are always only numbers.'
          ),
          phone: m(
            'Some of the values in the phone number column are not valid phone numbers.'
          ),
        },
        titles: {
          email: m('Invalid email address formats.'),
          empty: m('Something went wrong and the import was interrupted.'),
          gender: m('Invalid gender formats.'),
          id: m('Zetkin IDs are not correct format.'),
          phone: m('Invalid phone number formats.'),
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
            "This import will change a lot of people's {fieldName}"
          ),
        },
        unselectedId: {
          desc: m(
            'This can make updating people in Zetkin difficult and is not recommended.'
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
