import { Box } from '@mui/material';
import { Check } from '@mui/icons-material';
import { FC } from 'react';
import { GridColDef } from '@mui/x-data-grid-pro';

import { IColumnType } from '.';
import theme from '../../../../../theme';
import { ZetkinViewColumn } from '../../types';

type LocalQueryViewCell = boolean;

export default class LocalQueryColumnType
  implements IColumnType<ZetkinViewColumn, LocalQueryViewCell>
{
  cellToString(cell: LocalQueryViewCell | null): string {
    return cell ? cell.toString() : '';
  }

  getColDef(): Omit<GridColDef, 'field'> {
    return {
      renderCell: (params) => {
        return <Cell cell={params.value} />;
      },
      type: 'boolean',
      width: 150,
    };
  }

  getSearchableStrings(): string[] {
    return [];
  }
}

const Cell: FC<{ cell: LocalQueryViewCell | undefined }> = () => {
  return (
    <Box
      alignItems="center"
      bgcolor={theme.palette.success.light}
      display="flex"
      height="100%"
      justifyContent="center"
      width="100%"
    >
      <Check sx={{ opacity: '0.5' }} />
    </Box>
  );
};
