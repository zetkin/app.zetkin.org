import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import { Alert, Link } from '@mui/material';
import {
  AssignmentOutlined,
  CheckBoxOutlined,
  Delete,
  Event,
  HeadsetMic,
  OpenInNew,
  Settings,
} from '@mui/icons-material';
import React, { useContext, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import CampaignDataModel from '../models/CampaignDataModel';
import CampaignDetailsForm from 'features/campaigns/components/CampaignDetailsForm';
import { DialogContent as CreateTaskDialogContent } from 'zui/ZUISpeedDial/actions/createTask';
import deleteCampaign from 'features/campaigns/fetching/deleteCampaign';
import patchCampaign from 'features/campaigns/fetching/patchCampaign';
import useModel from 'core/useModel';
import { ZetkinCampaign } from 'utils/types/zetkin';
import ZUIButtonMenu from 'zui/ZUIButtonMenu';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import ZUIDialog from 'zui/ZUIDialog';
import ZUIEllipsisMenu from 'zui/ZUIEllipsisMenu';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';
import { Msg, useMessages } from 'core/i18n';

import messageIds from '../l10n/messageIds';
import useEventMutations from 'features/events/hooks/useEventMutations';
import { useNumericRouteParams } from 'core/hooks';

enum CAMPAIGN_MENU_ITEMS {
  EDIT_CAMPAIGN = 'editCampaign',
  DELETE_CAMPAIGN = 'deleteCampaign',
  SHOW_PUBLIC_PAGE = 'showPublicPage',
}

interface CampaignActionButtonsProps {
  campaign: ZetkinCampaign;
}

const CampaignActionButtons: React.FunctionComponent<
  CampaignActionButtonsProps
> = ({ campaign }) => {
  const messages = useMessages(messageIds);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { orgId } = useNumericRouteParams();
  // Dialogs
  const { showSnackbar } = useContext(ZUISnackbarContext);
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);
  const [editCampaignDialogOpen, setEditCampaignDialogOpen] = useState(false);
  const [createTaskDialogOpen, setCreateTaskDialogOpen] = useState(false);
  const closeEditCampaignDialog = () => setEditCampaignDialogOpen(false);
  const closeCreateTaskDialog = () => setCreateTaskDialogOpen(false);

  const model = useModel(
    (env) => new CampaignDataModel(env, orgId, campaign.id)
  );

  const { createEvent } = useEventMutations(orgId);

  // Mutations
  const patchCampaignMutation = useMutation(patchCampaign(orgId, campaign.id));
  const deleteCampaignMutation = useMutation(
    deleteCampaign(orgId, campaign.id)
  );

  // Event Handlers
  const handleEditCampaign = (campaign: Partial<ZetkinCampaign>) => {
    patchCampaignMutation.mutate(campaign, {
      onSettled: () => queryClient.invalidateQueries(['campaign']),
      onSuccess: () => closeEditCampaignDialog(),
    });
  };
  const handleDeleteCampaign = () => {
    deleteCampaignMutation.mutate(undefined, {
      onError: () =>
        showSnackbar('error', messages.form.deleteCampaign.error()),
      onSuccess: () => {
        router.push(`/organize/${orgId}/projects`);
      },
    });
  };

  const handleCreateEvent = () => {
    const defaultStart = new Date();
    defaultStart.setDate(defaultStart.getDate() + 1);
    defaultStart.setMinutes(0);
    defaultStart.setSeconds(0);
    defaultStart.setMilliseconds(0);

    const defaultEnd = new Date(defaultStart.getTime() + 60 * 60 * 1000);

    createEvent({
      activity_id: null,
      campaign_id: campaign.id,
      end_time: defaultEnd.toISOString(),
      location_id: null,
      start_time: defaultStart.toISOString(),
    });
  };
  const handleCreateCallAssignment = () => {
    const assignment = {
      goal_filters: [],
      target_filters: [],
      title: messages.form.createCallAssignment.newCallAssignment(),
    };
    model.createCallAssignment(assignment);
  };
  const handleCreateSurvey = () => {
    model.createSurvey({
      signature: 'require_signature',
      title: messages.form.createSurvey.newSurvey(),
    });
  };
  const handleCreateTask = () => {
    // Open the creat task dialog
    setCreateTaskDialogOpen(true);
  };

  return (
    <Box display="flex" gap={1}>
      <Box>
        <ZUIButtonMenu
          items={[
            {
              icon: <Event />,
              label: messages.linkGroup.createEvent(),
              onClick: handleCreateEvent,
            },
            {
              icon: <HeadsetMic />,
              label: messages.linkGroup.createCallAssignment(),
              onClick: handleCreateCallAssignment,
            },
            {
              icon: <AssignmentOutlined />,
              label: messages.linkGroup.createSurvey(),
              onClick: handleCreateSurvey,
            },
            {
              icon: <CheckBoxOutlined />,
              label: messages.linkGroup.createTask(),
              onClick: handleCreateTask,
            },
          ]}
          label={messages.linkGroup.createActivity()}
        />
      </Box>
      <Box>
        <ZUIEllipsisMenu
          items={[
            {
              id: CAMPAIGN_MENU_ITEMS.EDIT_CAMPAIGN,
              label: (
                <>
                  <Settings />
                  <Msg id={messageIds.form.edit} />
                </>
              ),
              onSelect: () => setEditCampaignDialogOpen(true),
            },
            {
              id: CAMPAIGN_MENU_ITEMS.DELETE_CAMPAIGN,
              label: (
                <>
                  <Delete />
                  <Msg id={messageIds.form.deleteCampaign.title} />
                </>
              ),
              onSelect: () => {
                showConfirmDialog({
                  onSubmit: handleDeleteCampaign,
                  title: messages.form.deleteCampaign.title(),
                  warningText: messages.form.deleteCampaign.warning(),
                });
              },
            },
            {
              id: CAMPAIGN_MENU_ITEMS.SHOW_PUBLIC_PAGE,
              label: (
                <>
                  <OpenInNew />
                  <Link
                    color="inherit"
                    display="flex"
                    href={`https://www.zetk.in/o/${orgId}/campaigns/${campaign.id}`}
                    sx={{ alignItems: 'center', gap: 1 }}
                    target="_blank"
                    underline="none"
                  >
                    {<Msg id={messageIds.singleProject.showPublicPage} />}
                  </Link>
                </>
              ),
              onSelect: () => {
                // Do nothing, but without this, the menu will not close
              },
            },
          ]}
        />
      </Box>
      <ZUIDialog
        onClose={closeEditCampaignDialog}
        open={editCampaignDialogOpen}
        title={messages.form.edit()}
      >
        {patchCampaignMutation.isError && (
          <Alert color="error" data-testid="error-alert">
            <Msg id={messageIds.form.requestError} />
          </Alert>
        )}
        <CampaignDetailsForm
          campaign={campaign}
          onCancel={closeEditCampaignDialog}
          onSubmit={handleEditCampaign}
        />
      </ZUIDialog>
      <ZUIDialog
        onClose={() => {
          closeCreateTaskDialog();
        }}
        open={createTaskDialogOpen}
        title={messages.form.createTask.title()}
      >
        <CreateTaskDialogContent
          closeDialog={() => {
            closeCreateTaskDialog();
          }}
        />
      </ZUIDialog>
    </Box>
  );
};

export default CampaignActionButtons;
