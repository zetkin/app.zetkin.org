import {
  Box,
  FormControl,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { FC, useState } from 'react';

import { DateColumn } from 'features/import/utils/types';
import messageIds from 'features/import/l10n/messageIds';
import { UIDataColumn } from 'features/import/hooks/useUIDataColumn';
import useDateConfig from 'features/import/hooks/useDateConfig';
import useDebounce from 'utils/hooks/useDebounce';
import { Msg, useMessages } from 'core/i18n';

type PersonNumberFormat = 'se' | 'dk' | 'no';
const personNumberFormats: PersonNumberFormat[] = ['se', 'dk', 'no'];

const dateFormats = ['YYYY-MM-DD', 'YY-MM-DD', 'MM-DD-YYYY'];

const isPersonNumberFormat = (
  dateFormat: string
): dateFormat is PersonNumberFormat => {
  return !!personNumberFormats.find((format) => format == dateFormat);
};

interface DateConfigProps {
  uiDataColumn: UIDataColumn<DateColumn>;
}

const DateConfig: FC<DateConfigProps> = ({ uiDataColumn }) => {
  const messages = useMessages(messageIds);

  const [dateFormat, setDateFormat] = useState(
    uiDataColumn.originalColumn.dateFormat ?? 'YYYY-MM-DD'
  );

  const updateDateFormat = useDateConfig(
    uiDataColumn.originalColumn,
    uiDataColumn.columnIndex
  );

  const debouncedFinishedTyping = useDebounce(async (dateFormat: string) => {
    updateDateFormat(dateFormat);
  }, 400);

  const isCustomFormat =
    !dateFormats.includes(dateFormat) && !isPersonNumberFormat(dateFormat);

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
        <Msg id={messageIds.configuration.configure.dates.description} />
      </Typography>
      <FormControl sx={{ paddingBottom: 2 }}>
        <InputLabel>
          <Msg id={messageIds.configuration.configure.dates.dropDownLabel} />
        </InputLabel>
        <Select
          label={messages.configuration.configure.dates.dropDownLabel()}
          onChange={(event) => {
            const value = event.target.value;

            if (value === 'custom') {
              setDateFormat('');
            } else {
              setDateFormat(event.target.value);
              updateDateFormat(value);
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
          {dateFormats.map((format) => (
            <MenuItem key={format} sx={{ paddingLeft: 4 }} value={format}>
              {format}
            </MenuItem>
          ))}
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
      {!isPersonNumberFormat(dateFormat) && (
        <TextField
          label={messages.configuration.configure.dates.dateInputLabel()}
          onChange={(event) => {
            const value = event.target.value;
            setDateFormat(value);
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
      {isPersonNumberFormat(dateFormat) && (
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
    </Box>
  );
};

export default DateConfig;
