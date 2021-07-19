import { GetServerSideProps } from 'next';
import { useQuery } from 'react-query';

import getCampaigns from '../../../../../fetching/getCampaigns';
import getEvents from '../../../../../fetching/getEvents';
import getOrg from '../../../../../fetching/getOrg';
import getOrganizationTasks from '../../../../../fetching/tasks/getOrganizationTasks';
import { PageWithLayout } from '../../../../../types';
import { scaffold } from '../../../../../utils/next';
import TabbedLayout from '../../../../../components/layout/organize/TabbedLayout';
import ZetkinCalendar from '../../../../../components/ZetkinCalendar';
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

    await ctx.queryClient.prefetchQuery(['tasks', orgId], getOrganizationTasks(orgId as string, ctx.apiFetch));
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
    const tasksQuery = useQuery(['tasks', orgId], getOrganizationTasks(orgId));
    const events = eventsQuery.data || [];
    const tasks = tasksQuery.data || [];
    const campaigns = campaignsQuery.data || [];

    return (
        <>
            <ZetkinCalendar baseHref={ `/organize/${orgId}/campaigns/calendar` } campaigns={ campaigns } events={ events } tasks={ tasks } />
            <ZetkinSpeedDial actions={ [ACTIONS.CREATE_EVENT, ACTIONS.CREATE_CAMPAIGN] } />
        </>
    );
};

AllCampaignsCalendarPage.getLayout = function getLayout(page) {
    return (
        <TabbedLayout fixedHeight>
            { page }
        </TabbedLayout>
    );
};

export default AllCampaignsCalendarPage;
