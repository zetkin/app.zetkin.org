import { Button, CircularProgress } from '@mui/material';
import { FC, KeyboardEventHandler, MouseEventHandler } from 'react';

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

export const getVariant = (variant: ZUIButtonVariant) => {
  if (variant === 'secondary') {
    return 'outlined';
  } else if (variant === 'tertiary') {
    return 'text';
  } else {
    return 'contained';
  }
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

const getLoadingIndicatorPadding = (
  size: 'large' | 'medium' | 'small' = 'medium'
) => {
  if (size == 'large') {
    return '13px 22px 13px 22px';
  } else if (size == 'medium') {
    return '10px 16px 10px 16px';
  } else if (size == 'small') {
    return '7px 10px 7px 10px';
  }
};

const getTextPadding = (
  size: 'large' | 'medium' | 'small' = 'medium',
  variant: ZUIButtonVariant = 'secondary'
) => {
  if (size === 'large') {
    if (variant === 'secondary') {
      return '7px 22px 7px 22px';
    } else {
      return '8px 22px 8px 22px';
    }
  }

  if (size === 'medium') {
    if (variant === 'tertiary') {
      return '6px 16px 6px 16px';
    }
  }

  if (size === 'small') {
    if (variant === 'tertiary') {
      return '4px 10px 4px 10px';
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
  size,
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
      sx={{
        minWidth: '35px',
        padding: isLoading
          ? getLoadingIndicatorPadding(size)
          : getTextPadding(size, variant),
      }}
      type={actionType}
      variant={variant ? getVariant(variant) : undefined}
    >
      {isLoading ? <CircularProgress size={16} /> : label}
    </Button>
  );
};

export default ZUIButton;
