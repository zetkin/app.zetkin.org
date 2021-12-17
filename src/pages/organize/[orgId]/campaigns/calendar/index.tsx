import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';

import AllCampaignsLayout from '../../../../../components/layout/organize/AllCampaignsLayout';
import getCampaigns from '../../../../../fetching/getCampaigns';
import getEvents from '../../../../../fetching/getEvents';
import getOrganizationTasks from '../../../../../fetching/tasks/getOrganizationTasks';
import { PageWithLayout } from '../../../../../types';
import { scaffold } from '../../../../../utils/next';
import ZetkinCalendar from '../../../../../components/ZetkinCalendar';
import getOrg, { getOrgQueryKey } from '../../../../../fetching/getOrg';
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

    await ctx.queryClient.prefetchQuery(getOrgQueryKey(orgId as string), getOrg(orgId as string, ctx.apiFetch));
    const orgState = ctx.queryClient.getQueryState(getOrgQueryKey(orgId as string));

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
    const intl = useIntl();
    const eventsQuery = useQuery(['events', orgId], getEvents(orgId));
    const campaignsQuery = useQuery(['campaigns', orgId], getCampaigns(orgId));
    const tasksQuery = useQuery(['tasks', orgId], getOrganizationTasks(orgId));
    const events = eventsQuery.data || [];
    const tasks = tasksQuery.data || [];
    const campaigns = campaignsQuery.data || [];

    return (
        <>
            <Head>
                <title>{ intl.formatMessage({ id:'layout.organize.campaigns.calendar' }) }</title>
            </Head>
            <ZetkinCalendar baseHref={ `/organize/${orgId}/campaigns/calendar` } campaigns={ campaigns } events={ events } tasks={ tasks } />
            <ZetkinSpeedDial actions={ [ACTIONS.CREATE_CAMPAIGN] } />
        </>
    );
};

AllCampaignsCalendarPage.getLayout = function getLayout(page) {
    return (
        <AllCampaignsLayout fixedHeight>
            { page }
        </AllCampaignsLayout>
    );
};

export default AllCampaignsCalendarPage;
