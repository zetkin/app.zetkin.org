import { Box } from '@mui/material';
import { FC, Fragment } from 'react';

import { Msg } from 'core/i18n';
import { callStateToString, Report, UnfinishedCall } from 'features/call/types';
import ZUIText from 'zui/components/ZUIText';
import calculateReportState from './Report/utils/calculateReportState';
import messageIds from 'features/call/l10n/messageIds';
import { DesktopStats } from './AssignmentStats';
import UnfinishedCallListItem from './UnfinishedCall';
import ZUIDivider from 'zui/components/ZUIDivider';
import useSimpleCallAssignmentStats from '../hooks/useSimpleCallAssignmentStats';

type Props = {
  assignmentId: number;
  name: string;
  onAbandonUnfinishedCall: (unfinishedCallId: number) => void;
  onSwitchToUnfinishedCall: (
    unfinishedCallId: number,
    assignmentId: number
  ) => void;
  orgId: number;
  report: Report;
  unfinishedCalls: UnfinishedCall[];
};

const CallSummary: FC<Props> = ({
  assignmentId,
  name,
  onAbandonUnfinishedCall,
  onSwitchToUnfinishedCall,
  orgId,
  report,
  unfinishedCalls,
}) => {
  const reportState = calculateReportState(report);
  const stats = useSimpleCallAssignmentStats(orgId, assignmentId);

  const hasUnfinishedCalls = unfinishedCalls.length == 0;

  return (
    <>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <ZUIText variant="headingLg">
          <Msg id={messageIds.summary.title} />
        </ZUIText>
        <ZUIText color="secondary" variant="headingSm">
          {hasUnfinishedCalls && (
            <Msg id={messageIds.summary.unfinishedCallsMessage} />
          )}
          {!hasUnfinishedCalls && (
            <Msg
              id={
                messageIds.summary.callSummary[callStateToString[reportState]]
              }
              values={{ name }}
            />
          )}
        </ZUIText>
      </Box>
      {!hasUnfinishedCalls && <DesktopStats stats={stats} />}
      {hasUnfinishedCalls && (
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
                <UnfinishedCallListItem
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
    </>
  );
};

export default CallSummary;
