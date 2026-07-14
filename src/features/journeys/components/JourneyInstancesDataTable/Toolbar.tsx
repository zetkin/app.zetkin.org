import { Box } from '@mui/material';
import React from 'react';
import {
  DataGridProProps,
  GridColDef,
  GridSortModel,
  GridToolbarFilterButton,
} from '@mui/x-data-grid-pro';

import ZUIDataTableSearch from 'zui/ZUIDataTableSearch';
import ZUIDataTableSorting from 'zui/ZUIDataTableSorting';

interface ToolbarProps {
  gridColumns: GridColDef[];
  setQuickSearch: (quickSearch: string) => void;
  onSortModelChange: DataGridProProps['onSortModelChange'];
  sortModel: GridSortModel;
}

const Toolbar: React.FunctionComponent<ToolbarProps> = ({
  gridColumns,
  setQuickSearch,
  onSortModelChange,
  sortModel,
}) => {
  return (
    <Box role="toolbar">
      <GridToolbarFilterButton
        slotProps={{
          button: { color: 'secondary', size: 'medium' },
        }}
      />
      <ZUIDataTableSorting
        gridColumns={gridColumns}
        onSortModelChange={onSortModelChange}
        sortModel={sortModel}
      />
      <ZUIDataTableSearch onChange={setQuickSearch} searchById />
    </Box>
  );
};

export default Toolbar;
