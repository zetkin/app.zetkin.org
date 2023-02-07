import { Person } from '@mui/icons-material';

import { ColumnChoice } from '.';
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
  defaultColumns: (intl) => [
    {
      config: {
        field: NATIVE_PERSON_FIELDS.FIRST_NAME,
      },
      title: intl.formatMessage({
        id: 'misc.views.columnDialog.commonHeaders.firstName',
      }),
      type: COLUMN_TYPE.PERSON_FIELD,
    },
    {
      config: {
        field: NATIVE_PERSON_FIELDS.LAST_NAME,
      },
      title: intl.formatMessage({
        id: 'misc.views.columnDialog.commonHeaders.lastName',
      }),
      type: COLUMN_TYPE.PERSON_FIELD,
    },
  ],
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
