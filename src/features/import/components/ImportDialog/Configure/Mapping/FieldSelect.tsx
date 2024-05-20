import { FC } from 'react';
import { ListSubheader, MenuItem, Select } from '@mui/material';

import messageIds from 'features/import/l10n/messageIds';
import { Option } from 'features/import/hooks/useColumn';
import { UIDataColumn } from 'features/import/hooks/useUIDataColumn';
import { Column, ColumnKind } from 'features/import/utils/types';
import { Msg, useMessages } from 'core/i18n';

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

  const getValue = () => {
    if (column.originalColumn.kind == ColumnKind.FIELD) {
      return `field:${column.originalColumn.field}`;
    }

    if (column.originalColumn.kind == ColumnKind.DATE) {
      return `date:${column.originalColumn.field}`;
    }

    if (column.originalColumn.kind != ColumnKind.UNKNOWN) {
      return column.originalColumn.kind.toString();
    }

    //Column kind is UNKNOWN, so we want no selected value
    return '';
  };

  // This has to be a function, not a component with PascalCase. If it is used
  // as a component, the `Select` below won't recognise it as a valid option.
  const listOption = ({ value, label, key }: Option & { key?: string }) => {
    const alreadySelected = optionAlreadySelected(value);
    return (
      <MenuItem
        key={key}
        disabled={alreadySelected}
        sx={{ paddingLeft: 4 }}
        value={value}
      >
        {label}
      </MenuItem>
    );
  };

  return (
    <Select
      disabled={!column.originalColumn.selected}
      label={messages.configuration.mapping.selectZetkinField()}
      onChange={(event) => {
        clearConfiguration();
        if (event.target.value == 'id') {
          onChange({
            idField: null,
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
        } else if (event.target.value.startsWith('field')) {
          onChange({
            field: event.target.value.slice(6),
            kind: ColumnKind.FIELD,
            selected: true,
          });
        } else if (event.target.value.startsWith('date')) {
          onChange({
            field: event.target.value.slice(5),
            kind: ColumnKind.DATE,
            selected: true,
          });
        }
      }}
      sx={{ opacity: column.originalColumn.selected ? '' : '50%' }}
      value={getValue()}
    >
      <ListSubheader>
        <Msg id={messageIds.configuration.mapping.zetkinFieldGroups.id} />
      </ListSubheader>
      {listOption({
        label: messages.configuration.mapping.id(),
        value: 'id',
      })}

      {fieldOptions.length > 0 && (
        <ListSubheader>
          <Msg id={messageIds.configuration.mapping.zetkinFieldGroups.fields} />
        </ListSubheader>
      )}
      {fieldOptions.map((option) => listOption(option))}

      <ListSubheader>
        <Msg id={messageIds.configuration.mapping.zetkinFieldGroups.other} />
      </ListSubheader>
      {listOption({
        label: messages.configuration.mapping.organization(),
        value: 'org',
      })}
      {listOption({
        label: messages.configuration.mapping.tags(),
        value: 'tag',
      })}
    </Select>
  );
};

export default FieldSelect;
