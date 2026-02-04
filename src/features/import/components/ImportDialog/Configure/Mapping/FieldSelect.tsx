import { FC, useContext, useState } from 'react';
import {
  Box,
  ListItemText,
  ListSubheader,
  MenuItem,
  Select,
} from '@mui/material';
import { BadgeOutlined } from '@mui/icons-material';

import messageIds from 'features/import/l10n/messageIds';
import { Option } from 'features/import/hooks/useColumn';
import { UIDataColumn } from 'features/import/hooks/useUIDataColumn';
import { Column, ColumnKind } from 'features/import/types';
import { Msg, useMessages } from 'core/i18n';
import useImportID from 'features/import/hooks/useImportID';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';

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
  const { importID, updateImportID } = useImportID();
  const [open, setOpen] = useState(false);
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);

  const fieldOptionsSorted = [
    ...fieldOptions,
    {
      disabled: false,
      label: messages.configuration.mapping.externalID(),
      value: 'ext_id',
    },
    {
      disabled: false,
      label: messages.configuration.mapping.email(),
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
          <ListItemText>{label}</ListItemText>
          {importID == value && open && (
            <BadgeOutlined color="secondary" fontSize="small" />
          )}
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

        if (!event.target.value) {
          onChange({
            kind: ColumnKind.UNKNOWN,
            selected: false,
          });
        } else if (event.target.value == 'ext_id') {
          onChange({
            idField: 'ext_id',
            kind: ColumnKind.ID_FIELD,
            selected: true,
          });
          onConfigureStart();
        } else if (event.target.value == 'id') {
          if (importID && importID != 'id') {
            showConfirmDialog({
              onSubmit: () => {
                onChange({
                  idField: 'id',
                  kind: ColumnKind.ID_FIELD,
                  selected: true,
                });
                updateImportID('id');
                onConfigureStart();
              },
              title:
                messages.configuration.configure.ids.confirmIDChange.title(),
              warningText:
                messages.configuration.configure.ids.confirmIDChange.description(
                  {
                    currentImportID:
                      messages.configuration.configure.ids.field[importID](),
                    newImportID:
                      messages.configuration.configure.ids.field['id'](),
                  }
                ),
            });
          } else {
            onChange({
              idField: 'id',
              kind: ColumnKind.ID_FIELD,
              selected: true,
            });
            updateImportID('id');
            onConfigureStart();
          }
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
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
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
      {fieldOptionsSorted.map(listOption)}

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
