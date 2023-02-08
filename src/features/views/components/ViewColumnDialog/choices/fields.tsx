import { Person } from '@mui/icons-material';

import { ColumnChoice } from './types';
import DoubleIconCardVisual from '../DoubleIconCardVisual';
import PersonFieldConfig from '../PersonFieldConfig';
import SingleIconCardVisual from '../SingleIconCardVisual';
import theme from 'theme';
import {
  COLUMN_TYPE,
  NATIVE_PERSON_FIELDS,
  SelectedViewColumn,
  ZetkinViewColumn,
} from '../../types';

const { blue, purple } = theme.palette.viewColumnGallery;

export const fullName: ColumnChoice = {
  alreadyInView: (columns) => {
    const fieldsToAdd = [
      NATIVE_PERSON_FIELDS.FIRST_NAME,
      NATIVE_PERSON_FIELDS.LAST_NAME,
    ];
    return fieldsToAdd.every((fieldName) =>
      columns.some(
        (col) =>
          col.type == COLUMN_TYPE.PERSON_FIELD && col.config.field == fieldName
      )
    );
  },
  color: purple,
  defaultColumns: (intl, existingColumns) => {
    const bothColumns = [
      {
        config: {
          field: NATIVE_PERSON_FIELDS.FIRST_NAME,
        },
        title: intl.formatMessage({
          id: 'misc.views.columnDialog.commonHeaders.first_name',
        }),
        type: COLUMN_TYPE.PERSON_FIELD,
      },
      {
        config: {
          field: NATIVE_PERSON_FIELDS.LAST_NAME,
        },
        title: intl.formatMessage({
          id: 'misc.views.columnDialog.commonHeaders.last_name',
        }),
        type: COLUMN_TYPE.PERSON_FIELD,
      },
    ];

    // Return first name, last name or both depending on what columns
    // already exist in the view, to avoid duplicates.
    return bothColumns.filter(
      (nameCol) =>
        !existingColumns.some(
          (exCol) =>
            exCol.type == COLUMN_TYPE.PERSON_FIELD &&
            exCol.config.field == nameCol.config.field
        )
    );
  },
  isRestricted: true,
  renderCardVisual: (color: string) => {
    return <DoubleIconCardVisual color={color} icons={[Person, Person]} />;
  },
};

export const pickFields: ColumnChoice = {
  alreadyInView: (columns) => {
    return Object.values(NATIVE_PERSON_FIELDS).every((fieldName) =>
      columns.some(
        (col) =>
          col.type == COLUMN_TYPE.PERSON_FIELD && col.config.field == fieldName
      )
    );
  },
  color: blue,
  isRestricted: true,
  renderCardVisual: (color: string) => (
    <SingleIconCardVisual color={color} icon={Person} />
  ),
  renderConfigForm: (props: {
    existingColumns: ZetkinViewColumn[];
    onOutputConfigured: (columns: SelectedViewColumn[]) => void;
  }) => (
    <PersonFieldConfig
      existingColumns={props.existingColumns}
      onOutputConfigured={props.onOutputConfigured}
    />
  ),
};

function createFieldChoice(field: NATIVE_PERSON_FIELDS): ColumnChoice {
  return {
    alreadyInView: (columns) => {
      return columns.some(
        (col) =>
          col.type == COLUMN_TYPE.PERSON_FIELD && col.config.field == field
      );
    },
    color: purple,
    defaultColumns: (intl) => [
      {
        config: {
          field: field,
        },
        title: intl.formatMessage({
          id: `misc.views.columnDialog.commonHeaders.${field}`,
        }),
        type: COLUMN_TYPE.PERSON_FIELD,
      },
    ],
    isRestricted: true,
    renderCardVisual: (color: string) => {
      return <SingleIconCardVisual color={color} icon={Person} />;
    },
  };
}

export const firstName = createFieldChoice(NATIVE_PERSON_FIELDS.FIRST_NAME);
export const lastName = createFieldChoice(NATIVE_PERSON_FIELDS.LAST_NAME);
export const email = createFieldChoice(NATIVE_PERSON_FIELDS.EMAIL);
export const phone = createFieldChoice(NATIVE_PERSON_FIELDS.PHONE);
