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
import useCallMutations from '../hooks/useCallMutations';
import ZUIDivider from 'zui/components/ZUIDivider';

type OnCallHeaderProps = {
  assignment: ZetkinCallAssignment;
  onReportCall?: () => void;
};

const OnCallHeader: FC<OnCallHeaderProps> = ({ assignment, onReportCall }) => {
  const call = useCurrentCall();
  const { deleteCall } = useCallMutations(assignment.organization.id);

  if (!call) {
    return null;
  }

  return (
    <>
      <Box p={2}>
        <Box alignItems="center" display="flex" mb={1} minWidth={0}>
          <Link
            href={`/call/${assignment.id}`}
            onClick={() => deleteCall(call.id)}
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
              }}
            >
              <ZUIText noWrap variant="headingLg">
                {call.target.first_name} {call.target.last_name}
              </ZUIText>
            </Box>
          </Box>

          <ZUIButton
            label="End Call"
            onClick={onReportCall}
            variant="primary"
          />
        </Box>
      </Box>
      <ZUIDivider />
    </>
  );
};

export default OnCallHeader;
