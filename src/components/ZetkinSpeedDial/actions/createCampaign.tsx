/* eslint-disable react/display-name */
import { Alert } from '@material-ui/lab';
import { Flag } from '@material-ui/icons';
import { FormattedMessage } from 'react-intl';
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from 'react-query';

import CampaignDetailsForm from 'components/forms/CampaignDetailsForm';
import postCampaign from 'fetching/postCampaign';

import { ACTIONS } from '../constants';
import { ActionConfig, DialogContentBaseProps } from './types';

const DialogContent: React.FunctionComponent<DialogContentBaseProps> = ({ closeDialog }) => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const { orgId } = router.query as {orgId: string};

    const { mutateAsync: sendCampaignRequest, isError } = useMutation(postCampaign(orgId));

    const handleFormSubmit = async (data: Record<string,unknown>) => {
        await sendCampaignRequest(data, {
            onSuccess: async (newCampaign) => {
                queryClient.invalidateQueries('campaigns');
                closeDialog();
                // Redirect to campaign page
                router.push(`/organize/${orgId}/campaigns/${newCampaign.id}`);
            },
        });

    };

    return (
        <>
            { isError &&
                <Alert color="error" data-testid="error-alert">
                    <FormattedMessage id="misc.formDialog.requestError" />
                </Alert>
            }
            <CampaignDetailsForm
                onCancel={ closeDialog }
                onSubmit={ handleFormSubmit }
            />
        </>
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
