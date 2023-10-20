import { Box, Button, Typography } from '@mui/material';
import { Headset, People } from '@mui/icons-material';

import CallAssignmentStatusChip from '../components/CallAssignmentStatusChip';
import messageIds from '../l10n/messageIds';
import TabbedLayout from '../../../utils/layout/TabbedLayout';
import useCallAssignment from '../hooks/useCallAssignment';
import useCallAssignmentStats from '../hooks/useCallAssignmentStats';
import useCallers from '../hooks/useCallers';
import { useNumericRouteParams } from 'core/hooks';
import ZUIDateRangePicker from 'zui/ZUIDateRangePicker/ZUIDateRangePicker';
import ZUIEditTextinPlace from 'zui/ZUIEditTextInPlace';
import ZUIFuture from 'zui/ZUIFuture';
import { Msg, useMessages } from 'core/i18n';
import useCallAssignmentState, {
  CallAssignmentState,
} from '../hooks/useCallAssignmentState';

interface CallAssignmentLayoutProps {
  children: React.ReactNode;
}

const CallAssignmentLayout: React.FC<CallAssignmentLayoutProps> = ({
  children,
}) => {
  const messages = useMessages(messageIds);
  const { orgId, campId, callAssId } = useNumericRouteParams();

  const {
    data: callAssignment,
    end,
    start,
    updateCallAssignment,
  } = useCallAssignment(orgId, callAssId);
  const { statsFuture } = useCallAssignmentStats(orgId, callAssId);
  const { filteredCallersFuture } = useCallers(orgId, callAssId);
  const state = useCallAssignmentState(orgId, callAssId);

  if (!callAssignment) {
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
      baseHref={`/organize/${orgId}/projects/${campId}/callassignments/${callAssId}`}
      belowActionButtons={
        <ZUIDateRangePicker
          endDate={callAssignment.end_date || null}
          onChange={(startDate, endDate) => {
            updateCallAssignment({ end_date: endDate, start_date: startDate });
          }}
          startDate={callAssignment.start_date || null}
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
              future={statsFuture}
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
              future={filteredCallersFuture}
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
      ]}
      title={
        <ZUIEditTextinPlace
          onChange={(newTitle) => updateCallAssignment({ title: newTitle })}
          value={callAssignment.title}
        />
      }
    >
      {children}
    </TabbedLayout>
  );
};

export default CallAssignmentLayout;
