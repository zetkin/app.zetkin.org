import deleteEventResponse from '../fetching/deleteEventResponse';

import putEventResponse from '../fetching/putEventResponse';
import { useMutation, useQueryClient } from 'react-query';

type OnSignup = (eventId: number, orgId: number) => void;
type OnUndoSignup = (eventId: number, orgId: number) => void;

type EventResponses = {
    onSignup: OnSignup;
    onUndoSignup: OnUndoSignup;
};

const useEventResponses = (key : string) : EventResponses => {

    const queryClient = useQueryClient();

    const removeFunc = useMutation(deleteEventResponse, {
        onSettled: () => {
            queryClient.invalidateQueries(key);
        },
    });

    const addFunc = useMutation(putEventResponse, {
        onSettled: () => {
            queryClient.invalidateQueries(key);
        },
    });

    function onSignup(eventId: number, orgId: number) {
        addFunc.mutate({ eventId, orgId });
    }

    function onUndoSignup(eventId: number, orgId: number) {
        removeFunc.mutate({ eventId, orgId });
    }

    return { onSignup, onUndoSignup };
};

export default useEventResponses;
