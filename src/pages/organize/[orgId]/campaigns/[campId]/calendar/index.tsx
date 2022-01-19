import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useIntl } from 'react-intl';

import getCampaign from 'fetching/getCampaign';
import getCampaignEvents from 'fetching/getCampaignEvents';
import getOrg from 'fetching/getOrg';
import { PageWithLayout } from 'types';
import { scaffold } from 'utils/next';
import SingleCampaignLayout from 'layout/organize/SingleCampaignLayout';
import { useQuery } from 'react-query';
import ZetkinCalendar from 'components/ZetkinCalendar';
import ZetkinSpeedDial, { ACTIONS } from 'components/ZetkinSpeedDial';

import { campaignTasksResource } from 'api/tasks';

const scaffoldOptions = {
    authLevelRequired: 2,
    localeScope: [
        'layout.organize', 'misc.breadcrumbs', 'misc.calendar', 'misc.formDialog', 'misc.speedDial', 'misc.tasks', 'pages.organizeCampaigns',
    ],
};

export const getServerSideProps : GetServerSideProps = scaffold(async (ctx) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { orgId, campId } = ctx.params!;

    const { prefetch: prefetchCampaignTasks } = campaignTasksResource(orgId as string, campId as string);
    const { state: campaignTasksState } = await prefetchCampaignTasks(ctx);

    await ctx.queryClient.prefetchQuery(['org', orgId], getOrg(orgId as string, ctx.apiFetch));
    const orgState = ctx.queryClient.getQueryState(['org', orgId]);

    await ctx.queryClient.prefetchQuery(['campaignEvents', orgId, campId], getCampaignEvents(orgId as string, campId as string, ctx.apiFetch));
    const campaignEventsState = ctx.queryClient.getQueryState(['campaignEvents', orgId, campId]);

    await ctx.queryClient.prefetchQuery(['campaign', orgId, campId], getCampaign(orgId as string, campId as string, ctx.apiFetch));
    const campaignState = ctx.queryClient.getQueryState(['campaign', orgId, campId]);

    if (orgState?.status === 'success' && campaignEventsState?.status === 'success' && campaignState?.status === 'success' && campaignTasksState?.status === 'success' ) {
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

type OrganizeCalendarPageProps = {
    campId: string;
    orgId: string;
};

const CampaignCalendarPage : PageWithLayout<OrganizeCalendarPageProps> = ({ orgId, campId }) => {
    const intl = useIntl();
    const eventsQuery = useQuery(['campaignEvents', orgId, campId], getCampaignEvents(orgId, campId));
    const campaignQuery = useQuery(['campaign', orgId, campId], getCampaign(orgId, campId));
    const tasksQuery = campaignTasksResource(orgId, campId).useQuery();

    const events = eventsQuery.data || [];
    const tasks = tasksQuery.data || [];
    const campaigns = campaignQuery.data ? [campaignQuery.data] : [];

    return (
        <>
            <Head>
                <title>{ `${campaignQuery.data?.title} - ${intl.formatMessage({ id:'layout.organize.campaigns.calendar' })}`  }</title>
            </Head>
            <ZetkinCalendar baseHref={ `/organize/${orgId}/campaigns/${campId}/calendar` } campaigns={ campaigns } events={ events } tasks={ tasks } />
            <ZetkinSpeedDial actions={ [ACTIONS.CREATE_TASK] }/>
        </>
    );
};

CampaignCalendarPage.getLayout = function getLayout(page) {
    return (
        <SingleCampaignLayout fixedHeight>
            { page }
        </SingleCampaignLayout>
    );
};

export default CampaignCalendarPage;
