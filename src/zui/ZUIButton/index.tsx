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

const getLoadingIndicatorSize = (
  size: 'large' | 'medium' | 'small' = 'medium'
) => {
  if (size == 'large') {
    return '15px';
  } else if (size == 'medium') {
    return '14px';
  } else if (size == 'small') {
    return '13px';
  }
};

const getLoadingIndicatorPadding = (
  size: 'large' | 'medium' | 'small' = 'medium'
) => {
  if (size == 'large') {
    return 1.7;
  } else if (size == 'medium') {
    return 1.4;
  } else if (size == 'small') {
    return 1.1;
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
      sx={{ padding: isLoading ? getLoadingIndicatorPadding(size) : '' }}
      type={buttonType}
      variant={type ? getVariant(type) : undefined}
    >
      {isLoading ? (
        <CircularProgress size={getLoadingIndicatorSize(size)} />
      ) : (
        label
      )}
    </Button>
  );
};

export default ZUIButton;
