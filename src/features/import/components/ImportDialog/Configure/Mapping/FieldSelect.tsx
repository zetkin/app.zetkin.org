import { FC } from 'react';
import { Box, ListSubheader, MenuItem, Select } from '@mui/material';
import { BadgeOutlined } from '@mui/icons-material';

import messageIds from 'features/import/l10n/messageIds';
import { Option } from 'features/import/hooks/useColumn';
import { UIDataColumn } from 'features/import/hooks/useUIDataColumn';
import { Column, ColumnKind } from 'features/import/utils/types';
import { Msg, useMessages } from 'core/i18n';
import useImportID from 'features/import/hooks/useImportID';

interface FieldSelectProps {
  clearConfiguration: () => void;
  column: UIDataColumn<Column>;
  fieldOptions: Option[];
  onChange: (newColumn: Column) => void;
  onConfigureStart: () => void;
  optionAlreadySelected: (value: string) => boolean;
}

const FieldSelect: FC<FieldSelectProps> = ({
  clearConfiguration,
  column,
  fieldOptions,
  onChange,
  onConfigureStart,
  optionAlreadySelected,
}) => {
  const messages = useMessages(messageIds);
  const { importID, updateImportID, resetImportIDIfNeeded } = useImportID();

  const fieldOptionsSorted = [
    ...fieldOptions,
    {
      disabled: false,
      label: messages.configuration.mapping.externalID(),
      value: 'ext_id',
    },
    {
      disabled: false,
      label: 'Email',
      value: 'email',
    },
  ].sort((a, b) => a.label.localeCompare(b.label));

  const getValue = () => {
    if (column.originalColumn.kind == ColumnKind.FIELD) {
      return `field:${column.originalColumn.field}`;
    }

    if (column.originalColumn.kind == ColumnKind.DATE) {
      return `date:${column.originalColumn.field}`;
    }

    if (column.originalColumn.kind == ColumnKind.ID_FIELD) {
      return column.originalColumn.idField || '';
    }

    if (column.originalColumn.kind == ColumnKind.ENUM) {
      return `enum:${column.originalColumn.field}`;
    }

    if (column.originalColumn.kind == ColumnKind.GENDER) {
      return `field:gender`;
    }

    if (column.originalColumn.kind != ColumnKind.UNKNOWN) {
      return column.originalColumn.kind.toString();
    }

    //Column kind is UNKNOWN, so we want no selected value
    return '';
  };

  // This has to be a function, not a component with PascalCase. If it is used
  // as a component, the `Select` below won't recognise it as a valid option.
  const listOption = ({
    disabled,
    value,
    label,
    key,
  }: Option & { key?: string }) => {
    const alreadySelected = optionAlreadySelected(value);
    return (
      <MenuItem
        key={key}
        disabled={alreadySelected || disabled}
        sx={{ paddingLeft: 4 }}
        value={value}
      >
        <Box
          alignItems="center"
          display="flex"
          justifyContent="space-between"
          width="100%"
        >
          <span>{label}</span>
          {importID == value ? (
            <BadgeOutlined color="secondary" fontSize="small" />
          ) : undefined}
        </Box>
      </MenuItem>
    );
  };

  return (
    <Select
      disabled={!column.originalColumn.selected}
      label={messages.configuration.mapping.selectZetkinField()}
      onChange={(event) => {
        clearConfiguration();

        if (event.target.value === '' || event.target.value === undefined) {
          resetImportIDIfNeeded(column.originalColumn, importID);
          onChange({
            kind: ColumnKind.UNKNOWN,
            selected: false,
          });
          return;
        }

        resetImportIDIfNeeded(column.originalColumn, importID);

        if (event.target.value == 'ext_id') {
          onChange({
            idField: 'ext_id',
            kind: ColumnKind.ID_FIELD,
            selected: true,
          });
          onConfigureStart();
        } else if (event.target.value == 'id') {
          onChange({
            idField: 'id',
            kind: ColumnKind.ID_FIELD,
            selected: true,
          });
          onConfigureStart();
          updateImportID(event.target.value);
        } else if (event.target.value == 'email') {
          onChange({
            idField: 'email',
            kind: ColumnKind.ID_FIELD,
            selected: true,
          });
          onConfigureStart();
        } else if (event.target.value == 'org') {
          onChange({
            kind: ColumnKind.ORGANIZATION,
            mapping: [],
            selected: true,
          });
          onConfigureStart();
        } else if (event.target.value == 'tag') {
          onChange({
            kind: ColumnKind.TAG,
            mapping: [],
            selected: true,
          });
          onConfigureStart();
        } else if (event.target.value == 'field:gender') {
          onChange({
            field: event.target.value,
            kind: ColumnKind.GENDER,
            mapping: [],
            selected: true,
          });
          onConfigureStart();
        } else if (event.target.value.startsWith('field')) {
          onChange({
            field: event.target.value.slice(6),
            kind: ColumnKind.FIELD,
            selected: true,
          });
        } else if (event.target.value.startsWith('date')) {
          onChange({
            dateFormat: null,
            field: event.target.value.slice(5),
            kind: ColumnKind.DATE,
            selected: true,
          });
          onConfigureStart();
        } else if (event.target.value.startsWith('enum')) {
          onChange({
            field: event.target.value.slice(5),
            kind: ColumnKind.ENUM,
            mapping: [],
            selected: true,
          });
          onConfigureStart();
        }
      }}
      sx={{ opacity: column.originalColumn.selected ? '' : '50%' }}
      value={getValue()}
    >
      <ListSubheader>
        <Msg id={messageIds.configuration.mapping.zetkinFieldGroups.id} />
      </ListSubheader>
      {listOption({
        disabled: false,
        label: messages.configuration.mapping.zetkinID(),
        value: 'id',
      })}

      {fieldOptionsSorted.length > 0 && (
        <ListSubheader>
          <Msg id={messageIds.configuration.mapping.zetkinFieldGroups.fields} />
        </ListSubheader>
      )}
      {fieldOptionsSorted.map((option) => listOption(option))}

      <ListSubheader>
        <Msg id={messageIds.configuration.mapping.zetkinFieldGroups.other} />
      </ListSubheader>
      {listOption({
        disabled: false,
        label: messages.configuration.mapping.organization(),
        value: 'org',
      })}
      {listOption({
        disabled: false,
        label: messages.configuration.mapping.tags(),
        value: 'tag',
      })}
    </Select>
  );
};

export default FieldSelect;
