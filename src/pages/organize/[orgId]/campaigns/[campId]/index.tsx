import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import { Box, Grid, Typography } from '@material-ui/core';

import { campaignTasksResource } from 'api/tasks';
import EventList from 'components/organize/events/EventList';
import getCampaign from 'fetching/getCampaign';
import getCampaignEvents from 'fetching/getCampaignEvents';
import getOrg from 'fetching/getOrg';
import { PageWithLayout } from 'types';
import { scaffold } from 'utils/next';
import SingleCampaignLayout from 'layout/organize/SingleCampaignLayout';
import TaskList from 'components/organize/tasks/TaskList';
import ZetkinPerson from 'components/ZetkinPerson';
import ZetkinSection from 'components/ZetkinSection';
import ZetkinSpeedDial, { ACTIONS } from 'components/ZetkinSpeedDial';

const scaffoldOptions = {
    authLevelRequired: 2,
    localeScope: [
        'layout.organize',
        'pages.organizeCampaigns',
        'misc',
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

    if (
        orgState?.status === 'success' &&
        campaignEventsState?.status === 'success' &&
        campaignState?.status === 'success' &&
        campaignTasksState?.status === 'success'
    ) {
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

const CampaignSummaryPage: PageWithLayout<CampaignCalendarPageProps> = ({ orgId, campId }) => {
    const intl = useIntl();

    const tasksQuery = campaignTasksResource(orgId, campId).useQuery();

    const eventsQuery = useQuery(['campaignEvents', orgId, campId], getCampaignEvents(orgId, campId));
    const campaignQuery = useQuery(['campaign', orgId, campId], getCampaign(orgId, campId));
    const events = eventsQuery.data || [];
    const tasks = tasksQuery.data || [];
    const campaign = campaignQuery.data;

    return (
        <>
            <Head>
                <title>{ campaign?.title }</title>
            </Head>
            <>
                <Box mb={ campaign?.info_text || campaign?.manager ? 2 : 0 }>
                    <Grid container spacing={ 2 }>
                        { campaign?.info_text && (
                            <Grid item lg={ 6 } md={ 12 } xs={ 12 }>
                                <Typography variant="body1">
                                    { campaign?.info_text }
                                </Typography>
                            </Grid>
                        ) }
                        { campaign?.manager && (
                            <Grid item xs={ 12 }>
                                <ZetkinPerson
                                    id={ campaign.manager.id }
                                    name={ campaign.manager.name }
                                    subtitle={ intl.formatMessage({ id: 'pages.organizeCampaigns.campaignManager' }) }
                                />
                            </Grid>
                        ) }
                    </Grid>
                </Box>

                <Grid container spacing={ 2 }>
                    { /* Events */ }
                    <Grid item md={ 6 } sm={ 12 } xs={ 12 }>
                        <ZetkinSection title={ intl.formatMessage({ id: 'pages.organizeCampaigns.events' }) }>
                            <EventList events={ events ?? [] } hrefBase={ `/organize/${orgId}/campaigns/${campId}` } />
                        </ZetkinSection>
                    </Grid>

                    { /* Tasks */ }
                    <Grid item md={ 6 } sm={ 12 } xs={ 12 }>
                        <ZetkinSection title={ intl.formatMessage({ id: 'pages.organizeCampaigns.tasks' }) }>
                            <TaskList tasks={ tasks ?? [] } />
                        </ZetkinSection>
                    </Grid>
                </Grid>
                <ZetkinSpeedDial actions={ [ACTIONS.CREATE_TASK] }/>
            </>
        </>
    );
};

CampaignSummaryPage.getLayout = function getLayout(page) {
    return (
        <SingleCampaignLayout>
            { page }
        </SingleCampaignLayout>
    );
};

export default CampaignSummaryPage;
