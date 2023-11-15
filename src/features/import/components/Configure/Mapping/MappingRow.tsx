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

import messageIds from 'features/import/l10n/messageIds';
import useColumnValuesMessage from 'features/import/hooks/useColumnValuesMessage';
import useConfigSomething from 'features/import/hooks/useConfigSomething';
import {
  Column,
  Field,
  FieldTypes,
  MappingResults,
} from 'features/import/utils/types';
import { Msg, useMessages } from 'core/i18n';

interface MappingRowProps {
  column: Column;
  mappingResults: MappingResults | null;
  onCheck: () => void;
  zetkinFields: Field[];
}

const MappingRow: FC<MappingRowProps> = ({
  column,
  mappingResults,
  onCheck,
  zetkinFields,
}) => {
  const theme = useTheme();
  const messages = useMessages(messageIds);
  const columnValuesMessage = useColumnValuesMessage(column.data);

  const { currentlyConfiguring, updateCurrentlyConfiguring } =
    useConfigSomething();

  const [selectedField, setSelectedField] = useState<Field | null>(null);

  const needsConfig =
    selectedField?.type == FieldTypes.ORGANIZATION ||
    selectedField?.type == FieldTypes.TAG ||
    selectedField?.type == FieldTypes.ID;
  const showColumnValuesMessage =
    !column.selected || !selectedField || !needsConfig;
  const showNeedsConfigMessage =
    column.selected && !mappingResults && selectedField && needsConfig;
  const showMappingResultMessage =
    column.selected && mappingResults && selectedField && needsConfig;
  const showGreyBackground =
    currentlyConfiguring?.columnId === column.id && showNeedsConfigMessage;

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
            checked={column.selected}
            onChange={(ev, isChecked) => {
              onCheck();
              if (!isChecked) {
                setSelectedField(null);
                if (currentlyConfiguring?.columnId == column.id) {
                  updateCurrentlyConfiguring(null);
                }
              }
            }}
          />
          <Box
            bgcolor={theme.palette.transparentGrey.light}
            borderRadius={2}
            padding={1}
          >
            <Typography>
              {column.title
                ? column.title
                : messages.configuration.mapping.defaultColumnHeader({
                    columnIndex: column.id,
                  })}
            </Typography>
          </Box>
        </Box>
        <Box alignItems="center" display="flex" width="50%">
          <ArrowForward color="secondary" sx={{ marginRight: 1 }} />
          <FormControl fullWidth size="small">
            <InputLabel>
              <Msg id={messageIds.configuration.mapping.selectZetkinField} />
            </InputLabel>
            <Select
              disabled={!column.selected}
              label={messages.configuration.mapping.selectZetkinField()}
              onChange={(event) => {
                if (typeof event.target.value == 'number') {
                  const field = zetkinFields.find(
                    (field) => field.id == event.target.value
                  );
                  setSelectedField(field || null);
                }
              }}
              value={column.selected ? selectedField?.id : ''}
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
                selectedField.type == FieldTypes.ID
                  ? messageIds.configuration.mapping.needsConfig
                  : messageIds.configuration.mapping.needsMapping
              }
            />
          )}
          {showMappingResultMessage && (
            <Msg
              id={
                selectedField.type == FieldTypes.ID
                  ? messageIds.configuration.mapping.finishedMappingIds
                  : selectedField.type == FieldTypes.ORGANIZATION
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
            onClick={() =>
              updateCurrentlyConfiguring({
                columnId: column.id,
                type: selectedField.type,
              })
            }
            variant="text"
          >
            <Msg
              id={
                selectedField.type == FieldTypes.ID
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
