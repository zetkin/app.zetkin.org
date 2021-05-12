import { GetServerSideProps } from 'next';
import { View } from '@adobe/react-spectrum';

import Calendar from '../../../../../components/Calendar';
import getCampaignEvents from '../../../../../fetching/getCampaignEvents';
import getOrg from '../../../../../fetching/getOrg';
import OrganizeLayout from '../../../../../components/layout/OrganizeLayout';
import { PageWithLayout } from '../../../../../types';
import { scaffold } from '../../../../../utils/next';
import { useQuery } from 'react-query';

const scaffoldOptions = {
    authLevelRequired: 2,
    localeScope: [
        'layout.organize', 'misc.breadcrumbs','misc.calendar',
    ],
};

export const getServerSideProps : GetServerSideProps = scaffold(async (ctx) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { orgId, campId } = ctx.params!;


    await ctx.queryClient.prefetchQuery(['org', orgId], getOrg(orgId as string, ctx.apiFetch));
    const orgState = ctx.queryClient.getQueryState(['org', orgId]);

    await ctx.queryClient.prefetchQuery(['campaignEvents', orgId, campId], getCampaignEvents(orgId as string, campId as string, ctx.apiFetch));
    const campaignEventsState = ctx.queryClient.getQueryState(['campaignEvents', orgId, campId]);

    if (orgState?.status === 'success' && campaignEventsState?.status === 'success') {
        return {
            props: {
                campId,
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

type CampaignCalendarPageProps = {
    campId: string;
    orgId: string;
};

const CampaignCalendarPage: PageWithLayout<CampaignCalendarPageProps> = ({ orgId, campId }) => {
    const eventsQuery = useQuery(['campaignEvents', orgId, campId], getCampaignEvents(orgId, campId));
    const events = eventsQuery.data || [];

    return (
        <View borderColor="gray-400" borderWidth="thick" height="80vh" margin="auto" marginTop="size-300" padding="size-100" width="95%">
            <Calendar events={ events } focusDate={ new Date('March 12 2021') } />
        </View>
    );
};

CampaignCalendarPage.getLayout = function getLayout(page, props) {
    return (
        <OrganizeLayout orgId={ props.orgId as string }>
            { page }
        </OrganizeLayout>
    );
};

export default CampaignCalendarPage;
