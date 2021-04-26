import { dehydrate } from 'react-query/hydration';
import { GetServerSideProps } from 'next';
import { Heading } from '@adobe/react-spectrum';
import { QueryClient } from 'react-query';

import getOrg from '../../../fetching/getOrg';
import OrganizeLayout from '../../../components/layout/OrganizeLayout';
import { PageWithLayout } from '../../../types';
import { scaffold } from '../../../utils/next';

const scaffoldOptions = {
    authLevelRequired: 1,
    localeScope: [
        'layout.organize',
    ],
};

export const getServerSideProps : GetServerSideProps = scaffold(async (context) => {
    const queryClient = new QueryClient();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { orgId } = context.params!;

    await queryClient.prefetchQuery(['org', orgId], getOrg(orgId as string));

    const orgState = queryClient.getQueryState(['org', orgId]);

    if (orgState?.status === 'success') {
        return {
            props: {
                dehydratedState: dehydrate(queryClient),
                orgId,
            },
        };
    }
    else {
        return {
            notFound: true,
        };
    }
}, scaffoldOptions);

type OrganizePageProps = {
    orgId: string;
};

const OrganizePage : PageWithLayout<OrganizePageProps> = () => {

    return (
        <Heading level={ 1 }>
            page content here
        </Heading>
    );
};

OrganizePage.getLayout = function getLayout(page, props) {
    return (
        <OrganizeLayout orgId={ props.orgId as string }>
            { page }
        </OrganizeLayout>
    );
};

export default OrganizePage;
