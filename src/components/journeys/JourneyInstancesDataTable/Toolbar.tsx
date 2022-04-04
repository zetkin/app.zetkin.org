import { Box } from '@material-ui/core';
import React from 'react';
import {
  GridColDef,
  GridSortModel,
  GridToolbarFilterButton,
} from '@mui/x-data-grid-pro';

import DataTableSorting from 'components/dataTables/DataTableSorting';

interface ToolbarProps {
  gridColumns: GridColDef[];
  setSortModel: (model: GridSortModel) => void;
  sortModel: GridSortModel;
}

const Toolbar: React.FunctionComponent<ToolbarProps> = ({
  gridColumns,
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
    </Box>
  );
};

export default Toolbar;
