import Link from 'next/link';
import { ArrowBackIos } from '@mui/icons-material';
import { Box } from '@mui/material';
import { FC, useState } from 'react';

import { ZetkinCallAssignment } from 'utils/types/zetkin';
import ZUIPersonAvatar from 'zui/components/ZUIPersonAvatar';
import ZUIText from 'zui/components/ZUIText';
import useCurrentCall from '../hooks/useCurrentCall';
import ZUIButton from 'zui/components/ZUIButton';
import ZUIIconButton from 'zui/components/ZUIIconButton';
import SkipCallDialog from './SkipCallDialog';
import useCallMutations from '../hooks/useCallMutations';

type PrepareHeaderProps = {
  assignment: ZetkinCallAssignment;
};

const PrepareHeader: FC<PrepareHeaderProps> = ({ assignment }) => {
  const [inCall, setInCall] = useState(false);
  const call = useCurrentCall();
  const { deleteCall } = useCallMutations(assignment.organization.id);

  if (!call) {
    return null;
  }

  const handleToggleCall = () => {
    setInCall((prev) => !prev);
  };

  return (
    <Box p={2}>
      <Box alignItems="center" display="flex" mb={1} minWidth={0}>
        <Link
          href={`/call/${assignment.id}`}
          passHref
          style={{
            alignItems: 'center',
            display: 'flex',
            minWidth: 0,
            textDecoration: 'none',
            width: '100%',
          }}
        >
          <ZUIIconButton
            icon={ArrowBackIos}
            onClick={() => deleteCall(call.id)}
            size="small"
            variant="tertiary"
          />
          <ZUIText noWrap variant="bodySmRegular">
            {assignment.title}
          </ZUIText>
        </Link>
      </Box>
      <Box
        alignItems="center"
        display="grid"
        gap={1}
        gridTemplateColumns="1fr auto"
      >
        <Box alignItems="center" display="flex" minWidth={0}>
          <Box alignItems="center" display="flex" sx={{ flexShrink: 0 }}>
            <ZUIPersonAvatar
              firstName={call.target.first_name}
              id={call.target.id}
              lastName={call.target.last_name}
            />
          </Box>
          <Box
            alignItems="center"
            display="flex"
            ml={1}
            sx={{
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            <ZUIText noWrap variant="headingLg">
              {call.target.first_name} {call.target.last_name}
            </ZUIText>
          </Box>
        </Box>

        <Box display="flex" gap={2}>
          {!inCall && (
            <SkipCallDialog
              assignment={assignment}
              callId={call.id}
              targetName={call.target.first_name + ' ' + call.target.last_name}
            />
          )}

          {inCall ? (
            <ZUIButton label="End Call" variant="primary" />
          ) : (
            <Link href={`/call/${assignment.id}/ongoing`} passHref>
              <ZUIButton
                label="Call"
                onClick={handleToggleCall}
                variant="primary"
              />
            </Link>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default PrepareHeader;
