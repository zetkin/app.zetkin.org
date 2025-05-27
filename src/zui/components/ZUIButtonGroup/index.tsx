import { ButtonGroup } from '@mui/material';
import { FC } from 'react';

import ZUIButton, {
  getVariant,
  ZUIButtonProps,
} from 'zui/components/ZUIButton';
import ZUIIconButton, {
  ZUIIconButtonProps,
} from 'zui/components/ZUIIconButton';
import { ZUIOrientation, ZUISize, ZUIVariant } from '../types';

interface ZUIButtonGroupProps {
  /**
   * List of button props to be rendered in the button group.
   */
  buttons: (ZUIButtonProps | ZUIIconButtonProps)[];

  /**
   * If the component is full-width or not.
   * Defaults to "false".
   */
  fullWidth?: boolean;

  /**
   * The orientation of the button group.
   *
   * Defaults to "horizontal".
   */
  orientation?: ZUIOrientation;

  /**
   * The size of the buttons.
   *
   * Defaults to "medium".
   */
  size?: ZUISize;

  /**
   * The variant of the buttons.
   *
   * Defaults to "primary".
   */
  variant?: ZUIVariant;
}

const ZUIButtonGroup: FC<ZUIButtonGroupProps> = ({
  buttons,
  fullWidth = false,
  orientation = 'horizontal',
  size = 'medium',
  variant = 'primary',
}) => (
  <ButtonGroup
    fullWidth={fullWidth}
    orientation={orientation}
    size={size}
    sx={{
      '& .MuiButton-outlined': {
        padding: '0.313rem 0.938rem 0.313rem 0.938rem',
      },
      '& .MuiButton-text, & .MuiButton-contained': {
        padding: '0.375rem 1rem 0.375rem 1rem',
      },
      '& > button': {
        '&.MuiButtonGroup-groupedHorizontal:has(.MuiSvgIcon-root)': {
          '&.MuiButton-sizeLarge:has(> svg)': {
            paddingLeft: 0,
            paddingRight: 0,
          },
          '&.MuiButton-sizeMedium:has(> svg)': {
            paddingLeft: 0,
            paddingRight: 0,
          },
          '&.MuiButton-sizeSmall:has(> svg)': {
            minWidth: '1.875rem',
            paddingLeft: 0,
            paddingRight: 0,
          },
        },
      },
      boxShadow: 'none',
    }}
    variant={getVariant(variant)}
  >
    {buttons.map((button) => {
      if ('icon' in button) {
        return <ZUIIconButton {...button} />;
      } else {
        return <ZUIButton {...button} />;
      }
    })}
  </ButtonGroup>
);

export default ZUIButtonGroup;
