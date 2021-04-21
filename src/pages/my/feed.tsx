import { GetServerSideProps } from 'next';
import { Heading } from '@adobe/react-spectrum';
import { FormattedMessage as Msg } from 'react-intl';

import { PageWithLayout } from '../../types';
import { scaffold } from '../../utils/next';
import UserHomeLayout from '../../components/layout/UserHomeLayout';
import { ZetkinUser } from '../../interfaces/ZetkinUser';

const scaffoldOptions = {
    localeScope: [
        'layout.userHome',
        'misc.publicHeader',
        'pages.my.feed',
    ],
};

export const getServerSideProps : GetServerSideProps = scaffold(async () => {
    return {
        props: {},
    };
}, scaffoldOptions);

interface FeedProps {
    user: ZetkinUser;
}

const Feed : PageWithLayout<FeedProps> = (props) => {
    const { user } = props;

    return (
        <Heading level={ 1 }>
            <Msg id="pages.my.feed.welcome" values={{ userName: user.first_name }}/>
        </Heading>
    );
};

Feed.getLayout = function getLayout(page) {
    return (
        <UserHomeLayout>
            { page }
        </UserHomeLayout>
    );
};

export default Feed;