import { FC } from 'react';
import {
  FormControl,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  Typography,
  useTheme,
} from '@mui/material';

import { ZUILarge, ZUIMedium } from '../types';

type CategoryItem = {
  selectItems: SelectItem[];
  title: string;
};

type SelectItem = {
  label: string;
  value: string;
};

const isCategoryItem = (
  item: CategoryItem | SelectItem
): item is CategoryItem => {
  return 'title' in item;
};

type ZUISelectProps = {
  /**
   * If the select is disabled or not.
   */
  disabled?: boolean;

  /**
   * If the select has an error.
   */
  error?: boolean;

  /**
   * The items that will render as options in the select.
   *
   * Can be either just a list of options, or "categories" where each
   * object has a title to be displayed as a sub-header, and a list
   * of options.
   */
  items: SelectItem[] | CategoryItem[];

  /**
   * The label of the select.
   */
  label: string;

  /**
   * The function that runs when an option is selected.
   */
  onChange: (newSelection: string) => void;

  /**
   * The currently selected option.
   */
  selectedOption: string;

  /**
   * The size of the select. Defaults to 'medium'.
   */
  size?: ZUIMedium | ZUILarge;
};

const ZUISelect: FC<ZUISelectProps> = ({
  disabled = false,
  error = false,
  label,
  onChange,
  items,
  size = 'medium',
  selectedOption,
}) => {
  const theme = useTheme();

  return (
    <FormControl
      disabled={disabled}
      error={error}
      size={size == 'medium' ? 'small' : 'medium'}
      sx={{
        '& > label': {
          fontFamily: theme.typography.fontFamily,
          fontSize: '1rem',
          fontWeight: '500',
          letterSpacing: '3%',
          transform: `translate(0.875rem, ${
            size == 'medium' ? '0.563rem' : '1rem'
          })`,
        },
        '& > label[data-shrink="true"]': {
          color: theme.palette.secondary.main,
          fontSize: '0.813rem',
          transform: 'translate(0.813rem, -0.563rem)',
        },
        '& >.MuiInputBase-root > fieldset > legend > span': {
          fontFamily: theme.typography.fontFamily,
          fontSize: '0.813rem',
          fontWeight: '500',
          letterSpacing: '3%',
          paddingLeft: '0.25rem',
          paddingRight: '0.25rem',
        },
        color: 'red',
        minWidth: '13.75rem',
      }}
    >
      <InputLabel id={`${label}-select`}>{label}</InputLabel>
      <Select
        label={<Typography variant="labelSmMedium">{label}</Typography>}
        labelId={`${label}-select`}
        onChange={(ev) => onChange(ev.target.value)}
        size={size == 'medium' ? 'small' : 'medium'}
        sx={{
          '& > .MuiSelect-select': {
            paddingY: size == 'medium' ? '0.594rem' : '',
          },
        }}
        value={selectedOption}
      >
        {items.map((item) => {
          if (isCategoryItem(item)) {
            return [
              <ListSubheader key={`subheader-${item.title}`}>
                {item.title}
              </ListSubheader>,
              ...item.selectItems.map((item) => (
                <MenuItem
                  key={item.value}
                  sx={{ paddingLeft: '2rem' }}
                  value={item.value}
                >
                  <Typography
                    sx={{
                      fontFamily: theme.typography.fontFamily,
                      fontSize: '1rem',
                      fontWeight: 400,
                      letterSpacing: '3%',
                    }}
                  >
                    {item.label}
                  </Typography>
                </MenuItem>
              )),
            ];
          } else {
            return (
              <MenuItem key={item.value} value={item.value}>
                <Typography
                  sx={{
                    fontFamily: theme.typography.fontFamily,
                    fontSize: '1rem',
                    fontWeight: 400,
                    letterSpacing: '3%',
                  }}
                >
                  {item.label}
                </Typography>
              </MenuItem>
            );
          }
        })}
      </Select>
    </FormControl>
  );
};

export default ZUISelect;
