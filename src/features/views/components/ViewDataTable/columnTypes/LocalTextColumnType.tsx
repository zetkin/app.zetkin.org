import { GridColDef } from '@mui/x-data-grid-pro';
import { IColumnType } from '.';
import ViewDataModel from 'features/views/models/ViewDataModel';

type LocalTextViewCell = string;

export default class LocalTextColumnType implements IColumnType {
  cellToString(cell: LocalTextViewCell): string {
    return cell ? cell : '';
  }
  getColDef(): Omit<GridColDef, 'field'> {
    return {
      editable: true,
      width: 250,
    };
  }
  processRowUpdate(
    model: ViewDataModel,
    colId: number,
    personId: number,
    data: LocalTextViewCell
  ): void {
    model.setCellValue(personId, colId, data);
  }
}
