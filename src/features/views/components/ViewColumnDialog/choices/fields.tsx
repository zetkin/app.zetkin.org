import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material';
import { Email, Person, Phone } from '@mui/icons-material';

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
  defaultColumns: (messages, existingColumns) => {
    const bothColumns = [
      {
        config: {
          field: NATIVE_PERSON_FIELDS.FIRST_NAME,
        },
        title: messages.columnDialog.commonHeaders.first_name(),
        type: COLUMN_TYPE.PERSON_FIELD,
      },
      {
        config: {
          field: NATIVE_PERSON_FIELDS.LAST_NAME,
        },
        title: messages.columnDialog.commonHeaders.last_name(),
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

function createFieldChoice(
  field:
    | NATIVE_PERSON_FIELDS.FIRST_NAME
    | NATIVE_PERSON_FIELDS.LAST_NAME
    | NATIVE_PERSON_FIELDS.EMAIL
    | NATIVE_PERSON_FIELDS.PHONE,
  icon: OverridableComponent<SvgIconTypeMap<Record<string, unknown>, 'svg'>>
): ColumnChoice {
  return {
    alreadyInView: (columns) => {
      return columns.some(
        (col) =>
          col.type == COLUMN_TYPE.PERSON_FIELD && col.config.field == field
      );
    },
    color: blue,
    defaultColumns: (messages) => [
      {
        config: {
          field: field,
        },
        title: messages.columnDialog.commonHeaders[field](),
        type: COLUMN_TYPE.PERSON_FIELD,
      },
    ],
    renderCardVisual: (color: string) => {
      return <SingleIconCardVisual color={color} icon={icon} />;
    },
  };
}

export const firstName = createFieldChoice(
  NATIVE_PERSON_FIELDS.FIRST_NAME,
  Person
);
export const lastName = createFieldChoice(
  NATIVE_PERSON_FIELDS.LAST_NAME,
  Person
);
export const email = createFieldChoice(NATIVE_PERSON_FIELDS.EMAIL, Email);
export const phone = createFieldChoice(NATIVE_PERSON_FIELDS.PHONE, Phone);
