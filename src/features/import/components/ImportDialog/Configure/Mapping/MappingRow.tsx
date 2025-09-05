import { FC } from 'react';
import { ArrowForward, ChevronRight } from '@mui/icons-material';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  Typography,
  useTheme,
} from '@mui/material';

import FieldSelect from './FieldSelect';
import messageIds from 'features/import/l10n/messageIds';
import { Msg } from 'core/i18n';
import { Option } from 'features/import/hooks/useColumn';
import useColumnValuesMessage from 'features/import/hooks/useColumnValuesMessage';
import useUIDataColumn from 'features/import/hooks/useUIDataColumn';
import {
  Column,
  ColumnKind,
  ConfigurableColumn,
} from 'features/import/utils/types';
import useImportID from 'features/import/hooks/useImportID';

const isConfigurableColumn = (column: Column): column is ConfigurableColumn => {
  return [
    ColumnKind.ID_FIELD,
    ColumnKind.ORGANIZATION,
    ColumnKind.TAG,
    ColumnKind.DATE,
    ColumnKind.ENUM,
    ColumnKind.GENDER,
  ].includes(column.kind);
};

interface MappingRowProps {
  clearConfiguration: () => void;
  columnIndex: number;
  fieldOptions: Option[];
  isBeingConfigured: boolean;
  onChange: (newColumn: Column) => void;
  onConfigureStart: () => void;
  optionAlreadySelected: (value: string) => boolean;
}

const MappingRow: FC<MappingRowProps> = ({
  clearConfiguration,
  columnIndex,
  fieldOptions,
  isBeingConfigured,
  onChange,
  onConfigureStart,
  optionAlreadySelected,
}) => {
  const theme = useTheme();
  const column = useUIDataColumn(columnIndex);
  const { importID, handleColumnDeselection } = useImportID();

  const columnValuesMessage = useColumnValuesMessage(
    column.numberOfEmptyRows,
    column.uniqueValues
  );

  const getMappingRowButtonMessageId = () => {
    if (column.originalColumn.kind == ColumnKind.DATE) {
      return messageIds.configuration.mapping.configButton;
    } else if (column.originalColumn.kind == ColumnKind.ID_FIELD) {
      return messageIds.configuration.mapping.configButton;
    } else {
      return messageIds.configuration.mapping.mapValuesButton;
    }
  };

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
                handleColumnDeselection(
                  column.originalColumn,
                  importID,
                  onChange
                );
              }
              clearConfiguration();
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
          <ArrowForward
            color="secondary"
            sx={{
              marginRight: 1,
              opacity: column.originalColumn.selected ? '' : '50%',
            }}
          />
          <FormControl fullWidth size="small">
            <InputLabel
              sx={{ opacity: column.originalColumn.selected ? '' : '50%' }}
            >
              <Msg id={messageIds.configuration.mapping.selectZetkinField} />
            </InputLabel>
            <FieldSelect
              clearConfiguration={clearConfiguration}
              column={column}
              fieldOptions={fieldOptions}
              onChange={onChange}
              onConfigureStart={onConfigureStart}
              optionAlreadySelected={optionAlreadySelected}
            />
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
        {!isConfigurableColumn(column.originalColumn) && (
          <Box display="flex" sx={{ wordBreak: 'break-word' }} width="100%">
            <Typography color="secondary" variant="body2">
              {columnValuesMessage}
            </Typography>
          </Box>
        )}
        {isConfigurableColumn(column.originalColumn) && (
          <>
            <Typography
              color={
                column.unfinishedMapping
                  ? theme.palette.warning.main
                  : 'secondary'
              }
              variant="body2"
            >
              {column.unfinishedMapping && (
                <Msg
                  id={
                    messageIds.configuration.mapping.unfinished[
                      column.originalColumn.kind
                    ]
                  }
                />
              )}
              {!column.unfinishedMapping && column.mappingResultsMessage}
            </Typography>
            <Button
              endIcon={<ChevronRight />}
              onClick={() => onConfigureStart()}
              variant="text"
            >
              <Msg id={getMappingRowButtonMessageId()} />
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default MappingRow;
