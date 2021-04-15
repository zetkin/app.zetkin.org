import React from 'react';
import { useMutation, useQueryClient } from 'react-query';

import deleteEventResponse from '../fetching/deleteEventResponse';
import putEventResponse from '../fetching/putEventResponse';
import { ZetkinUser } from '../interfaces/ZetkinUser';

export const UserContext = React.createContext(null);

export const useUser = () : ZetkinUser | null => {
    return React.useContext(UserContext);
};

type OnEventResponse = (eventId : number, orgId : number, response : boolean) => void;

export const useOnEventResponse = () : OnEventResponse => {
    const queryClient = useQueryClient();

    const removeFunc = useMutation(deleteEventResponse, {
        onSettled: () => {
            queryClient.invalidateQueries('eventResponses');
        },
    });

    const addFunc = useMutation(putEventResponse, {
        onSettled: () => {
            queryClient.invalidateQueries('eventResponses');
        },
    });

    return (eventId : number, orgId : number, response : boolean) => {
        if (response) {
            removeFunc.mutate({ eventId, orgId });
            return;
        }
        addFunc.mutate({ eventId, orgId });
    };
};
