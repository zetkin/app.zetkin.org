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
      dates: {
        customFormatDescription: m(
          'Describe the format of the values in this column, using the letters Y, M and D and any characters you use to separate them. For example, if your dates are written 1998.03.23, you would describe that as YYYY.MM.DD.'
        ),
        customFormatLabel: m('Custom date format'),
        dateInputLabel: m('Date format'),
        description: m(
          'Select the format of the values in this column so they can be imported correctly.'
        ),
        dropDownLabel: m('Select format'),
        emptyPreview: m('Could not be parsed'),
        header: m('Configure date format'),
        listSubHeaders: {
          custom: m('Custom'),
          dates: m('Date formats'),
          personNumbers: m('Person numbers'),
        },
        personNumberFormat: {
          dk: {
            description: m(
              'The values in this column will be parsed from 10 digit Danish CPR-numbers (DDMMYY-XXXX or DDMMYYXXXX) into dates.'
            ),
            label: m('Danish CPR-number'),
          },
          no: {
            description: m(
              'The values in this column will be parsed from 11 digit Norwegian fødselsnummer (DDMMYYXXXXX or DDMMYY-XXXXX) into dates.'
            ),
            label: m('Norwegian fødselsnummer'),
          },
          se: {
            description: m(
              'The values in this column will be parsed from 10 or 12 digit Swedish personnummer (YYMMDD-XXXX or YYYYMMDD-XXXX) into dates.'
            ),
            label: m('Swedish Personnummer'),
          },
        },
        wrongDateFormatWarning: m(
          'Some of the values in this column can not be parsed into dates using this format.'
        ),
      },
      enum: {
        header: m('Map values to options'),
        none: m('None'),
        value: m('Value'),
      },
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
        guess: m('Guess organisations'),
        header: m('Map values to organizations'),
        organizations: m('Organization'),
        status: m('Status'),
      },
      tags: {
        empty: m('Empty'),
        guess: m('Guess tags'),
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
      finishedMappingDates: m<{ dateFormat: string; numValues: number }>(
        'Mapping {numValues, plural, =1 {1 value} other {# values}} from {dateFormat, select, se {Swedish personnummer} no {Norwegian fødselsnummer} dk {Danish CPR-number} other {{dateFormat}}} into dates'
      ),
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
      organization: m('Organization'),
      selectZetkinField: m('Import as...'),
      tags: m('Tags'),
      unfinished: {
        date: m('You need to configure date format'),
        enum: m('You need to map values'),
        id: m('You need to configure the IDs'),
        org: m('You need to map values'),
        tag: m('You need to map values'),
      },
      zetkinFieldGroups: {
        fields: m('Fields'),
        id: m('ID'),
        other: m('Other'),
      },
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
  impactSummary: {
    future: {
      created: m<{ numPeople: number; number: ReactElement }>(
        '{number} new {numPeople, plural, =1 {person} other {people}} will be created'
      ),
      defaultDesc: m<{ field: ReactElement; numPeople: ReactElement }>(
        '{numPeople} will receive changes to their {field}'
      ),
      organization: m('Organization'),
      orgs: m<{ numPeople: ReactElement; org: ReactElement }>(
        '{numPeople} will be added to an {org}'
      ),
      tags: m('Tags'),
      tagsDesc: m<{ numPeople: ReactElement; tags: ReactElement }>(
        '{numPeople} will have {tags} added'
      ),
      updated: m<{ numPeople: number; number: ReactElement }>(
        '{number} {numPeople, plural, =1 {person} other {people}} will be updated'
      ),
    },
    past: {
      created: m<{ numPeople: number; number: ReactElement }>(
        '{number} new {numPeople, plural, =1 {person} other {people}} were created'
      ),
      defaultDesc: m<{ field: ReactElement; numPeople: ReactElement }>(
        '{numPeople} recieved changes to their {field}'
      ),
      organization: m('Organization'),
      orgs: m<{ numPeople: ReactElement; org: ReactElement }>(
        '{numPeople} were added to an {org}'
      ),
      tags: m('Tags'),
      tagsDesc: m<{ numPeople: ReactElement; tags: ReactElement }>(
        '{numPeople} had {tags} added'
      ),
      updated: m<{ numPeople: number; number: ReactElement }>(
        '{number} {numPeople, plural, =1 {person} other {people}} were updated'
      ),
    },
    people: m<{ numPeople: number; number: ReactElement }>(
      '{number} {numPeople, plural, =1 {person} other {people}}'
    ),
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
    headers: {
      messages: m('Messages'),
      summary: m('Summary'),
    },
    messages: {
      common: {
        back: m('Go back'),
        checkbox: m('I understand and want to proceed anyway'),
        fewRows: m<{ commaRows: string; lastRow: number }>(
          'This problem exists on rows {commaRows} and {lastRow}.'
        ),
        manyRows: m<{ additionalRows: number; commaRows: string }>(
          'This problem exists on rows {commaRows} and {additionalRows, plural, =1 {1 additional row} other {# additional rows}}.'
        ),
        singleRow: m<{ row: number }>('This problem exists on row {row}.'),
      },
      invalidFormat: {
        title: m<{ field: string }>('Wrong format for field: {field}'),
      },
      majorChange: {
        description: m(
          'This warning is shown when more than 30% of imported people are affected. Make sure you have configured the columns correctly'
        ),
        title: m<{ amount: number; field: string }>(
          'This import will overwrite "{field}" for {amount} people'
        ),
      },
      missingIdAndName: {
        description: m(
          'Every row needs to contain at least a full name, or an ID of a person that already exists in Zetkin.'
        ),
        title: m('Not all rows have identifiers'),
      },
      noImpact: {
        description: m(
          'This could be because the file contains no new data, or due to an unknown error.'
        ),
        title: m('This import would have no effect'),
      },
      ok: {
        description: m(
          'Make sure the summary looks good and click "Import" to perform the import.'
        ),
        title: m('No problems found!'),
      },
      unconfiguredId: {
        description: m(
          'This will result in duplicates in the database. If this is your first import, it is recommended to go back and choose an external ID that you can use going forward.'
        ),
        title: m('You have not chosen an ID column'),
      },
      unconfiguredIdAndName: {
        description: m(
          'Every import must at least include either full names, or IDs of people that already exist in Zetkin.'
        ),
        title: m('You have not configured identifying columns'),
      },
      unexpectedError: {
        description: m(
          'No people have been imported. You can go back and check the import settings or select a new file to import. There were errors in the form you submitted. Please try again and make sure you fill in all the necessary information. If the error persist you can contact support at info@zetkin.org'
        ),
        title: m('Something went wrong and the import was aborted'),
      },
      unknownError: {
        description: m(
          'Contact support if you need help understanding the problem.'
        ),
        title: m('An unknown error ocurred'),
      },
      unknownPerson: {
        description: m(
          `You configured a column as Zetkin IDs, but the column contains IDs that don't exist. Did you mean to use External ID, or could some people have been deleted since the file was created?`
        ),
        title: m('Trying to update records that do not exist'),
      },
      validating: m('Validating'),
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
    messages: m('Messages'),
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
      error: m('You have to fix the errors before you can import'),
      update: m<{ numUpdated: number }>(
        'This import will update {numUpdated, plural, =1 {1 person} other {# people}}.'
      ),
    },
  },
});
