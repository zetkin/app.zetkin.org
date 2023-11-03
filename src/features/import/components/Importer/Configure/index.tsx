import { CompareArrows } from '@mui/icons-material';
import { Box, useTheme } from '@mui/material';
import { FC, useState } from 'react';

import { ExperimentalFieldTypes } from './Mapping/MappingRow';
import Mapping from './Mapping';
import messageIds from 'features/import/l10n/messageIds';
import { useMessages } from 'core/i18n';
import ZUIEmptyState from 'zui/ZUIEmptyState';
import SheetSettings, { ExperimentSheet } from './SheetSettings';

export interface ConfiguringData {
  columnId: number;
  type: ExperimentalFieldTypes;
}

interface ConfigureProps {
  sheets: ExperimentSheet[];
}

const Configure: FC<ConfigureProps> = ({ sheets }) => {
  const messages = useMessages(messageIds);
  const theme = useTheme();

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
          {currentlyConfiguring && <>Mapping</>}
          {!currentlyConfiguring && (
            <Box
              alignItems="center"
              bgcolor={theme.palette.transparentGrey.light}
              display="flex"
              height="100%"
              justifyContent="center"
            >
              <ZUIEmptyState
                message={messages.configuration.mapping.emptyStateMessage()}
                renderIcon={(props) => <CompareArrows {...props} />}
              />
            </Box>
          )}
        </Box>
      </Box>
      <Box padding={4}>Preview</Box>
    </Box>
  );
};

export default Configure;
