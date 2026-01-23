import { FC } from 'react';
import { alpha, Button, CircularProgress } from '@mui/material';

import {
  getVariant,
  ZUIButtonProps,
  ZUIButtonVariant,
} from 'zui/components/ZUIButton';
import { MUIIcon, ZUISize } from '../types';

export type ZUIIconButtonProps = Omit<
  ZUIButtonProps,
  'endIcon' | 'fullWidth' | 'label' | 'startIcon'
> & {
  /**
   * The icon to be rendered in the button.
   *
   * Send in a reference to the icon, not the component, for example: Close, not < Close / >
   */
  icon: MUIIcon;
};

const getColor = (variant: ZUIButtonVariant) => {
  if (variant === 'destructive') {
    return 'error';
  } else if (variant === 'warning') {
    return 'warning';
  } else {
    return 'primary';
  }
};

const getPadding = (size: ZUISize, variant: ZUIButtonVariant) => {
  if (variant === 'secondary') {
    if (size === 'small') {
      return '0.25rem';
    } else if (size === 'medium') {
      return '0.344rem';
    } else {
      return '0.406rem';
    }
  }

  const padding: Record<ZUISize, string> = {
    large: '0.469rem',
    medium: '0.406rem',
    small: '0.313rem',
  };

  return padding[size];
};

const ZUIIconButton: FC<ZUIIconButtonProps> = ({
  actionType,
  disabled,
  href,
  icon: Icon,
  onClick,
  onKeyDown,
  size = 'medium',
  variant,
}) => {
  const isLoading = variant === 'loading';
  return (
    <Button
      color={variant ? getColor(variant) : undefined}
      disabled={disabled || isLoading}
      href={href}
      onClick={onClick}
      onKeyDown={onKeyDown}
      size={size}
      sx={(theme) => ({
        '& >.MuiCircularProgress-root': {
          color: theme.palette.grey[300],
        },
        '&.Mui-disabled': {
          '&.MuiButton-containedError': {
            backgroundColor: theme.palette.swatches.red[400],
            color: theme.palette.swatches.red[100],
          },
          '&.MuiButton-containedPrimary': {
            backgroundColor: theme.palette.grey[600],
            color: theme.palette.grey[300],
          },
          '&.MuiButton-containedWarning': {
            backgroundColor: theme.palette.swatches.yellow[200],
            color: theme.palette.swatches.yellow[600],
          },
          '&.MuiButton-outlinedPrimary': {
            borderColor: theme.palette.grey[300],
            color: theme.palette.grey[400],
          },
          '&.MuiButton-textPrimary': {
            color: theme.palette.grey[400],
          },
        },
        '&:hover': {
          '&.MuiButton-containedError': {
            backgroundColor: theme.palette.error.dark,
          },
          '&.MuiButton-containedPrimary': {
            backgroundColor: theme.palette.primary.dark,
          },
          '&.MuiButton-containedWarning': {
            backgroundColor: theme.palette.warning.dark,
          },
          '&.MuiButton-outlinedPrimary': {
            backgroundColor: alpha(theme.palette.primary.main, 0.11),
          },
          '&.MuiButton-textPrimary': {
            backgroundColor: alpha(theme.palette.primary.main, 0.11),
          },
          boxShadow: 'none',
        },
        borderColor: theme.palette.primary.light,
        boxShadow: 'none',
        minWidth: 0,
        padding: variant ? getPadding(size, variant) : '',
      })}
      type={actionType}
      variant={variant ? getVariant(variant) : undefined}
    >
      {variant === 'loading' && (
        <CircularProgress
          size={size === 'small' ? '0.875rem' : '1rem'}
          sx={{ margin: size === 'small' ? '0.188rem' : '0.25rem' }}
        />
      )}
      {variant !== 'loading' && (
        <Icon
          sx={(theme) => {
            let color: string | undefined = '';

            if (!disabled) {
              if (variant === 'primary' || variant === 'destructive') {
                color = theme.palette.common.white;
              } else if (variant) {
                color = theme.palette.primary.main;
              } else {
                //Variant is undefined = we want to inherit color from parent.
                color = '';
              }
            }

            return {
              color,
              fontSize: size === 'small' ? '1.25rem' : '1.5rem',
            };
          }}
        />
      )}
    </Button>
  );
};

export default ZUIIconButton;
