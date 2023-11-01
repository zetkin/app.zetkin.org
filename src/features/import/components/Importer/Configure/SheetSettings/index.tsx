import { FC } from 'react';
import {
  Box,
  Checkbox,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';

import { ExperimentRow } from '../Mapping';
import messageIds from 'features/import/l10n/messageIds';
import { Msg, useMessages } from 'core/i18n';

export interface ExperimentSheet {
  data: ExperimentRow[];
  id: number;
  title: string;
}

interface SheetSettingsProps {
  firstRowIsHeaders: boolean;
  onChangeFirstRowIsHeaders: () => void;
  onChangeSelectedSheet: (id: number) => void;
  selectedSheet: number;
  sheets: ExperimentSheet[];
}

const SheetSettings: FC<SheetSettingsProps> = ({
  firstRowIsHeaders,
  onChangeFirstRowIsHeaders,
  onChangeSelectedSheet,
  selectedSheet,
  sheets,
}) => {
  const messages = useMessages(messageIds);

  return (
    <Box>
      {sheets.length > 1 && (
        <Box>
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
        </Box>
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
    </Box>
  );
};

export default SheetSettings;
