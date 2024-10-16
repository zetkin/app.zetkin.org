import { Box } from '@mui/system';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { Button, Typography } from '@mui/material';
import { FC, ReactNode } from 'react';
import { Pentagon, People } from '@mui/icons-material';

import AssignmentStatusChip from '../components/AssignmentStatusChip';
import getCanvassers from '../utils/getCanvassers';
import TabbedLayout from 'utils/layout/TabbedLayout';
import useCanvassAssignment from '../hooks/useCanvassAssignment';
import useCanvassAssignmentMutations from '../hooks/useCanvassAssignmentMutations';
import useCanvassSessions from '../hooks/useCanvassSessions';
import useCanvassAssignmentStats from '../hooks/useCanvassAssignmentStats';
import ZUIEditTextinPlace from 'zui/ZUIEditTextInPlace';
import ZUIFuture from 'zui/ZUIFuture';
import ZUIDateRangePicker from 'zui/ZUIDateRangePicker/ZUIDateRangePicker';
import useCanvassAssignmentStatus, {
  CanvassAssignmentState,
} from '../hooks/useCanvassAssignmentStatus';

type CanvassAssignmentLayoutProps = {
  campId: number;
  canvassAssId: string;
  children: ReactNode;
  orgId: number;
};

const CanvassAssignmentLayout: FC<CanvassAssignmentLayoutProps> = ({
  children,
  orgId,
  campId,
  canvassAssId,
}) => {
  const path = useRouter().pathname;
  const canvassAssignment = useCanvassAssignment(orgId, canvassAssId).data;
  const updateCanvassAssignment = useCanvassAssignmentMutations(
    orgId,
    canvassAssId
  );

  const allSessions = useCanvassSessions(orgId, canvassAssId).data || [];
  const sessions = allSessions.filter(
    (session) => session.assignment.id === canvassAssId
  );

  const stats = useCanvassAssignmentStats(orgId, canvassAssId);
  const state = useCanvassAssignmentStatus(orgId, canvassAssId);

  const canvassers = getCanvassers(sessions);

  const isPlanTab = path.endsWith('/plan');

  if (!canvassAssignment) {
    return null;
  }

  return (
    <TabbedLayout
      actionButtons={
        state == CanvassAssignmentState.OPEN ? (
          <Button
            onClick={() =>
              updateCanvassAssignment({
                end_date: dayjs().format('YYYY-MM-DD'),
              })
            }
            variant="outlined"
          >
            {'End Assignment'}
          </Button>
        ) : (
          <Button
            onClick={() =>
              updateCanvassAssignment({
                start_date: dayjs().format('YYYY-MM-DD'),
              })
            }
            variant="contained"
          >
            {'Start Assignment'}
          </Button>
        )
      }
      baseHref={`/organize/${orgId}/projects/${campId}/canvassassignments/${canvassAssId}`}
      belowActionButtons={
        <ZUIDateRangePicker
          endDate={canvassAssignment.end_date || null}
          onChange={(startDate, endDate) => {
            updateCanvassAssignment({
              end_date: endDate,
              start_date: startDate,
            });
          }}
          startDate={canvassAssignment.start_date || null}
        />
      }
      defaultTab="/"
      fixedHeight={isPlanTab}
      subtitle={
        <Box alignItems="center" display="flex">
          <Box marginRight={1}>
            <AssignmentStatusChip state={state} />
          </Box>
          <ZUIFuture future={stats} ignoreDataWhileLoading skeletonWidth={100}>
            {(data) => (
              <Box display="flex" marginX={1}>
                <Pentagon />
                <Typography marginLeft={1}>{data.num_areas} Area(s)</Typography>
              </Box>
            )}
          </ZUIFuture>
          <Box display="flex" marginX={1}>
            <People />
            <Typography marginLeft={1}>
              {canvassers.length} Canvasser(s)
            </Typography>
          </Box>
        </Box>
      }
      tabs={[
        { href: '/', label: 'Overview' },
        { href: '/plan', label: 'Plan' },
        { href: '/canvassers', label: 'Canvassers' },
        { href: '/editor', label: 'Editor' },
      ]}
      title={
        <ZUIEditTextinPlace
          onChange={(newTitle) => updateCanvassAssignment({ title: newTitle })}
          value={canvassAssignment.title || 'Untitled canvass assignment'}
        />
      }
    >
      {children}
    </TabbedLayout>
  );
};

export default CanvassAssignmentLayout;
