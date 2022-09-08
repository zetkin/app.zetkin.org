import { MoreVert } from '@material-ui/icons';
import { noPropagate } from 'utils/noPropagate';
import { Button, ListItemIcon, Menu, MenuItem } from '@material-ui/core';
import { FunctionComponent, ReactElement, useState } from 'react';

interface MenuItem {
  id?: string;
  label: string | React.ReactNode;
  onSelect?: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
  startIcon?: ReactElement;
  subMenuItems?: Omit<MenuItem, 'subMenuItems'>[];
}

export interface EllipsisMenuProps {
  items: MenuItem[];
}

const EllipsisMenu: FunctionComponent<EllipsisMenuProps> = ({ items }) => {
  const [menuActivator, setMenuActivator] = useState<null | HTMLElement>(null);
  const [subMenuActivator, setSubMenuActivator] = useState<null | HTMLElement>(
    null
  );

  const ITEM_HEIGHT = 48;

  return (
    <>
      <Button
        data-testid="EllipsisMenu-menuActivator"
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
            data-testid={`EllipsisMenu-item-${item.id || idx}`}
            onClick={(e) => {
              if (item.onSelect) {
                item.onSelect(e);
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
                getContentAnchorEl={null}
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

export default EllipsisMenu;
