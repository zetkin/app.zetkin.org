import { GetServerSideProps } from 'next';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { PageWithLayout } from '../../types';
import { scaffold } from '../../utils/next';
import UserHomeLayout from '../../components/layout/UserHomeLayout';

const scaffoldOptions = {
    localeScope: [
        'layout.userHome',
        'misc.publicHeader',
    ],
};

export const getServerSideProps : GetServerSideProps = scaffold(async () => {
    return {
        props: {},
    };
}, scaffoldOptions);

const MyPage : PageWithLayout = () => {

    const router = useRouter();

    useEffect(() => {
        router.push(`/my/feed`);
    }, [router]);

    return (
        <></>
    );
};

MyPage.getLayout = function getLayout(page) {
    return (
        <UserHomeLayout>
            { page }
        </UserHomeLayout>
    );
};

export default MyPage;