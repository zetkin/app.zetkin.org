import { FC } from 'react';
import { GridColDef } from '@mui/x-data-grid-pro';
import { Link } from '@mui/material';

import messageIds from 'features/duplicates/l10n/messageIds';
import { IColumnType } from '.';
import {
  NATIVE_PERSON_FIELDS,
  PersonFieldViewColumn,
  ZetkinViewColumn,
} from '../../types';
import { useMessages } from 'core/i18n';

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
        {
          return <CellContent fieldType={column.config.field} value={value} />;
        }
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

const CellContent: FC<{ fieldType: string; value: string }> = ({
  fieldType,
  value,
}) => {
  const messages = useMessages(messageIds);

  if (fieldType == NATIVE_PERSON_FIELDS.GENDER) {
    let genderString = '';
    if (value === 'f') {
      genderString = messages.modal.fieldSettings.gender.f();
    } else if (value === 'm') {
      genderString = messages.modal.fieldSettings.gender.m();
    } else if (value === 'o') {
      genderString = messages.modal.fieldSettings.gender.o();
    }
    return <div>{genderString}</div>;
  }

  if (fieldType == NATIVE_PERSON_FIELDS.EMAIL) {
    return <Link href={`mailto:${value}`}>{value}</Link>;
  }

  if (
    fieldType == NATIVE_PERSON_FIELDS.PHONE ||
    fieldType == NATIVE_PERSON_FIELDS.ALT_PHONE
  ) {
    return <Link href={`tel:${value}`}>{value}</Link>;
  }

  return <div>{value}</div>;
};
