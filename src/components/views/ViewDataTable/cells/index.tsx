import { GridCellValue, GridRenderCellParams } from '@mui/x-data-grid-pro';

export type ViewGridCellParams<Value = GridCellValue> = GridRenderCellParams & {
    value: Value;
}
