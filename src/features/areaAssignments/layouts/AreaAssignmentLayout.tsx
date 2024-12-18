import { Box } from '@mui/system';
import router, { useRouter } from 'next/router';
import { Button, Typography } from '@mui/material';
import { FC, ReactNode, useContext } from 'react';
import { Delete, Pentagon, People } from '@mui/icons-material';

import AssignmentStatusChip from '../components/AssignmentStatusChip';
import getAreaAssignees from '../utils/getAreaAssignees';
import TabbedLayout from 'utils/layout/TabbedLayout';
import useAreaAssignment from '../hooks/useAreaAssignment';
import useAreaAssignmentMutations from '../hooks/useAreaAssignmentMutations';
import useAreaAssignmentSessions from '../hooks/useAreaAssignmentSessions';
import useAreaAssignmentStats from '../hooks/useAreaAssignmentStats';
import useStartEndAssignment from '../hooks/useStartEndAssignment';
import ZUIEditTextinPlace from 'zui/ZUIEditTextInPlace';
import ZUIFuture from 'zui/ZUIFuture';
import ZUIDateRangePicker from 'zui/ZUIDateRangePicker/ZUIDateRangePicker';
import useAreaAssignmentStatus, {
  AreaAssignmentState,
} from '../hooks/useAreaAssignmentStatus';
import ZUIEllipsisMenu from 'zui/ZUIEllipsisMenu';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';

type AreaAssignmentLayoutProps = {
  areaAssId: string;
  campId: number;
  children: ReactNode;
  orgId: number;
};

const AreaAssignmentLayout: FC<AreaAssignmentLayoutProps> = ({
  children,
  orgId,
  campId,
  areaAssId,
}) => {
  const path = useRouter().pathname;
  const areaAssignment = useAreaAssignment(orgId, areaAssId).data;
  const { deleteAreaAssignment, updateAreaAssignment } =
    useAreaAssignmentMutations(orgId, areaAssId);

  const allSessions = useAreaAssignmentSessions(orgId, areaAssId).data || [];
  const sessions = allSessions.filter(
    (session) => session.assignment.id === areaAssId
  );

  const stats = useAreaAssignmentStats(orgId, areaAssId);
  const state = useAreaAssignmentStatus(orgId, areaAssId);
  const { startAssignment, endAssignment } = useStartEndAssignment(
    orgId,
    areaAssId
  );
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);

  const areaAssignees = getAreaAssignees(sessions);

  const isMapTab = path.endsWith('/map');

  if (!areaAssignment) {
    return null;
  }

  const handleDelete = () => {
    deleteAreaAssignment();
    router.push(
      `/organize/${orgId}/projects/${areaAssignment.campaign.id || ''} `
    );
  };

  return (
    <TabbedLayout
      actionButtons={
        <Box>
          {state == AreaAssignmentState.OPEN ? (
            <Button onClick={endAssignment} variant="outlined">
              {'End Assignment'}
            </Button>
          ) : (
            <Button onClick={startAssignment} variant="contained">
              {'Start Assignment'}
            </Button>
          )}
          <ZUIEllipsisMenu
            items={[
              {
                label: 'Delete',
                onSelect: () => {
                  showConfirmDialog({
                    onSubmit: handleDelete,
                    title: 'Delete',
                    warningText: `Are you sure you want to delete ${areaAssignment.title}?`,
                  });
                },
                startIcon: <Delete />,
              },
            ]}
          />
        </Box>
      }
      baseHref={`/organize/${orgId}/projects/${campId}/areaassignments/${areaAssId}`}
      belowActionButtons={
        <ZUIDateRangePicker
          endDate={areaAssignment.end_date || null}
          onChange={(startDate, endDate) => {
            updateAreaAssignment({
              end_date: endDate,
              start_date: startDate,
            });
          }}
          startDate={areaAssignment.start_date || null}
        />
      }
      defaultTab="/"
      fixedHeight={isMapTab}
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
              {areaAssignees.length} Assignee(s)
            </Typography>
          </Box>
        </Box>
      }
      tabs={[
        { href: '/', label: 'Overview' },
        { href: '/map', label: 'Map' },
        { href: '/assignees', label: 'Assignees' },
        { href: '/report', label: 'Report' },
      ]}
      title={
        <ZUIEditTextinPlace
          onChange={(newTitle) => updateAreaAssignment({ title: newTitle })}
          value={areaAssignment.title || 'Untitled area assignment'}
        />
      }
    >
      {children}
    </TabbedLayout>
  );
};

export default AreaAssignmentLayout;
