import { MoreVert } from '@material-ui/icons';
import { noPropagate } from 'utils';
import { Button, ListItemIcon, Menu, MenuItem } from '@material-ui/core';
import { FunctionComponent, ReactElement, useState } from 'react';

interface MenuItem {
  id?: string;
  label: string | React.ReactNode;
  onSelect: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
  startIcon?: ReactElement;
  subMenuItems?: Omit<MenuItem, 'subMenuItems'>[];
}

export interface ZetkinEllipsisMenuProps {
  items: MenuItem[];
}

const ZetkinEllipsisMenu: FunctionComponent<ZetkinEllipsisMenuProps> = ({
  items,
}) => {
  const [menuActivator, setMenuActivator] = useState<null | HTMLElement>(null);
  const [subMenuActivator, setSubMenuActivator] = useState<null | HTMLElement>(
    null
  );

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
              item.onSelect(e);
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
                onClose={(e: Event) => {
                  e.stopPropagation();
                  setSubMenuActivator(null);
                }}
                open={Boolean(subMenuActivator)}
              >
                {item.subMenuItems.map((subMenuItem, index) => (
                  <MenuItem
                    key={subMenuItem.id || index}
                    data-testid={`EllipsisSubMenu-item-${
                      subMenuItem.id || index
                    }`}
                    onClick={(e) => subMenuItem.onSelect(e)}
                  >
                    {subMenuItem.startIcon && (
                      <ListItemIcon>{item.startIcon}</ListItemIcon>
                    )}
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

export default ZetkinEllipsisMenu;
