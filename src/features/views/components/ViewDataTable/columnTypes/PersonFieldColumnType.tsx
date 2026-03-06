import { GridColDef } from '@mui/x-data-grid-pro';
import { Link } from '@mui/material';

import globalMessageIds from 'core/i18n/messageIds';
import { IColumnType } from '.';
import { Msg } from 'core/i18n';
import {
  NATIVE_PERSON_FIELDS,
  PersonFieldViewColumn,
  ZetkinViewColumn,
} from '../../types';
import { CUSTOM_FIELD_TYPE, ZetkinCustomField } from 'utils/types/zetkin';

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

  getColDef(
    column: PersonFieldViewColumn,
    _discarded: unknown,
    { customFieldsInfo }: { customFieldsInfo?: ZetkinCustomField[] }
  ): Omit<GridColDef, 'field'> {
    const customField = customFieldsInfo?.find(
      (cf) => cf.slug === column.config.field
    );
    const isDate = customField?.type === CUSTOM_FIELD_TYPE.DATE;

    return {
      filterable: true,
      renderCell: (params) => {
        const cell = params.row[params.field];
        const value = getValue(cell, column);

        if (column.config.field == NATIVE_PERSON_FIELDS.EMAIL) {
          return <Link href={`mailto:${value}`}>{value}</Link>;
        }

        if (column.config.field == NATIVE_PERSON_FIELDS.GENDER) {
          if (value == 'm' || value == 'f' || value == 'o') {
            return <Msg id={globalMessageIds.genderOptions[value]} />;
          }
          return <Msg id={globalMessageIds.genderOptions.unspecified} />;
        }

        if (
          column.config.field == NATIVE_PERSON_FIELDS.PHONE ||
          column.config.field == NATIVE_PERSON_FIELDS.ALT_PHONE
        ) {
          return <Link href={`tel:${value}`}>{value}</Link>;
        }
        return <div>{value}</div>;
      },
      type: isDate ? 'date' : undefined,
      valueGetter: (value: SimpleData) => {
        if (isDate && typeof value === 'string') {
          // For date fields, MUI expects a Date object
          return new Date(value);
        }

        return getValue(value, column);
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
