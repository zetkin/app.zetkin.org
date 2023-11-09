import { ExpandMore } from '@mui/icons-material';
import {
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  styled,
  Typography,
  useTheme,
} from '@mui/material';
import { FC, useState } from 'react';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';

import messageIds from 'features/import/l10n/messageIds';
import { SheetWithId } from '..';
import { Msg, useMessages } from 'core/i18n';

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(() => ({
  '&:before': {
    display: 'none',
  },
  border: 0,
}));

interface SheetSettingsProps {
  firstRowIsHeaders: boolean;
  onChangeFirstRowIsHeaders: () => void;
  onChangeSelectedSheet: (id: number) => void;
  selectedSheet: number;
  sheets: SheetWithId[];
}

const SheetSettings: FC<SheetSettingsProps> = ({
  firstRowIsHeaders,
  onChangeFirstRowIsHeaders,
  onChangeSelectedSheet,
  selectedSheet,
  sheets,
}) => {
  const messages = useMessages(messageIds);
  const theme = useTheme();
  const [settingsExpanded, setSettingsExpanded] = useState(true);

  return (
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
        {sheets.length > 1 && (
          <FormControl size="small">
            <InputLabel>
              <Msg id={messageIds.configuration.settings.sheetSelectLabel} />
            </InputLabel>
            <Select
              label={messages.configuration.settings.sheetSelectLabel()}
              onChange={(event) =>
                onChangeSelectedSheet(event.target.value as number)
              }
              value={selectedSheet}
            >
              {sheets.map((sheet, index) => (
                <MenuItem key={index} value={sheet.id.toString()}>
                  {sheet.title}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              <Msg id={messageIds.configuration.settings.sheetSelectHelpText} />
            </FormHelperText>
          </FormControl>
        )}
        <Box alignItems="center" display="flex">
          <Checkbox
            checked={firstRowIsHeaders}
            onChange={onChangeFirstRowIsHeaders}
          />
          <Typography>
            <Msg id={messageIds.configuration.settings.firstRowIsHeaders} />
          </Typography>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default SheetSettings;
