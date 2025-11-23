'use client';

import { Alert, Box, Slide, Snackbar, Tab } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { Info, ListOutlined, Person } from '@mui/icons-material';
import { TabContext, TabList } from '@mui/lab';

import useCurrentCall from '../hooks/useCurrentCall';
import { LaneStep } from '../types';
import { useAppDispatch, useAppSelector } from 'core/hooks';
import { updateLaneStep } from '../store';
import useServerSide from 'core/useServerSide';
import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';
import ZUIText from 'zui/components/ZUIText';
import useOutgoingCalls from '../hooks/useOutgoingCalls';
import useCallMutations from '../hooks/useCallMutations';
import CallSwitchModal from '../components/CallSwitchModal';
import ZUIModal from 'zui/components/ZUIModal';
import useCurrentAssignment from '../hooks/useCurrentAssignment';
import useMyAssignments from '../hooks/useMyAssignments';
import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import CallHeader from './CallHeader';
import CallPanels from './CallPanels';
import useIsMobile from 'utils/hooks/useIsMobile';

const Call: FC = () => {
  const messages = useMessages(messageIds);
  const dispatch = useAppDispatch();
  const onServer = useServerSide();
  const assignment = useCurrentAssignment();
  const allUserAssignments = useMyAssignments();
  const isMobile = useIsMobile();
  const [currentMobileTab, setCurrentMobileTab] = useState<number | null>(
    isMobile ? 1 : null
  );

  const [callLogOpen, setCallLogOpen] = useState(false);
  const [assignmentSwitchedTo, setAssignmentSwitchedTo] = useState<
    number | null
  >(null);
  const [skipCallModalOpen, setSkipCallModalOpen] = useState(false);

  const call = useCurrentCall();

  const { abandonUnfinishedCall, skipCurrentCall, switchToUnfinishedCall } =
    useCallMutations(assignment.organization.id);
  const outgoingCalls = useOutgoingCalls();

  const lane = useAppSelector(
    (state) => state.call.lanes[state.call.activeLaneIndex]
  );

  useEffect(() => {
    if (lane.step == LaneStep.REPORT) {
      setCurrentMobileTab(3);
    }
  }, [lane.step]);

  const report = useAppSelector(
    (state) => state.call.lanes[state.call.activeLaneIndex].report
  );

  const unfinishedCalls = outgoingCalls.filter((c) => {
    const isUnfinishedCall = c.state == 0;
    const isNotCurrentCall = call ? call.id != c.id : true;

    return isUnfinishedCall && isNotCurrentCall;
  });

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

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentMobileTab(newValue);
  };

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
          hasUnfinishedCalls={unfinishedCalls.length > 0}
          lane={lane}
          onSkipCall={() => setSkipCallModalOpen(true)}
          report={report}
        />
        <Box height="calc(100dvh - 150px)" position="relative" width="100%">
          <CallPanels
            assignment={assignment}
            call={call}
            lane={lane}
            mobileTabIndex={currentMobileTab}
            onAbandonUnfinishedCall={(callId) => abandonUnfinishedCall(callId)}
            onOpenCallLog={() => setCallLogOpen(true)}
            onSwitchToUnfinishedCall={(callId, assignmentId) => {
              switchToUnfinishedCall(callId, assignmentId);
              if (assignmentId != assignment.id) {
                setAssignmentSwitchedTo(assignmentId);
              }
            }}
            report={report}
            unfinishedCalls={unfinishedCalls}
          />
        </Box>
        {currentMobileTab && (
          <Box sx={{ typography: 'body1', width: '100%' }}>
            <TabContext value={currentMobileTab}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList
                  aria-label="lab API tabs example"
                  onChange={handleChange}
                >
                  <Tab icon={<Info />} label="One" value="1" />
                  <Tab icon={<Person />} label="Item Two" value="2" />
                  <Tab icon={<ListOutlined />} label="Item Three" value="3" />
                </TabList>
              </Box>
            </TabContext>
          </Box>
        )}
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
        title={messages.skipCallDialog.title({ name: call?.target.name || '' })}
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
