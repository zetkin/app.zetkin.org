import { GetServerSideProps } from 'next';

import getOrg from '../../../../fetching/getOrg';
import { PageWithLayout } from '../../../../types';
import { scaffold } from '../../../../utils/next';
import TabbedLayout from '../../../../components/layout/organize/TabbedLayout';

const scaffoldOptions = {
    authLevelRequired: 2,
    localeScope: [
        'layout.organize', 'misc.breadcrumbs',
    ],
};

export const getServerSideProps : GetServerSideProps = scaffold(async (ctx) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { orgId } = ctx.params!;

    await ctx.queryClient.prefetchQuery(['org', orgId], getOrg(orgId as string, ctx.apiFetch));
    const orgState = ctx.queryClient.getQueryState(['org', orgId]);

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
}, scaffoldOptions);

type AllCampaignsInsightsPageProps = {
    orgId: string;
};

const AllCampaignsInsightsPage: PageWithLayout<AllCampaignsInsightsPageProps> = () => {
    return (
        <>
            all campaigns insights
        </>
    );
};

AllCampaignsInsightsPage.getLayout = function getLayout(page) {
    return (
        <TabbedLayout>
            { page }
        </TabbedLayout>
    );
};

export default AllCampaignsInsightsPage;
