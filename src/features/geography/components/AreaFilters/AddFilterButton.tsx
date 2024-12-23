import { alpha } from '@mui/material/styles';
import { Add } from '@mui/icons-material';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import { MenuItem } from '@mui/material';
import { FC, useState } from 'react';

import theme from 'theme';
import { Msg } from 'core/i18n';
import messageIds from 'features/geography/l10n/messageIds';

type Props = {
  items: {
    disabled?: boolean;
    icon?: JSX.Element;
    label: string;
    onClick: () => void;
  }[];
  onToggle: (open: boolean) => void;
  open: boolean;
};

const AddFilterButton: FC<Props> = ({ items, open, onToggle }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <div>
      <Button
        ref={(elem) => setAnchorEl(elem)}
        onClick={() => onToggle(!open)}
        startIcon={<Add />}
        variant="text"
      >
        <Msg id={messageIds.areas.filter.addFilterButton} />
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

export default AddFilterButton;
