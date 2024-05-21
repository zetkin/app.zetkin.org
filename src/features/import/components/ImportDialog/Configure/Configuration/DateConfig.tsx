import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { FC, useState } from 'react';

import { columnUpdate } from 'features/import/store';
import { DateColumn } from 'features/import/utils/types';
import messageIds from 'features/import/l10n/messageIds';
import { UIDataColumn } from 'features/import/hooks/useUIDataColumn';
import { useAppDispatch } from 'core/hooks';
import useDebounce from 'utils/hooks/useDebounce';
import { Msg, useMessages } from 'core/i18n';

const useDateConfig = (column: DateColumn, columnIndex: number) => {
  const dispatch = useAppDispatch();

  return (dateFormat: string) => {
    dispatch(columnUpdate([columnIndex, { ...column, dateFormat }]));
  };
};

const dateFormats = ['YYYY-MM-DD', 'YY-MM-DD', 'MM-DD-YYYY'];

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

  const isCustomValue = !dateFormats.includes(dateFormat);

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
          value={isCustomValue ? 'custom' : dateFormat}
        >
          {dateFormats.map((format, index) => (
            <MenuItem key={index} value={format}>
              {format}
            </MenuItem>
          ))}
          <MenuItem value="custom">
            <Msg
              id={messageIds.configuration.configure.dates.customFormatLabel}
            />
          </MenuItem>
        </Select>
      </FormControl>
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
    </Box>
  );
};

export default DateConfig;
