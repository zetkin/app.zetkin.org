import { FC } from 'react';
import { ListItemIcon, Menu, MenuItem, Typography } from '@mui/material';

import { MUIIcon } from '../types';

export type MenuItem = {
  /**
   * If the menu item is disabled.
   *
   * Defaults to "false".
   */
  disabled?: boolean;

  /**
   * If a divider should be rendered below the menu item.
   *
   * Defaults to "false".
   */
  divider?: boolean;

  /**
   * The text in the menu item.
   */
  label: string;

  /**
   * The function that runs when the user clicks this menu item.
   */
  onClick: () => void;

  /**
   * An icon to display to the left of the menu item text.
   *
   * Pass in reference to the icon, for example: Close, not < Close / >.
   */
  startIcon?: MUIIcon;
};

type ZUIMenuProps = {
  /**
   * The html element that the menu anchors itself at.
   */
  anchorEl?: Element | null;

  /**
   * The maximum height of the menu.
   */
  maxHeight?: string;

  /**
   * The list of menu items.
   */
  menuItems: MenuItem[];

  /**
   * The function that runs when the menu should close.
   */
  onClose?: () => void;

  /**
   * The width of the menu.
   * If none is provided it will be as wide as its widest menu item.
   */
  width?: string;
};

const ZUIMenu: FC<ZUIMenuProps> = ({
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
          disabled={item.disabled}
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
