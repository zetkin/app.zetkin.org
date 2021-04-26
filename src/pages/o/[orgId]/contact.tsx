import { GetServerSideProps } from 'next';

import DefaultOrgLayout from '../../../components/layout/DefaultOrgLayout';
import getOrg from '../../../fetching/getOrg';
import { PageWithLayout } from '../../../types';
import { scaffold } from '../../../utils/next';

export const getServerSideProps : GetServerSideProps = scaffold(async (context) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { orgId } = context.params!;

    await context.queryClient.prefetchQuery(['org', orgId], getOrg(orgId as string));

    const orgState = context.queryClient.getQueryState(['org', orgId]);

    if (orgState?.status === 'success') {
        return {
            props: {
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

const ContactPage : PageWithLayout = () => {
    return (
        <>
            <h1>Test</h1>
        </>
    );
};

ContactPage.getLayout = function getLayout(page, props) {
    return (
        <DefaultOrgLayout orgId={ props.orgId as string }>
            { page }
        </DefaultOrgLayout>
    );
};

export default ContactPage;