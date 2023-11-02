import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.import', {
  configuration: {
    hide: m('Hide'),
    mapping: {
      configButton: m('Configure'),
      defaultColumnHeader: m<{ columnIndex: number }>('Column {columnIndex}'),
      emptyStateMessage: m('Start by mapping file columns.'),
      fileHeader: m('File'),
      finishedMappingIds: m<{
        numMappedTo: number;
        numPeople: number;
      }>(
        '{numPeople, plural, =1 {1 person} other {# people}} mapped to {numMappedTo, plural, =1 {1 Zetkin ID} other {# Zetkin IDs}}'
      ),
      finishedMappingOrganizations: m<{
        numMappedTo: number;
        numPeople: number;
      }>(
        '{numPeople, plural, =1 {1 person} other {# people}} mapped to {numMappedTo, plural, =1 {1 organization} other {# organizations}}'
      ),
      finishedMappingTags: m<{
        numMappedTo: number;
        numPeople: number;
      }>(
        '{numPeople, plural, =1 {1 person} other {# people}} mapped to {numMappedTo, plural, =1 {1 tag} other {# tags}}'
      ),
      header: m('Mapping'),
      id: m('Id'),
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
      needsConfig: m('You need to configure the ids'),
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
    title: m('Import people'),
  },
  restart: m('Restart'),
  steps: {
    configure: m('Configure'),
    import: m('Import'),
    upload: m('Upload'),
    validate: m('Validate'),
  },
});
