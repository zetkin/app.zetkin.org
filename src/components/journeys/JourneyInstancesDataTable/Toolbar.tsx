import { Box } from '@material-ui/core';
import React from 'react';
import {
  GridColDef,
  GridSortModel,
  GridToolbarFilterButton,
} from '@mui/x-data-grid-pro';

import DataTableSearch from 'components/dataTables/DataTableSearch';
import DataTableSorting from 'components/dataTables/DataTableSorting';

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
      <DataTableSorting
        gridColumns={gridColumns}
        onSortModelChange={onSortModelChange}
        sortModel={sortModel}
      />
      <DataTableSearch
        onChange={(searchString) => onQuickSearchChange(searchString)}
        searchById
      />
    </Box>
  );
};

export default Toolbar;
