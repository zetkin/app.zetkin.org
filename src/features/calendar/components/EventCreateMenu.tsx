import { Event, SplitscreenOutlined } from '@mui/icons-material';
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';

import messageIds from '../l10n/messageIds';
import { Msg } from 'core/i18n';

type EventCreateMenuProps = {
  anchorEl: HTMLElement;
  disabled?: boolean;
  id?: string;
  onClose: () => void;
  onCreateShifts: () => void;
  onCreateSingle: () => void;
  openTowardsLeft: boolean;
};

const EventCreateMenu = ({
  anchorEl,
  disabled = false,
  id,
  onClose,
  onCreateShifts,
  onCreateSingle,
  openTowardsLeft,
}: EventCreateMenuProps) => (
  <Menu
    anchorEl={anchorEl}
    anchorOrigin={{
      horizontal: openTowardsLeft ? 'left' : 'right',
      vertical: 'bottom',
    }}
    onClose={onClose}
    open={true}
    slotProps={{ list: { id } }}
    transformOrigin={{
      horizontal: openTowardsLeft ? 'right' : 'left',
      vertical: 'top',
    }}
  >
    <MenuItem disabled={disabled} onClick={onCreateSingle}>
      <ListItemIcon>
        <Event />
      </ListItemIcon>
      <ListItemText>
        <Msg id={messageIds.createMenu.singleEvent} />
      </ListItemText>
    </MenuItem>
    <MenuItem disabled={disabled} onClick={onCreateShifts}>
      <ListItemIcon>
        <SplitscreenOutlined />
      </ListItemIcon>
      <ListItemText>
        <Msg id={messageIds.createMenu.shiftEvent} />
      </ListItemText>
    </MenuItem>
  </Menu>
);

export default EventCreateMenu;
