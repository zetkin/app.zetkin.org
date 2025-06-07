import { ArrowBackIos } from '@mui/icons-material';
import { Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';

import { ZetkinCallAssignment } from 'utils/types/zetkin';
import ZUIPersonAvatar from 'zui/components/ZUIPersonAvatar';
import ZUIText from 'zui/components/ZUIText';
import useCurrentCall from '../../hooks/useCurrentCall';
import ZUIButton from 'zui/components/ZUIButton';
import SkipCallDialog from '../SkipCallDialog';
import useCallMutations from '../../hooks/useCallMutations';
import ZUIDivider from 'zui/components/ZUIDivider';
import CallSwitchModal from '../CallSwitchModal';
import ZUIBadge from 'zui/components/ZUIBadge';
import useOutgoingCalls from '../../hooks/useOutgoingCalls';
import useIsMobile from 'utils/hooks/useIsMobile';
import { CallStep } from 'features/call/pages/CallPage';
import useAllocateCall from 'features/call/hooks/useAllocateCall';
import { ZetkinCall } from 'features/call/types';

type StepButtonsProps = {
  assignment: ZetkinCallAssignment;
  call: ZetkinCall;
  onActivities?: () => void;
  onBack: () => void;
  onNextStep?: () => void;
  step?: CallStep;
};

const StepButtons: FC<StepButtonsProps> = ({
  assignment,
  call,
  onActivities,
  onBack,
  onNextStep,
  step,
}) => {
  const { allocateCall } = useAllocateCall(
    assignment.organization.id,
    assignment.id
  );
  const router = useRouter();

  if (step === CallStep.PREPARE) {
    return (
      <>
        <SkipCallDialog
          assignment={assignment}
          callId={call.id}
          targetName={`${call.target.first_name} ${call.target.last_name}`}
        />
        <ZUIButton label="Call" onClick={onNextStep} variant="primary" />
      </>
    );
  } else if (step === CallStep.ONGOING) {
    return (
      <ZUIButton
        label="Finish and report"
        onClick={onNextStep}
        variant="primary"
      />
    );
  } else if (step === CallStep.REPORT) {
    return (
      <>
        <ZUIButton
          label="Back to activities"
          onClick={onActivities}
          variant="secondary"
        />
        <ZUIButton label="Finish" onClick={onNextStep} variant="primary" />
      </>
    );
  } else if (step === CallStep.SUMMARY) {
    return (
      <>
        <ZUIButton label="Take a break" onClick={onBack} variant="secondary" />
        <ZUIButton
          label="Keep calling"
          onClick={async () => {
            const result = await allocateCall();
            if (result) {
              onBack();
              router.push(`/call/${assignment.id}`);
            } else {
              onNextStep?.();
            }
          }}
          variant="primary"
        />
      </>
    );
  }

  return null;
};

type StepsHeaderProps = {
  assignment: ZetkinCallAssignment;
  onActivities?: () => void;
  onBack: () => void;
  onNextStep?: () => void;
  onSwitchCall: () => void;
  step?: CallStep;
};

const StepsHeader: FC<StepsHeaderProps> = ({
  assignment,
  onActivities,
  onBack,
  onNextStep,
  onSwitchCall,
  step,
}) => {
  const call = useCurrentCall();
  const { deleteCall } = useCallMutations(assignment.organization.id);
  const [showModal, setShowModal] = useState(false);
  const outgoingCalls = useOutgoingCalls();
  const unfinishedCallList = outgoingCalls.filter((call) => call.state === 0);
  const isMobile = useIsMobile();

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
          {isMobile && (
            <>
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
                alignItems="flex-start"
                display="flex"
                justifyContent="space-between"
              >
                <Box display="flex" flexDirection="column" minWidth={0}>
                  <ZUIText noWrap variant="headingLg">
                    {call.target.phone}
                  </ZUIText>
                  <Box
                    alignItems="center"
                    display="flex"
                    gap={0.5}
                    minWidth={0}
                  >
                    <ZUIPersonAvatar
                      firstName={call.target.first_name}
                      id={call.target.id}
                      lastName={call.target.last_name}
                      size="small"
                    />
                    <ZUIText noWrap variant="bodyMdRegular">
                      {call.target.first_name} {call.target.last_name}
                    </ZUIText>
                  </Box>
                </Box>

                <Box alignItems="center" display="flex">
                  <ZUIBadge color="warning" number={unfinishedCallList.length}>
                    <ZUIButton
                      label="Switch"
                      onClick={() => setShowModal(true)}
                      variant="secondary"
                    />
                  </ZUIBadge>
                </Box>
              </Box>
              <Box display="flex" gap={2} justifyContent="flex-end">
                {StepButtons({
                  assignment,
                  call,
                  onActivities,
                  onBack,
                  onNextStep,
                  step,
                })}
              </Box>
            </>
          )}
          {!isMobile && (
            <>
              <Box mb={1} minWidth={0}>
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
                alignItems="flex-start"
                display="flex"
                justifyContent="space-between"
              >
                <Box display="flex">
                  <Box display="flex" flexDirection="column" minWidth={0}>
                    <ZUIText variant="headingLg">{call.target.phone}</ZUIText>
                    <Box
                      alignItems="center"
                      display="flex"
                      gap={1}
                      minWidth={0}
                    >
                      <ZUIPersonAvatar
                        firstName={call.target.first_name}
                        id={call.target.id}
                        lastName={call.target.last_name}
                        size="small"
                      />
                      <ZUIText noWrap variant="bodyMdRegular">
                        {call.target.first_name} {call.target.last_name}
                      </ZUIText>
                    </Box>
                  </Box>

                  <Box alignItems="center" display="flex" ml={2}>
                    <ZUIBadge
                      color="warning"
                      number={unfinishedCallList.length}
                    >
                      <ZUIButton
                        label="Switch"
                        onClick={() => setShowModal(true)}
                        variant="secondary"
                      />
                    </ZUIBadge>
                  </Box>
                </Box>
                <Box display="flex" gap={2} justifyContent="flex-end">
                  {StepButtons({
                    assignment,
                    call,
                    onActivities,
                    onBack,
                    onNextStep,
                    step,
                  })}
                </Box>
              </Box>
            </>
          )}
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

export default StepsHeader;
