
import { useMutation, useQuery, useQueryClient } from 'react-query';

import deleteUserFollowing from '../fetching/deleteUserFollowing';
import getUserFollowing from '../fetching/getUserFollowing';
import putUserFollowing from '../fetching/putUserFollowing';
import { ZetkinMembership } from '../types/zetkin';

type OnFollow = (orgId: number) => void;
type OnUnfollow = (orgId: number) => void;

type UserFollowing = {
    following: ZetkinMembership[] | undefined;
    onFollow: OnFollow;
    onUnfollow: OnUnfollow;
};

const useUserFollowing = (): UserFollowing => {
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

export default useUserFollowing;
