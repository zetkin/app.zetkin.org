import React, { useContext, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { ArrowForward, Delete, Headset, People } from '@mui/icons-material';
import { useRouter } from 'next/router';

import CallAssignmentStatusChip from '../components/CallAssignmentStatusChip';
import getCallAssignmentUrl from '../utils/getCallAssignmentUrl';
import messageIds from '../l10n/messageIds';
import TabbedLayout from '../../../utils/layout/TabbedLayout';
import useCallAssignment from '../hooks/useCallAssignment';
import useCallAssignmentStats from '../hooks/useCallAssignmentStats';
import useCallers from '../hooks/useCallers';
import { useNumericRouteParams } from 'core/hooks';
import ZUIDateRangePicker from 'zui/ZUIDateRangePicker/ZUIDateRangePicker';
import ZUIEditTextinPlace from 'zui/ZUIEditTextInPlace';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';
import ZUIFuture from 'zui/ZUIFuture';
import { Msg, useMessages } from 'core/i18n';
import useCallAssignmentState, {
  CallAssignmentState,
} from '../hooks/useCallAssignmentState';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import ChangeCampaignDialog from '../../campaigns/components/ChangeCampaignDialog';

interface CallAssignmentLayoutProps {
  children: React.ReactNode;
}

const CallAssignmentLayout: React.FC<CallAssignmentLayoutProps> = ({
  children,
}) => {
  const messages = useMessages(messageIds);
  const { orgId, callAssId } = useNumericRouteParams();
  const router = useRouter();
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);

  const {
    data: callAssignment,
    end,
    start,
    updateCallAssignment,
    deleteAssignment,
  } = useCallAssignment(orgId, callAssId);
  const { stats } = useCallAssignmentStats(orgId, callAssId);
  const { filteredCallersFuture } = useCallers(orgId, callAssId);
  const state = useCallAssignmentState(orgId, callAssId);
  const { showSnackbar } = useContext(ZUISnackbarContext);
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
  const handleDelete = () => {
    deleteAssignment();
    router.push(
      `/organize/${orgId}/projects/${callAssignment?.campaign?.id || ''} `
    );
  };

  const handleMove = () => {
    setIsMoveDialogOpen(true);
  };

  if (!callAssignment) {
    return null;
  }

  const handleOnCampaignSelected = async (campaignId: number) => {
    const updatedCallAssignment = await updateCallAssignment({
      campaign_id: campaignId,
    });
    await router.push(
      `/organize/${orgId}/projects/${campaignId}/callassignments/${
        callAssignment!.id
      }`
    );
    showSnackbar(
      'success',
      messages.callAssignmentChangeCampaignDialog.success({
        assignmentTitle: updatedCallAssignment.title,
        campaignTitle: updatedCallAssignment.campaign!.title,
      })
    );
  };

  return (
    <TabbedLayout
      actionButtons={
        state == CallAssignmentState.OPEN ||
        state == CallAssignmentState.ACTIVE ? (
          <Button onClick={() => end()} variant="outlined">
            <Msg id={messageIds.actions.end} />
          </Button>
        ) : (
          <Button onClick={() => start()} variant="contained">
            <Msg id={messageIds.actions.start} />
          </Button>
        )
      }
      baseHref={getCallAssignmentUrl(callAssignment)}
      belowActionButtons={
        <ZUIDateRangePicker
          endDate={callAssignment.end_date || null}
          onChange={(startDate, endDate) => {
            updateCallAssignment({
              end_date: endDate,
              start_date: startDate,
            });
          }}
          startDate={callAssignment.start_date || null}
        />
      }
      defaultTab="/"
      ellipsisMenuItems={[
        {
          label: messages.actions.move(),
          onSelect: handleMove,
          startIcon: <ArrowForward />,
        },
        {
          label: messages.actions.delete(),
          onSelect: () => {
            showConfirmDialog({
              onSubmit: handleDelete,
              title: messages.actions.delete(),
              warningText: messages.actions.warning({
                title: callAssignment.title,
              }),
            });
          },
          startIcon: <Delete />,
        },
      ]}
      subtitle={
        <Box alignItems="center" display="flex">
          <Box marginRight={1}>
            <CallAssignmentStatusChip state={state} />
          </Box>
          <Box display="flex" marginX={1}>
            {stats && (
              <>
                <People />
                <Typography marginLeft={1}>
                  <Msg
                    id={messageIds.stats.targets}
                    values={{ numTargets: stats.allTargets ?? 0 }}
                  />
                </Typography>
              </>
            )}
          </Box>
          <Box display="flex" marginX={1}>
            <ZUIFuture
              future={filteredCallersFuture}
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
          <ChangeCampaignDialog
            errorMessage={messages.callAssignmentChangeCampaignDialog.error()}
            onCampaignSelected={handleOnCampaignSelected}
            onClose={() => setIsMoveDialogOpen(false)}
            open={isMoveDialogOpen}
            title={messages.callAssignmentChangeCampaignDialog.title()}
          />
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
      ]}
      title={
        <ZUIEditTextinPlace
          onChange={(newTitle) => updateCallAssignment({ title: newTitle })}
          value={callAssignment.title}
        />
      }
    >
      {children}
    </TabbedLayout>
  );
};
export default CallAssignmentLayout;
