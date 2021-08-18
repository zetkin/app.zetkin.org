/* eslint-disable react/display-name */
import { Flag } from '@material-ui/icons';
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from 'react-query';

import CampaignForm from 'components/organize/campaigns/forms/CampaignForm';
import postCampaign from 'fetching/postCampaign';

import { ACTIONS } from '../constants';
import { ActionConfig, DialogContentBaseProps } from './types';

const DialogContent: React.FunctionComponent<DialogContentBaseProps> = ({ closeDialog }) => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const { orgId } = router.query as {orgId: string};
    const campaignMutation = useMutation(postCampaign(orgId), {
        onSettled: () => queryClient.invalidateQueries('campaigns'),
    });

    const handleCreateCampaignFormSubmit = async (data: Record<string,unknown>) => {
        const newCampaign = await campaignMutation.mutateAsync(data);

        // Redirect to campaign page
        router.push(`/organize/${orgId}/campaigns/${newCampaign.id}`);
    };

    return (<CampaignForm
        onCancel={ closeDialog }
        onSubmit={ handleCreateCampaignFormSubmit }
    />
    );
};

const config = {
    icon: <Flag />,
    key: ACTIONS.CREATE_CAMPAIGN,
    name: 'misc.speedDial.createCampaign',
    urlKey: 'create-campaign',
} as ActionConfig;

export {
    config,
    DialogContent,
};
