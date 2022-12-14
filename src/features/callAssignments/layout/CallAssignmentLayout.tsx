import { useIntl } from 'react-intl';
import { Box, Button } from '@mui/material';

import CallAssignmentStatusChip from '../components/CallAssignmentStatusChip';
import TabbedLayout from '../../../utils/layout/TabbedLayout';
import useModel from 'core/useModel';
import ZUIDateRangePicker from 'zui/ZUIDateRangePicker/ZUIDateRangePicker';
import ZUIEditTextinPlace from 'zui/ZUIEditTextInPlace';
import CallAssignmentModel, {
  CallAssignmentState,
} from '../models/CallAssignmentModel';

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

  const future = model.getData();

  if (!future.data) {
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
              endDate={future.data.end_date || null}
              onChange={(startDate, endDate) => {
                model.setDates(startDate, endDate);
              }}
              startDate={future.data.start_date || null}
            />
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
          href: '/conversation',
          messageId: 'layout.organize.callAssignment.tabs.conversation',
        },
        {
          href: '/insights',
          messageId: 'layout.organize.callAssignment.tabs.insights',
        },
      ]}
      title={
        <ZUIEditTextinPlace
          onChange={(newTitle) => model.setTitle(newTitle)}
          value={future.data.title}
        />
      }
    >
      {children}
    </TabbedLayout>
  );
};

export default CallAssignmentLayout;
