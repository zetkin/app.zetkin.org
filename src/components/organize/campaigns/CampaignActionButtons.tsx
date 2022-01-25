/* eslint-disable react-hooks/exhaustive-deps */
import { Alert } from '@material-ui/lab';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Box, Button } from '@material-ui/core';
import { Delete, Settings } from '@material-ui/icons';
import { FormattedMessage as Msg, useIntl } from 'react-intl';
import React, { useContext, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import CampaignDetailsForm from 'components/forms/CampaignDetailsForm';
import { ConfirmDialogContext } from 'hooks/ConfirmDialogProvider';
import deleteCampaign from 'fetching/campaigns/deleteCampaign';
import patchCampaign from 'fetching/campaigns/patchCampaign';
import SnackbarContext from 'hooks/SnackbarContext';
import { ZetkinCampaign } from 'types/zetkin';
import ZetkinDialog from 'components/ZetkinDialog';
import ZetkinEllipsisMenu from 'components/ZetkinEllipsisMenu';

enum CAMPAIGN_MENU_ITEMS {
    EDIT_CAMPAIGN = 'editCampaign',
    DELETE_CAMPAIGN = 'deleteCampaign'
}

interface CampaignActionButtonsProps {
    campaign: ZetkinCampaign;
}

const CampaignActionButtons: React.FunctionComponent<CampaignActionButtonsProps> = ({ campaign }) => {
    const intl = useIntl();
    const queryClient = useQueryClient();
    const router = useRouter();
    const { orgId } = router.query;
    // Dialogs
    const { showSnackbar } = useContext(SnackbarContext);
    const { showConfirmDialog } = useContext(ConfirmDialogContext);
    const [editCampaignDialogOpen, setEditCampaignDialogOpen] = useState(false);
    const closeDialog = () => setEditCampaignDialogOpen(false);

    // Mutations
    const patchCampaignMutation = useMutation(patchCampaign(orgId as string, campaign.id));
    const deleteCampaignMutation = useMutation(deleteCampaign(orgId as string, campaign.id));

    // Event Handlers
    const handleEditCampaign = (campaign: Partial<ZetkinCampaign>) => {
        patchCampaignMutation.mutate(campaign, {
            onSettled: () => queryClient.invalidateQueries(['campaign' ]),
            onSuccess: () => closeDialog(),
        });
    };
    const handleDeleteCampaign = () => {
        deleteCampaignMutation.mutate(undefined, {
            onError: () => showSnackbar(
                'error',
                intl.formatMessage({ id: 'misc.formDialog.campaign.deleteCampaign.error' }),
            ),
            onSuccess: () => {
                router.push(`/organize/${orgId as string}/campaigns`);
            },
        });
    };

    return (
        <Box display="flex">
            <Box mr={ 1 }>
                <Link href={ `/o/${orgId}/campaigns/${campaign.id}` } passHref>
                    <Button color="primary">
                        <Msg id="pages.organizeCampaigns.linkGroup.public"/>
                    </Button>
                </Link>
            </Box>
            <Box>
                <ZetkinEllipsisMenu items={ [
                    {
                        id: CAMPAIGN_MENU_ITEMS.EDIT_CAMPAIGN,
                        label: (
                            <>
                                <Box mr={ 1 }><Settings /></Box>
                                <Msg id="misc.formDialog.campaign.edit" />
                            </>
                        ),
                        onSelect: () => setEditCampaignDialogOpen(true),
                    },
                    {
                        id: CAMPAIGN_MENU_ITEMS.DELETE_CAMPAIGN,
                        label: (
                            <>
                                <Box mr={ 1 }><Delete /></Box>
                                <Msg id="misc.formDialog.campaign.deleteCampaign.title" />
                            </>
                        ),
                        onSelect: () => {
                            showConfirmDialog({
                                onSubmit: handleDeleteCampaign,
                                title: intl.formatMessage({ id: 'misc.formDialog.campaign.deleteCampaign.title' }),
                                warningText: intl.formatMessage({ id: 'misc.formDialog.campaign.deleteCampaign.warning' }),
                            });
                        },
                    },
                ] }
                />
            </Box>
            <ZetkinDialog
                onClose={ closeDialog }
                open={ editCampaignDialogOpen }
                title={ intl.formatMessage({ id: 'misc.formDialog.campaign.edit' }) }>
                {
                    patchCampaignMutation.isError &&
                    <Alert color="error" data-testid="error-alert">
                        <Msg id="misc.formDialog.requestError" />
                    </Alert>
                }
                <CampaignDetailsForm campaign={ campaign } onCancel={ closeDialog } onSubmit={ handleEditCampaign }/>
            </ZetkinDialog>
        </Box>
    );
};

export default CampaignActionButtons;
