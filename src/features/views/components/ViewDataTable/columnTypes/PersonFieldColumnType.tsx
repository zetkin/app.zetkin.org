import { GridColDef } from '@mui/x-data-grid-pro';
import isEmail from 'validator/lib/isEmail';

import { IColumnType } from '.';
import { PersonFieldViewColumn, ZetkinViewColumn } from '../../types';

const phoneRegex = /^(\+|0)?[\d\s-]{6,}$/;

const looksLikePhoneNumberish = (value: string): boolean => {
  // Check if the value matches the phone number regex
  return phoneRegex.test(value);
};

type SimpleData = string | number | boolean | null;

const getValue = (cell: SimpleData, column: PersonFieldViewColumn) => {
  if (column.config.enum_choices) {
    const choice = column.config.enum_choices.find((c) => c.key == cell);
    return choice?.label ?? '';
  } else {
    return cell != null ? cell.toString() : '';
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
        if (isEmail(value)) {
          return (
            <a href={`mailto:${value}`} style={{ textDecoration: 'none' }}>
              {value}
            </a>
          );
        }
        if (looksLikePhoneNumberish(value)) {
          return (
            <a href={`tel:${value}`} style={{ textDecoration: 'none' }}>
              {value}
            </a>
          );
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
