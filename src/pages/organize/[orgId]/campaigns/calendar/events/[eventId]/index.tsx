import { GetServerSideProps } from 'next';

import getOrg from '../../../../../../../fetching/getOrg';
import OrganizeTabbedLayout from '../../../../../../../components/layout/OrganizeTabbedLayout';
import { PageWithLayout } from '../../../../../../../types';
import { scaffold } from '../../../../../../../utils/next';

const scaffoldOptions = {
    authLevelRequired: 2,
    localeScope: [
        'layout.organize', 'misc.breadcrumbs', 'pages.organizeAllCampaigns',
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

const EventPage: PageWithLayout = () => {
    return (
        <>
            event page placeholder
        </>
    );
};

EventPage.getLayout = function getLayout(page) {
    return (
        <OrganizeTabbedLayout>
            { page }
        </OrganizeTabbedLayout>
    );
};

export default EventPage;
