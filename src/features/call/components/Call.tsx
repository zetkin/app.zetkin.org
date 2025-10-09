'use client';

import { Alert, Box, List, ListItem, Slide, Snackbar } from '@mui/material';
import { SkipNext } from '@mui/icons-material';
import { FC, Fragment, useState } from 'react';

import useCurrentCall from '../hooks/useCurrentCall';
import { LaneStep } from '../types';
import { useAppDispatch, useAppSelector } from 'core/hooks';
import {
  updateLaneStep,
  reportUpdated,
  previousCallAdd,
  filtersUpdated,
} from '../store';
import useServerSide from 'core/useServerSide';
import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';
import AssignmentStats, { DesktopStats } from '../components/AssignmentStats';
import useSimpleCallAssignmentStats from '../hooks/useSimpleCallAssignmentStats';
import InstructionsSection from '../components/InstructionsSection';
import AboutSection from '../components/AboutSection';
import ZUISection from 'zui/components/ZUISection';
import ReportForm from '../components/Report';
import ZUIText from 'zui/components/ZUIText';
import ZUIButton from 'zui/components/ZUIButton';
import useOutgoingCalls from '../hooks/useOutgoingCalls';
import ZUIPersonAvatar from 'zui/components/ZUIPersonAvatar';
import useCallMutations from '../hooks/useCallMutations';
import CallSwitchModal from '../components/CallSwitchModal';
import useAllocateCall from '../hooks/useAllocateCall';
import ZUIModal from 'zui/components/ZUIModal';
import { objectToFormData } from '../components/utils/objectToFormData';
import prepareSurveyApiSubmission from 'features/surveys/utils/prepareSurveyApiSubmission';
import useSubmitReport from '../hooks/useSubmitReport';
import ZUIOrgLogoAvatar from 'zui/components/ZUIOrgLogoAvatar';
import UnfinishedCall from '../components/UnfinishedCall';
import ZUIDivider from 'zui/components/ZUIDivider';
import callSummarySentence from '../components/utils/callSummarySentence';
import ActivitiesSection from '../components/ActivitiesSection';
import ZUITooltip from 'zui/components/ZUITooltip';
import useCurrentAssignment from '../hooks/useCurrentAssignment';
import useMyAssignments from '../hooks/useMyAssignments';
import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';

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
  const [submittingReport, setSubmittingReport] = useState(false);

  const call = useCurrentCall();
  const {
    allocateCall,
    error: errorAllocatingCall,
    isLoading: isAllocatingCall,
  } = useAllocateCall(assignment.organization.id, assignment.id);
  const stats = useSimpleCallAssignmentStats(
    assignment.organization.id,
    assignment.id
  );
  const {
    abandonUnfinishedCall,
    quitCurrentCall,
    skipCurrentCall,
    switchToUnfinishedCall,
  } = useCallMutations(assignment.organization.id);
  const { submitReport } = useSubmitReport(assignment.organization.id);
  const outgoingCalls = useOutgoingCalls();

  const lane = useAppSelector(
    (state) => state.call.lanes[state.call.activeLaneIndex]
  );
  const report = useAppSelector(
    (state) => state.call.lanes[state.call.activeLaneIndex].report
  );
  const submissionDataBySurveyId = useAppSelector(
    (state) =>
      state.call.lanes[state.call.activeLaneIndex].submissionDataBySurveyId
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

  return (
    <>
      <Box
        sx={(theme) => ({
          backgroundColor: theme.palette.common.white,
          height: '100dvh',
          overflow: 'hidden',
        })}
      >
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
                <ZUIText color="secondary" variant="headingLg">{`${
                  call.target.phone
                }${
                  call.target.alt_phone ? `/ ${call.target.alt_phone}` : ''
                }`}</ZUIText>
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
                if (
                  lane.step != LaneStep.START &&
                  lane.step != LaneStep.SUMMARY
                ) {
                  setSkipCallModalOpen(true);
                } else if (lane.step == LaneStep.SUMMARY) {
                  dispatch(updateLaneStep(LaneStep.START));
                }
              }}
              variant="secondary"
            />
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

                  const result = await submitReport(
                    call.id,
                    report,
                    submissions
                  );

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
                  : lane.step == LaneStep.SUMMARY && unfinishedCalls.length > 0
                  ? 'secondary'
                  : 'primary'
              }
            />
          </Box>
        </Box>
        <Box height="calc(100dvh - 100px)" position="relative" width="100%">
          <Box
            sx={(theme) => ({
              borderRight: `1px solid ${theme.palette.dividers.main}`,
              height: '100%',
              left: lane.step == LaneStep.START ? 0 : 'calc(-100% / 3)',
              maxHeight: '100%',
              overflowY: 'auto',
              position: 'absolute',
              transition: 'left 0.5s',
              width: 1 / 3,
            })}
          >
            <ZUISection
              borders={false}
              fullHeight
              renderContent={() => (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    paddingBottom: 10,
                  }}
                >
                  <ZUIText variant="headingMd">
                    <Msg id={messageIds.callingInfo.tutorial.start.title} />
                  </ZUIText>
                  <ZUIText>
                    <Msg
                      id={messageIds.callingInfo.tutorial.start.description}
                    />
                  </ZUIText>
                  <ZUIText variant="headingMd">
                    <Msg
                      id={messageIds.callingInfo.tutorial.personInfo.title}
                    />
                  </ZUIText>
                  <ZUIText>
                    <Msg
                      id={
                        messageIds.callingInfo.tutorial.personInfo.description
                      }
                    />
                  </ZUIText>
                  <ZUIText variant="headingMd">
                    <Msg id={messageIds.callingInfo.tutorial.call.title} />
                  </ZUIText>
                  <ZUIText>
                    <Msg
                      id={messageIds.callingInfo.tutorial.call.description}
                    />
                  </ZUIText>
                  <ZUIText variant="headingMd">
                    <Msg id={messageIds.callingInfo.tutorial.report.title} />
                  </ZUIText>
                  <ZUIText>
                    <Msg
                      id={messageIds.callingInfo.tutorial.report.description}
                    />
                  </ZUIText>
                  <ZUIText variant="headingMd">
                    <Msg id={messageIds.callingInfo.tutorial.oldCalls.title} />
                  </ZUIText>
                  <ZUIText>
                    <Msg
                      id={messageIds.callingInfo.tutorial.oldCalls.description}
                    />
                  </ZUIText>
                </Box>
              )}
              title={messages.callingInfo.title()}
            />
          </Box>
          <Box
            sx={(theme) => ({
              borderRight: `1px solid ${theme.palette.dividers.main}`,
              height: '100%',
              left:
                lane.step == LaneStep.START
                  ? 'calc(100% / 3)'
                  : 'calc(-100% / 3)',
              maxHeight: '100%',
              overflowY: 'auto',
              position: 'absolute',
              transition: 'left 0.5s',
              width: 1 / 3,
            })}
          >
            <AssignmentStats stats={stats} />
          </Box>
          <Box
            sx={(theme) => ({
              '@keyframes instructionsOut': {
                '0%': { left: 0 },
                '100%': { left: 'calc((-100% / 3) * 2)' },
              },
              animationDuration: '0.5s',
              animationFillMode: 'backwards',
              animationName:
                lane.step == LaneStep.SUMMARY ? 'instructionsOut' : '',
              borderRight: `1px solid ${theme.palette.dividers.main}`,
              height: '100%',
              left:
                lane.step == LaneStep.START
                  ? 'calc((100% / 3) * 2)'
                  : lane.step == LaneStep.SUMMARY
                  ? '100%'
                  : 0,
              maxHeight: '100%',
              overflowY: 'auto',
              position: 'absolute',
              transition: lane.step != LaneStep.SUMMARY ? 'left 0.5s' : '',
              width: 1 / 3,
              zIndex: lane.step == LaneStep.REPORT || LaneStep.CALL ? 2 : '',
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
              left:
                lane.step == LaneStep.START
                  ? '100%'
                  : lane.step == LaneStep.CALL
                  ? 'calc(100% / 3)'
                  : lane.step == LaneStep.REPORT
                  ? 0
                  : 'calc(100% + (100% / 3))',

              overflowY: 'auto',
              position: 'absolute',
              transition: 'left 0.5s',
              visibility: lane.step == LaneStep.SUMMARY ? 'hidden' : '',
              width: 1 / 3,
            })}
          >
            <AboutSection call={call} />
          </Box>
          <Box
            id="boxContainingActivities"
            sx={(theme) => ({
              '@keyframes activitiesOut': {
                '0%': { left: 'calc(100% / 3)' },
                '100%': { left: 'calc(-100% / 3)' },
              },
              animationDuration: '0.5s',
              animationFillMode: 'backwards',
              animationName:
                lane.step == LaneStep.SUMMARY ? 'activitiesOut' : '',
              borderRight: `1px solid ${theme.palette.dividers.main}`,
              height: '100%',
              left:
                lane.step == LaneStep.START
                  ? '100%'
                  : lane.step == LaneStep.CALL
                  ? 'calc((100% / 3) * 2)'
                  : lane.step == LaneStep.REPORT
                  ? 'calc(100% / 3)'
                  : 'calc(100% + (100% / 3) * 2)',
              overflowY: 'auto',
              position: 'absolute',
              transition: lane.step != LaneStep.SUMMARY ? 'left 0.5s' : '',
              width: 1 / 3,
              zIndex: lane.step == LaneStep.START ? -1 : 0,
            })}
          >
            <ActivitiesSection
              assignment={assignment}
              target={call?.target ?? null}
            />
          </Box>
          <Box
            sx={(theme) => ({
              '@keyframes reportOut': {
                '0%': { left: 'calc((100% / 3) * 2)' },
                '100%': { left: 'calc(-100% / 3)' },
              },
              animationDuration: '0.5s',
              animationFillMode: 'backwards',
              animationName: lane.step == LaneStep.SUMMARY ? 'reportOut' : '',
              borderRight: `1px solid ${theme.palette.dividers.main}`,
              height: '100%',
              left:
                lane.step == LaneStep.REPORT ? 'calc((100% / 3) * 2)' : '100%',
              overflowY: 'auto',
              position: 'absolute',
              transition: lane.step != LaneStep.SUMMARY ? 'left 0.5s' : '',
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
              title={messages.report.title()}
            />
          </Box>
          <Box
            sx={{
              '@keyframes summaryOut': {
                '0%': { left: 'calc(100% / 3)' },
                '100%': { left: 'calc(-100% / 3)' },
              },
              alignItems: 'center',
              animationDuration: '0.5s',
              animationFillMode: 'backwards',
              animationName: lane.step == LaneStep.CALL ? 'summaryOut' : '',
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              justifyContent: 'space-evenly',
              left: lane.step == LaneStep.SUMMARY ? 'calc(100% / 3)' : '100%',
              padding: 2,
              position: 'relative',
              transition: lane.step != LaneStep.CALL ? 'left 0.5s' : '',
              width: 1 / 3,
            }}
          >
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <ZUIText variant="headingLg">Woop woop!</ZUIText>
              <ZUIText color="secondary" variant="headingSm">
                {unfinishedCalls.length == 0
                  ? callSummarySentence(call?.target.first_name ?? '', report)
                  : messages.summary.unfinishedCallsMessage()}
              </ZUIText>
            </Box>
            {unfinishedCalls.length == 0 && <DesktopStats stats={stats} />}
            {unfinishedCalls.length > 0 && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                }}
              >
                <Box>
                  {unfinishedCalls.map((unfinishedCall, index) => (
                    <Fragment key={unfinishedCall.id}>
                      <UnfinishedCall
                        onAbandonCall={() =>
                          abandonUnfinishedCall(unfinishedCall.id)
                        }
                        onSwitchToCall={() => {
                          switchToUnfinishedCall(
                            unfinishedCall.id,
                            unfinishedCall.assignment_id
                          );
                        }}
                        unfinishedCall={unfinishedCall}
                      />
                      {index != unfinishedCalls.length - 1 && <ZUIDivider />}
                    </Fragment>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              alignItems: 'center',
              bottom: 16,
              display: 'flex',
              gap: 1,
              left: 16,
              position: 'absolute',
              zIndex: 3,
            }}
          >
            <Box
              sx={(theme) => ({
                backgroundColor: theme.palette.common.white,
                borderRadius: 1,
              })}
            >
              <ZUIButton
                label={messages.callLog.openCallLogButton()}
                onClick={() => setCallLogOpen(true)}
                variant="secondary"
              />
            </Box>
            {lane.step != LaneStep.SUMMARY && (
              <List sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
                {unfinishedCalls.map((c) => (
                  <ZUITooltip key={c.id} label={c.target.name}>
                    <ListItem
                      onClick={() => {
                        switchToUnfinishedCall(c.id, c.assignment_id);
                        if (c.assignment_id != assignment.id) {
                          setAssignmentSwitchedTo(c.assignment_id);
                        }
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
                  </ZUITooltip>
                ))}
              </List>
            )}
          </Box>
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
