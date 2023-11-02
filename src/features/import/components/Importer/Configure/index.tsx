import { CompareArrows } from '@mui/icons-material';
import { Box, useTheme } from '@mui/material';
import { FC, useState } from 'react';

import AccordionSection from './AccordionSection';
import { ExperimentalFieldTypes } from './Mapping/MappingRow';
import Mapping from './Mapping';
import messageIds from 'features/import/l10n/messageIds';
import { useMessages } from 'core/i18n';
import ZUIEmptyState from 'zui/ZUIEmptyState';
import SheetSettings, { ExperimentSheet } from './SheetSettings';

export interface MappingData {
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
  const [currentlyMapping, setCurrentlyMapping] = useState<MappingData | null>(
    null
  );
  const [selectedColumns, setSelectedColumns] = useState<number[]>([]);

  const selectedSheet = sheets.find((sheet) => {
    return sheet.id == selectedSheetId;
  });

  return (
    <Box display="flex">
      <Box width="50%">
        <AccordionSection header={messages.configuration.settings.header()}>
          <SheetSettings
            firstRowIsHeaders={firstRowIsHeaders}
            onChangeFirstRowIsHeaders={() =>
              setFirstRowIsHeaders(!firstRowIsHeaders)
            }
            onChangeSelectedSheet={(id: number) => {
              setSelectedSheetId(id);
              setSelectedColumns([]);
              setCurrentlyMapping(null);
            }}
            selectedSheet={selectedSheetId}
            sheets={sheets}
          />
        </AccordionSection>
        <AccordionSection header={messages.configuration.mapping.header()}>
          <Mapping
            clearCurrentlyMapping={() => setCurrentlyMapping(null)}
            currentlyMapping={currentlyMapping}
            firstRowIsHeaders={firstRowIsHeaders}
            onMapValues={(columnId: number, type: ExperimentalFieldTypes) =>
              setCurrentlyMapping({ columnId, type })
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
        </AccordionSection>
      </Box>
      <Box width="50%">
        {currentlyMapping && <>Mapping</>}
        {!currentlyMapping && (
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
  );
};

export default Configure;
