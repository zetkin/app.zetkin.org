import { Box, Button, Typography } from '@mui/material';
import { Headset, People } from '@mui/icons-material';

import CallAssignmentStatusChip from '../components/CallAssignmentStatusChip';
import TabbedLayout from '../../../utils/layout/TabbedLayout';
import useModel from 'core/useModel';
import ZUIDateRangePicker from 'zui/ZUIDateRangePicker/ZUIDateRangePicker';
import ZUIEditTextinPlace from 'zui/ZUIEditTextInPlace';
import ZUIFuture from 'zui/ZUIFuture';
import CallAssignmentModel, {
  CallAssignmentState,
} from '../models/CallAssignmentModel';
import { Msg, useMessages } from 'core/i18n';

import messageIds from '../l10n/messageIds';
import useCallAssignment from '../hooks/useCallAssignment';
import useCallAssignmentStats from '../hooks/useCallAssignmentStats';
import useCallers from '../hooks/useCallers';

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
  const model = useModel(
    (env) =>
      new CallAssignmentModel(env, parseInt(orgId), parseInt(assignmentId))
  );

  const { data, endDate, startDate, title } = useCallAssignment(
    parseInt(orgId),
    parseInt(assignmentId)
  );

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

  if (!data) {
    return null;
  }

  return (
    <TabbedLayout
      actionButtons={
        model.state == CallAssignmentState.OPEN ||
        model.state == CallAssignmentState.ACTIVE ? (
          <Button onClick={() => model.end()} variant="outlined">
            <Msg id={messageIds.actions.end} />
          </Button>
        ) : (
          <Button onClick={() => model.start()} variant="contained">
            <Msg id={messageIds.actions.start} />
          </Button>
        )
      }
      baseHref={`/organize/${orgId}/projects/${campaignId}/callassignments/${assignmentId}`}
      belowActionButtons={
        <ZUIDateRangePicker
          endDate={endDate || null}
          onChange={(startDate, endDate) => {
            model.setDates(startDate, endDate);
          }}
          startDate={startDate || null}
        />
      }
      defaultTab="/"
      subtitle={
        <Box alignItems="center" display="flex">
          <Box marginRight={1}>
            <CallAssignmentStatusChip state={model.state} />
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
          onChange={(newTitle) => model.setTitle(newTitle)}
          value={title}
        />
      }
    >
      {children}
    </TabbedLayout>
  );
};

export default CallAssignmentLayout;
