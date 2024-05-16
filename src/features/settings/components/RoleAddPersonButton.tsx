import { People } from '@mui/icons-material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useState } from 'react';
import { Box, Button, Popover } from '@mui/material';

import messageIds from '../l10n/messageIds';
import useRoles from '../hooks/useRoles';
import { ZetkinOfficial } from 'utils/types/zetkin';
import zuiMessageIds from 'zui/l10n/messageIds';
import { MUIOnlyPersonSelect as ZUIPersonSelect } from 'zui/ZUIPersonSelect';
import { Msg, useMessages } from 'core/i18n';

interface RoleAddPersonButtonProps {
  orgId: number;
  disabledList: ZetkinOfficial[];
}

const RoleAddPersonButton = ({
  disabledList,
  orgId,
}: RoleAddPersonButtonProps) => {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const zuiMessages = useMessages(zuiMessageIds);
  const rolesFuture = useRoles(orgId);
  const getOptionExtraLabel = (personId: number) => {
    if (data.some((participant) => participant.id === personId)) {
      return (
        <Box
          sx={{
            color: '#A8A8A8',
            display: 'flex',
            fontSize: '0.9rem',
          }}
        >
          <People sx={{ fontSize: '1.3rem', mr: 1 }} />
          <Msg id={messageIds.addPerson.status.booked} />
        </Box>
      );
    }
    // if (respondents.some((respondent) => respondent.id === personId)) {
    //   return (
    //     <Box
    //       sx={{
    //         color: '#A8A8A8',
    //         display: 'flex',
    //         fontSize: '0.9rem',
    //       }}
    //     >
    //       <EmojiPeople sx={{ fontSize: '1.3rem', mr: 1 }} />
    //       <Msg id={messageIds.addPerson.status.signedUp} />
    //     </Box>
    //   );
    // }
    return '';
  };
  return (
    <>
      <Button
        onClick={(ev) => {
          setAnchorEl(ev.target as Element);
        }}
        startIcon={<PersonAddIcon />}
        sx={{ fontSize: '1rem' }}
        variant="outlined"
      >
        <Msg id={messageIds.addPerson.button} />
      </Button>

      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'bottom',
        }}
        elevation={1}
        onClose={() => setAnchorEl(null)}
        open={!!anchorEl}
        PaperProps={{
          style: {
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '40vh',
            maxWidth: '400px',
            width: '40vh',
          },
        }}
        transformOrigin={{
          horizontal: 'right',
          vertical: 'top',
        }}
      >
        <Box mt={1} p={2}>
          <ZUIPersonSelect
            getOptionDisabled={(option) =>
              disabledList.some((participant) => participant.id == option.id)
            }
            getOptionExtraLabel={(option) => {
              return getOptionExtraLabel(option.id);
            }}
            name="person"
            onChange={(person) => {
              // addParticipant(person.id);
            }}
            placeholder={'place'}
            selectedPerson={null}
            submitLabel={zuiMessages.createPerson.submitLabel.add()}
            title={zuiMessages.createPerson.title.participant()}
            variant="outlined"
          />
        </Box>
      </Popover>
    </>
  );
};

export default RoleAddPersonButton;
