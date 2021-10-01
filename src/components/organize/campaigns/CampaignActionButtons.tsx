/* eslint-disable react-hooks/exhaustive-deps */
import { Alert } from '@material-ui/lab';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Box, Button, Menu, MenuItem } from '@material-ui/core';
import { Delete, Settings } from '@material-ui/icons';
import { FormattedMessage, FormattedMessage as Msg, useIntl } from 'react-intl';
import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';


import CampaignDeleteForm from 'components/forms/CampaignDeleteForm';
import CampaignDetailsForm from 'components/forms/CampaignDetailsForm';
import deleteCampaign from 'fetching/campaigns/deleteCampaign';
import patchCampaign from 'fetching/campaigns/patchCampaign';
import { ZetkinCampaign } from 'types/zetkin';
import ZetkinDialog from 'components/ZetkinDialog';

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
    // Menu
    const [menuActivator, setMenuActivator] = React.useState<null | HTMLElement>(null);
    // Dialogs
    const [currentOpenDialog, setCurrentOpenDialog] = useState<CAMPAIGN_MENU_ITEMS>();
    const closeDialog = () => setCurrentOpenDialog(undefined);

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
        deleteCampaignMutation.mutate();
        closeDialog();
        // Navigate back to campaign page
        router.push(`/organize/${orgId as string}/campaigns`);
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
                <Button
                    color="secondary"
                    data-testid="campaign-action-buttons-menu-activator"
                    disableElevation
                    onClick={ (e) => setMenuActivator(e.currentTarget) }
                    variant="contained">
                    <Settings />
                </Button>
            </Box>
            <Menu
                anchorEl={ menuActivator }
                keepMounted
                onClose={ () => setMenuActivator(null) }
                open={ Boolean(menuActivator) }>
                { /* Edit Campaign */ }
                <MenuItem
                    key={ CAMPAIGN_MENU_ITEMS.EDIT_CAMPAIGN }
                    data-testid="campaign-action-buttons-edit-campaign"
                    onClick={ () => {
                        setMenuActivator(null);
                        setCurrentOpenDialog(CAMPAIGN_MENU_ITEMS.EDIT_CAMPAIGN);
                    } }>
                    <Box mr={ 1 }><Settings /></Box>
                    <Msg id="misc.formDialog.campaign.edit" />
                </MenuItem>
                { /* Delete Task */ }
                <MenuItem
                    key={ CAMPAIGN_MENU_ITEMS.DELETE_CAMPAIGN }
                    onClick={ () => {
                        setMenuActivator(null);
                        setCurrentOpenDialog(CAMPAIGN_MENU_ITEMS.DELETE_CAMPAIGN);
                    } }>
                    <Box mr={ 1 }><Delete /></Box>
                    <Msg id="misc.formDialog.campaign.deleteCampaign.title" />
                </MenuItem>
            </Menu>
            { /* Dialogs */ }
            <ZetkinDialog
                onClose={ closeDialog }
                open={ currentOpenDialog === CAMPAIGN_MENU_ITEMS.EDIT_CAMPAIGN }
                title={ intl.formatMessage({ id: 'misc.formDialog.campaign.edit' }) }>
                {
                    patchCampaignMutation.isError &&
                    <Alert color="error" data-testid="error-alert">
                        <FormattedMessage id="misc.formDialog.requestError" />
                    </Alert>
                }
                <CampaignDetailsForm campaign={ campaign } onCancel={ closeDialog } onSubmit={ handleEditCampaign }/>
            </ZetkinDialog>
            <ZetkinDialog
                onClose={ closeDialog }
                open={ currentOpenDialog === CAMPAIGN_MENU_ITEMS.DELETE_CAMPAIGN }
                title={ intl.formatMessage({ id: 'misc.formDialog.campaign.deleteCampaign.title' }) }>
                <CampaignDeleteForm onCancel={ closeDialog } onSubmit={ handleDeleteCampaign } />
            </ZetkinDialog>
        </Box>
    );
};

export default CampaignActionButtons;
