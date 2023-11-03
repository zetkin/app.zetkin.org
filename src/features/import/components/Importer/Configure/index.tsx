import {
  AccordionDetails,
  AccordionSummary,
  Box,
  styled,
  Typography,
  useTheme,
} from '@mui/material';
import { CompareArrows, ExpandMore } from '@mui/icons-material';
import { FC, useState } from 'react';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';

import { ExperimentalFieldTypes } from './Mapping/MappingRow';
import Mapping from './Mapping';
import messageIds from 'features/import/l10n/messageIds';
import ZUIEmptyState from 'zui/ZUIEmptyState';
import { Msg, useMessages } from 'core/i18n';
import SheetSettings, { ExperimentSheet } from './SheetSettings';

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(() => ({
  '&:before': {
    display: 'none',
  },
  border: 0,
}));

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
  const [settingsExpanded, setSettingsExpanded] = useState(true);

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
          <Accordion
            defaultExpanded
            disableGutters
            onChange={(ev, isExpanded) => setSettingsExpanded(isExpanded)}
          >
            <AccordionSummary
              expandIcon={
                <ExpandMore sx={{ color: theme.palette.primary.main }} />
              }
            >
              <Box display="flex" justifyContent="space-between" width="100%">
                <Typography variant="h5">
                  <Msg id={messageIds.configuration.settings.header} />
                </Typography>
                <Typography color={theme.palette.primary.main} paddingRight={1}>
                  {settingsExpanded
                    ? messages.configuration.hide().toLocaleUpperCase()
                    : messages.configuration.show().toLocaleUpperCase()}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
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
            </AccordionDetails>
          </Accordion>
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
