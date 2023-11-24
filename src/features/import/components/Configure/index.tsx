import { Box } from '@mui/material';
import { FC, useState } from 'react';

import Configuration from './Configuration';
import Mapping from './Mapping';
import Preview from './Preview';
import SheetSettings from './SheetSettings';
import { useNumericRouteParams } from 'core/hooks';
import useUIDataColumns from 'features/import/hooks/useUIDataColumns';

const Configure: FC = () => {
  const [columnIndexBeingConfigured, setColumnIndexBeingConfigured] = useState<
    number | null
  >(null);
  const { orgId } = useNumericRouteParams();
  const uiDataColumns = useUIDataColumns(orgId);

  return (
    <Box display="flex" flexDirection="column" height="100%" overflow="hidden">
      <Box display="flex" flexGrow={1} overflow="hidden">
        <Box
          display="flex"
          flexDirection="column"
          sx={{ overflowY: 'scroll' }}
          width="50%"
        >
          <SheetSettings
            clearConfiguration={() => setColumnIndexBeingConfigured(null)}
          />
          <Mapping
            clearConfiguration={() => setColumnIndexBeingConfigured(null)}
            columnIndexBeingConfigured={columnIndexBeingConfigured}
            columns={uiDataColumns}
            onConfigureStart={(columnIndex: number) =>
              setColumnIndexBeingConfigured(columnIndex)
            }
          />
        </Box>
        <Box display="flex" flexDirection="column" width="50%">
          <Configuration
            uiDataColumn={
              typeof columnIndexBeingConfigured == 'number'
                ? uiDataColumns[columnIndexBeingConfigured]
                : null
            }
          />
        </Box>
      </Box>
      <Preview />
    </Box>
  );
};

export default Configure;
