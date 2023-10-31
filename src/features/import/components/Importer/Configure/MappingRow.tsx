import { ArrowForward } from '@mui/icons-material';
import { FC } from 'react';
import {
  Box,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  useTheme,
} from '@mui/material';

import messageIds from 'features/import/l10n/messageIds';
import { Msg, useMessages } from 'core/i18n';

interface Field {
  id: number;
  title: string;
}

interface MappingRowProps {
  column: (number | string | null)[];
  fields: Field[];
  isEnabled: boolean;
  onEnable: () => void;
  onZetkinFieldSelect: (zetkinFieldId: string) => void;
  selectedZetkinField: string;
  title: string;
}

const useMappingMessage = (column: (number | string | null)[]): string => {
  const messages = useMessages(messageIds);
  const rowsWithValues: (string | number)[] = [];
  let numberOfEmptyRows = 0;

  column.forEach((cellValue) => {
    if (typeof cellValue === 'string' || typeof cellValue === 'number') {
      rowsWithValues.push(cellValue);
    } else {
      numberOfEmptyRows += 1;
    }
  });

  const uniqueValues = Array.from(new Set(rowsWithValues));

  if (numberOfEmptyRows > 0 && uniqueValues.length == 0) {
    return messages.configuration.mapping.messages.onlyEmpty({
      numEmpty: numberOfEmptyRows,
    });
  }

  if (numberOfEmptyRows > 0 && uniqueValues.length == 1) {
    return messages.configuration.mapping.messages.oneValueAndEmpty({
      firstValue: uniqueValues[0],
      numEmpty: numberOfEmptyRows,
    });
  }

  if (numberOfEmptyRows > 0 && uniqueValues.length == 2) {
    return messages.configuration.mapping.messages.twoValuesAndEmpty({
      firstValue: uniqueValues[0],
      numEmpty: numberOfEmptyRows,
      secondValue: uniqueValues[1],
    });
  }

  if (numberOfEmptyRows > 0 && uniqueValues.length == 3) {
    return messages.configuration.mapping.messages.threeValuesAndEmpty({
      firstValue: uniqueValues[0],
      numEmpty: numberOfEmptyRows,
      secondValue: uniqueValues[1],
      thirdValue: uniqueValues[2],
    });
  }

  if (numberOfEmptyRows > 0 && uniqueValues.length > 3) {
    return messages.configuration.mapping.messages.manyValuesAndEmpty({
      firstValue: uniqueValues[0],
      numEmpty: numberOfEmptyRows,
      numMoreValues: uniqueValues.length - 3,
      secondValue: uniqueValues[1],
      thirdValue: uniqueValues[2],
    });
  }

  if (numberOfEmptyRows == 0 && uniqueValues.length == 1) {
    return messages.configuration.mapping.messages.oneValueNoEmpty({
      firstValue: uniqueValues[0],
    });
  }

  if (numberOfEmptyRows == 0 && uniqueValues.length == 2) {
    return messages.configuration.mapping.messages.twoValuesNoEmpty({
      firstValue: uniqueValues[0],
      secondValue: uniqueValues[1],
    });
  }

  if (numberOfEmptyRows == 0 && uniqueValues.length == 3) {
    return messages.configuration.mapping.messages.threeValuesNoEmpty({
      firstValue: uniqueValues[0],
      secondValue: uniqueValues[1],
      thirdValue: uniqueValues[2],
    });
  }

  if (numberOfEmptyRows == 0 && uniqueValues.length > 3) {
    return messages.configuration.mapping.messages.manyValuesNoEmpty({
      firstValue: uniqueValues[0],
      numMoreValues: uniqueValues.length - 3,
      secondValue: uniqueValues[1],
      thirdValue: uniqueValues[2],
    });
  }

  //if you pass an empty array this happens
  return '';
};

const MappingRow: FC<MappingRowProps> = ({
  isEnabled,
  onEnable,
  onZetkinFieldSelect: onFieldSelect,
  fields,
  selectedZetkinField,
  title,
  column,
}) => {
  const theme = useTheme();
  const messages = useMessages(messageIds);
  const mappingMessage = useMappingMessage(column);

  return (
    <Box display="flex" flexDirection="column">
      <Box
        alignItems="center"
        display="flex"
        justifyContent="space-between"
        width="100%"
      >
        <Box alignItems="center" display="flex">
          <Checkbox checked={isEnabled} onChange={onEnable} />
          <Box bgcolor={theme.palette.grey[100]} borderRadius={2} padding={1}>
            <Typography>{title}</Typography>
          </Box>
        </Box>
        <Box alignItems="center" display="flex" width="50%">
          <ArrowForward color="secondary" sx={{ marginRight: 1 }} />
          <FormControl fullWidth size="small">
            <InputLabel>
              <Msg id={messageIds.configuration.mapping.selectZetkinField} />
            </InputLabel>
            <Select
              disabled={!isEnabled}
              label={messages.configuration.mapping.selectZetkinField()}
              onChange={(ev) => onFieldSelect(ev.target.value)}
              value={selectedZetkinField}
            >
              {fields.map((field) => (
                <MenuItem key={field.id} value={field.id}>
                  {field.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Box marginLeft={5.5} paddingTop={1}>
        <Typography color="secondary">{mappingMessage}</Typography>
      </Box>
    </Box>
  );
};

export default MappingRow;
