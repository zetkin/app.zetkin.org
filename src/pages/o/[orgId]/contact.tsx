import { dehydrate } from 'react-query/hydration';
import { GetServerSideProps } from 'next';
import { QueryClient } from 'react-query';

import getOrg from '../../../fetching/getOrg';
import { PageWithLayout } from '../../../types';
import { scaffold } from '../../../utils/next';
import SimpleOrgLayout from '../../../components/layout/SimpleOrgLayout';

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
});

const OrgContactPage : PageWithLayout = () => {
    return (
        <>
            <h1>Test</h1>
        </>
    );
};

OrgContactPage.getLayout = function getLayout(page, props) {
    return (
        <SimpleOrgLayout orgId={ props.orgId as string }>
            { page }
        </SimpleOrgLayout>
    );
};

export default OrgContactPage;