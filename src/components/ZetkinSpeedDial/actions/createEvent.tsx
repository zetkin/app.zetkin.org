/* eslint-disable react/display-name */
import { ACTIONS } from '../constants';
import CreateEventForm from '../../CreateEventForm';
import { Event } from '@material-ui/icons';
import postEvent from '../../../fetching/postEvent';
import { useMutation } from 'react-query';
import { useRouter } from 'next/router';

import { ActionConfig, DialogContentBaseProps } from './types';


const DialogContent: React.FunctionComponent<DialogContentBaseProps> = ({ closeDialog }) => {
    const router = useRouter();
    const { orgId } = router.query as {orgId: string};
    const eventMutation = useMutation(postEvent(orgId));

    const handleCreateEventFormSubmit = (data: Record<string,unknown>) => {
        eventMutation.mutate(data);
        closeDialog();
    };

    return (<CreateEventForm
        onCancel={ closeDialog }
        onSubmit={ handleCreateEventFormSubmit }
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
