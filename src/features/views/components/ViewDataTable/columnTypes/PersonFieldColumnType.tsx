import { GridColDef } from '@mui/x-data-grid-pro';
import { Link } from '@mui/material';

import { IColumnType } from '.';
import {
  NATIVE_PERSON_FIELDS,
  PersonFieldViewColumn,
  ZetkinViewColumn,
} from '../../types';
import notEmpty from 'utils/notEmpty';

type SimpleData = string | number | boolean | null;

const getValue = (cell: SimpleData, column: PersonFieldViewColumn) => {
  if (column.config.enum_choices) {
    const choice = column.config.enum_choices.find((c) => c.key === cell);
    return choice?.label ?? '';
  } else {
    return notEmpty(cell) ? cell.toString() : '';
  }
};

export default class PersonFieldColumnType
  implements IColumnType<ZetkinViewColumn, SimpleData>
{
  cellToString(cell: SimpleData, column: PersonFieldViewColumn): string {
    return getValue(cell, column);
  }

  getColDef(column: PersonFieldViewColumn): Omit<GridColDef, 'field'> {
    return {
      filterable: true,
      renderCell: (params) => {
        const cell = params.row[params.field];
        const value = getValue(cell, column);

        if (column.config.field === NATIVE_PERSON_FIELDS.EMAIL) {
          return <Link href={`mailto:${value}`}>{value}</Link>;
        }

        if (
          column.config.field === NATIVE_PERSON_FIELDS.PHONE ||
          column.config.field === NATIVE_PERSON_FIELDS.ALT_PHONE
        ) {
          return <Link href={`tel:${value}`}>{value}</Link>;
        }

        return <div>{value}</div>;
      },
      valueGetter: (params) => {
        const cell = params.row[params.field];
        return getValue(cell, column);
      },
    };
  }

  getSearchableStrings(
    cell: SimpleData,
    column: PersonFieldViewColumn
  ): string[] {
    return [getValue(cell, column)];
  }
}
