'use client';

import { Box } from '@mui/material';
import { FC } from 'react';

import StatsHeader from '../components/headers/StatsHeader';
import CallStats from '../components/CallStats';
import CallPrepare from '../components/CallPrepare';
import CallOngoing from '../components/CallOngoing';
import CallReport from '../components/CallReport';
import useCurrentCall from '../hooks/useCurrentCall';
import ReportHeader from '../components/headers/ReportHeader';
import { ZetkinCallAssignment } from 'utils/types/zetkin';
import PrepareHeader from '../components/headers/PrepareHeader';
import CallHeader from '../components/headers/CallHeader';
import { LaneStep } from '../types';
import ZUIModal from 'zui/components/ZUIModal';
import CallSummarySentence from '../components/CallSummarySentence';
import { useAppDispatch, useAppSelector } from 'core/hooks';
import { previousCallClear, clearReport, updateLaneStep } from '../store';
import useServerSide from 'core/useServerSide';
import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';

type Props = {
  assignment: ZetkinCallAssignment;
};

const CallPage: FC<Props> = ({ assignment }) => {
  const dispatch = useAppDispatch();
  const lane = useAppSelector(
    (state) => state.call.lanes[state.call.activeLaneIndex]
  );
  const call = useCurrentCall();
  const onServer = useServerSide();

  if (onServer) {
    return (
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          height: '100dvh',
          justifyContent: 'center',
        }}
      >
        <ZUILogoLoadingIndicator />
      </Box>
    );
  }

  return (
    <Box>
      {lane.step == LaneStep.STATS && (
        <>
          <StatsHeader assignment={assignment} />
          <CallStats assignment={assignment} />
        </>
      )}
      {lane.step == LaneStep.PREPARE && call && (
        <>
          <PrepareHeader assignment={assignment} call={call} />
          <CallPrepare assignment={assignment} />
          <ZUIModal
            open={!!lane.previousCall}
            primaryButton={{
              label: 'Close',
              onClick: () => {
                dispatch(clearReport());
                dispatch(previousCallClear());
              },
            }}
            title="Summary of previous call"
          >
            {lane.previousCall && (
              <CallSummarySentence call={lane.previousCall} />
            )}
          </ZUIModal>
        </>
      )}
      {lane.step == LaneStep.ONGOING && call && (
        <>
          <CallHeader
            assignment={assignment}
            call={call}
            forwardButtonLabel={'Finish and report'}
            onForward={() => dispatch(updateLaneStep(LaneStep.REPORT))}
          />
          <CallOngoing assignment={assignment} />
        </>
      )}
      {lane.step == LaneStep.REPORT && call && (
        <>
          <ReportHeader
            assignment={assignment}
            call={call}
            forwardButtonLabel={'Submit report'}
            onSecondaryAction={() => dispatch(updateLaneStep(LaneStep.ONGOING))}
            secondaryActionLabel={'Back to activities'}
          />
          <CallReport assignment={assignment} call={call} />
        </>
      )}
    </Box>
  );
};

export default CallPage;
