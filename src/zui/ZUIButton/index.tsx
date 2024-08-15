import { Button, CircularProgress } from '@mui/material';
import { FC, KeyboardEventHandler, MouseEventHandler } from 'react';

type ZUIButtonType =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'destructive'
  | 'warning'
  | 'loading';

interface ZUIButtonProps {
  buttonType?: 'button' | 'reset' | 'submit';
  disabled?: boolean;
  endIcon?: JSX.Element;
  fullWidth?: boolean;
  label: string | JSX.Element;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onKeyDown?: KeyboardEventHandler<HTMLButtonElement>;
  size?: 'large' | 'medium' | 'small';
  startIcon?: JSX.Element;
  type?: ZUIButtonType;
}

const getVariant = (type: ZUIButtonType) => {
  if (type === 'secondary') {
    return 'outlined';
  } else if (type === 'tertiary') {
    return 'text';
  } else {
    return 'contained';
  }
};

const getColor = (type: ZUIButtonType) => {
  if (type === 'destructive') {
    return 'error';
  } else if (type === 'warning') {
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
  type: ZUIButtonType = 'secondary'
) => {
  if (size === 'large') {
    if (type === 'secondary') {
      return '7px 22px 7px 22px';
    } else {
      return '8px 22px 8px 22px';
    }
  }

  if (size === 'medium') {
    if (type === 'tertiary') {
      return '6px 16px 6px 16px';
    }
  }

  if (size === 'small') {
    if (type === 'tertiary') {
      return '4px 10px 4px 10px';
    }
  }
};

const ZUIButton: FC<ZUIButtonProps> = ({
  buttonType,
  disabled,
  endIcon,
  fullWidth,
  label,
  onClick,
  onKeyDown,
  size,
  startIcon,
  type,
}) => {
  const isLoading = type === 'loading';
  return (
    <Button
      color={type ? getColor(type) : undefined}
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
          : getTextPadding(size, type),
      }}
      type={buttonType}
      variant={type ? getVariant(type) : undefined}
    >
      {isLoading ? <CircularProgress size={16} /> : label}
    </Button>
  );
};

export default ZUIButton;
