import { MoreVert } from '@mui/icons-material';
import noPropagate from 'utils/noPropagate';
import { Button, ListItemIcon, Menu, MenuItem } from '@mui/material';
import { FunctionComponent, ReactElement, useState } from 'react';

interface MenuItem {
  disabled?: boolean;
  divider?: boolean;
  id?: string;
  label: string | React.ReactNode;
  onSelect?: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
  startIcon?: ReactElement;
  subMenuItems?: Omit<MenuItem, 'subMenuItems'>[];
}

export interface ZUIEllipsisMenuProps {
  items: MenuItem[];
}

const ZUIEllipsisMenu: FunctionComponent<ZUIEllipsisMenuProps> = ({
  items,
}) => {
  const [menuActivator, setMenuActivator] = useState<null | HTMLElement>(null);
  const [subMenuActivator, setSubMenuActivator] = useState<null | HTMLElement>(
    null
  );

  const ITEM_HEIGHT = 48;

  return (
    <>
      <Button
        color="inherit"
        data-testid="ZUIEllipsisMenu-menuActivator"
        disableElevation
        onClick={noPropagate((e) =>
          setMenuActivator(e?.currentTarget as HTMLElement)
        )}
      >
        <MoreVert />
      </Button>
      <Menu
        anchorEl={menuActivator}
        keepMounted
        onClose={() => setMenuActivator(null)}
        open={Boolean(menuActivator)}
      >
        {items.map((item, idx) => (
          <MenuItem
            key={item.id || idx}
            divider={item.divider}
            data-testid={`ZUIEllipsisMenu-item-${item.id || idx}`}
            disabled={item.disabled}
            onClick={(e) => {
              if (item.onSelect) {
                item.onSelect(e);
                setMenuActivator(null);
              }
              if (item.subMenuItems) {
                setSubMenuActivator(e.currentTarget as HTMLElement);
              }
            }}
          >
            {item.startIcon && <ListItemIcon>{item.startIcon}</ListItemIcon>}
            {item.label}
            {item.subMenuItems && (
              <Menu
                anchorEl={subMenuActivator}
                anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                onClose={(e: Event) => {
                  e.stopPropagation();
                  setSubMenuActivator(null);
                }}
                open={Boolean(subMenuActivator)}
                PaperProps={{
                  style: {
                    maxHeight: ITEM_HEIGHT * 4.5,
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              >
                {item.subMenuItems.map((subMenuItem, index) => (
                  <MenuItem
                    key={subMenuItem.id || index}
                    onClick={(e) => {
                      if (subMenuItem.onSelect) {
                        e.stopPropagation();
                        subMenuItem.onSelect(e);
                        setMenuActivator(null);
                        setSubMenuActivator(null);
                      }
                    }}
                  >
                    {subMenuItem.label}
                  </MenuItem>
                ))}
              </Menu>
            )}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default ZUIEllipsisMenu;
