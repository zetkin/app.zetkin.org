import { ArrowBackIos } from '@mui/icons-material';
import { Box } from '@mui/material';
import { FC, useState } from 'react';

import { ZetkinCallAssignment } from 'utils/types/zetkin';
import ZUIPersonAvatar from 'zui/components/ZUIPersonAvatar';
import ZUIText from 'zui/components/ZUIText';
import useCurrentCall from '../hooks/useCurrentCall';
import ZUIButton from 'zui/components/ZUIButton';
import SkipCallDialog from './SkipCallDialog';
import useCallMutations from '../hooks/useCallMutations';
import ZUIDivider from 'zui/components/ZUIDivider';
import CallSwitchModal from './CallSwitchModal';
import ZUIBadge from 'zui/components/ZUIBadge';
import useOutgoingCalls from '../hooks/useOutgoingCalls';

type PrepareHeaderProps = {
  assignment: ZetkinCallAssignment;
  onBack: () => void;
  onStartCall: () => void;
  onSwitchCall: () => void;
};

const PrepareHeader: FC<PrepareHeaderProps> = ({
  assignment,
  onBack,
  onStartCall,
  onSwitchCall,
}) => {
  const call = useCurrentCall();
  const { deleteCall } = useCallMutations(assignment.organization.id);
  const [showModal, setShowModal] = useState(false);
  const outgoingCalls = useOutgoingCalls();
  const unfinishedCallList = outgoingCalls.filter((call) => call.state === 0);

  if (!call) {
    return null;
  }

  return (
    <>
      <Box sx={(theme) => ({ backgroundColor: theme.palette.common.white })}>
        <Box p={2}>
          <Box alignItems="center" display="flex" mb={0.5} minWidth={0}>
            <ZUIButton
              label={assignment.title}
              noWrap
              onClick={() => {
                deleteCall(call.id);
                onBack();
              }}
              startIcon={ArrowBackIos}
            />
          </Box>

          <Box
            alignItems="center"
            display="flex"
            justifyContent="space-between"
          >
            <Box
              alignItems="center"
              display="flex"
              gap={2}
              mr={1}
              sx={{ minWidth: 0 }}
            >
              <Box
                sx={{ alignSelf: 'baseline', display: 'flex', flexShrink: 0 }}
              >
                <ZUIPersonAvatar
                  firstName={call.target.first_name}
                  id={call.target.id}
                  lastName={call.target.last_name}
                />
              </Box>

              <Box minWidth={0}>
                <ZUIText noWrap variant="headingLg">
                  {call.target.first_name} {call.target.last_name}
                </ZUIText>
                <ZUIText>{call.target.phone}</ZUIText>
              </Box>

              <ZUIBadge color="warning" number={unfinishedCallList.length}>
                <ZUIButton
                  label={'Switch'}
                  onClick={() => setShowModal(true)}
                  variant="secondary"
                />
              </ZUIBadge>
            </Box>
            <Box alignItems="center" display="flex" gap={1}>
              <SkipCallDialog
                assignment={assignment}
                callId={call.id}
                targetName={`${call.target.first_name} ${call.target.last_name}`}
              />

              <ZUIButton label="Call" onClick={onStartCall} variant="primary" />
            </Box>
          </Box>
        </Box>
      </Box>
      <CallSwitchModal
        assignment={assignment}
        onClose={() => setShowModal(false)}
        onSwitchCall={onSwitchCall}
        open={showModal}
      />
      <ZUIDivider />
    </>
  );
};

export default PrepareHeader;
