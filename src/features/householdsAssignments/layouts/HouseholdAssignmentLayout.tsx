import { Box } from '@mui/system';
import router, { useRouter } from 'next/router';
import { Button, Typography } from '@mui/material';
import { FC, ReactNode, useContext } from 'react';
import { Delete, People } from '@mui/icons-material';

import AssignmentStatusChip from '../components/AssignmentStatusChip';
import TabbedLayout from 'utils/layout/TabbedLayout';
import useHouseholdAssignment from '../hooks/useHouseholdAssignment';
import useHouseholdAssignmentMutations from '../hooks/useHouseholdAssignmentMutations';
import useHouseholdAssignees from '../hooks/useHouseholdAssignees';
import useStartEndAssignment from '../hooks/useStartEndAssignment';
import ZUIEditTextinPlace from 'zui/ZUIEditTextInPlace';
import ZUIDateRangePicker from 'zui/ZUIDateRangePicker/ZUIDateRangePicker';
import useHouseholdAssignmentStatus, {
  HouseholdAssignmentState,
} from '../hooks/useHouseholdAssignmentStatus';
import ZUIEllipsisMenu from 'zui/ZUIEllipsisMenu';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import { useNumericRouteParams } from '../../../core/hooks';

type HouseholdAssignmentLayoutProps = {
  children: ReactNode;
};

const HouseholdAssignmentLayout: FC<HouseholdAssignmentLayoutProps> = ({
  children,
}) => {
  const messages = useMessages(messageIds);
  const { orgId, campId, householdsAssId } = useNumericRouteParams();
  const path = useRouter().pathname;

  const { data: householdsAssignment } = useHouseholdAssignment(
    campId,
    orgId,
    householdsAssId
  );

  const { deleteHouseholdAssignment, updateHouseholdAssignment } =
    useHouseholdAssignmentMutations(campId, orgId, householdsAssId);

  const householdAssignees =
    useHouseholdAssignees(campId, orgId, householdsAssId).data || [];

  const state = useHouseholdAssignmentStatus(campId, orgId, householdsAssId);
  const { startAssignment, endAssignment } = useStartEndAssignment(
    campId,
    orgId,
    householdsAssId
  );
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);

  const isMapTab = path.endsWith('/map');

  if (!householdsAssignment) {
    return null;
  }

  const handleDelete = () => {
    deleteHouseholdAssignment();
    router.push(`/organize/${orgId}/projects/${householdsAssignment.campId} `);
  };

  return (
    <TabbedLayout
      actionButtons={
        <Box>
          {state == HouseholdAssignmentState.OPEN ? (
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
                      title: householdsAssignment.title ?? '',
                    }),
                  });
                },
                startIcon: <Delete />,
              },
            ]}
          />
        </Box>
      }
      baseHref={`/organize/${orgId}/projects/${campId}/householdsassignments/${householdsAssId}`}
      belowActionButtons={
        <ZUIDateRangePicker
          endDate={householdsAssignment.end_date || null}
          onChange={(startDate, endDate) => {
            updateHouseholdAssignment({
              end_date: endDate,
              start_date: startDate,
            });
          }}
          startDate={householdsAssignment.start_date || null}
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
            <People />
            <Typography marginLeft={1}>
              <Msg
                id={messageIds.layout.basicAssignmentStats.assignees}
                values={{ numAssignees: householdAssignees.length }}
              />
            </Typography>
          </Box>
        </Box>
      }
      tabs={[
        {
          href: '/',
          label: messages.layout.tabs.overview()
        },
        {
          href: '/canvassers',
          label: messages.layout.tabs.canvassers()
        }
      ]}
      title={
        <ZUIEditTextinPlace
          onChange={(newTitle) =>
            updateHouseholdAssignment({ title: newTitle })
          }
          value={householdsAssignment.title ?? ''}
        />
      }
    >
      {children}
    </TabbedLayout>
  );
};

export default HouseholdAssignmentLayout;
