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

  const {
    currentlyConfiguring,
    updateCurrentlyConfiguring,
    updateSelectedField,
  } = useConfigSomething();

  const needsConfig =
    column.selected &&
    !!column.selectedField &&
    column.selectedField.type !== FieldTypes.BASIC;
  const showColumnValuesMessage =
    !column.selected ||
    column.selectedField?.type != FieldTypes.BASIC ||
    !needsConfig;
  const showNeedsConfigMessage =
    column.selected && !mappingResults && !!column.selectedField && needsConfig;
  const showMappingResultMessage =
    column.selected &&
    !!mappingResults &&
    !!column.selectedField &&
    needsConfig;
  const showGreyBackground =
    currentlyConfiguring === column.id && showNeedsConfigMessage;

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
                updateSelectedField(column.id, undefined);
                if (currentlyConfiguring == column.id) {
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
                  if (field) {
                    updateSelectedField(column.id, field);
                  }
                }
              }}
              value={
                column.selected && column.selectedField
                  ? column.selectedField.id
                  : ''
              }
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
                column.selectedField?.type == FieldTypes.ID
                  ? messageIds.configuration.mapping.needsConfig
                  : messageIds.configuration.mapping.needsMapping
              }
            />
          )}
          {showMappingResultMessage && (
            <Msg
              id={
                column.selectedField?.type == FieldTypes.ID
                  ? messageIds.configuration.mapping.finishedMappingIds
                  : column.selectedField?.type == FieldTypes.ORGANIZATION
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
            onClick={() => updateCurrentlyConfiguring(column.id)}
            variant="text"
          >
            <Msg
              id={
                column.selectedField?.type == FieldTypes.ID
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
