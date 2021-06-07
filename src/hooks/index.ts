import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import deleteEventResponse from '../fetching/deleteEventResponse';
import deleteUserFollowing from '../fetching/deleteUserFollowing';
import getUserFollowing from '../fetching/getUserFollowing';
import putEventResponse from '../fetching/putEventResponse';
import putUserFollowing from '../fetching/putUserFollowing';
import { ZetkinMembership, ZetkinUser } from '../types/zetkin';

export const UserContext = React.createContext<ZetkinUser | null>(null);

export const useUser = (): ZetkinUser | null => {
    return React.useContext(UserContext);
};

type OnSignup = (eventId: number, orgId: number) => void;
type OnUndoSignup = (eventId: number, orgId: number) => void;

type EventResponses = {
    onSignup: OnSignup;
    onUndoSignup: OnUndoSignup;
};

export const useEventResponses = (key : string) : EventResponses => {

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

type OnFollow = (orgId: number) => void;
type OnUnfollow = (orgId: number) => void;

type UserFollowing = {
    following: ZetkinMembership[] | undefined;
    onFollow: OnFollow;
    onUnfollow: OnUnfollow;
};

export const useUserFollowing = (): UserFollowing => {
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

    function onUnfollow(orgId: number) {
        removeFunc.mutate(orgId);
    }

    function onFollow(orgId: number) {
        addFunc.mutate(orgId);
    }

    return { following, onFollow, onUnfollow };
};

type focusDateState = {
    focusDate: Date;
    setFocusDate: (date: Date) => void;
};

export const useFocusDate = (): focusDateState => {
    const [focusDate, setFocusDate] = useState(new Date(Date.now()));
    return { focusDate, setFocusDate };
};
