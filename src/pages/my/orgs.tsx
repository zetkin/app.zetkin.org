import { GetServerSideProps } from 'next';
import { Heading } from '@adobe/react-spectrum';
import { FormattedMessage as Msg } from 'react-intl';

import getUserFollowing from '../../fetching/getUserFollowing';
import MyHomeLayout from '../../components/layout/MyHomeLayout';
import { PageWithLayout } from '../../types';
import { scaffold } from '../../utils/next';
import UserFollowingList from '../../components/UserFollowingList';
import { useUserFollowing } from '../../hooks';

const scaffoldOptions = {
    authLevelRequired: 1,
    localeScope: [
        'layout.my',
        'misc.publicHeader',
        'pages.myOrgs',
    ],
};

export const getServerSideProps : GetServerSideProps = scaffold(async (context) => {
    const { user } = context;

    if (user) {
        await context.queryClient.prefetchQuery('following', getUserFollowing(context.apiFetch));

        return {
            props: {},
        };
    }
    else {
        return {
            notFound: true,
        };
    }
}, scaffoldOptions);

const MyOrgsPage : PageWithLayout = () => {

    const { following, onUnfollow } = useUserFollowing();

    return (
        <>
            <Heading level={ 1 }>
                <Msg id="pages.myOrgs.heading"/>
            </Heading>
            <UserFollowingList
                following={ following }
                onUnfollow={ onUnfollow }
            />
        </>
    );
};

MyOrgsPage.getLayout = function getLayout(page) {
    return (
        <MyHomeLayout>
            { page }
        </MyHomeLayout>
    );
};

export default MyOrgsPage;