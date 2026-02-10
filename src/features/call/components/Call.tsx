'use client';

import { Alert, Box, Slide, Snackbar } from '@mui/material';
import { FC, useState } from 'react';

import useCurrentCall from '../hooks/useCurrentCall';
import { LaneStep } from '../types';
import { useAppDispatch, useAppSelector } from 'core/hooks';
import { updateLaneStep } from '../store';
import useServerSide from 'core/useServerSide';
import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';
import ZUIText from 'zui/components/ZUIText';
import useUnfinishedCalls from '../hooks/useUnfinishedCalls';
import useCallMutations from '../hooks/useCallMutations';
import CallSwitchModal from '../components/CallSwitchModal';
import ZUIModal from 'zui/components/ZUIModal';
import useCurrentAssignment from '../hooks/useCurrentAssignment';
import useMyAssignments from '../hooks/useMyAssignments';
import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import CallHeader from './CallHeader';
import CallPanels from './CallPanels';

const Call: FC = () => {
  const messages = useMessages(messageIds);
  const dispatch = useAppDispatch();
  const onServer = useServerSide();
  const assignment = useCurrentAssignment();
  const allUserAssignments = useMyAssignments();

  const [callLogOpen, setCallLogOpen] = useState(false);
  const [assignmentSwitchedTo, setAssignmentSwitchedTo] = useState<
    number | null
  >(null);
  const [skipCallModalOpen, setSkipCallModalOpen] = useState(false);

  const call = useCurrentCall();

  const { abandonUnfinishedCall, skipCurrentCall, switchToUnfinishedCall } =
    useCallMutations(assignment.organization.id);
  const unfinishedCalls = useUnfinishedCalls();

  const lane = useAppSelector(
    (state) => state.call.lanes[state.call.activeLaneIndex]
  );
  const report = useAppSelector(
    (state) => state.call.lanes[state.call.activeLaneIndex].report
  );

  const filteredUnfinishedCalls = unfinishedCalls.filter((unfinishedCall) =>
    call ? call.id != unfinishedCall.id : true
  );

  const switchedTo = allUserAssignments.find(
    (oc) => oc.id == assignmentSwitchedTo
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
    <>
      <Box
        sx={(theme) => ({
          backgroundColor: theme.palette.common.white,
          height: '100dvh',
          overflow: 'hidden',
        })}
      >
        <CallHeader
          assignment={assignment}
          call={call}
          hasUnfinishedCalls={filteredUnfinishedCalls.length > 0}
          lane={lane}
          onSkipCall={() => setSkipCallModalOpen(true)}
          report={report}
        />
        <Box height="calc(100dvh - 100px)" position="relative" width="100%">
          <CallPanels
            assignment={assignment}
            call={call}
            lane={lane}
            onAbandonUnfinishedCall={(callId) => abandonUnfinishedCall(callId)}
            onOpenCallLog={() => setCallLogOpen(true)}
            onSwitchToUnfinishedCall={(callId, assignmentId) => {
              switchToUnfinishedCall(callId, assignmentId);
              if (assignmentId != assignment.id) {
                setAssignmentSwitchedTo(assignmentId);
              }
            }}
            report={report}
            unfinishedCalls={filteredUnfinishedCalls}
          />
        </Box>
      </Box>
      <CallSwitchModal
        assignment={assignment}
        onClose={() => setCallLogOpen(false)}
        onSwitch={(assignmentId) => {
          if (assignmentId != assignment.id) {
            setAssignmentSwitchedTo(assignmentId);
          }
        }}
        open={callLogOpen}
      />
      <ZUIModal
        open={skipCallModalOpen}
        primaryButton={{
          label: messages.skipCallDialog.cancelButton(),
          onClick: () => {
            setSkipCallModalOpen(false);
          },
        }}
        secondaryButton={{
          label: messages.skipCallDialog.confirmButton({
            name: call?.target.name || '',
          }),
          onClick: () => {
            if (call) {
              skipCurrentCall(assignment.id, call.id);
              dispatch(updateLaneStep(LaneStep.CALL));
              setSkipCallModalOpen(false);
            }
          },
        }}
        size="small"
        title={messages.skipCallDialog.title({
          name: call?.target.name || '',
        })}
      />
      <Snackbar
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        autoHideDuration={5000}
        onClose={(ev, reason) => {
          if (reason == 'clickaway') {
            return;
          } else {
            setAssignmentSwitchedTo(null);
          }
        }}
        open={!!assignmentSwitchedTo}
        slots={{
          transition: (props) => {
            return (
              <Slide
                {...props}
                direction="right"
                timeout={{
                  enter: 500,
                  exit: 300,
                }}
              />
            );
          },
        }}
        sx={{
          '@media (min-width: 600px)': {
            bottom: 68,
            left: 16,
          },
        }}
      >
        <Alert
          icon={false}
          onClose={() => setAssignmentSwitchedTo(null)}
          severity="success"
          sx={(theme) => ({
            backgroundColor: theme.palette.common.white,
            borderLeft: `4px solid ${theme.palette.success.main}`,
            boxShadow: theme.elevation.bottom.big.medium,
          })}
        >
          {switchedTo && (
            <ZUIText>
              <Msg
                id={messageIds.switchedAssignmentsAlert.message}
                values={{ assignmentTitle: switchedTo.title }}
              />
            </ZUIText>
          )}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Call;
