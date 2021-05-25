import React, { useState } from 'react';
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

type CalendarNavigation = {
    goBackAMonth: () => void;
    goBackAWeek: () => void;
    goFwdAMonth: () => void;
    goFwdAWeek: () => void;
    selectedMonday: Date;
    selectedMonth: number;
    selectedYear: number;
}

export const useFocusDate = (): CalendarNavigation => {
    const [focusDate, setFocusDate] = useState(new Date(Date.now()));

    const selectedMonday = new Date(
        new Date(focusDate).setDate(
            new Date(focusDate).getDate() - new Date(focusDate).getDay() + 1,
        ),
    );
    selectedMonday.setUTCHours(0, 0, 0, 0);

    const selectedMonth = new Date(focusDate).getUTCMonth();
    const selectedYear = new Date(focusDate).getUTCFullYear();

    const goBackAMonth = () => {
        setFocusDate(
            new Date(new Date(focusDate).setDate(focusDate.getDate() - 30)),
        );
    };

    const goFwdAMonth = () => {
        setFocusDate(
            new Date(new Date(focusDate).setDate(focusDate.getDate() + 30)),
        );
    };

    const goBackAWeek = () => {
        setFocusDate(
            new Date(new Date(focusDate).setDate(focusDate.getDate() - 7)),
        );
    };

    const goFwdAWeek = () => {
        setFocusDate(
            new Date(new Date(focusDate).setDate(focusDate.getDate() + 7)),
        );
    };

    return { goBackAMonth, goBackAWeek, goFwdAMonth, goFwdAWeek, selectedMonday, selectedMonth, selectedYear };
};