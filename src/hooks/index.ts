import React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import deleteEventResponse from '../fetching/deleteEventResponse';
import getEventResponses from '../fetching/getEventResponses';
import putEventResponse from '../fetching/putEventResponse';
import { ZetkinEventResponse } from '../types/zetkin';
import { ZetkinUser } from '../interfaces/ZetkinUser';

export const UserContext = React.createContext(null);

export const useUser = () : ZetkinUser | null => {
    return React.useContext(UserContext);
};

type OnEventResponse = (eventId : number, orgId : number, response : boolean) => void;

type EventResponses = {
    eventResponses: ZetkinEventResponse[] | undefined;
    onEventResponse: OnEventResponse;
}

export const useEventResponses = () : EventResponses => {
    const responseQuery = useQuery('eventResponses', getEventResponses());
    const eventResponses = responseQuery.data;

    const queryClient = useQueryClient();

    const removeFunc = useMutation(deleteEventResponse(), {
        onSettled: () => {
            queryClient.invalidateQueries('eventResponses');
        },
    });

    const addFunc = useMutation(putEventResponse(), {
        onSettled: () => {
            queryClient.invalidateQueries('eventResponses');
        },
    });

    function onEventResponse (eventId : number, orgId : number, response : boolean) {
        if (response) {
            removeFunc.mutate({ eventId, orgId });
        }
        else {
            addFunc.mutate({ eventId, orgId });
        }
    }

    return { eventResponses, onEventResponse };
};