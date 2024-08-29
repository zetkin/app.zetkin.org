import { Button, CircularProgress } from '@mui/material';
import {
  CSSProperties,
  FC,
  KeyboardEventHandler,
  MouseEventHandler,
} from 'react';

type ZUIButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'destructive'
  | 'warning'
  | 'loading';

export interface ZUIButtonProps {
  actionType?: 'button' | 'reset' | 'submit';
  disabled?: boolean;
  endIcon?: JSX.Element;
  fullWidth?: boolean;
  label: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onKeyDown?: KeyboardEventHandler<HTMLButtonElement>;
  size?: 'large' | 'medium' | 'small';
  startIcon?: JSX.Element;
  variant?: ZUIButtonVariant;
}

export const getVariant = (variant: ZUIButtonVariant = 'secondary') => {
  if (variant === 'secondary') {
    return 'outlined';
  } else if (variant === 'tertiary') {
    return 'text';
  } else {
    return 'contained';
  }
};

const getColor = (variant: ZUIButtonVariant = 'secondary') => {
  if (variant === 'destructive') {
    return 'error';
  } else if (variant === 'warning') {
    return 'warning';
  } else {
    return 'primary';
  }
};

const getLoadingIndicatorPadding = (
  size: 'large' | 'medium' | 'small' = 'medium'
) => {
  if (size == 'large') {
    return '0.183rem 1.375rem 0.183rem 1.375rem';
  } else if (size == 'medium') {
    return '0.625rem 1rem 0.625rem 1rem';
  } else if (size == 'small') {
    return '0.438rem 0.625rem 0.438rem 0.625rem';
  }
};

const getTextPadding = (
  size: 'large' | 'medium' | 'small' = 'medium',
  variant: ZUIButtonVariant = 'secondary'
) => {
  if (size === 'large') {
    if (variant === 'secondary') {
      return '0.438rem 1.375rem 0.438rem 1.375rem';
    } else {
      return '0.5rem 1.375rem 0.5rem 1.375rem';
    }
  }

  if (size === 'medium') {
    if (variant === 'tertiary') {
      return '0.375rem 1rem 0.375rem 1rem';
    }
  }

  if (size === 'small') {
    if (variant === 'tertiary') {
      return '0.25rem 0.625rem 0.25rem 0.625rem';
    }
  }
};

const ZUIButton: FC<ZUIButtonProps> = ({
  actionType,
  disabled,
  endIcon,
  fullWidth,
  label,
  onClick,
  onKeyDown,
  size = 'medium',
  startIcon,
  variant,
}) => {
  const isLoading = variant === 'loading';
  return (
    <Button
      color={variant ? getColor(variant) : undefined}
      disabled={disabled || isLoading}
      endIcon={endIcon}
      fullWidth={fullWidth}
      onClick={onClick}
      onKeyDown={onKeyDown}
      size={size}
      startIcon={startIcon}
      sx={(theme) => {
        let textStyle: CSSProperties;
        if (size === 'small') {
          textStyle = theme.typography.labelSmSemiBold;
        } else if (size === 'medium') {
          textStyle = theme.typography.bodySmSemiBold;
        } else {
          textStyle = theme.typography.labelLgSemiBold;
        }

        return {
          ...textStyle,
          minWidth: '2.188rem',
          padding: isLoading
            ? getLoadingIndicatorPadding(size)
            : getTextPadding(size, variant),
        };
      }}
      type={actionType}
      variant={variant ? getVariant(variant) : undefined}
    >
      {isLoading ? <CircularProgress size={16} /> : label}
    </Button>
  );
};

export default ZUIButton;
