import { FC } from 'react';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import {
  ListItemIcon,
  Menu,
  MenuItem,
  SvgIconTypeMap,
  Typography,
} from '@mui/material';

export interface MenuItem {
  disabled?: boolean;
  divider?: boolean;
  label: string;
  onClick: () => void;
  startIcon?: OverridableComponent<
    SvgIconTypeMap<Record<string, unknown>, 'svg'>
  >;
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
}) => (
  <Menu
    anchorEl={anchorEl}
    onClose={onClose}
    open={!!anchorEl}
    slotProps={{
      paper: {
        sx: (theme) => ({ boxShadow: theme.elevation.bottom.small.medium }),
      },
    }}
    sx={{
      '& ul': {
        '& .MuiMenuItem-divider': {
          '& + li': {
            paddingTop: '0.5rem',
          },
          paddingBottom: '0.5rem',
        },
        maxHeight,
        width,
      },
    }}
  >
    {menuItems.map((item, index) => {
      const Icon = item.startIcon;
      return (
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
          {Icon && (
            <ListItemIcon>
              <Icon sx={{ fontSize: '1.5rem' }} />
            </ListItemIcon>
          )}
          <Typography variant="labelXlMedium">{item.label}</Typography>
        </MenuItem>
      );
    })}
  </Menu>
);

export default ZUIMenu;
