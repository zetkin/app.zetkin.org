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

  const dataFuture = model.getData();
  const statsFuture = model.getStats();
  const callersFuture = model.getFilteredCallers();

  if (!dataFuture.data) {
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
      datePicker={
        <ZUIDateRangePicker
          endDate={dataFuture.data.end_date || null}
          onChange={(startDate, endDate) => {
            model.setDates(startDate, endDate);
          }}
          startDate={dataFuture.data.start_date || null}
        />
      }
      defaultTab="/"
      subtitle={
        <Box alignItems="center" display="flex">
          <CallAssignmentStatusChip state={model.state} />
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
              future={callersFuture}
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
          value={dataFuture.data.title}
        />
      }
    >
      {children}
    </TabbedLayout>
  );
};

export default CallAssignmentLayout;
