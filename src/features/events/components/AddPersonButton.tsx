import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { IconButton } from '@mui/material';
import { useState } from 'react';

import AddParticipantPopover from './AddParticipantPopover';
import messageIds from '../l10n/messageIds';
import { Msg } from 'core/i18n';

interface AddPersonButtonProps {
  eventId: number;
  orgId: number;
}

const AddPersonButton = ({ eventId, orgId }: AddPersonButtonProps) => {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  return (
    <>
      <IconButton
        onClick={(ev) => {
          setAnchorEl(ev.target as Element);
        }}
        sx={{ fontSize: '1rem' }}
      >
        <PersonAddIcon sx={{ mr: 1 }} />
        <Msg id={messageIds.addPerson.addButton} />
      </IconButton>
      <AddParticipantPopover
        anchorEl={anchorEl}
        eventId={eventId}
        onChangeAnchor={() => setAnchorEl(null)}
        orgId={orgId}
      />
    </>
  );
};

export default AddPersonButton;
