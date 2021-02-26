//TODO: Enable eslint rule and fix errors
/* eslint-disable  @typescript-eslint/no-non-null-assertion */
import { dehydrate } from 'react-query/hydration';
import { GetServerSideProps } from 'next';
import { QueryClient } from 'react-query';

import getOrg from '../../../fetching/getOrg';
import { LayoutParams } from '../../../interfaces/LayoutParams';
import OrgLayout from '../../../components/layout/OrgLayout';

export const getServerSideProps : GetServerSideProps = async (context) => {
    const queryClient = new QueryClient();
    const { orgId } = context.params!;

    await queryClient.prefetchQuery(['org', orgId], getOrg(orgId as string));

    const orgState = queryClient.getQueryState(['org', orgId]);

    if (orgState!.status === 'success') {
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
};

export default function OrgContactPage() : JSX.Element {
    return (
        <>
            <h1>Test</h1>
        </>
    );
}

OrgContactPage.getLayout = function getLayout({ page, props } : LayoutParams) {
    return (
        <OrgLayout orgId={ props.orgId as string }>
            { page }
        </OrgLayout>
    );
};