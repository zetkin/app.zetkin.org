import {
  Alert,
  Box,
  FormControl,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { FC } from 'react';

import { Msg, useMessages } from 'core/i18n';
import useDateConfig from 'features/import/hooks/useDateConfig';
import { UIDataColumn } from 'features/import/hooks/useUIDataColumn';
import messageIds from 'features/import/l10n/messageIds';
import { DateColumn } from 'features/import/utils/types';
import useDebounce from 'utils/hooks/useDebounce';
import ProblemRowsText from '../../elements/ImportMessageList/ProblemRowsText';

interface DateConfigProps {
  uiDataColumn: UIDataColumn<DateColumn>;
}

const DateConfig: FC<DateConfigProps> = ({ uiDataColumn }) => {
  const messages = useMessages(messageIds);
  const {
    dateFormat,
    dateFormats,
    isCustomFormat,
    isPersonNumberFormat,
    noCustomFormat,
    onDateFormatChange,
    personNumberFormats,
    wrongDateFormat,
    updateDateFormat,
  } = useDateConfig(uiDataColumn.originalColumn, uiDataColumn.columnIndex);

  const debouncedFinishedTyping = useDebounce(async (dateFormat: string) => {
    updateDateFormat(dateFormat);
  }, 400);

  return (
    <Box
      alignItems="flex-start"
      display="flex"
      flexDirection="column"
      padding={2}
    >
      <Typography sx={{ paddingBottom: 2 }} variant="h5">
        <Msg id={messageIds.configuration.configure.dates.header} />
      </Typography>
      <Typography sx={{ paddingBottom: 2 }}>
        <Msg
          id={messageIds.configuration.configure.dates.dateConfigDescription}
        />
      </Typography>
      <FormControl sx={{ paddingBottom: 2 }}>
        <InputLabel>
          <Msg id={messageIds.configuration.configure.dates.dropDownLabel} />
        </InputLabel>
        <Select
          label={messages.configuration.configure.dates.dropDownLabel()}
          onChange={(event) => {
            const value = event.target.value;
            if (value) {
              onDateFormatChange(value);
            }
          }}
          sx={{ minWidth: '200px' }}
          value={isCustomFormat ? 'custom' : dateFormat}
        >
          <ListSubheader>
            <Msg
              id={messageIds.configuration.configure.dates.listSubHeaders.dates}
            />
          </ListSubheader>
          {Object.entries(dateFormats).map((entry) => {
            const [format, label] = entry;
            return (
              <MenuItem key={format} sx={{ paddingLeft: 4 }} value={format}>
                {label}
              </MenuItem>
            );
          })}
          <ListSubheader>
            <Msg
              id={
                messageIds.configuration.configure.dates.listSubHeaders
                  .personNumbers
              }
            />
          </ListSubheader>
          {Object.values(personNumberFormats).map((format) => (
            <MenuItem key={format} sx={{ paddingLeft: 4 }} value={format}>
              <Msg
                id={
                  messageIds.configuration.configure.dates.personNumberFormat[
                    format
                  ].label
                }
              />
            </MenuItem>
          ))}
          <ListSubheader>
            <Msg
              id={
                messageIds.configuration.configure.dates.listSubHeaders.custom
              }
            />
          </ListSubheader>
          <MenuItem sx={{ paddingLeft: 4 }} value="custom">
            <Msg
              id={messageIds.configuration.configure.dates.customFormatLabel}
            />
          </MenuItem>
        </Select>
      </FormControl>
      {dateFormat != null && !isPersonNumberFormat(dateFormat) && (
        <TextField
          label={messages.configuration.configure.dates.dateInputLabel()}
          onChange={(event) => {
            const value = event.target.value;
            onDateFormatChange(value);
            if (value) {
              debouncedFinishedTyping(value);
            }
          }}
          sx={{ paddingBottom: 2 }}
          value={dateFormat}
        />
      )}
      {isCustomFormat && (
        <Typography>
          <Msg
            id={
              messageIds.configuration.configure.dates.customFormatDescription
            }
          />
        </Typography>
      )}
      {dateFormat && isPersonNumberFormat(dateFormat) && (
        <Typography>
          <Msg
            id={
              messageIds.configuration.configure.dates.personNumberFormat[
                dateFormat
              ].description
            }
          />
        </Typography>
      )}
      {noCustomFormat && (
        <Alert severity="warning" sx={{ marginTop: 1 }}>
          <Msg
            id={messageIds.configuration.configure.dates.noCustomFormatWarning}
          />
        </Alert>
      )}
      {wrongDateFormat && (
        <Alert severity="warning" sx={{ marginTop: 1 }}>
          <Msg
            id={
              messageIds.configuration.configure.dates.invalidDateFormatWarning
            }
          />
          <br />
          <ProblemRowsText
            percentage={wrongDateFormat.percentage}
            rows={wrongDateFormat.problemRows}
          />
        </Alert>
      )}
    </Box>
  );
};

export default DateConfig;
