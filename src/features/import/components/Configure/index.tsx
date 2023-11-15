import { Box } from '@mui/material';
import { FC } from 'react';

import Configuration from './Configuration';
import Mapping from './Mapping';
import SheetSettings from './SheetSettings';
import useColumns from 'features/import/hooks/useColumns';

const Configure: FC = () => {
  const { columns, selectColumn } = useColumns();

  return (
    <Box display="flex" flexDirection="column" height="100%" overflow="hidden">
      <Box display="flex" flexGrow={1} overflow="hidden">
        <Box display="flex" flexDirection="column" width="50%">
          <SheetSettings />
          <Mapping
            columns={columns}
            onSelectColumn={(columnId: number) => {
              selectColumn(columnId);
            }}
          />
        </Box>
        <Box display="flex" flexDirection="column" width="50%">
          <Configuration columns={columns} />
        </Box>
      </Box>
      <Box padding={4}>Preview</Box>
    </Box>
  );
};

export default Configure;
