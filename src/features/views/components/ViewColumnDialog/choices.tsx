import { Button } from '@mui/material';
import { IntlShape } from 'react-intl';
import { Person } from '@mui/icons-material';

import DoubleIconCardVisual from './DoubleIconCardVisual';
import SingleIconCardVisual from './SingleIconCardVisual';
import {
  COLUMN_TYPE,
  PendingZetkinViewColumn,
  SelectedViewColumn,
  ZetkinViewColumn,
} from '../types';

export type ColumnChoice = {
  alreadyInView?: (columns: ZetkinViewColumn[]) => boolean;
  defaultColumns?: (intl: IntlShape) => PendingZetkinViewColumn[];
  key: string;
  renderCardVisual: (color: string) => JSX.Element;
  renderConfigForm?: (props: {
    onOutputConfigured: (columns: SelectedViewColumn[]) => void;
  }) => JSX.Element;
};

const choices: ColumnChoice[] = [
  {
    alreadyInView: (columns) => {
      const fieldsToAdd = ['first_name', 'last_name'];
      return fieldsToAdd.every((fieldName) =>
        columns.some(
          (col) =>
            col.type == COLUMN_TYPE.PERSON_FIELD &&
            col.config.field == fieldName
        )
      );
    },
    defaultColumns: (intl) => [
      {
        config: {
          field: 'first_name',
        },
        title: intl.formatMessage({
          id: 'misc.views.columnDialog.commonHeaders.firstName',
        }),
        type: COLUMN_TYPE.PERSON_FIELD,
      },
      {
        config: {
          field: 'last_name',
        },
        title: intl.formatMessage({
          id: 'misc.views.columnDialog.commonHeaders.lastName',
        }),
        type: COLUMN_TYPE.PERSON_FIELD,
      },
    ],
    key: 'firstAndLastName',
    renderCardVisual: (color: string) => {
      return <DoubleIconCardVisual color={color} icons={[Person, Person]} />;
    },
  },
  {
    key: 'personFields',
    renderCardVisual: (color: string) => {
      return <SingleIconCardVisual color={color} icon={Person} />;
    },
    renderConfigForm: (props: {
      onOutputConfigured: (columns: SelectedViewColumn[]) => void;
    }) => {
      return (
        <Button onClick={() => props.onOutputConfigured([])}>Klick!</Button>
      );
    },
  },
];

export default choices;
