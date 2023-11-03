import { Box } from '@mui/material';
import { FC, useState } from 'react';

import Configuration from './Configuration';
import { ExperimentalFieldTypes } from './Mapping/MappingRow';
import Mapping from './Mapping';
import SheetSettings, { ExperimentSheet } from './SheetSettings';

export interface ConfiguringData {
  columnId: number;
  type: ExperimentalFieldTypes;
}

interface ConfigureProps {
  sheets: ExperimentSheet[];
}

const Configure: FC<ConfigureProps> = ({ sheets }) => {
  //settings
  const [firstRowIsHeaders, setFirstRowIsHeaders] = useState(true);
  const [selectedSheetId, setSelectedSheetId] = useState(sheets[0].id);

  //mapping
  const [currentlyConfiguring, setCurrentlyConfiguring] =
    useState<ConfiguringData | null>(null);
  const [selectedColumns, setSelectedColumns] = useState<number[]>([]);

  const selectedSheet = sheets.find((sheet) => {
    return sheet.id == selectedSheetId;
  });

  return (
    <Box display="flex" flexDirection="column" height="100%" overflow="hidden">
      <Box display="flex" flexGrow={1} overflow="hidden">
        <Box display="flex" flexDirection="column" width="50%">
          <SheetSettings
            firstRowIsHeaders={firstRowIsHeaders}
            onChangeFirstRowIsHeaders={() =>
              setFirstRowIsHeaders(!firstRowIsHeaders)
            }
            onChangeSelectedSheet={(id: number) => {
              setSelectedSheetId(id);
              setSelectedColumns([]);
              setCurrentlyConfiguring(null);
            }}
            selectedSheet={selectedSheetId}
            sheets={sheets}
          />
          <Mapping
            clearCurrentlyConfiguring={() => setCurrentlyConfiguring(null)}
            currentlyConfiguring={currentlyConfiguring}
            firstRowIsHeaders={firstRowIsHeaders}
            onMapValues={(columnId: number, type: ExperimentalFieldTypes) =>
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
            rows={selectedSheet?.data}
            selectedColumns={selectedColumns}
          />
        </Box>
        <Box width="50%">
          <Configuration currentlyConfiguring={currentlyConfiguring} />
        </Box>
      </Box>
      <Box padding={4}>Preview</Box>
    </Box>
  );
};

export default Configure;
