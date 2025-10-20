import { FC, Fragment } from 'react';
import { Box, List, ListItem } from '@mui/material';

import useSimpleCallAssignmentStats from '../hooks/useSimpleCallAssignmentStats';
import { ZetkinCallAssignment } from 'utils/types/zetkin';
import ZUISection from 'zui/components/ZUISection';
import ZUIText from 'zui/components/ZUIText';
import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import { LaneState, LaneStep, Report, ZetkinCall } from '../types';
import AssignmentStats, { DesktopStats } from './AssignmentStats';
import InstructionsSection from './InstructionsSection';
import AboutSection from './AboutSection';
import ActivitiesSection from './ActivitiesSection';
import ReportForm from './Report';
import { useAppDispatch } from 'core/hooks';
import { reportUpdated } from '../store';
import ZUIButton from 'zui/components/ZUIButton';
import ZUITooltip from 'zui/components/ZUITooltip';
import ZUIPersonAvatar from 'zui/components/ZUIPersonAvatar';
import UnfinishedCall from './UnfinishedCall';
import callSummarySentence from './utils/callSummarySentence';
import ZUIDivider from 'zui/components/ZUIDivider';

type Props = {
  assignment: ZetkinCallAssignment;
  call: ZetkinCall | null;
  lane: LaneState;
  onAbandonUnfinishedCall: (callId: number) => void;
  onOpenCallLog: () => void;
  onSwitchToUnfinishedCall: (callId: number, assignmentId: number) => void;
  report: Report;
  unfinishedCalls: ZetkinCall[];
};

const CallPanels: FC<Props> = ({
  assignment,
  call,
  lane,
  onAbandonUnfinishedCall,
  onOpenCallLog,
  onSwitchToUnfinishedCall,
  report,
  unfinishedCalls,
}) => {
  const messages = useMessages(messageIds);
  const dispatch = useAppDispatch();

  const stats = useSimpleCallAssignmentStats(
    assignment.organization.id,
    assignment.id
  );
  return (
    <>
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
                <Msg id={messageIds.callingInfo.tutorial.start.description} />
              </ZUIText>
              <ZUIText variant="headingMd">
                <Msg id={messageIds.callingInfo.tutorial.personInfo.title} />
              </ZUIText>
              <ZUIText>
                <Msg
                  id={messageIds.callingInfo.tutorial.personInfo.description}
                />
              </ZUIText>
              <ZUIText variant="headingMd">
                <Msg id={messageIds.callingInfo.tutorial.call.title} />
              </ZUIText>
              <ZUIText>
                <Msg id={messageIds.callingInfo.tutorial.call.description} />
              </ZUIText>
              <ZUIText variant="headingMd">
                <Msg id={messageIds.callingInfo.tutorial.report.title} />
              </ZUIText>
              <ZUIText>
                <Msg id={messageIds.callingInfo.tutorial.report.description} />
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
            lane.step == LaneStep.START ? 'calc(100% / 3)' : 'calc(-100% / 3)',
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
          animationName: lane.step == LaneStep.SUMMARY ? 'instructionsOut' : '',
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
          animationName: lane.step == LaneStep.SUMMARY ? 'activitiesOut' : '',
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
          left: lane.step == LaneStep.REPORT ? 'calc((100% / 3) * 2)' : '100%',
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
                      onAbandonUnfinishedCall(unfinishedCall.id)
                    }
                    onSwitchToCall={() => {
                      onSwitchToUnfinishedCall(
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
            onClick={() => onOpenCallLog()}
            variant="secondary"
          />
        </Box>
        {lane.step != LaneStep.SUMMARY && (
          <List sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
            {unfinishedCalls.map((c) => (
              <ZUITooltip key={c.id} label={c.target.name}>
                <ListItem
                  onClick={() =>
                    onSwitchToUnfinishedCall(c.id, c.assignment_id)
                  }
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
    </>
  );
};

export default CallPanels;
