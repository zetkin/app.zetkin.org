import { Box } from '@mui/material';
import React from 'react';
import {
  GridColDef,
  GridSortModel,
  GridToolbarFilterButton,
} from '@mui/x-data-grid-pro';

import ZUIDataTableSearch from 'zui/ZUIDataTableSearch';
import ZUIDataTableSorting from 'zui/ZUIDataTableSorting';

interface ToolbarProps {
  gridColumns: GridColDef[];
  onQuickSearchChange: (quickSearch: string) => void;
  onSortModelChange: (model: GridSortModel) => void;
  sortModel: GridSortModel;
}

const Toolbar: React.FunctionComponent<ToolbarProps> = ({
  gridColumns,
  onQuickSearchChange,
  onSortModelChange,
  sortModel,
}) => {
  return (
    <Box role="toolbar">
      <GridToolbarFilterButton
        componentsProps={{
          button: { color: 'secondary', size: 'medium' },
        }}
      />
      <ZUIDataTableSorting
        gridColumns={gridColumns}
        onSortModelChange={onSortModelChange}
        sortModel={sortModel}
      />
      <ZUIDataTableSearch
        onChange={(searchString) => onQuickSearchChange(searchString)}
        searchById
      />
    </Box>
  );
};

export default Toolbar;
