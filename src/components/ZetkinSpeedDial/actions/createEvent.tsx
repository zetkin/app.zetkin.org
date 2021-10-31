/* eslint-disable react/display-name */
import { ACTIONS } from '../constants';
import { Event } from '@mui/icons-material';
import EventDetailsForm from 'components/forms/EventDetailsForm';
import postEvent from '../../../fetching/postEvent';
import { useMutation } from 'react-query';
import { useRouter } from 'next/router';
import { ActionConfig, DialogContentBaseProps } from './types';


const DialogContent: React.FunctionComponent<DialogContentBaseProps> = ({ closeDialog }) => {
    const router = useRouter();
    const { orgId } = router.query as {orgId: string};
    const eventMutation = useMutation(postEvent(orgId));

    const handleEventDetailsFormSubmit = (data: Record<string,unknown>) => {
        eventMutation.mutate(data);
        closeDialog();
    };

    return (<EventDetailsForm
        onCancel={ closeDialog }
        onSubmit={ handleEventDetailsFormSubmit }
        orgId={ orgId }
    />
    );
};

const config = {
    icon: <Event />,
    key: ACTIONS.CREATE_EVENT,
    name: 'misc.speedDial.createEvent',
    urlKey: 'create-event',
} as ActionConfig;

export {
    config,
    DialogContent,
};
