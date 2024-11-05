import { ButtonGroup } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { FC } from 'react';

import ZUIButton, {
  getVariant,
  ZUIButtonProps,
} from 'zui/components/ZUIButton';
import ZUIIconButton, {
  ZUIIconButtonProps,
} from 'zui/components/ZUIIconButton';
import { ZUIOrientation, ZUISize, ZUIVariant } from '../types';

const useStyles = makeStyles({
  buttonGroup: {
    '& .MuiButton-outlined': {
      padding: '0.313rem 0.938rem 0.313rem 0.938rem',
    },
    '& .MuiButton-text, & .MuiButton-contained': {
      padding: '0.375rem 1rem 0.375rem 1rem',
    },
    '& > button': {
      '&.MuiButtonGroup-groupedHorizontal:has(.MuiSvgIcon-root)': {
        '&.MuiButton-sizeLarge:has(> svg)': {
          '&> svg': {
            fontSize: '1.75rem',
          },
          paddingLeft: 0,
          paddingRight: 0,
        },
        '&.MuiButton-sizeMedium:has(> svg)': {
          '&> svg': {
            fontSize: '1.5rem',
          },
          paddingLeft: 0,
          paddingRight: 0,
        },
        '&.MuiButton-sizeSmall:has(> svg)': {
          '&> svg': {
            fontSize: '1.25rem',
          },
          minWidth: '1.875rem',
          paddingLeft: 0,
          paddingRight: 0,
        },
      },
    },
    boxShadow: 'none',
  },
});

interface ZUIButtonGroupProps {
  buttons: (ZUIButtonProps | ZUIIconButtonProps)[];
  orientation?: ZUIOrientation;
  size?: ZUISize;
  variant?: ZUIVariant;
}

const ZUIButtonGroup: FC<ZUIButtonGroupProps> = ({
  buttons,
  orientation = 'horizontal',
  size = 'medium',
  variant = 'primary',
}) => {
  const classes = useStyles();
  return (
    <ButtonGroup
      className={classes.buttonGroup}
      orientation={orientation}
      size={size}
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
};

export default ZUIButtonGroup;
