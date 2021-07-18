import { GetServerSideProps } from 'next';

import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import { Box, Grid } from '@material-ui/core';

import CampaignDetailsHeader from '../../../../../components/organize/CampaignDetailsHeader';
import EventList from '../../../../../components/organize/EventList';
import getCampaign from '../../../../../fetching/getCampaign';
import getCampaignEvents from '../../../../../fetching/getCampaignEvents';
import getCampaignTasks from '../../../../../fetching/tasks/getCampaignTasks';
import getOrg from '../../../../../fetching/getOrg';
import OrganizeTabbedLayout from '../../../../../components/layout/OrganizeTabbedLayout';
import { PageWithLayout } from '../../../../../types';
import { scaffold } from '../../../../../utils/next';
import TaskList from '../../../../../components/organize/tasks/TaskList';
import ZetkinSection from '../../../../../components/ZetkinSection';
import ZetkinSpeedDial, { ACTIONS } from '../../../../../components/ZetkinSpeedDial';

const scaffoldOptions = {
    authLevelRequired: 2,
    localeScope: [
        'layout.organize',
        'misc.breadcrumbs',
        'pages.organizeCampaigns',
        'misc.formDialog',
        'misc.tasks',
        'misc.speedDial',
    ],
};

export const getServerSideProps : GetServerSideProps = scaffold(async (ctx) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { orgId, campId } = ctx.params!;


    await ctx.queryClient.prefetchQuery(['org', orgId], getOrg(orgId as string, ctx.apiFetch));
    const orgState = ctx.queryClient.getQueryState(['org', orgId]);

    await ctx.queryClient.prefetchQuery(['campaignEvents', orgId, campId], getCampaignEvents(orgId as string, campId as string, ctx.apiFetch));
    const campaignEventsState = ctx.queryClient.getQueryState(['campaignEvents', orgId, campId]);

    await ctx.queryClient.prefetchQuery(['campaignTasks', orgId, campId], getCampaignTasks(orgId as string, campId as string, ctx.apiFetch));
    const campaignTasksState = ctx.queryClient.getQueryState(['campaignTasks', orgId, campId]);

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
    const { data: campaign } = useQuery(['campaign', orgId, campId], getCampaign(orgId, campId));
    const { data: events } = useQuery(
        ['campaignEvents', orgId, campId],
        getCampaignEvents(orgId as string, campId as string),
    );
    const { data: tasks } = useQuery(
        ['campaignTasks', orgId, campId],
        getCampaignTasks(orgId as string, campId as string),
    );

    return (
        <Box p={ 4 }>
            { /* Details Header */ }
            { campaign && (
                <Box mb={ 4 }>
                    <CampaignDetailsHeader campaign={ campaign } />
                </Box>
            ) }
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
                        <TaskList hrefBase={ `/organize/${orgId}/campaigns/${campId}` } tasks={ tasks ?? [] } />
                    </ZetkinSection>
                </Grid>
            </Grid>
            <ZetkinSpeedDial actions={ [ACTIONS.CREATE_EVENT, ACTIONS.CREATE_TASK] }/>
        </Box>
    );
};

CampaignSummaryPage.getLayout = function getLayout(page) {
    return (
        <OrganizeTabbedLayout>
            { page }
        </OrganizeTabbedLayout>
    );
};

export default CampaignSummaryPage;
