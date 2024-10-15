import { GridColDef } from '@mui/x-data-grid-pro';

import { IColumnType } from '.';
import { PersonFieldViewColumn, ZetkinViewColumn } from '../../types';
import { EnumChoice } from 'utils/types/zetkin';

type SimpleData = string | number | boolean | null;

export default class PersonFieldColumnType
  implements IColumnType<ZetkinViewColumn, SimpleData>
{
  cellToString(): string {
    return '';
  }

  private enumChoices: EnumChoice[] | null = null;

  getColDef(column: PersonFieldViewColumn): Omit<GridColDef, 'field'> {
    return {
      filterable: true,
      valueGetter: (params) => {
        const cell = params.row[params.field];
        if (column.config.enum_choices) {
          this.enumChoices = column.config.enum_choices;
          const choice = column.config.enum_choices.find((c) => c.key == cell);
          return choice?.label ?? '';
        } else {
          return cell ? cell.toString() : '';
        }
      },
    };
  }

  getSearchableStrings(cell: SimpleData): string[] {
    if (this.enumChoices) {
      const choice = this.enumChoices.find((c) => c.key == cell);
      return choice ? [choice.label] : [];
    } else {
      return cell && cell !== true ? [cell.toString()] : [];
    }
  }
}
