'use client';

import { Box, List, ListItem, Snackbar } from '@mui/material';
import { FC, useState } from 'react';

import StatsHeader from '../components/headers/StatsHeader';
import useCurrentCall from '../hooks/useCurrentCall';
import ReportHeader from '../components/headers/ReportHeader';
import { ZetkinCallAssignment } from 'utils/types/zetkin';
import PrepareHeader from '../components/headers/PrepareHeader';
import CallHeader from '../components/headers/CallHeader';
import { LaneStep } from '../types';
import ZUIModal from 'zui/components/ZUIModal';
import CallSummarySentence from '../components/CallSummarySentence';
import { useAppDispatch, useAppSelector } from 'core/hooks';
import {
  previousCallClear,
  clearReport,
  updateLaneStep,
  reportUpdated,
} from '../store';
import useServerSide from 'core/useServerSide';
import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';
import AssignmentStats from '../components/AssignmentStats';
import useSimpleCallAssignmentStats from '../hooks/useSimpleCallAssignmentStats';
import InstructionsSection from '../components/InstructionsSection';
import AboutSection from '../components/AboutSection';
import ActivitiesSection from '../components/ActivitiesSection';
import ZUISection from 'zui/components/ZUISection';
import ReportForm from '../components/Report';
import ZUIText from 'zui/components/ZUIText';
import ZUIButton from 'zui/components/ZUIButton';
import useOutgoingCalls from '../hooks/useOutgoingCalls';
import ZUIPersonAvatar from 'zui/components/ZUIPersonAvatar';
import useCallMutations from '../hooks/useCallMutations';
import CallSwitchModal from '../components/CallSwitchModal';

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
  const [callLogOpen, setCallLogOpen] = useState(false);
  const [unfinishedCallSwitchedTo, setUnfinishedCallSwitchedTo] = useState<
    number | null
  >(null);

  const stats = useSimpleCallAssignmentStats(
    assignment.organization.id,
    assignment.id
  );
  const { switchToUnfinishedCall } = useCallMutations(
    assignment.organization.id
  );

  const report = useAppSelector(
    (state) => state.call.lanes[state.call.activeLaneIndex].report
  );

  const outgoingCalls = useOutgoingCalls();

  const unfinishedCalls = outgoingCalls.filter((c) => {
    const isUnfinishedCall = c.state == 0;
    const isNotCurrentCall = call ? call.id != c.id : true;

    return isUnfinishedCall && isNotCurrentCall;
  });

  const switchedTo = outgoingCalls.find(
    (oc) => oc.id == unfinishedCallSwitchedTo
  );

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
    <main>
      <Box
        sx={{
          height: '100dvh',
          overflow: 'hidden',
        }}
      >
        {lane.step == LaneStep.STATS && <StatsHeader assignment={assignment} />}
        {lane.step == LaneStep.PREPARE && call && (
          <>
            <PrepareHeader assignment={assignment} call={call} />
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
          <CallHeader
            assignment={assignment}
            call={call}
            forwardButtonLabel={'Finish and report'}
            onForward={() => dispatch(updateLaneStep(LaneStep.REPORT))}
          />
        )}
        {lane.step == LaneStep.REPORT && call && (
          <ReportHeader
            assignment={assignment}
            call={call}
            forwardButtonLabel={'Submit report'}
            onSecondaryAction={() => dispatch(updateLaneStep(LaneStep.ONGOING))}
            secondaryActionLabel={'Back to activities'}
          />
        )}
        {/**TODO: Change height of this Box once header is remade with a constant height */}
        <Box height="calc(100dvh - 127px)" position="relative" width="100%">
          <Box
            sx={(theme) => ({
              borderRight: `1px solid ${theme.palette.dividers.main}`,
              height: '100%',
              left: lane.step == LaneStep.STATS ? 0 : 'calc(-100% / 3)',
              maxHeight: '100%',
              overflowY: 'auto',
              position: 'absolute',
              transition: '0.5s',
              width: 1 / 3,
            })}
          >
            <ZUISection
              borders={false}
              fullHeight
              renderContent={() => (
                <ZUIText>Some general info about calling</ZUIText>
              )}
              title="Info about calling"
            />
          </Box>
          <Box
            sx={(theme) => ({
              borderRight: `1px solid ${theme.palette.dividers.main}`,
              height: '100%',
              left:
                lane.step == LaneStep.STATS
                  ? 'calc(100% / 3)'
                  : 'calc(-100% / 3)',
              maxHeight: '100%',
              overflowY: 'auto',
              position: 'absolute',
              transition: '0.5s',
              width: 1 / 3,
            })}
          >
            <AssignmentStats stats={stats} />
          </Box>
          <Box
            sx={(theme) => ({
              borderRight: `1px solid ${theme.palette.dividers.main}`,
              height: '100%',
              left: lane.step != LaneStep.STATS ? 0 : 'calc((100% / 3) * 2)',
              maxHeight: '100%',
              overflowY: 'auto',
              position: 'absolute',
              transition: '0.5s',
              width: 1 / 3,
              zIndex: lane.step == LaneStep.REPORT || LaneStep.ONGOING ? 2 : '',
            })}
          >
            <InstructionsSection
              call={call}
              instructions={assignment.instructions}
              step={lane.step}
            />
          </Box>
          <Box
            sx={(theme) => ({
              borderRight: `1px solid ${theme.palette.dividers.main}`,
              height: '100%',
              overflowY: 'auto',
              position: 'absolute',
              right:
                lane.step == LaneStep.STATS
                  ? 'calc(-100% / 3)'
                  : lane.step == LaneStep.REPORT
                  ? 'calc((100% / 3) * 2)'
                  : 'calc(100% / 3)',
              transition: '0.5s',
              width: 1 / 3,
            })}
          >
            <AboutSection call={call} />
          </Box>
          <Box
            sx={(theme) => ({
              borderRight: `1px solid ${theme.palette.dividers.main}`,
              height: '100%',
              overflowY: 'auto',
              position: 'absolute',
              right:
                lane.step == LaneStep.STATS
                  ? 'calc(-100% / 3)'
                  : lane.step == LaneStep.REPORT
                  ? 'calc(100% / 3)'
                  : 0,
              transition: '0.5s',
              width: 1 / 3,
            })}
          >
            <ActivitiesSection
              assignment={assignment}
              target={call?.target ?? null}
            />
          </Box>
          <Box
            sx={(theme) => ({
              borderRight: `1px solid ${theme.palette.dividers.main}`,
              height: '100%',
              overflowY: 'auto',
              position: 'absolute',
              right: lane.step == LaneStep.REPORT ? 0 : -500,
              transition: '0.5s',
              width: 1 / 3,
            })}
          >
            <ZUISection
              borders={false}
              fullHeight
              renderContent={() => {
                if (!call) {
                  return <Box sx={{ height: '200px' }} />;
                }
                return (
                  <ReportForm
                    disableCallerNotes={assignment.disable_caller_notes}
                    onReportChange={(updatedReport) => {
                      dispatch(reportUpdated(updatedReport));
                    }}
                    report={report}
                    target={call.target}
                  />
                );
              }}
              title="Report"
            />
          </Box>
          <Box
            sx={{
              alignItems: 'center',
              bottom: 0,
              display: 'flex',
              gap: 1,
              left: 0,
              padding: 1,
              position: 'absolute',
              width: '100%',
              zIndex: 3,
            }}
          >
            <ZUIButton
              label="Call log"
              onClick={() => setCallLogOpen(true)}
              variant="secondary"
            />
            <List sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
              {unfinishedCalls.map((c) => (
                <ListItem
                  key={c.id}
                  onClick={() => {
                    switchToUnfinishedCall(c.id);
                    setUnfinishedCallSwitchedTo(c.id);
                  }}
                  sx={{
                    borderRadius: '2rem',
                    cursor: 'pointer',
                    display: 'flex',
                    padding: 0,
                  }}
                >
                  <ZUIPersonAvatar
                    firstName={c.target.first_name}
                    id={c.target.id}
                    lastName={c.target.last_name}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Box>
      <CallSwitchModal
        assignment={assignment}
        onClose={() => setCallLogOpen(false)}
        open={callLogOpen}
      />
      <Snackbar
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        autoHideDuration={5000}
        message={
          switchedTo ? (
            <ZUIText>{`Switched to call with ${switchedTo.target.name}`}</ZUIText>
          ) : (
            ''
          )
        }
        onClose={(ev, reason) => {
          if (reason == 'clickaway') {
            return;
          } else {
            setUnfinishedCallSwitchedTo(null);
          }
        }}
        open={!!unfinishedCallSwitchedTo}
        sx={(theme) => ({
          '& div': { backgroundColor: theme.palette.common.white },
        })}
      />
    </main>
  );
};

export default CallPage;
