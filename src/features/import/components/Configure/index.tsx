import { Box } from '@mui/material';
import { FC, useState } from 'react';

import Configuration from './Configuration';
import Mapping from './Mapping';
import SheetSettings from './SheetSettings';
import useUIDataColumns from 'features/import/hooks/useColumns';

const Configure: FC = () => {
  const [columnIndexBeingConfigured, setColumnIndexBeingConfigured] = useState<
    number | null
  >(null);
  const uiDataColumns = useUIDataColumns();

  return (
    <Box display="flex" flexDirection="column" height="100%" overflow="hidden">
      <Box display="flex" flexGrow={1} overflow="hidden">
        <Box display="flex" flexDirection="column" width="50%">
          <SheetSettings />
          <Mapping
            columnIndexBeingConfigured={columnIndexBeingConfigured}
            columns={uiDataColumns}
            onConfigureStart={(columnIndex: number) =>
              setColumnIndexBeingConfigured(columnIndex)
            }
            onDeselectColumn={() => setColumnIndexBeingConfigured(null)}
          />
        </Box>
        <Box display="flex" flexDirection="column" width="50%">
          <Configuration
            columnIndexBeingConfigured={columnIndexBeingConfigured}
            uiDataColumns={uiDataColumns}
          />
        </Box>
      </Box>
      <Box padding={4}>Preview</Box>
    </Box>
  );
};

export default Configure;
