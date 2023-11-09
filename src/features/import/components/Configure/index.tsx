import { Box } from '@mui/material';
import { FC, useState } from 'react';

import Configuration from './Configuration';
import Mapping from './Mapping';
import SheetSettings from './SheetSettings';
import useColumns from 'features/import/hooks/useColumns';
import useSheets from 'features/import/hooks/useSheets';
import { ConfiguringData, FieldTypes } from 'features/import/utils/types';

const Configure: FC = () => {
  const {
    firstRowIsHeaders,
    selectedSheet,
    selectedSheetIndex,
    sheets,
    updateFirstRowIsHeaders,
    updateSelectedSheetIndex,
  } = useSheets();

  const [currentlyConfiguring, setCurrentlyConfiguring] =
    useState<ConfiguringData | null>(null);

  const { allColumns, selectedColumnIds, updateSelectedColumnIds } = useColumns(
    firstRowIsHeaders,
    selectedSheet?.data || []
  );

  return (
    <Box display="flex" flexDirection="column" height="100%" overflow="hidden">
      <Box display="flex" flexGrow={1} overflow="hidden">
        <Box display="flex" flexDirection="column" width="50%">
          <SheetSettings
            firstRowIsHeaders={firstRowIsHeaders}
            onChangeFirstRowIsHeaders={updateFirstRowIsHeaders}
            onChangeSelectedSheet={(index: number) => {
              updateSelectedSheetIndex(index);
              updateSelectedColumnIds([]);
              setCurrentlyConfiguring(null);
            }}
            selectedSheetIndex={selectedSheetIndex}
            sheets={sheets}
          />
          <Mapping
            clearCurrentlyConfiguring={() => setCurrentlyConfiguring(null)}
            columns={allColumns}
            currentlyConfiguring={currentlyConfiguring}
            onMapValues={(columnId: number, type: FieldTypes) =>
              setCurrentlyConfiguring({ columnId, type })
            }
            onSelectColumn={(columnId: number, isChecked: boolean) => {
              if (isChecked) {
                updateSelectedColumnIds([...selectedColumnIds, columnId]);
              } else {
                updateSelectedColumnIds(
                  selectedColumnIds.filter((id) => id != columnId)
                );
              }
            }}
            selectedColumnIds={selectedColumnIds}
          />
        </Box>
        <Box display="flex" flexDirection="column" width="50%">
          <Configuration
            columns={allColumns}
            currentlyConfiguring={currentlyConfiguring}
          />
        </Box>
      </Box>
      <Box padding={4}>Preview</Box>
    </Box>
  );
};

export default Configure;
