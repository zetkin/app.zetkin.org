import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { FC } from 'react';

import { MUIIcon, ZUIOrientation, ZUISize } from '../types';

type OptionBase = {
  value: string;
};

type TextOption = OptionBase & {
  /**
   * A label for the toggle button.
   */
  label: string;
};

type IconOption = OptionBase & {
  /**
   * A function that returns a reference to an icon.
   *
   * Note that it should return the referecn to an icon,
   * for example: () => Close, not () => < Close / >.
   */
  renderIcon: () => MUIIcon;
};

type Option = TextOption | IconOption;

interface ZUIToggleButtonProps {
  /**
   * One option for each button.
   *
   *
   */
  options: Option[];

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

const isTextOption = (option: Option): option is TextOption => {
  return 'label' in option;
};

const ZUIToggleButton: FC<ZUIToggleButtonProps> = ({
  options,
  onChange,
  value,
  orientation = 'horizontal',
  size = 'medium',
}) => (
  <ToggleButtonGroup
    exclusive
    onChange={(ev, newValue) => onChange(newValue)}
    orientation={orientation}
    size={size}
    sx={(theme) => ({
      '& .MuiToggleButton-root': {
        '&:hover': {
          backgroundColor: theme.palette.grey[100],
          color: theme.palette.primary.main,
        },
        border: `1px solid ${theme.palette.grey[600]}`,
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
          border: `1px solid ${theme.palette.grey[600]}`,
        },
      },
    })}
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
        const Icon = option.renderIcon();
        return (
          <ToggleButton key={option.value} value={option.value}>
            <Icon fontSize={size} />
          </ToggleButton>
        );
      }
    })}
  </ToggleButtonGroup>
);

export default ZUIToggleButton;
