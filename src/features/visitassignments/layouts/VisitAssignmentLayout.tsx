import { Box } from '@mui/system';
import router, { useRouter } from 'next/router';
import { Button, Typography } from '@mui/material';
import { FC, ReactNode, useContext } from 'react';
import { Delete, Hiking, People } from '@mui/icons-material';

import AssignmentStatusChip from '../components/AssignmentStatusChip';
import TabbedLayout from 'utils/layout/TabbedLayout';
import useVisitAssignment from '../hooks/useVisitAssignment';
import useVisitAssignmentMutations from '../hooks/useVisitAssignmentMutations';
import useVisitAssignees from '../hooks/useVisitAssignees';
import useStartEndAssignment from '../hooks/useStartEndAssignment';
import ZUIEditTextinPlace from 'zui/ZUIEditTextInPlace';
import ZUIDateRangePicker from 'zui/ZUIDateRangePicker/ZUIDateRangePicker';
import useVisitAssignmentStatus, {
  VisitAssignmentState,
} from '../hooks/useVisitAssignmentStatus';
import ZUIEllipsisMenu from 'zui/ZUIEllipsisMenu';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import { useNumericRouteParams } from '../../../core/hooks';
import { ZUIFuture } from '../../../../docs';
import useVisitAssignmentStats from '../hooks/useVisitAssignmentStats';

type VisitAssignmentLayoutProps = {
  children: ReactNode;
};

const VisitAssignmentLayout: FC<VisitAssignmentLayoutProps> = ({
  children,
}) => {
  const messages = useMessages(messageIds);
  const { orgId, campId, visitAssId } = useNumericRouteParams();
  const path = useRouter().pathname;
  const { data: visitAssignment } = useVisitAssignment(orgId, visitAssId);
  const { deleteVisitAssignment, updateVisitAssignment } =
    useVisitAssignmentMutations(orgId, visitAssId);
  const statsFuture = useVisitAssignmentStats(orgId, visitAssId);
  const { filteredAssigneesFuture } = useVisitAssignees(orgId, visitAssId);

  const state = useVisitAssignmentStatus(orgId, visitAssId);
  const { startAssignment, endAssignment } = useStartEndAssignment(
    orgId,
    visitAssId
  );
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);

  const isMapTab = path.endsWith('/map');

  if (!visitAssignment) {
    return null;
  }

  const handleDelete = () => {
    deleteVisitAssignment();
    router.push(`/organize/${orgId}/projects/${visitAssignment.campaign.id} `);
  };

  return (
    <TabbedLayout
      actionButtons={
        <Box>
          {state == VisitAssignmentState.OPEN ? (
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
                      title: visitAssignment.title ?? '',
                    }),
                  });
                },
                startIcon: <Delete />,
              },
            ]}
          />
        </Box>
      }
      baseHref={`/organize/${orgId}/projects/${campId}/visitassignments/${visitAssId}`}
      belowActionButtons={
        <ZUIDateRangePicker
          endDate={visitAssignment.end_date || null}
          onChange={(startDate, endDate) => {
            updateVisitAssignment({
              end_date: endDate,
              start_date: startDate,
            });
          }}
          startDate={visitAssignment.start_date || null}
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
              future={filteredAssigneesFuture}
              ignoreDataWhileLoading
              skeletonWidth={100}
            >
              {(data) => (
                <>
                  <Hiking />
                  <Typography marginLeft={1}>
                    <Msg
                      id={messageIds.stats.assignees}
                      values={{ numAssignees: data.length }}
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
          label: messages.layout.tabs.target(),
        },
        {
          href: '/map',
          label: messages.layout.tabs.map(),
        },
        {
          href: '/assignees',
          label: messages.layout.tabs.assignees(),
        },
        {
          href: '/report',
          label: messages.layout.tabs.report(),
        },
      ]}
      title={
        <ZUIEditTextinPlace
          onChange={(newTitle) => updateVisitAssignment({ title: newTitle })}
          value={visitAssignment.title ?? ''}
        />
      }
    >
      {children}
    </TabbedLayout>
  );
};

export default VisitAssignmentLayout;
