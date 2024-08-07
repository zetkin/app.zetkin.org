import { makeStyles } from '@mui/styles';
import { FC, ReactNode } from 'react';
import {
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Theme,
  Typography,
} from '@mui/material';

const useStyles = makeStyles<Theme, { maxHeight?: string; width?: string }>({
  menu: {
    '& ul': {
      maxHeight: ({ maxHeight }) => (maxHeight ? maxHeight : ''),
      width: ({ width }) => (width ? width : ''),
    },
  },
});

export interface MenuItem {
  dense?: boolean;
  disabled?: boolean;
  disableGutters?: boolean;
  divider?: boolean;
  endContent?: ReactNode;
  label: string;
  onClick: () => void;
  smallScreen?: boolean;
  startIcon?: ReactNode;
}

interface ZUIMenuProps {
  anchorEl?: Element | null;
  menuItems: MenuItem[];
  maxHeight?: string;
  width?: string;
  onClose?: () => void;
}

const ZUIMenu: FC<ZUIMenuProps> = ({
  anchorEl,
  maxHeight,
  menuItems,
  width,
  onClose,
}) => {
  const classes = useStyles({ maxHeight, width });
  return (
    <Menu
      anchorEl={anchorEl}
      className={classes.menu}
      onClose={onClose}
      open={!!anchorEl}
    >
      {menuItems.map((item, index) => (
        <MenuItem
          key={index}
          dense={item.dense}
          disabled={item.disabled}
          disableGutters={item.disableGutters}
          divider={item.divider}
          onClick={() => {
            item.onClick();
            if (onClose) {
              onClose();
            }
          }}
          sx={{ paddingY: item.smallScreen ? 2 : '' }}
        >
          {item.startIcon && <ListItemIcon>{item.startIcon}</ListItemIcon>}
          <ListItemText>{item.label}</ListItemText>
          {item.endContent && (
            <Typography color="secondary" variant="body2">
              {item.endContent}
            </Typography>
          )}
        </MenuItem>
      ))}
    </Menu>
  );
};

export default ZUIMenu;
