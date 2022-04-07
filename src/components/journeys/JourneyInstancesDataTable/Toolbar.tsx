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
  setQuickSearch: (quickSearch: string) => void;
  setSortModel: (model: GridSortModel) => void;
  sortModel: GridSortModel;
}

const Toolbar: React.FunctionComponent<ToolbarProps> = ({
  gridColumns,
  setQuickSearch,
  setSortModel,
  sortModel,
}) => {
  return (
    <Box role="toolbar">
      <GridToolbarFilterButton
        componentsProps={{
          button: { color: 'default', size: 'medium' },
        }}
      />
      <DataTableSorting
        gridColumns={gridColumns}
        setSortModel={setSortModel}
        sortModel={sortModel}
      />
      <DataTableSearch
        onChange={(searchString) => setQuickSearch(searchString)}
      />
    </Box>
  );
};

export default Toolbar;
