import { Box } from '@mui/material';
import { ArrowBackIos } from '@mui/icons-material';
import { FC } from 'react';

import { ZetkinCallAssignment } from 'utils/types/zetkin';
import ZUIPersonAvatar from 'zui/components/ZUIPersonAvatar';
import ZUIText from 'zui/components/ZUIText';
import useCurrentCall from '../hooks/useCurrentCall';
import ZUIButton from 'zui/components/ZUIButton';
import ZUIDivider from 'zui/components/ZUIDivider';
import { CallStep } from '../pages/CallPage';
import useAllocateCall from '../hooks/useAllocateCall';

type OngoingHeaderProps = {
  assignment: ZetkinCallAssignment;
  onBack?: () => void;
  onReportCall?: () => void;
  onSummarize?: () => void;
  step?: CallStep;
};

const OngoingHeader: FC<OngoingHeaderProps> = ({
  assignment,
  onBack,
  onReportCall,
  onSummarize,
  step,
}) => {
  const call = useCurrentCall();
  const { allocateCall } = useAllocateCall(
    assignment.organization.id,
    assignment.id
  );

  if (!call) {
    return null;
  }

  return (
    <>
      <Box
        sx={(theme) => ({
          backgroundColor: theme.palette.common.white,
        })}
      >
        <Box p={2}>
          {step === CallStep.REPORT && onBack && (
            <Box alignItems="center" display="flex" mb={0.5} minWidth={0}>
              <ZUIButton
                label={assignment.title}
                noWrap
                onClick={() => {
                  onBack();
                }}
                startIcon={ArrowBackIos}
              />
            </Box>
          )}
          {(step == CallStep.ONGOING || step === CallStep.SUMMARY) && (
            <Box alignItems="center" display="flex" mb={2} minWidth={0}>
              <ZUIText noWrap variant="headingMd">
                {assignment?.title || 'Untitled call assignment'}
              </ZUIText>
            </Box>
          )}
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
            {step == CallStep.ONGOING && (
              <ZUIButton
                label="End Call"
                onClick={onReportCall}
                variant="primary"
              />
            )}
            {step == CallStep.SUMMARY && onSummarize && (
              <Box display="flex" gap={1}>
                <ZUIButton
                  label="Take a break"
                  onClick={onBack}
                  variant="secondary"
                />
                <ZUIButton
                  label="Keep calling"
                  onClick={() => {
                    onSummarize();
                    allocateCall();
                  }}
                  variant="primary"
                />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      <ZUIDivider />
    </>
  );
};

export default OngoingHeader;
