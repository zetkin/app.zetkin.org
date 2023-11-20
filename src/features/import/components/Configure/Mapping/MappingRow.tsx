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
import { Column, ColumnKind, UIDataColumn } from 'features/import/utils/types';
import { Msg, useMessages } from 'core/i18n';

interface MappingRowProps {
  column: UIDataColumn;
  isBeingConfigured: boolean;
  onChange: (newColumn: Column) => void;
  onConfigureStart: () => void;
  onDeselectColumn: () => void;
  options: { label: string; value: string }[];
}

const MappingRow: FC<MappingRowProps> = ({
  column,
  isBeingConfigured,
  onChange,
  onDeselectColumn,
  onConfigureStart,
  options,
}) => {
  const theme = useTheme();
  const messages = useMessages(messageIds);

  return (
    <Box
      bgcolor={isBeingConfigured ? theme.palette.transparentGrey.light : ''}
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
            checked={column.originalColumn.selected}
            onChange={(ev, isChecked) => {
              if (isChecked) {
                onChange({
                  ...column.originalColumn,
                  selected: isChecked,
                });
              } else {
                onChange({
                  ...column.originalColumn,
                  kind: ColumnKind.UNKNOWN,
                  selected: isChecked,
                });
                onDeselectColumn();
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
              disabled={!column.originalColumn.selected}
              label={messages.configuration.mapping.selectZetkinField()}
              onChange={(event) => {
                if (event.target.value == 'id') {
                  onChange({
                    idField: null,
                    kind: ColumnKind.ID_FIELD,
                    selected: true,
                  });
                } else if (event.target.value == 'org') {
                  onChange({
                    kind: ColumnKind.ORGANIZATION,
                    mapping: [],
                    selected: true,
                  });
                } else if (event.target.value == 'tag') {
                  onChange({
                    kind: ColumnKind.TAG,
                    mapping: [],
                    selected: true,
                  });
                } else if (event.target.value.startsWith('field')) {
                  onChange({
                    field: event.target.value.slice(7),
                    kind: ColumnKind.FIELD,
                    selected: true,
                  });
                }
              }}
              value={
                column.originalColumn.selected &&
                column.originalColumn.kind != ColumnKind.UNKNOWN
                  ? column.originalColumn.kind
                  : ''
              }
            >
              {options.map((option) => {
                return (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                );
              })}
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
        {column.showColumnValuesMessage && (
          <Typography color="secondary">
            {column.columnValuesMessage}
          </Typography>
        )}
        <Typography
          color={
            column.showNeedsConfigMessage
              ? theme.palette.warning.main
              : 'secondary'
          }
        >
          {column.showNeedsConfigMessage && (
            <Msg
              id={
                column.originalColumn.kind == ColumnKind.ID_FIELD
                  ? messageIds.configuration.mapping.needsConfig
                  : messageIds.configuration.mapping.needsMapping
              }
            />
          )}
          {/* {column.showMappingResultMessage && (
            <Msg
              id={
                column.originalColumn.kind == ColumnKind.ID_FIELD
                  ? messageIds.configuration.mapping.finishedMappingIds
                  : column.originalColumn.kind == ColumnKind.ORGANIZATION
                  ? messageIds.configuration.mapping
                      .finishedMappingOrganizations
                  : messageIds.configuration.mapping.finishedMappingTags
              }
              values={{
                numMappedTo: mappingResults.numMappedTo,
                numPeople: mappingResults.numRows,
              }}
            />
          )} */}
        </Typography>
        {(column.showNeedsConfigMessage || column.showMappingResultMessage) && (
          <Button
            endIcon={<ChevronRight />}
            onClick={() => onConfigureStart()}
            variant="text"
          >
            <Msg
              id={
                column.originalColumn.kind == ColumnKind.ID_FIELD
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
