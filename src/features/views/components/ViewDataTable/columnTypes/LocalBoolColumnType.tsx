import { Box, Checkbox, useTheme } from '@mui/material';
import { FC, KeyboardEvent } from 'react';
import {
  GridColDef,
  GridRenderCellParams,
  MuiEvent,
} from '@mui/x-data-grid-pro';

import { IColumnType } from '.';
import useViewDataModel from 'features/views/hooks/useViewDataModel';
import ViewDataModel from 'features/views/models/ViewDataModel';
import { ZetkinObjectAccess } from 'core/api/types';
import {
  LocalBoolViewColumn,
  ZetkinViewColumn,
  ZetkinViewRow,
} from '../../types';

export default class LocalBoolColumnType implements IColumnType {
  cellToString(cell: boolean | null): string {
    return String(!!cell);
  }

  getColDef(column: LocalBoolViewColumn): Omit<GridColDef, 'field'> {
    return {
      headerAlign: 'center',
      renderCell: (params: GridRenderCellParams<ZetkinViewRow, boolean>) => {
        return (
          <Cell cell={params.value} column={column} personId={params.row.id} />
        );
      },
      type: 'boolean',
    };
  }

  getSearchableStrings(): string[] {
    return [];
  }

  handleKeyDown(
    model: ViewDataModel,
    column: ZetkinViewColumn,
    personId: number,
    data: boolean,
    ev: MuiEvent<KeyboardEvent<HTMLElement>>,
    accessLevel: ZetkinObjectAccess['level'] | null
  ): void {
    if (accessLevel == 'readonly') {
      return;
    }

    if (ev.key == 'Enter' || ev.key == ' ') {
      model.setCellValue(personId, column.id, !data);
      ev.defaultMuiPrevented = true;
      ev.preventDefault();
    }
  }
}

const Cell: FC<{
  cell?: boolean | undefined;
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
        tabIndex={-1}
      />
    </Box>
  );
};
