/* eslint-disable react/display-name */
import { ACTIONS } from '../constants';
import CreateEventForm from '../../CreateEventForm';
import { DialogContentBaseProps } from './types';
import { Event } from '@material-ui/icons';
import postEvent from '../../../fetching/postEvent';
import { useMutation } from 'react-query';
import { useRouter } from 'next/router';


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

const actionConfig = {
    icon: <Event />,
    key: ACTIONS.CREATE_EVENT,
    name: 'Create Event',
};

export {
    actionConfig,
    DialogContent,
};
