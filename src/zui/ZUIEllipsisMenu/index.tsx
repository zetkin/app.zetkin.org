import { MoreVert } from '@mui/icons-material';
import {
  Button,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { FunctionComponent, ReactElement, useState } from 'react';

import noPropagate from 'utils/noPropagate';
import theme from 'theme';

type horizontalType = 'left' | 'center' | 'right';
type verticalType = 'top' | 'center' | 'bottom';

interface MenuItem {
  disabled?: boolean;
  divider?: boolean;
  id?: string;
  label: string | React.ReactNode;
  onSelect?: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
  startIcon?: ReactElement;
  subMenuItems?: Omit<MenuItem, 'subMenuItems'>[];
  textColor?: string;
}

export interface ZUIEllipsisMenuProps {
  items: MenuItem[];
  anchorOrigin?: { horizontal: horizontalType; vertical: verticalType };
  transformOrigin?: { horizontal: horizontalType; vertical: verticalType };
}

const ZUIEllipsisMenu: FunctionComponent<ZUIEllipsisMenuProps> = ({
  items,
  anchorOrigin,
  transformOrigin,
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
        anchorOrigin={
          anchorOrigin ?? { horizontal: 'left', vertical: 'bottom' }
        }
        keepMounted
        onClose={() => setMenuActivator(null)}
        open={Boolean(menuActivator)}
        sx={{
          '& .MuiPaper-root': {
            '& .MuiMenuItem-root': {
              '& .MuiSvgIcon-root': {
                marginRight: 1,
              },
            },
            marginTop: theme.spacing(1),
          },
        }}
        transformOrigin={
          transformOrigin ?? { horizontal: 'left', vertical: 'top' }
        }
      >
        {items.map((item, idx) => (
          <MenuItem
            key={item.id || idx}
            data-testid={`ZUIEllipsisMenu-item-${item.id || idx}`}
            disabled={item.disabled}
            divider={item.divider}
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
            <Typography sx={{ color: item.textColor ?? '', display: 'flex' }}>
              {item.label}
            </Typography>
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
