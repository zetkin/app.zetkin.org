import { SvgIconTypeMap, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { makeStyles } from '@mui/styles';
import { FC } from 'react';

import { ZUIOrientation, ZUISize } from '../types';

const useStyles = makeStyles((theme) => ({
  toggleButtonGroup: {
    '& .MuiToggleButton-root': {
      '&:hover': {
        backgroundColor: theme.palette.grey[100],
        color: theme.palette.primary.main,
      },
      border: `1px solid ${theme.palette.primary.light}`,
      color: theme.palette.primary.main,
    },
    '& .MuiToggleButton-root.Mui-selected': {
      '&:hover': {
        color: theme.palette.primary.main,
      },
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
    '& .MuiToggleButton-sizeLarge': {
      padding: '0.5rem 1.375rem',
    },
    '& .MuiToggleButton-sizeLarge:has(>svg)': {
      '& > svg': {
        fontSize: '1.5rem',
      },
      padding: '0.469rem',
    },
    '& .MuiToggleButton-sizeMedium': {
      padding: '0.5rem 1rem',
    },
    '& .MuiToggleButton-sizeMedium:has(>svg)': {
      '& > svg': {
        fontSize: '1.5rem',
      },
      padding: '0.406rem',
    },
    '& .MuiToggleButton-sizeSmall': {
      padding: '0.313rem 0.625rem',
    },
    '& .MuiToggleButton-sizeSmall:has(svg)': {
      '& > svg': {
        fontSize: '1.25rem',
      },
      padding: '0.313rem',
    },
    '& .MuiToggleButtonGroup-grouped:not(:first-of-type)': {
      '&:hover': {
        border: `1px solid ${theme.palette.primary.light}`,
      },
    },
  },
}));

type TextOption = {
  label: string;
  value: string;
};

type IconOption = {
  label: OverridableComponent<SvgIconTypeMap<Record<string, unknown>, 'svg'>>;
  value: string;
};

interface ZUIToggleButtonProps {
  /**
   * One option for each button.
   * The labels can be either strings or icons.
   */
  options: TextOption[] | IconOption[];

  onChange: (newValue: string) => void;

  value: string;

  /**
   * The orientation of the row of buttons.
   * Defaults to 'horizontal'.
   */
  orientation?: ZUIOrientation;

  /**
   * The size of the buttons.
   * Defaults to 'medium'.
   */
  size?: ZUISize;
}

const isTextOption = (
  option: TextOption | IconOption
): option is TextOption => {
  return typeof option.label == 'string';
};

const ZUIToggleButton: FC<ZUIToggleButtonProps> = ({
  options,
  onChange,
  value,
  orientation = 'horizontal',
  size = 'medium',
}) => {
  const classes = useStyles();
  return (
    <ToggleButtonGroup
      className={classes.toggleButtonGroup}
      exclusive
      onChange={(ev, newValue) => onChange(newValue)}
      orientation={orientation}
      size={size}
      value={value}
    >
      {options.map((option) => {
        if (isTextOption(option)) {
          return (
            <ToggleButton key={option.value} size={size} value={option.value}>
              {option.label}
            </ToggleButton>
          );
        } else {
          const Icon = option.label;
          return (
            <ToggleButton key={option.value} value={option.value}>
              <Icon fontSize={size} />
            </ToggleButton>
          );
        }
      })}
    </ToggleButtonGroup>
  );
};

export default ZUIToggleButton;
