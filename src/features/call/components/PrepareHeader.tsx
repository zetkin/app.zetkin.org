import Link from 'next/link';
import { ArrowBackIos } from '@mui/icons-material';
import { Box } from '@mui/material';
import { FC } from 'react';

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
  const call = useCurrentCall();
  const { deleteCall } = useCallMutations(assignment.organization.id);

  if (!call) {
    return null;
  }

  return (
    <Box p={2}>
      <Box alignItems="center" display="flex" gap={1} mb={1} minWidth={0}>
        <Link href={`/call/${assignment.id}`} passHref>
          <ZUIIconButton
            icon={ArrowBackIos}
            onClick={() => deleteCall(call.id)}
            size="small"
            variant="tertiary"
          />
        </Link>
        <Box
          sx={{
            flexGrow: 1,
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          <ZUIText noWrap variant="bodySmRegular">
            {assignment.title}
          </ZUIText>
        </Box>
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
          {call && (
            <SkipCallDialog
              assignment={assignment}
              callId={call.id}
              targetName={call.target.first_name + ' ' + call.target.last_name}
            />
          )}
          <ZUIButton label="Call" variant="primary" />
        </Box>
      </Box>
    </Box>
  );
};

export default PrepareHeader;
