'use client';

import { Alert, Box, Slide, Snackbar, Tab } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { Info, ListOutlined, Person } from '@mui/icons-material';
import { TabContext, TabList } from '@mui/lab';

import useCurrentCall from '../hooks/useCurrentCall';
import { LaneStep } from '../types';
import { useAppDispatch, useAppSelector } from 'core/hooks';
import { filtersUpdated, previousCallAdd, updateLaneStep } from '../store';
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
import { objectToFormData } from './utils/objectToFormData';
import prepareSurveyApiSubmission from 'features/surveys/utils/prepareSurveyApiSubmission';
import useIsMobile from 'utils/hooks/useIsMobile';
import useAllocateCall from '../hooks/useAllocateCall';
import ZUIButton from 'zui/components/ZUIButton';
import useSubmitReport from '../hooks/useSubmitReport';

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
  const {
    allocateCall,
    error: errorAllocatingCall,
    isLoading: isAllocatingCall,
  } = useAllocateCall(assignment.organization.id, assignment.id);

  const submissionDataBySurveyId = useAppSelector(
    (state) =>
      state.call.lanes[state.call.activeLaneIndex].submissionDataBySurveyId
  );

  const [submittingReport, setSubmittingReport] = useState(false);

  const { submitReport } = useSubmitReport(assignment.organization.id);

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
                  <Tab icon={<Info />} value="1" />
                  <Tab icon={<Person />} value="2" />
                  <Tab icon={<ListOutlined />} value="3" />
                  {isMobile && (
                    <Box>
                      <ZUIButton
                        disabled={
                          !!errorAllocatingCall ||
                          (lane.step == LaneStep.REPORT && !report.completed)
                        }
                        label={messages.header.primaryButton[lane.step]()}
                        onClick={async () => {
                          if (lane.step == LaneStep.START) {
                            await allocateCall();
                            dispatch(updateLaneStep(LaneStep.CALL));
                          } else if (lane.step == LaneStep.CALL) {
                            dispatch(updateLaneStep(LaneStep.REPORT));

                            const hasSurveySubmissions =
                              Object.entries(submissionDataBySurveyId).length > 0;
                            const hasEventSignups = lane.respondedEventIds.length > 0;

                            if (hasSurveySubmissions || hasEventSignups) {
                              dispatch(
                                filtersUpdated({
                                  customDatesToFilterEventsBy: [null, null],
                                  eventDateFilterState: null,
                                  filterState: {
                                    alreadyIn: false,
                                    events: false,
                                    surveys: false,
                                    thisCall: true,
                                  },
                                  orgIdsToFilterEventsBy: [],
                                  projectIdsToFilterActivitiesBy: [],
                                })
                              );
                            }
                          } else if (lane.step == LaneStep.REPORT) {
                            if (!report || !call) {
                              return;
                            }
                            setSubmittingReport(true);

                            const submissions = Object.entries(submissionDataBySurveyId)
                              .filter(([, surveySubmissionData]) => {
                                return Object.entries(surveySubmissionData).some(
                                  ([, value]) => {
                                    if (typeof value == 'string') {
                                      return value.trim() !== '';
                                    }
                                    return true;
                                  }
                                );
                              })
                              .map(([surveyId, surveySubmissionData]) => {
                                const surveySubmissionDataAsFormData =
                                  objectToFormData(surveySubmissionData);
                                return {
                                  submission: prepareSurveyApiSubmission(
                                    surveySubmissionDataAsFormData
                                  ),
                                  surveyId: Number(surveyId),
                                  targetId: call.target.id,
                                };
                              });

                            const result = await submitReport(call.id, report, submissions);

                            if (result.kind === 'success') {
                              dispatch(previousCallAdd(call));
                            } else {
                              setSubmittingReport(false);
                            }
                            setSubmittingReport(false);
                            dispatch(updateLaneStep(LaneStep.SUMMARY));
                          } else {
                            //Lane step must be Summary
                            await allocateCall();
                          }
                        }}
                        variant={
                          isAllocatingCall || submittingReport
                            ? 'loading'
                            : lane.step == LaneStep.SUMMARY && (unfinishedCalls.length > 0)
                              ? 'secondary'
                              : 'primary'
                        }
                      />
                    </Box>
                  )}
                </TabList>
              </Box>
            </TabContext>
          </Box>
        )}
      </Box>
      {!isMobile && (
        <>
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
        </>)}
    </>
  );
};

export default Call;
