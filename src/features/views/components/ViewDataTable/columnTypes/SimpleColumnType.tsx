import { GridColDef } from '@mui/x-data-grid-pro';

import { IColumnType } from '.';
import { ZetkinViewColumn } from '../../types';

type SimpleData = string | number | boolean;

export default class SimpleColumnType
  implements IColumnType<ZetkinViewColumn, SimpleData>
{
  cellToString(cell: SimpleData): string {
    return cell.toString();
  }

  getColDef(): Omit<GridColDef, 'field'> {
    return {};
  }
}
