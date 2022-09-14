import { Alert } from '@material-ui/lab';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Box, Button } from '@material-ui/core';
import { Delete, Settings } from '@material-ui/icons';
import { FormattedMessage as Msg, useIntl } from 'react-intl';
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
  const intl = useIntl();
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
        showSnackbar(
          'error',
          intl.formatMessage({
            id: 'misc.formDialog.campaign.deleteCampaign.error',
          })
        ),
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
            <Msg id="pages.organizeCampaigns.linkGroup.public" />
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
                  <Msg id="misc.formDialog.campaign.edit" />
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
                  <Msg id="misc.formDialog.campaign.deleteCampaign.title" />
                </>
              ),
              onSelect: () => {
                showConfirmDialog({
                  onSubmit: handleDeleteCampaign,
                  title: intl.formatMessage({
                    id: 'misc.formDialog.campaign.deleteCampaign.title',
                  }),
                  warningText: intl.formatMessage({
                    id: 'misc.formDialog.campaign.deleteCampaign.warning',
                  }),
                });
              },
            },
          ]}
        />
      </Box>
      <ZUIDialog
        onClose={closeDialog}
        open={editCampaignDialogOpen}
        title={intl.formatMessage({
          id: 'misc.formDialog.campaign.edit',
        })}
      >
        {patchCampaignMutation.isError && (
          <Alert color="error" data-testid="error-alert">
            <Msg id="misc.formDialog.requestError" />
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
