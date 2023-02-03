import { FC } from 'react';
import { Box, Checkbox, useTheme } from '@mui/material';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid-pro';

import { IColumnType } from '.';
import useViewDataModel from 'features/views/hooks/useViewDataModel';
import { LocalBoolViewColumn, ZetkinViewRow } from '../../types';

export default class LocalBoolColumnType implements IColumnType {
  cellToString(cell: boolean): string {
    return String(cell);
  }

  getColDef(column: LocalBoolViewColumn): Omit<GridColDef, 'field'> {
    return {
      headerAlign: 'center',
      renderCell: (params: GridRenderCellParams<boolean, ZetkinViewRow>) => {
        return (
          <Cell cell={params.value} column={column} personId={params.row.id} />
        );
      },
    };
  }
}

const Cell: FC<{
  cell?: boolean;
  column: LocalBoolViewColumn;
  personId: number;
}> = ({ cell, column, personId }) => {
  const theme = useTheme();
  const model = useViewDataModel();

  const checked = !!cell;

  return (
    <Box
      alignItems="center"
      bgcolor={checked ? theme.palette.success.light : 'none'}
      display="flex"
      height="100%"
      justifyContent="center"
      width="100%"
    >
      <Checkbox
        checked={checked}
        color="success"
        onChange={(ev) => {
          model.setCellValue(personId, column.id, !!ev.target.checked);
        }}
      />
    </Box>
  );
};
