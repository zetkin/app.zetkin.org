import ExpandMore from '@mui/icons-material/ExpandMore';
import {
  AccordionDetails,
  AccordionSummary,
  Box,
  styled,
  Typography,
  useTheme,
} from '@mui/material';
import { FC, useState } from 'react';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';

import Mapping from './Mapping';
import messageIds from 'features/import/l10n/messageIds';
import { Msg, useMessages } from 'core/i18n';
import SheetSettings, { ExperimentSheet } from './SheetSettings';

interface ConfigureProps {
  sheets: ExperimentSheet[];
}

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(() => ({
  '&:before': {
    display: 'none',
  },
  border: 0,
}));

const Configure: FC<ConfigureProps> = ({ sheets }) => {
  const messages = useMessages(messageIds);
  const theme = useTheme();
  const [firstRowIsHeaders, setFirstRowIsHeaders] = useState(true);
  const [selectedSheetId, setSelectedSheetId] = useState(sheets[0].id);
  const [settingsExpanded, setSettingsExpanded] = useState(true);
  const [mappingExpanded, setMappingExpanded] = useState(true);

  const selectedSheet = sheets.find((sheet) => {
    return sheet.id == selectedSheetId;
  });

  return (
    <>
      <Accordion
        defaultExpanded
        disableGutters
        onChange={(ev, isExpanded) => setSettingsExpanded(isExpanded)}
      >
        <AccordionSummary
          expandIcon={<ExpandMore sx={{ color: theme.palette.primary.main }} />}
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
            onChangeSelectedSheet={(id: number) => setSelectedSheetId(id)}
            selectedSheet={selectedSheetId}
            sheets={sheets}
          />
        </AccordionDetails>
      </Accordion>
      <Accordion
        defaultExpanded
        disableGutters
        onChange={(ev, isExpanded) => setMappingExpanded(isExpanded)}
      >
        <AccordionSummary
          expandIcon={<ExpandMore sx={{ color: theme.palette.primary.main }} />}
        >
          <Box display="flex" justifyContent="space-between" width="100%">
            <Typography variant="h5">
              <Msg id={messageIds.configuration.mapping.header} />
            </Typography>
            <Typography color={theme.palette.primary.main} paddingRight={1}>
              {mappingExpanded
                ? messages.configuration.hide().toLocaleUpperCase()
                : messages.configuration.show().toLocaleUpperCase()}
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Mapping
            firstRowIsHeaders={firstRowIsHeaders}
            rows={selectedSheet?.data}
          />
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default Configure;
