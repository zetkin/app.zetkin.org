import { alpha } from '@mui/material/styles';
import { ArrowDropDown } from '@mui/icons-material';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import { MenuItem } from '@mui/material';
import { FC, ReactNode, useState } from 'react';
import { Box } from '@mui/system';

import oldTheme from 'theme';

type Props = {
  items: {
    disabled?: boolean;
    icon?: JSX.Element;
    label: string;
    onClick: () => void;
  }[];
  label: string;
  onToggle: (open: boolean) => void;
  open: boolean;
  startIcon?: ReactNode;
  variant?: 'text' | 'outlined' | 'contained';
};

const FilterDropDown: FC<Props> = ({
  items,
  label,
  open,
  onToggle,
  startIcon,
  variant = 'contained',
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <div style={{ width: '100%' }}>
      <Button
        ref={(elem) => setAnchorEl(elem)}
        fullWidth
        onClick={() => onToggle(!open)}
        variant={variant}
      >
        <Box display="flex" justifyContent="space-between" width="100%">
          {label}
          <Box alignItems="center" display="flex">
            {startIcon}
            <ArrowDropDown />
          </Box>
        </Box>
      </Button>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          horizontal: 'left',
          vertical: 'bottom',
        }}
        onClose={() => onToggle(false)}
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
