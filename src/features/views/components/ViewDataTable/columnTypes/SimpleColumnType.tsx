import { GridColDef } from '@mui/x-data-grid-pro';

import { IColumnType } from '.';
import { ZetkinViewColumn } from '../../types';

type SimpleData = string | number | boolean | null;

export default class SimpleColumnType
  implements IColumnType<ZetkinViewColumn, SimpleData>
{
  cellToString(cell: SimpleData | null): string {
    return cell ? cell.toString() : '';
  }

  getColDef(): Omit<GridColDef, 'field'> {
    return {};
  }

  getSearchableStrings(cell: SimpleData): string[] {
    return cell && cell !== true ? [cell.toString()] : [];
  }
}
