import { SkipNext } from '@mui/icons-material';
import { FC, useState } from 'react';
import { Box } from '@mui/material';

import { LaneState, LaneStep, Report, UnfinishedCall } from '../types';
import ZUIOrgLogoAvatar from 'zui/components/ZUIOrgLogoAvatar';
import ZUIText from 'zui/components/ZUIText';
import { ZetkinCallAssignment } from 'utils/types/zetkin';
import ZUIPersonAvatar from 'zui/components/ZUIPersonAvatar';
import ZUIButton from 'zui/components/ZUIButton';
import { useAppDispatch } from 'core/hooks';
import { updateLaneStep } from '../store';
import useAllocateCall from '../hooks/useAllocateCall';
import useSubmitReport from '../hooks/useSubmitReport';
import useCallMutations from '../hooks/useCallMutations';
import { useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import notEmpty from 'utils/notEmpty';
import ZUILink from 'zui/components/ZUILink';
import useSetupReportStep from '../hooks/useSetupReportStep';

type Props = {
  assignment: ZetkinCallAssignment;
  call: UnfinishedCall | null;
  hasUnfinishedCalls: boolean;
  lane: LaneState;
  onSkipCall: () => void;
  report: Report;
};

const CallHeader: FC<Props> = ({
  assignment,
  call,
  hasUnfinishedCalls,
  lane,
  onSkipCall,
  report,
}) => {
  const messages = useMessages(messageIds);
  const dispatch = useAppDispatch();
  const setupReportStep = useSetupReportStep(assignment.organization.id);

  const [submittingReport, setSubmittingReport] = useState(false);

  const { quitCurrentCall } = useCallMutations(assignment.organization.id);
  const {
    allocateCall,
    queueError,
    isLoading: isAllocatingCall,
  } = useAllocateCall(assignment.organization.id, assignment.id);
  const submitReport = useSubmitReport(assignment.organization.id);

  const phoneNumbers = [call?.target.phone, call?.target.alt_phone].filter(
    notEmpty
  );

  return (
    <Box
      sx={(theme) => ({
        backgroundColor: theme.palette.common.white,
        borderBottom: `1px solid ${theme.palette.dividers.main}`,
        height: '100px',
        position: 'sticky',
        top: 0,
        zIndex: 1100,
      })}
    >
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          gap: 1,
          left: 16,
          position: 'absolute',
          top:
            lane.step == LaneStep.START || lane.step == LaneStep.SUMMARY
              ? 16
              : -50,
          transition: '0.5s',
        }}
      >
        <ZUIOrgLogoAvatar orgId={assignment.organization.id} />
        <ZUIText>{assignment.organization.title}</ZUIText>
      </Box>
      <Box
        sx={{
          bottom:
            lane.step == LaneStep.START || lane.step == LaneStep.SUMMARY
              ? 16
              : 60,
          left: 16,
          position: 'absolute',
          transition: '0.5s',
        }}
      >
        <ZUIText
          variant={
            lane.step == LaneStep.START || lane.step == LaneStep.SUMMARY
              ? 'headingLg'
              : 'bodyMdRegular'
          }
        >
          {assignment.title}
        </ZUIText>
      </Box>
      <Box
        sx={{
          alignItems: 'center',
          bottom: 16,
          display: 'flex',
          gap: 1,
          left:
            lane.step == LaneStep.START || lane.step == LaneStep.SUMMARY
              ? '-100%'
              : 16,
          position: 'absolute',
          transition: 'left 0.5s',
        }}
      >
        {call?.target && (
          <>
            <ZUIPersonAvatar
              firstName={call.target.first_name}
              id={call.target.id}
              lastName={call.target.last_name}
            />
            <ZUIText variant="headingLg">{call.target.name}</ZUIText>
            <ZUIText
              color="secondary"
              sx={{ fontFamily: 'monospace' }}
              variant="headingLg"
            >
              {phoneNumbers.flatMap((phone, index) => {
                return [
                  index > 0 ? '/' : null,
                  <ZUILink key={phone} href={`tel:${phone}`} text={phone} />,
                ];
              })}
            </ZUIText>
          </>
        )}
      </Box>
      <Box
        sx={{
          bottom: 16,
          display: 'flex',
          gap: 1,
          position: 'absolute',
          right: 16,
        }}
      >
        {lane.step != LaneStep.START && lane.step != LaneStep.SUMMARY && (
          <ZUIButton
            label="Stop"
            onClick={() => {
              if (call) {
                quitCurrentCall(call.id);
              }
            }}
            variant="tertiary"
          />
        )}
        <ZUIButton
          endIcon={
            lane.step != LaneStep.START && lane.step != LaneStep.SUMMARY
              ? SkipNext
              : undefined
          }
          href={lane.step == LaneStep.START ? '/my/home' : undefined}
          label={messages.header.secondaryButton[lane.step]()}
          onClick={() => {
            if (lane.step != LaneStep.START && lane.step != LaneStep.SUMMARY) {
              onSkipCall();
            } else if (lane.step == LaneStep.SUMMARY) {
              dispatch(updateLaneStep(LaneStep.START));
            }
          }}
          variant="secondary"
        />
        <ZUIButton
          disabled={
            !!queueError || (lane.step == LaneStep.REPORT && !report.completed)
          }
          label={messages.header.primaryButton[lane.step]()}
          onClick={async () => {
            if (lane.step == LaneStep.START) {
              await allocateCall();
            } else if (lane.step == LaneStep.CALL) {
              setupReportStep();
            } else if (lane.step == LaneStep.REPORT) {
              if (!report || !call) {
                return;
              }
              setSubmittingReport(true);
              await submitReport(call.id, report, call.target.id);
              setSubmittingReport(false);
            } else {
              //Lane step must be Summary
              await allocateCall();
            }
          }}
          variant={
            isAllocatingCall || submittingReport
              ? 'loading'
              : lane.step == LaneStep.SUMMARY && hasUnfinishedCalls
                ? 'secondary'
                : 'primary'
          }
        />
      </Box>
    </Box>
  );
};

export default CallHeader;
