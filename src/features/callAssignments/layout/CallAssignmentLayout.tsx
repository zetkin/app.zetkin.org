import { Box, Button, Typography } from '@mui/material';
import { Headset, People } from '@mui/icons-material';

import CallAssignmentStatusChip from '../components/CallAssignmentStatusChip';
import TabbedLayout from '../../../utils/layout/TabbedLayout';
import ZUIDateRangePicker from 'zui/ZUIDateRangePicker/ZUIDateRangePicker';
import ZUIEditTextinPlace from 'zui/ZUIEditTextInPlace';
import ZUIFuture from 'zui/ZUIFuture';
import { Msg, useMessages } from 'core/i18n';

import messageIds from '../l10n/messageIds';
import useCallAssignmentStats from '../hooks/useCallAssignmentStats';
import useCallers from '../hooks/useCallers';
import useCallAssignment, {
  CallAssignmentState,
} from '../hooks/useCallAssignment';

interface CallAssignmentLayoutProps {
  children: React.ReactNode;
  orgId: string;
  campaignId: string;
  assignmentId: string;
}

const CallAssignmentLayout: React.FC<CallAssignmentLayoutProps> = ({
  children,
  orgId,
  campaignId,
  assignmentId,
}) => {
  const messages = useMessages(messageIds);
  const {
    data: assignmentData,
    end,
    start,
    state,
    updateCallAssignment,
  } = useCallAssignment(parseInt(orgId), parseInt(assignmentId));

  const {
    data: statsData,
    error: statsError,
    isLoading: statsIsLoading,
  } = useCallAssignmentStats(parseInt(orgId), parseInt(assignmentId));

  const {
    data: callersData,
    error: callersError,
    isLoading: callersIsLoading,
  } = useCallers(parseInt(orgId), parseInt(assignmentId));

  if (!assignmentData) {
    return null;
  }

  return (
    <TabbedLayout
      actionButtons={
        state == CallAssignmentState.OPEN ||
        state == CallAssignmentState.ACTIVE ? (
          <Button onClick={() => end()} variant="outlined">
            <Msg id={messageIds.actions.end} />
          </Button>
        ) : (
          <Button onClick={() => start()} variant="contained">
            <Msg id={messageIds.actions.start} />
          </Button>
        )
      }
      baseHref={`/organize/${orgId}/projects/${campaignId}/callassignments/${assignmentId}`}
      belowActionButtons={
        <ZUIDateRangePicker
          endDate={assignmentData.end_date || null}
          onChange={(startDate, endDate) => {
            updateCallAssignment({ end_date: endDate, start_date: startDate });
          }}
          startDate={assignmentData.start_date || null}
        />
      }
      defaultTab="/"
      subtitle={
        <Box alignItems="center" display="flex">
          <Box marginRight={1}>
            <CallAssignmentStatusChip state={state} />
          </Box>
          <Box display="flex" marginX={1}>
            <ZUIFuture
              future={{
                data: statsData,
                error: statsError,
                isLoading: statsIsLoading,
              }}
              ignoreDataWhileLoading
              skeletonWidth={100}
            >
              {(data) => (
                <>
                  <People />
                  <Typography marginLeft={1}>
                    <Msg
                      id={messageIds.stats.targets}
                      values={{ numTargets: data?.allTargets ?? 0 }}
                    />
                  </Typography>
                </>
              )}
            </ZUIFuture>
          </Box>
          <Box display="flex" marginX={1}>
            <ZUIFuture
              future={{
                data: callersData,
                error: callersError,
                isLoading: callersIsLoading,
              }}
              ignoreDataWhileLoading
              skeletonWidth={100}
            >
              {(data) => (
                <>
                  <Headset />
                  <Typography marginLeft={1}>
                    <Msg
                      id={messageIds.stats.callers}
                      values={{ numCallers: data.length }}
                    />
                  </Typography>
                </>
              )}
            </ZUIFuture>
          </Box>
        </Box>
      }
      tabs={[
        {
          href: '/',
          label: messages.tabs.overview(),
        },
        {
          href: '/callers',
          label: messages.tabs.callers(),
        },
        {
          href: '/conversation',
          label: messages.tabs.conversation(),
        },
        {
          href: '/insights',
          label: messages.tabs.insights(),
        },
      ]}
      title={
        <ZUIEditTextinPlace
          onChange={(newTitle) => updateCallAssignment({ title: newTitle })}
          value={assignmentData.title}
        />
      }
    >
      {children}
    </TabbedLayout>
  );
};

export default CallAssignmentLayout;
