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

type HouseholdAssignmentLayoutProps = {
  campId: number;
  children: ReactNode;
  householdsAssId: number;
  orgId: number;
};

const HouseholdAssignmentLayout: FC<HouseholdAssignmentLayoutProps> = ({
  children,
  orgId,
  campId,
  householdsAssId,
}) => {
  const messages = useMessages(messageIds);
  const path = useRouter().pathname;
  const householdAssignment = useHouseholdAssignment(
    campId,
    orgId,
    householdsAssId
  ).data;
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

  if (!householdAssignment) {
    return null;
  }

  const handleDelete = () => {
    deleteHouseholdAssignment();
    router.push(`/organize/${orgId}/projects/${householdAssignment.campId} `);
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
                      title: householdAssignment.title ?? '',
                    }),
                  });
                },
                startIcon: <Delete />,
              },
            ]}
          />
        </Box>
      }
      baseHref={`/organize/${orgId}/projects/${campId}/householdassignments/${householdsAssId}`}
      belowActionButtons={
        <ZUIDateRangePicker
          endDate={householdAssignment.end_date || null}
          onChange={(startDate, endDate) => {
            updateHouseholdAssignment({
              end_date: endDate,
              start_date: startDate,
            });
          }}
          startDate={householdAssignment.start_date || null}
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
        { href: '/', label: messages.layout.tabs.overview() },
        { href: '/map', label: messages.layout.tabs.map() },
        { href: '/report', label: messages.layout.tabs.report() },
        { href: '/instructions', label: messages.layout.tabs.instructions() },
      ]}
      title={
        <ZUIEditTextinPlace
          onChange={(newTitle) =>
            updateHouseholdAssignment({ title: newTitle })
          }
          value={householdAssignment.title ?? ''}
        />
      }
    >
      {children}
    </TabbedLayout>
  );
};

export default HouseholdAssignmentLayout;
