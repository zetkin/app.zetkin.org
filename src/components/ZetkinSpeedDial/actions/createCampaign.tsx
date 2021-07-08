
/* eslint-disable react/display-name */
import { ACTIONS } from '../constants';
import CreateCampaignForm from '../../CreateCampaignForm';
import { DialogContentBaseProps } from './types';
import { Flag } from '@material-ui/icons';
import postCampaign from '../../../fetching/postCampaign';
import { useMutation } from 'react-query';
import { useRouter } from 'next/router';


const DialogContent: React.FunctionComponent<DialogContentBaseProps> = ({ closeDialog }) => {
    const router = useRouter();
    const { orgId } = router.query as {orgId: string};
    const eventMutation = useMutation(postCampaign(orgId));

    const handleFormSubmit = (data: Record<string,unknown>) => {
        eventMutation.mutate(data);
        closeDialog();
    };

    return (
        <CreateCampaignForm onCancel={ closeDialog } onSubmit={ handleFormSubmit }/>
    );
};

const config = {
    icon: <Flag />,
    key: ACTIONS.CREATE_CAMPAIGN,
    name: 'misc.speedDial.createCampaign',
};

export {
    config,
    DialogContent,
};
