import { Box, Button, Typography } from '@mui/material';
import { FormattedMessage as Msg, useIntl } from 'react-intl';

import CallAssignmentStatusChip from '../components/CallAssignmentStatusChip';
import TabbedLayout from '../../../utils/layout/TabbedLayout';
import useModel from 'core/useModel';
import ZUIDateRangePicker from 'zui/ZUIDateRangePicker/ZUIDateRangePicker';
import ZUIEditTextinPlace from 'zui/ZUIEditTextInPlace';
import ZUIFuture from 'zui/ZUIFuture';
import CallAssignmentModel, {
  CallAssignmentState,
} from '../models/CallAssignmentModel';
import { Headset, People } from '@material-ui/icons';

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
  const intl = useIntl();
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
          <Button onClick={() => model.end()} variant="contained">
            {intl.formatMessage({
              id: 'layout.organize.callAssignment.actions.end',
            })}
          </Button>
        ) : (
          <Button onClick={() => model.start()} variant="contained">
            {intl.formatMessage({
              id: 'layout.organize.callAssignment.actions.start',
            })}
          </Button>
        )
      }
      baseHref={`/organize/${orgId}/campaigns/${campaignId}/callassignments/${assignmentId}`}
      defaultTab="/"
      subtitle={
        <Box alignItems="center" display="flex">
          <CallAssignmentStatusChip state={model.state} />
          <Box marginX={2}>
            <ZUIDateRangePicker
              endDate={dataFuture.data.end_date || null}
              onChange={(startDate, endDate) => {
                model.setDates(startDate, endDate);
              }}
              startDate={dataFuture.data.start_date || null}
            />
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
                      id="layout.organize.callAssignment.stats.targets"
                      values={{ numTargets: data?.allTargets }}
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
                      id="layout.organize.callAssignment.stats.callers"
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
          messageId: 'layout.organize.callAssignment.tabs.overview',
        },
        {
          href: '/callers',
          messageId: 'layout.organize.callAssignment.tabs.callers',
        },
        {
          href: '/insights',
          messageId: 'layout.organize.callAssignment.tabs.insights',
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
