import { Alert } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Box, Button } from '@mui/material';
import { Delete, Settings } from '@mui/icons-material';
import React, { useContext, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import CampaignDetailsForm from 'features/campaigns/components/CampaignDetailsForm';
import deleteCampaign from 'features/campaigns/fetching/deleteCampaign';
import patchCampaign from 'features/campaigns/fetching/patchCampaign';
import { ZetkinCampaign } from 'utils/types/zetkin';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import ZUIDialog from 'zui/ZUIDialog';
import ZUIEllipsisMenu from 'zui/ZUIEllipsisMenu';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';
import { Msg, useMessages } from 'core/i18n';

import messageIds from '../l10n/messageIds';

enum CAMPAIGN_MENU_ITEMS {
  EDIT_CAMPAIGN = 'editCampaign',
  DELETE_CAMPAIGN = 'deleteCampaign',
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
  const { orgId } = router.query;
  // Dialogs
  const { showSnackbar } = useContext(ZUISnackbarContext);
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);
  const [editCampaignDialogOpen, setEditCampaignDialogOpen] = useState(false);
  const closeDialog = () => setEditCampaignDialogOpen(false);

  // Mutations
  const patchCampaignMutation = useMutation(
    patchCampaign(orgId as string, campaign.id)
  );
  const deleteCampaignMutation = useMutation(
    deleteCampaign(orgId as string, campaign.id)
  );

  // Event Handlers
  const handleEditCampaign = (campaign: Partial<ZetkinCampaign>) => {
    patchCampaignMutation.mutate(campaign, {
      onSettled: () => queryClient.invalidateQueries(['campaign']),
      onSuccess: () => closeDialog(),
    });
  };
  const handleDeleteCampaign = () => {
    deleteCampaignMutation.mutate(undefined, {
      onError: () =>
        showSnackbar('error', messages.form.deleteCampaign.error()),
      onSuccess: () => {
        router.push(`/organize/${orgId as string}/campaigns`);
      },
    });
  };

  return (
    <Box display="flex">
      <Box mr={1}>
        <Link href={`/o/${orgId}/campaigns/${campaign.id}`} passHref>
          <Button color="primary">
            <Msg id={messageIds.linkGroup.public} />
          </Button>
        </Link>
      </Box>
      <Box>
        <ZUIEllipsisMenu
          items={[
            {
              id: CAMPAIGN_MENU_ITEMS.EDIT_CAMPAIGN,
              label: (
                <>
                  <Box mr={1}>
                    <Settings />
                  </Box>
                  <Msg id={messageIds.form.edit} />
                </>
              ),
              onSelect: () => setEditCampaignDialogOpen(true),
            },
            {
              id: CAMPAIGN_MENU_ITEMS.DELETE_CAMPAIGN,
              label: (
                <>
                  <Box mr={1}>
                    <Delete />
                  </Box>
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
          ]}
        />
      </Box>
      <ZUIDialog
        onClose={closeDialog}
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
          onCancel={closeDialog}
          onSubmit={handleEditCampaign}
        />
      </ZUIDialog>
    </Box>
  );
};

export default CampaignActionButtons;
