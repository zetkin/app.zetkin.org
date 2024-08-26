import { makeStyles } from '@mui/styles';
import { FC, ReactNode } from 'react';
import { ListItemIcon, Menu, MenuItem, Theme, Typography } from '@mui/material';

const useStyles = makeStyles<Theme, { maxHeight?: string; width?: string }>(
  (theme) => ({
    menu: {
      '& ul': {
        '& .MuiMenuItem-divider': {
          '& + li': {
            paddingTop: '8px',
          },
          paddingBottom: '8px',
        },
        '& li > p': {
          marginLeft: '12px',
        },
        maxHeight: ({ maxHeight }) => (maxHeight ? maxHeight : ''),
        width: ({ width }) => (width ? width : ''),
      },
    },
    paper: {
      boxShadow: theme.elevation.bottom.small.medium,
    },
  })
);

export interface MenuItem {
  disabled?: boolean;
  divider?: boolean;
  endContent?: ReactNode;
  label: string;
  onClick: () => void;
  startIcon?: ReactNode;
}

interface ZUIMenuProps {
  anchorEl?: Element | null;
  dense?: boolean;
  disableGutters?: boolean;
  menuItems: MenuItem[];
  maxHeight?: string;
  onClose?: () => void;
  width?: string;
}

const ZUIMenu: FC<ZUIMenuProps> = ({
  dense,
  disableGutters,
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
      PaperProps={{ className: classes.paper }}
    >
      {menuItems.map((item, index) => (
        <MenuItem
          key={index}
          dense={dense}
          disabled={item.disabled}
          disableGutters={disableGutters}
          divider={item.divider}
          onClick={() => {
            item.onClick();
            if (onClose) {
              onClose();
            }
          }}
        >
          {item.startIcon && <ListItemIcon>{item.startIcon}</ListItemIcon>}
          <Typography variant="bodySmRegular">{item.label}</Typography>
          {item.endContent && (
            <Typography color="secondary" variant="bodySmRegular">
              {item.endContent}
            </Typography>
          )}
        </MenuItem>
      ))}
    </Menu>
  );
};

export default ZUIMenu;
