import { alpha } from '@mui/material/styles';
import { ArrowDropDown } from '@mui/icons-material';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import { MenuItem } from '@mui/material';
import { FC, MouseEvent, ReactNode, useState } from 'react';

import theme from 'theme';

type ZUIButtonMenuProps = {
  items: {
    disabled?: boolean;
    icon?: JSX.Element;
    label: string;
    onClick: () => void;
  }[];
  label: string;
  startIcon?: ReactNode;
  variant?: 'text' | 'outlined' | 'contained';
};

const ZUIButtonMenu: FC<ZUIButtonMenuProps> = ({
  items,
  label,
  startIcon,
  variant = 'contained',
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        endIcon={<ArrowDropDown />}
        onClick={handleClick}
        startIcon={startIcon}
        variant={variant}
      >
        {label}
      </Button>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'bottom',
        }}
        onClose={handleClose}
        open={open}
        sx={{
          '& .MuiPaper-root': {
            '& .MuiMenuItem-root': {
              '& .MuiSvgIcon-root': {
                marginRight: 1,
              },
              '&:active': {
                backgroundColor: alpha(
                  theme.palette.primary.main,
                  theme.palette.action.selectedOpacity
                ),
              },
            },
            marginTop: theme.spacing(1),
          },
        }}
        transformOrigin={{
          horizontal: 'right',
          vertical: 'top',
        }}
      >
        {items.map((item, idx) => {
          return (
            <MenuItem
              key={idx}
              disabled={item.disabled}
              disableRipple
              onClick={() => {
                handleClose();
                item.onClick();
              }}
            >
              {item.icon}
              {item.label}
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
};

export default ZUIButtonMenu;
