import { GridCellValue, GridRenderCellParams } from '@mui/x-data-grid-pro';

/**
 * This generic version of the standard GridRenderCellParams type supports any
 * type of value (e.g. complex objects returned for some types of Zetkin View
 * columns), whereas the standard one only supports POD types.
 */
export type ViewGridCellParams<Value = GridCellValue> = GridRenderCellParams & {
  value: Value;
};
