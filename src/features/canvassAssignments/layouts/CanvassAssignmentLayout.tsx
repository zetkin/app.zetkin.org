import { Box } from '@mui/system';
import router, { useRouter } from 'next/router';
import { Button, Typography } from '@mui/material';
import { FC, ReactNode, useContext } from 'react';
import { Delete, Pentagon, People } from '@mui/icons-material';

import AssignmentStatusChip from '../components/AssignmentStatusChip';
import getCanvassers from '../utils/getCanvassers';
import TabbedLayout from 'utils/layout/TabbedLayout';
import useCanvassAssignment from '../hooks/useCanvassAssignment';
import useCanvassAssignmentMutations from '../hooks/useCanvassAssignmentMutations';
import useCanvassSessions from '../hooks/useCanvassSessions';
import useCanvassAssignmentStats from '../hooks/useCanvassAssignmentStats';
import useStartEndAssignment from '../hooks/useStartEndAssignment';
import ZUIEditTextinPlace from 'zui/ZUIEditTextInPlace';
import ZUIFuture from 'zui/ZUIFuture';
import ZUIDateRangePicker from 'zui/ZUIDateRangePicker/ZUIDateRangePicker';
import useCanvassAssignmentStatus, {
  CanvassAssignmentState,
} from '../hooks/useCanvassAssignmentStatus';
import ZUIEllipsisMenu from 'zui/ZUIEllipsisMenu';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';

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
  const { deleteCanvassAssignment, updateCanvassAssignment } =
    useCanvassAssignmentMutations(orgId, canvassAssId);

  const allSessions = useCanvassSessions(orgId, canvassAssId).data || [];
  const sessions = allSessions.filter(
    (session) => session.assignment.id === canvassAssId
  );

  const stats = useCanvassAssignmentStats(orgId, canvassAssId);
  const state = useCanvassAssignmentStatus(orgId, canvassAssId);
  const { startAssignment, endAssignment } = useStartEndAssignment(
    orgId,
    canvassAssId
  );
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);

  const canvassers = getCanvassers(sessions);

  const isMapTab = path.endsWith('/map');

  if (!canvassAssignment) {
    return null;
  }

  const handleDelete = () => {
    deleteCanvassAssignment();
    router.push(
      `/organize/${orgId}/projects/${canvassAssignment.campaign.id || ''} `
    );
  };

  return (
    <TabbedLayout
      actionButtons={
        <Box>
          {state == CanvassAssignmentState.OPEN ? (
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
                    warningText: `Are you sure you want to delete ${canvassAssignment.title}?`,
                  });
                },
                startIcon: <Delete />,
              },
            ]}
          />
        </Box>
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
              {canvassers.length} Canvasser(s)
            </Typography>
          </Box>
        </Box>
      }
      tabs={[
        { href: '/', label: 'Overview' },
        { href: '/map', label: 'Map' },
        { href: '/canvassers', label: 'Canvassers' },
        { href: '/report', label: 'Report' },
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
