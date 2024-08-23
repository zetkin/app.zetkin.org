import { ButtonGroup } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { FC } from 'react';

import ZUIButton, { getVariant, ZUIButtonProps } from 'zui/ZUIButton';
import ZUIIconButton, { ZUIIconButtonProps } from 'zui/ZUIIconButton';

const useStyles = makeStyles({
  group: {
    '& .MuiButton-outlined': {
      padding: '5px 15px 5px 15px',
    },
    '& .MuiButton-text, & .MuiButton-contained': {
      padding: '6px 16px 6px 16px',
    },
  },
});

interface ZUIButtonGroupProps {
  buttons: (ZUIButtonProps | ZUIIconButtonProps)[];
  orientation?: 'horizontal' | 'vertical';
  size?: 'large' | 'medium' | 'small';
  variant?: 'primary' | 'secondary' | 'tertiary';
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
      className={classes.group}
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
