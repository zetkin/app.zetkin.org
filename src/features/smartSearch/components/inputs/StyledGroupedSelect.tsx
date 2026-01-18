import {
  ListSubheader,
  MenuItem,
  TextField,
  TextFieldProps,
} from '@mui/material';
import { FC, ReactElement } from 'react';

import oldTheme from 'theme';

type Props = TextFieldProps & {
  items: {
    group: string | null;
    id: string | number;
    label: string;
  }[];
  minWidth?: string;
};

const StyledGroupedSelect: FC<Props> = (props) => {
  const groups = new Set(props.items.map((item) => item.group));

  const options: ReactElement[] = [];
  Array.from(groups)
    .sort((group0, group1) => (group0 || '').localeCompare(group1 || ''))
    .map((groupTitle) => {
      if (groupTitle) {
        options.push(
          <ListSubheader key={groupTitle}>{groupTitle}</ListSubheader>
        );
      }

      props.items
        .filter((item) => item.group == groupTitle)
        .sort((item0, item1) => item0.label.localeCompare(item1.label))
        .forEach((item) => {
          options.push(
            <MenuItem
              key={item.id}
              sx={{ ml: groupTitle ? 2 : 0 }}
              value={item.id}
            >
              {item.label}
            </MenuItem>
          );
        });
    });

  return (
    <TextField
      select
      sx={{
        display: 'inline',
        verticalAlign: 'inherit',
      }}
      {...props}
      slotProps={{
        htmlInput: {
          sx: {
            fontSize: oldTheme.typography.h4.fontSize,
            padding: 0,
          },
        },
        select: {
          renderValue: (value) =>
            props.items.find((item) => item.id == value)?.label ?? '',
          ...props.SelectProps,
          sx: {
            fontSize: oldTheme.typography.h4.fontSize,
            minWidth: `${props.minWidth}px`,
            padding: 0,
          },
        },
      }}
      variant="standard"
    >
      {options}
    </TextField>
  );
};

export default StyledGroupedSelect;
