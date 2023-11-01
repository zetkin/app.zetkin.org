import { FC } from 'react';
import { ArrowForward, ChevronRight } from '@mui/icons-material';
import {
  Box,
  Button,
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

export enum ExperimentalFieldTypes {
  ORGANIZATION = 'organization',
  TAG = 'tag',
  BASIC = 'basic',
}

interface ExperimentField {
  id: number;
  title: string;
  type: ExperimentalFieldTypes;
  needsMapping: boolean;
}

interface ExperimentColumn {
  data: (number | string | null)[];
  id: number;
  title: string;
}

export interface ExperimentalMappingResults {
  numMappedTo: number;
  numPeople: number;
}

interface MappingRowProps {
  column: ExperimentColumn;
  currentlyMapping: number | null;
  isEnabled: boolean;
  mappingResults: ExperimentalMappingResults | null;
  onEnable: () => void;
  onMapValues: () => void;
  onSelectField: (id: string) => void;
  selectedZetkinFieldId: string;
  zetkinFields: ExperimentField[];
}

const useColumnValuesMessage = (column: (number | string | null)[]): string => {
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
  column,
  currentlyMapping,
  isEnabled,
  mappingResults,
  onEnable,
  onMapValues,
  onSelectField,
  selectedZetkinFieldId,
  zetkinFields,
}) => {
  const theme = useTheme();
  const messages = useMessages(messageIds);
  const columnValuesMessage = useColumnValuesMessage(column.data);

  const selectedZetkinField = zetkinFields.find(
    (field) => field.id === parseInt(selectedZetkinFieldId)
  );

  const showColumnValuesMessage =
    !isEnabled || !selectedZetkinField || !selectedZetkinField.needsMapping;
  const showNeedsMappingMessage =
    isEnabled &&
    !mappingResults &&
    selectedZetkinField &&
    selectedZetkinField.needsMapping;
  const showMappingResultMessage =
    isEnabled &&
    mappingResults &&
    selectedZetkinField &&
    selectedZetkinField.needsMapping;
  const showGreyBackground =
    currentlyMapping === column.id && showNeedsMappingMessage;

  return (
    <Box
      bgcolor={showGreyBackground ? theme.palette.transparentGrey.light : ''}
      display="flex"
      flexDirection="column"
      padding={1}
    >
      <Box
        alignItems="center"
        display="flex"
        justifyContent="space-between"
        width="100%"
      >
        <Box alignItems="center" display="flex">
          <Checkbox checked={isEnabled} onChange={onEnable} />
          <Box
            bgcolor={theme.palette.transparentGrey.light}
            borderRadius={2}
            padding={1}
          >
            <Typography>{column.title}</Typography>
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
              onChange={(event) => {
                if (typeof event.target.value !== 'string') {
                  onSelectField(event.target.value);
                }
              }}
              value={isEnabled ? selectedZetkinFieldId : ''}
            >
              {zetkinFields.map((field) => (
                <MenuItem key={field.id} value={field.id}>
                  {field.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Box
        alignItems="center"
        display="flex"
        justifyContent="space-between"
        marginLeft={5.5}
        minHeight="40px"
      >
        {showColumnValuesMessage && (
          <Typography color="secondary">{columnValuesMessage}</Typography>
        )}
        <Typography
          color={
            showNeedsMappingMessage ? theme.palette.warning.main : 'secondary'
          }
        >
          {showNeedsMappingMessage && (
            <Msg id={messageIds.configuration.mapping.notMapped} />
          )}
          {showMappingResultMessage && (
            <Msg
              id={
                selectedZetkinField.type == ExperimentalFieldTypes.ORGANIZATION
                  ? messageIds.configuration.mapping
                      .finishedMappingOrganizations
                  : messageIds.configuration.mapping.finishedMappingTags
              }
              values={{
                numMappedTo: mappingResults.numMappedTo,
                numPeople: mappingResults.numPeople,
              }}
            />
          )}
        </Typography>
        {(showNeedsMappingMessage || showMappingResultMessage) && (
          <Button
            endIcon={<ChevronRight />}
            onClick={onMapValues}
            variant="text"
          >
            <Msg id={messageIds.configuration.mapping.mapValuesButton} />
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default MappingRow;
