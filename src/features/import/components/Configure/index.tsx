import { Box } from '@mui/material';
import { FC, useState } from 'react';

import Configuration from './Configuration';
import Mapping from './Mapping';
import SheetSettings from './SheetSettings';
import useColumns from 'features/import/hooks/useColumns';
import useSheets from 'features/import/hooks/useSheets';
import { ConfiguringData, FieldTypes } from 'features/import/utils/types';

const Configure: FC = () => {
  const { updateSelectedSheetIndex } = useSheets();

  const [currentlyConfiguring, setCurrentlyConfiguring] =
    useState<ConfiguringData | null>(null);

  const { columns, selectColumn } = useColumns();

  return (
    <Box display="flex" flexDirection="column" height="100%" overflow="hidden">
      <Box display="flex" flexGrow={1} overflow="hidden">
        <Box display="flex" flexDirection="column" width="50%">
          <SheetSettings
            onChangeSelectedSheet={(index: number) => {
              updateSelectedSheetIndex(index);
              setCurrentlyConfiguring(null);
            }}
          />
          <Mapping
            clearCurrentlyConfiguring={() => setCurrentlyConfiguring(null)}
            columns={columns}
            currentlyConfiguring={currentlyConfiguring}
            onMapValues={(columnId: number, type: FieldTypes) =>
              setCurrentlyConfiguring({ columnId, type })
            }
            onSelectColumn={(columnId: number) => {
              selectColumn(columnId);
            }}
          />
        </Box>
        <Box display="flex" flexDirection="column" width="50%">
          <Configuration
            columns={columns}
            currentlyConfiguring={currentlyConfiguring}
          />
        </Box>
      </Box>
      <Box padding={4}>Preview</Box>
    </Box>
  );
};

export default Configure;
