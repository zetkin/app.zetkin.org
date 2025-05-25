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
import useAreaAssignees from '../hooks/useAreaAssignees';
import useStartEndAssignment from '../hooks/useStartEndAssignment';
import ZUIEditTextinPlace from 'zui/ZUIEditTextInPlace';
import ZUIDateRangePicker from 'zui/ZUIDateRangePicker/ZUIDateRangePicker';
import useAreaAssignmentStatus, {
  AreaAssignmentState,
} from '../hooks/useAreaAssignmentStatus';
import ZUIEllipsisMenu from 'zui/ZUIEllipsisMenu';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';

type AreaAssignmentLayoutProps = {
  areaAssId: number;
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
  const messages = useMessages(messageIds);
  const path = useRouter().pathname;
  const areaAssignment = useAreaAssignment(orgId, areaAssId).data;
  const { deleteAreaAssignment, updateAreaAssignment } =
    useAreaAssignmentMutations(orgId, areaAssId);

  const sessions = useAreaAssignees(orgId, areaAssId).data || [];

  const state = useAreaAssignmentStatus(orgId, areaAssId);
  const { startAssignment, endAssignment } = useStartEndAssignment(
    orgId,
    areaAssId
  );
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);

  const areaAssignees = getAreaAssignees(sessions);

  const isMapTab = path.endsWith('/map');

  const numAreas = new Set(sessions.map((assignee) => assignee.area_id)).size;

  if (!areaAssignment) {
    return null;
  }

  const handleDelete = () => {
    deleteAreaAssignment();
    router.push(`/organize/${orgId}/projects/${areaAssignment.project_id} `);
  };

  return (
    <TabbedLayout
      actionButtons={
        <Box>
          {state == AreaAssignmentState.OPEN ? (
            <Button onClick={endAssignment} variant="outlined">
              <Msg id={messageIds.layout.actions.end} />
            </Button>
          ) : (
            <Button onClick={startAssignment} variant="contained">
              <Msg id={messageIds.layout.actions.start} />
            </Button>
          )}
          <ZUIEllipsisMenu
            items={[
              {
                label: <Msg id={messageIds.layout.actions.delete} />,
                onSelect: () => {
                  showConfirmDialog({
                    onSubmit: handleDelete,
                    title: messages.layout.actions.delete(),
                    warningText: messages.layout.actions.deleteWarningText({
                      title: areaAssignment.title,
                    }),
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
          <Box display="flex" marginX={1}>
            <Pentagon />
            <Typography marginLeft={1}>
              <Msg
                id={messageIds.layout.basicAssignmentStats.areas}
                values={{ numAreas }}
              />
            </Typography>
          </Box>
          <Box display="flex" marginX={1}>
            <People />
            <Typography marginLeft={1}>
              <Msg
                id={messageIds.layout.basicAssignmentStats.assignees}
                values={{ numAssignees: areaAssignees.length }}
              />
            </Typography>
          </Box>
        </Box>
      }
      tabs={[
        { href: '/', label: messages.layout.tabs.overview() },
        { href: '/map', label: messages.layout.tabs.map() },
        { href: '/report', label: messages.layout.tabs.report() },
        { href: '/instructions', label: messages.layout.tabs.instructions() },
      ]}
      title={
        <ZUIEditTextinPlace
          onChange={(newTitle) => updateAreaAssignment({ title: newTitle })}
          value={areaAssignment.title}
        />
      }
    >
      {children}
    </TabbedLayout>
  );
};

export default AreaAssignmentLayout;
