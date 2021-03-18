import { GetServerSideProps } from 'next';
import { Heading } from '@adobe/react-spectrum';
import { FormattedMessage as Msg } from 'react-intl';

import { scaffold } from '../utils/next';
import { ZetkinUser } from '../interfaces/ZetkinUser';

const scaffoldOptions = {
    localeScope: ['pages.my'],
};

export const getServerSideProps : GetServerSideProps = scaffold(async () => {
    return {
        props: {},
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