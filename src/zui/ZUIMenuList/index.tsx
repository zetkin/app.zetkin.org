import { FC } from 'react';
import {
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Typography,
} from '@mui/material';

import { MenuItem as MenuItemType } from 'zui/ZUIMenu';

interface ZUIMenuListProps {
  menuItems: MenuItemType[];
}

const ZUIMenuList: FC<ZUIMenuListProps> = ({ menuItems }) => {
  return (
    <MenuList>
      {menuItems.map((item, index) => (
        <MenuItem
          key={index}
          dense={item.dense}
          disabled={item.disabled}
          disableGutters={item.disableGutters}
          divider={item.divider}
          onClick={item.onClick}
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
    </MenuList>
  );
};

export default ZUIMenuList;
