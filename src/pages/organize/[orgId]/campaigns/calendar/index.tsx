import { Box } from '@material-ui/core';
import { GetServerSideProps } from 'next';
import { useQuery } from 'react-query';

import getAllTasks from '../../../../../fetching/tasks/getAllTasks';
import getCampaigns from '../../../../../fetching/getCampaigns';
import getEvents from '../../../../../fetching/getEvents';
import getOrg from '../../../../../fetching/getOrg';
import OrganizeTabbedLayout from '../../../../../components/layout/OrganizeTabbedLayout';
import { PageWithLayout } from '../../../../../types';
import { scaffold } from '../../../../../utils/next';
import ZetkinCalendar from '../../../../../components/calendar';
import ZetkinSpeedDial, { ACTIONS } from '../../../../../components/ZetkinSpeedDial';

const scaffoldOptions = {
    authLevelRequired: 2,
    localeScope: [
        'layout.organize', 'misc.breadcrumbs', 'misc.calendar','misc.speedDial', 'misc.formDialog',
    ],
};

export const getServerSideProps : GetServerSideProps = scaffold(async (ctx) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { orgId } = ctx.params!;

    await ctx.queryClient.prefetchQuery(['org', orgId], getOrg(orgId as string, ctx.apiFetch));
    const orgState = ctx.queryClient.getQueryState(['org', orgId]);

    await ctx.queryClient.prefetchQuery(['events', orgId], getEvents(orgId as string, ctx.apiFetch));
    const eventsState = ctx.queryClient.getQueryState(['events', orgId]);

    await ctx.queryClient.prefetchQuery(['campaigns', orgId], getCampaigns(orgId as string, ctx.apiFetch));
    const campaignsState = ctx.queryClient.getQueryState(['campaigns', orgId]);

    await ctx.queryClient.prefetchQuery(['tasks', orgId], getAllTasks(orgId as string, ctx.apiFetch));
    const allTasksState = ctx.queryClient.getQueryState(['tasks', orgId]);

    if (orgState?.status === 'success' && eventsState?.status === 'success' &&campaignsState?.status === 'success' && allTasksState?.status === 'success') {
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

type AllCampaignsCalendarPageProps = {
    orgId: string;
};

const AllCampaignsCalendarPage : PageWithLayout<AllCampaignsCalendarPageProps> = ({ orgId }) => {
    const eventsQuery = useQuery(['events', orgId], getEvents(orgId));
    const campaignsQuery = useQuery(['campaigns', orgId], getCampaigns(orgId));
    const events = eventsQuery.data || [];
    const campaigns = campaignsQuery.data || [];

    return (
        <>
            <Box height={ 1 }>
                <ZetkinCalendar baseHref={ `/organize/${orgId}/campaigns/calendar` } campaigns={ campaigns } events={ events } />
            </Box>
            <ZetkinSpeedDial actions={ [ACTIONS.CREATE_EVENT, ACTIONS.CREATE_CAMPAIGN] } />
        </>
    );
};

AllCampaignsCalendarPage.getLayout = function getLayout(page) {
    return (
        <OrganizeTabbedLayout fixedHeight>
            { page }
        </OrganizeTabbedLayout>
    );
};

export default AllCampaignsCalendarPage;
