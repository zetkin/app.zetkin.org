import { alpha } from '@mui/material/styles';
import { ArrowDropDown } from '@mui/icons-material';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import { MenuItem } from '@mui/material';
import { FC, ReactNode, useState } from 'react';

import theme from 'theme';

type Props = {
  closeOnClick?: boolean;
  initiallyOpen?: boolean;
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

const FilterDropDown: FC<Props> = ({
  closeOnClick,
  initiallyOpen,
  items,
  label,
  startIcon,
  variant = 'contained',
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(!!initiallyOpen);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        ref={(elem) => setAnchorEl(elem)}
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
          horizontal: 'left',
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
          },
        }}
        transformOrigin={{
          horizontal: 'left',
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
                if (closeOnClick) {
                  handleClose();
                }

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

export default FilterDropDown;
