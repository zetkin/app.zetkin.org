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
      className={classes.MuiTextField}
      inputProps={{ className: classes.MuiInput }}
      select
      {...props}
      SelectProps={{
        renderValue: (value) =>
          props.items.find((item) => item.id == value)?.label ?? '',
        ...props.SelectProps,
        className: classes.MuiSelect,
      }}
      variant="standard"
    >
      {options}
    </TextField>
  );
};

export default StyledGroupedSelect;
