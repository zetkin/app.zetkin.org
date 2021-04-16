import { dehydrate } from 'react-query/hydration';
import { GetServerSideProps } from 'next';
import { Heading } from '@adobe/react-spectrum';
import { FormattedMessage as Msg } from 'react-intl';
import { QueryClient } from 'react-query';

import { scaffold } from '../utils/next';
import { ZetkinUser } from '../interfaces/ZetkinUser';

const scaffoldOptions = {
    localeScope: ['pages.my'],
};

export const getServerSideProps : GetServerSideProps = scaffold(async (ctx) => {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery('userActionResponses', async () => {
        const res = await ctx.apiFetch('/users/me/action_responses');
        const data = await res.json();
        return data;
    });

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
        },
    };
}, scaffoldOptions);

interface MyPageProps {
    user: ZetkinUser;
}

export default function MyPage({ user } : MyPageProps) : JSX.Element {
    return (
        <Heading level={ 1 }>
            <Msg id="pages.my.welcome" values={{ userName: user.first_name }}/>
        </Heading>
    );
}