import { FC, ReactNode } from 'react';
import {
  ListItemIcon,
  ListItemText,
  MenuItem,
  Typography,
} from '@mui/material';

interface ZUIMenuItemProps {
  dense?: boolean;
  disabled?: boolean;
  disableGutters?: boolean;
  divider?: boolean;
  endContent?: ReactNode;
  label: string;
  onClick?: () => void;
  smallScreen?: boolean;
  startIcon?: ReactNode;
}

const ZUIMenuItem: FC<ZUIMenuItemProps> = ({
  dense,
  disabled,
  disableGutters,
  divider,
  endContent,
  label,
  onClick,
  smallScreen,
  startIcon,
}) => {
  return (
    <MenuItem
      dense={dense}
      disabled={disabled}
      disableGutters={disableGutters}
      divider={divider}
      onClick={onClick}
      sx={{ paddingY: smallScreen ? 2 : '' }}
    >
      {startIcon && <ListItemIcon>{startIcon}</ListItemIcon>}
      <ListItemText>{label}</ListItemText>
      {endContent && (
        <Typography color="secondary" variant="body2">
          {endContent}
        </Typography>
      )}
    </MenuItem>
  );
};

export default ZUIMenuItem;
