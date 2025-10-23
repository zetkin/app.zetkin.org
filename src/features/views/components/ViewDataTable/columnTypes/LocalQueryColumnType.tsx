import { Box, useTheme } from '@mui/material';
import { Check } from '@mui/icons-material';
import { FC } from 'react';
import { GridColDef } from '@mui/x-data-grid-pro';

import { IColumnType } from '.';
import SmartSearchDialog from 'features/smartSearch/components/SmartSearchDialog';
import { LocalQueryViewColumn, ZetkinViewColumn } from '../../types';

type LocalQueryViewCell = boolean | null;

export default class LocalQueryColumnType
  implements IColumnType<ZetkinViewColumn, LocalQueryViewCell>
{
  cellToString(cell: LocalQueryViewCell): string {
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

  renderConfigDialog(
    column: LocalQueryViewColumn,
    onConfigureColumnCancel: () => void,
    onConfigureColumnSave: (
      id: number,
      config: ZetkinViewColumn['config']
    ) => void
  ): JSX.Element {
    const query = {
      filter_spec: column.config.filter_spec,
      id: column.id,
    };
    return (
      <SmartSearchDialog
        onDialogClose={onConfigureColumnCancel}
        onSave={(query) => {
          onConfigureColumnSave(column.id, { filter_spec: query.filter_spec });
        }}
        query={query}
      />
    );
  }
}

const Cell: FC<{ cell: LocalQueryViewCell | undefined }> = ({ cell }) => {
  const theme = useTheme();

  if (!cell) {
    return null;
  }

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
