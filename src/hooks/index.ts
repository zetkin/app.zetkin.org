import React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import deleteEventResponse from '../fetching/deleteEventResponse';
import deleteUserFollowing from '../fetching/deleteUserFollowing';
import getEventResponses from '../fetching/getEventResponses';
import getRespondEvents from '../fetching/getRespondEvents';
import getUserFollowing from '../fetching/getUserFollowing';
import putEventResponse from '../fetching/putEventResponse';
import putUserFollowing from '../fetching/putUserFollowing';
import { ZetkinEvent, ZetkinEventResponse, ZetkinMembership, ZetkinUser } from '../types/zetkin';

export const UserContext = React.createContext<ZetkinUser | null>(null);

export const useUser = () : ZetkinUser | null => {
    return React.useContext(UserContext);
};

type OnSignup = (eventId : number, orgId : number) => void;
type OnUndoSignup = (eventId : number, orgId : number) => void;

type EventResponses = {
    eventResponses: ZetkinEventResponse[] | undefined;
    onSignup: OnSignup;
    onUndoSignup: OnUndoSignup;
}

export const useEventResponses = () : EventResponses => {
    const responseQuery = useQuery('eventResponses', getEventResponses());
    const eventResponses = responseQuery.data;

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

    function onSignup (eventId : number, orgId : number) {
        addFunc.mutate({ eventId, orgId });
    }

    function onUndoSignup (eventId : number, orgId : number) {
        removeFunc.mutate({ eventId, orgId });
    }

    return { eventResponses, onSignup, onUndoSignup };
};

type RespondEvents = {
    onUndoSignup: OnUndoSignup;
    respondEvents: ZetkinEvent[] | undefined;
}

export const useRespondEvents = () : RespondEvents => {
    const respondEventsQuery = useQuery('respondEvents', getRespondEvents());
    const respondEvents = respondEventsQuery.data;

    const queryClient = useQueryClient();

    const removeFunc = useMutation(deleteEventResponse, {
        onSettled: () => {
            queryClient.invalidateQueries('respondEvents');
        },
    });

    function onUndoSignup (eventId : number, orgId : number) {
        removeFunc.mutate({ eventId, orgId });
    }

    return { onUndoSignup, respondEvents };
};

type OnFollow = (orgId : number) => void;
type OnUnfollow = (orgId : number) => void;

type UserFollowing = {
    following: ZetkinMembership[] | undefined;
    onFollow: OnFollow;
    onUnfollow: OnUnfollow;
}

export const useUserFollowing = () : UserFollowing => {
    const followingQuery = useQuery('following', getUserFollowing());
    const following = followingQuery.data;

    const queryClient = useQueryClient();

    const removeFunc = useMutation(deleteUserFollowing, {
        onSettled: () => {
            queryClient.invalidateQueries('following');
        },
    });

    const addFunc = useMutation(putUserFollowing, {
        onSettled: () => {
            queryClient.invalidateQueries('following');
        },
    });

    function onUnfollow (orgId : number) {
        removeFunc.mutate(orgId);
    }

    function onFollow (orgId : number) {
        addFunc.mutate(orgId);
    }

    return { following, onFollow, onUnfollow };
};

type EventsFilter = {
    later: ZetkinEvent[] | undefined;
    today: ZetkinEvent[] | undefined;
    tomorrow: ZetkinEvent[] | undefined;
    week: ZetkinEvent[] | undefined;
}

export const useEventsFilter = (events : ZetkinEvent[] | undefined) : EventsFilter => {
    function sliceString(string : string) {
        return string.slice(0, 10);
    }

    function newDate(days? : number) {
        const today = new Date();

        if (days) {
            today.setDate(today.getDate() + days);
        }

        const date = sliceString(today.toISOString());
        return date;
    }

    const today = events?.filter(event =>
        sliceString(event.start_time) === newDate());

    const tomorrow = events?.filter(event =>
        sliceString(event.start_time) === newDate(1));

    const week = events?.filter(event =>
        sliceString(event.start_time) <= newDate(7)
        && sliceString(event.start_time) >= newDate());

    const later = events?.filter(event =>
        sliceString(event.start_time) > newDate(7));

    return { later, today, tomorrow, week };
};
