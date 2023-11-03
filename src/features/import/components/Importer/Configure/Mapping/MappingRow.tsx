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
import { FC, useState } from 'react';

import { ConfiguringData } from '..';
import messageIds from 'features/import/l10n/messageIds';
import useColumnValuesMessage from 'features/import/hooks/useColumnValuesMessage';
import { Msg, useMessages } from 'core/i18n';

export enum ExperimentalFieldTypes {
  BASIC = 'basic',
  ID = 'id',
  ORGANIZATION = 'organization',
  TAG = 'tag',
}

export interface ExperimentField {
  id: number;
  slug: string;
  title: string;
  type: ExperimentalFieldTypes;
}

export interface ExperimentColumn {
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
  clearCurrentlyConfiguring: () => void;
  currentlyConfiguring: ConfiguringData | null;
  isSelected: boolean;
  mappingResults: ExperimentalMappingResults | null;
  onCheck: (isChecked: boolean) => void;
  onMapValues: (type: ExperimentalFieldTypes) => void;
  zetkinFields: ExperimentField[];
}

const MappingRow: FC<MappingRowProps> = ({
  column,
  clearCurrentlyConfiguring,
  currentlyConfiguring: currentlyMapping,
  isSelected,
  mappingResults,
  onCheck,
  onMapValues,
  zetkinFields,
}) => {
  const theme = useTheme();
  const messages = useMessages(messageIds);
  const columnValuesMessage = useColumnValuesMessage(column.data);
  const [selectedField, setSelectedField] = useState<ExperimentField | null>(
    null
  );

  const needsConfig =
    selectedField?.type == ExperimentalFieldTypes.ORGANIZATION ||
    selectedField?.type == ExperimentalFieldTypes.TAG ||
    selectedField?.type == ExperimentalFieldTypes.ID;
  const showColumnValuesMessage = !isSelected || !selectedField || !needsConfig;
  const showNeedsConfigMessage =
    isSelected && !mappingResults && selectedField && needsConfig;
  const showMappingResultMessage =
    isSelected && mappingResults && selectedField && needsConfig;
  const showGreyBackground =
    currentlyMapping?.columnId === column.id && showNeedsConfigMessage;

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
          <Checkbox
            checked={isSelected}
            onChange={(ev, isChecked) => {
              onCheck(isChecked);
              if (!isChecked) {
                setSelectedField(null);
                if (currentlyMapping?.columnId == column.id) {
                  clearCurrentlyConfiguring();
                }
              }
            }}
          />
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
              disabled={!isSelected}
              label={messages.configuration.mapping.selectZetkinField()}
              onChange={(event) => {
                if (typeof event.target.value == 'number') {
                  const field = zetkinFields.find(
                    (field) => field.id == event.target.value
                  );
                  setSelectedField(field || null);
                }
              }}
              value={isSelected ? selectedField?.id : ''}
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
            showNeedsConfigMessage ? theme.palette.warning.main : 'secondary'
          }
        >
          {showNeedsConfigMessage && (
            <Msg
              id={
                selectedField.type == ExperimentalFieldTypes.ID
                  ? messageIds.configuration.mapping.needsConfig
                  : messageIds.configuration.mapping.needsMapping
              }
            />
          )}
          {showMappingResultMessage && (
            <Msg
              id={
                selectedField.type == ExperimentalFieldTypes.ID
                  ? messageIds.configuration.mapping.finishedMappingIds
                  : selectedField.type == ExperimentalFieldTypes.ORGANIZATION
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
        {(showNeedsConfigMessage || showMappingResultMessage) && (
          <Button
            endIcon={<ChevronRight />}
            onClick={() => onMapValues(selectedField.type)}
            variant="text"
          >
            <Msg
              id={
                selectedField.type == ExperimentalFieldTypes.ID
                  ? messageIds.configuration.mapping.configButton
                  : messageIds.configuration.mapping.mapValuesButton
              }
            />
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default MappingRow;
