import { GetServerSideProps } from 'next';
import { Heading } from '@adobe/react-spectrum';
import { FormattedMessage as Msg } from 'react-intl';

import { scaffold } from '../utils/next';
import { ZetkinUser } from '../interfaces/ZetkinUser';

export const getServerSideProps : GetServerSideProps = scaffold(async () => {
    return {
        props: {},
    };
});

interface MyPageProps {
    user: ZetkinUser;
}

export default function MyPage({ user } : MyPageProps) : JSX.Element {
    return (
        <Heading level={ 1 }>
            <Msg id="pages.my.welcome"/>, { user.first_name }
        </Heading>
    );
}