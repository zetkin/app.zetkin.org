import { alpha } from '@mui/material/styles';
import { ArrowDropDown } from '@mui/icons-material';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import { MenuItem } from '@mui/material';
import { FC, MouseEvent, ReactNode, useState } from 'react';

import oldTheme from 'theme';

type ZUIButtonMenuProps = {
  alignHorizontal?: 'right' | 'left';
  alignVertical?: 'bottom' | 'top';
  items: {
    disabled?: boolean;
    icon?: JSX.Element;
    label: string;
    onClick: () => void;
  }[];
  label: string;
  loading?: boolean;
  startIcon?: ReactNode;
  variant?: 'text' | 'outlined' | 'contained';
};

const ZUIButtonMenu: FC<ZUIButtonMenuProps> = ({
  alignHorizontal = 'right',
  alignVertical = 'bottom',
  items,
  label,
  loading,
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
        loading={loading}
        onClick={handleClick}
        startIcon={startIcon}
        variant={variant}
      >
        {label}
      </Button>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          horizontal: alignHorizontal,
          vertical: alignVertical,
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
                  oldTheme.palette.primary.main,
                  oldTheme.palette.action.selectedOpacity
                ),
              },
            },
            marginTop: oldTheme.spacing(1),
          },
        }}
        transformOrigin={{
          horizontal: alignHorizontal,
          vertical: alignVertical == 'bottom' ? 'top' : 'bottom',
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
