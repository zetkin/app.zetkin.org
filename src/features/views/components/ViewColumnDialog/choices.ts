import { IntlShape } from 'react-intl';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { Person } from '@mui/icons-material';
import { SvgIconTypeMap } from '@mui/material/SvgIcon';
import {
  COLUMN_TYPE,
  PendingZetkinViewColumn,
  SelectedViewColumn,
  ZetkinViewColumn,
} from '../types';

export type ColumnChoice = {
  alreadyInView?: (columns: ZetkinViewColumn[]) => boolean;
  defaultColumns?: (intl: IntlShape) => PendingZetkinViewColumn[];
  icons: OverridableComponent<SvgIconTypeMap<Record<string, unknown>, 'svg'>>[];
  key: string;
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
    icons: [Person, Person],
    key: 'firstAndLastName',
  },
];

export default choices;
