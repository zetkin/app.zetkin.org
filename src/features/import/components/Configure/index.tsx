import { Box } from '@mui/material';
import { FC, useState } from 'react';

import Configuration from './Configuration';
import Mapping from './Mapping';
import SheetSettings from './SheetSettings';
import useColumns from 'features/import/hooks/useColumns';
import useSheets from 'features/import/hooks/useSheets';
import { FieldTypes, Sheet } from 'features/import/utils/types';

export interface ConfiguringData {
  columnId: number;
  type: FieldTypes;
}

export type SheetWithId = Sheet & { id: number };

const Configure: FC = () => {
  const {
    firstRowIsHeaders,
    selectedSheet,
    selectedSheetIndex,
    sheets,
    updateFirstRowIsHeaders,
    updateSelectedSheetIndex,
  } = useSheets();

  //mapping
  const [currentlyConfiguring, setCurrentlyConfiguring] =
    useState<ConfiguringData | null>(null);

  const [selectedColumns, setSelectedColumns] = useState<number[]>([]);

  const columns = useColumns(firstRowIsHeaders, selectedSheet?.data || []);

  return (
    <Box display="flex" flexDirection="column" height="100%" overflow="hidden">
      <Box display="flex" flexGrow={1} overflow="hidden">
        <Box display="flex" flexDirection="column" width="50%">
          <SheetSettings
            firstRowIsHeaders={firstRowIsHeaders}
            onChangeFirstRowIsHeaders={updateFirstRowIsHeaders}
            onChangeSelectedSheet={(index: number) => {
              updateSelectedSheetIndex(index);
              setSelectedColumns([]);
              setCurrentlyConfiguring(null);
            }}
            selectedSheetIndex={selectedSheetIndex}
            sheets={sheets}
          />
          <Mapping
            clearCurrentlyConfiguring={() => setCurrentlyConfiguring(null)}
            columns={columns}
            currentlyConfiguring={currentlyConfiguring}
            onMapValues={(columnId: number, type: FieldTypes) =>
              setCurrentlyConfiguring({ columnId, type })
            }
            onSelectColumn={(columnId: number, isChecked: boolean) => {
              if (isChecked) {
                setSelectedColumns([...selectedColumns, columnId]);
              } else {
                setSelectedColumns(
                  selectedColumns.filter((id) => id != columnId)
                );
              }
            }}
            selectedColumns={selectedColumns}
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
