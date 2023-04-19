import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { IconButton, Popover } from '@mui/material';
import { useState } from 'react';

import messageIds from '../l10n/messageIds';
import { Msg, useMessages } from 'core/i18n';
import ZUIPersonGridEditCell from 'zui/ZUIPersonGridEditCell';

const AddParticipantButton = () => {
  const messages = useMessages(messageIds);
  const [btnAnchor, setBtnAnchor] = useState<Element | null>(null);

  const update = () => {
    console.log('update');
  };
  return (
    <>
      <IconButton
        sx={{ fontSize: '1rem' }}
        onClick={(ev) => setBtnAnchor(ev.target as Element)}
      >
        <PersonAddIcon sx={{ mr: 1 }} />
        <Msg id={messageIds.addPerson} />
      </IconButton>
      <Popover
        anchorEl={btnAnchor}
        onClose={() => setBtnAnchor(null)}
        onKeyDown={(ev) => setBtnAnchor(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={!!btnAnchor}
        PaperProps={{
          style: {
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '40vh',
            // width: '30ch',
          },
        }}
      >
        <ZUIPersonGridEditCell
          onUpdate={update}
          removePersonLabel={''}
          suggestedPeople={[]}
          suggestedPeopleLabel={''}
        />
      </Popover>
    </>
  );
};

export default AddParticipantButton;
