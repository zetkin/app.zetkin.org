import { Box } from '@material-ui/core';
import React from 'react';
import { GridSortModel, GridToolbarFilterButton } from '@mui/x-data-grid-pro';

interface ToolbarProps {
  disabled: boolean;
  setQuickSearch: (quickSearch: string) => void;
  setSortModel: (model: GridSortModel) => void;
  sortModel: GridSortModel;
}

const Toolbar: React.FunctionComponent<ToolbarProps> = () => {
  return (
    <Box role="toolbar">
      <GridToolbarFilterButton
        componentsProps={{
          button: { color: 'default', size: 'medium' },
        }}
      />
    </Box>
  );
};

export default Toolbar;
