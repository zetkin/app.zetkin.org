import { cloneElement, forwardRef, FunctionComponentElement } from 'react';
import {
  IconProps,
  ListItemButton,
  ListItemIcon,
  useTheme,
} from '@mui/material';

import messageIds from 'features/manage/l10n/messageIds';
import { useMessages } from 'core/i18n';
import ZUIText from 'zui/components/ZUIText';

export interface SidebarListItemProps {
  icon: FunctionComponentElement<IconProps>;
  name: 'users';
  open: boolean;
  selected?: boolean;
  onClick?: () => void;
}

const SidebarListItem = forwardRef<HTMLDivElement, SidebarListItemProps>(
  ({ icon, name, onClick, open, selected, ...restProps }, ref) => {
    const theme = useTheme();
    const messages = useMessages(messageIds);

    const sizedIcon = cloneElement<IconProps>(icon, {
      // Differentiate size of icon for open/closed states
      fontSize: open ? 'small' : 'medium',
    });

    return (
      <ListItemButton
        ref={ref}
        disableGutters
        onClick={onClick}
        sx={{
          '&:hover': {
            background: theme.palette.grey[100],
            pointer: 'cursor',
          },
          backgroundColor: selected ? theme.palette.grey[200] : 'transparent',
          borderRadius: '3px',
          my: 0.5,
          py: open ? 1.25 : 1.5,
          transition: theme.transitions.create(
            ['padding-top', 'padding-bottom', 'background-color'],
            {
              duration: theme.transitions.duration.leavingScreen,
              easing: theme.transitions.easing.sharp,
            }
          ),
        }}
        {...restProps}
      >
        <ListItemIcon
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '48px',
            width: '48px',
          }}
        >
          {sizedIcon}
        </ListItemIcon>
        <ZUIText
          sx={{
            display: open ? 'block' : 'none',
          }}
          variant={selected ? 'bodyMdSemiBold' : 'bodyMdRegular'}
        >
          {messages.manageSidebar.items[name]()}
        </ZUIText>
      </ListItemButton>
    );
  }
);

SidebarListItem.displayName = 'SidebarListItem';

export default SidebarListItem;
