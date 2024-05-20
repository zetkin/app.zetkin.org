import {
  Box,
  Button,
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

const getInitialDateFormat = (dateFormat: string | null) => {
  if (!dateFormat) {
    return 'YYYY-MM-DD';
  }

  if (dateFormats.includes(dateFormat)) {
    return dateFormat;
  }

  return 'custom';
};

const DateConfig: FC<DateConfigProps> = ({ uiDataColumn }) => {
  const messages = useMessages(messageIds);

  const initialDateFormat = getInitialDateFormat(
    uiDataColumn.originalColumn.dateFormat
  );
  const [dateFormat, setDateFormat] = useState(initialDateFormat);
  const [diyDateFormat, setDiyDateFormat] = useState(
    dateFormat === 'custom' ? uiDataColumn.originalColumn.dateFormat : ''
  );

  const updateDateFormat = useDateConfig(
    uiDataColumn.originalColumn,
    uiDataColumn.columnIndex
  );

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
            setDiyDateFormat('');
            setDateFormat(event.target.value);
          }}
          value={dateFormat}
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
      {dateFormat === 'custom' && (
        <TextField
          label={messages.configuration.configure.dates.dateInputLabel()}
          onChange={(event) => setDiyDateFormat(event.target.value)}
          sx={{ paddingBottom: 2 }}
          value={diyDateFormat}
        />
      )}
      <Button
        disabled={
          (dateFormat === 'custom' && !diyDateFormat) ||
          dateFormat === uiDataColumn.originalColumn.dateFormat
        }
        onClick={() => {
          if (dateFormat === 'custom' && diyDateFormat) {
            updateDateFormat(diyDateFormat);
          } else {
            updateDateFormat(dateFormat);
          }
        }}
        variant="outlined"
      >
        <Msg id={messageIds.configuration.configure.dates.confirmButton} />
      </Button>
    </Box>
  );
};

export default DateConfig;
