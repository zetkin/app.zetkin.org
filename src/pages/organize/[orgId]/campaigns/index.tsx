import { GetServerSideProps } from 'next';

import getOrg from '../../../../fetching/getOrg';
import OrganizeAllCampaignsLayout from '../../../../components/layout/OrganizeAllCampaignsLayout';
import { PageWithLayout } from '../../../../types';
import { scaffold } from '../../../../utils/next';

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

type AllCampaignsSummaryPageProps = {
    orgId: string;
};

const AllCampaignsSummaryPage: PageWithLayout<AllCampaignsSummaryPageProps> = () => {
    return (
        <>
            all campaigns summary
        </>
    );
};

AllCampaignsSummaryPage.getLayout = function getLayout(page, props) {
    return (
        <OrganizeAllCampaignsLayout orgId={ props.orgId as string }>
            { page }
        </OrganizeAllCampaignsLayout>
    );
};

export default AllCampaignsSummaryPage;
