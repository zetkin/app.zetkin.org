import { GetServerSideProps } from 'next';
import { grey } from '@material-ui/core/colors';
import NextLink from 'next/link';
import { Avatar, Box, Button, Link, makeStyles, Typography } from '@material-ui/core';
import { FormattedDate, FormattedMessage as Msg } from 'react-intl';
import { Phone, PlaylistAddCheck, Public, Settings } from '@material-ui/icons';

import EventList from '../../../../../components/organize/EventList';
import getCampaign from '../../../../../fetching/getCampaign';
import getCampaignEvents from '../../../../../fetching/getCampaignEvents';
import getCampaignTasks from '../../../../../fetching/tasks/getCampaignTasks';
import getOrg from '../../../../../fetching/getOrg';
import OrganizeCampaignLayout from '../../../../../components/layout/OrganizeCampaignLayout';
import { PageWithLayout } from '../../../../../types';
import { scaffold } from '../../../../../utils/next';
import TaskList from '../../../../../components/organize/TaskList';
import { useQuery } from 'react-query';
import ZetkinSpeedDial, { ACTIONS } from '../../../../../components/ZetkinSpeedDial';

const scaffoldOptions = {
    authLevelRequired: 2,
    localeScope: [
        'layout.organize', 'misc.breadcrumbs', 'pages.organizeCampaigns', 'misc.formDialog', 'misc.speedDial',
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

const useStyles = makeStyles((theme) => ({
    responsiveFlexBox: {
        display: 'flex',
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
        },
    },
    responsiveText: {
        width: '70%',
        [theme.breakpoints.down('sm')]: {
            width: '100%',
        },
    },
}));

const CampaignSummaryPage: PageWithLayout<CampaignCalendarPageProps> = ({ orgId, campId }) => {
    const classes = useStyles();
    const eventsQuery = useQuery(['campaignEvents', orgId, campId], getCampaignEvents(orgId, campId));
    const tasksQuery = useQuery(['campaignTasks', orgId, campId], getCampaignTasks(orgId, campId));
    const campaignQuery = useQuery(['campaign', orgId, campId], getCampaign(orgId, campId));
    const events = eventsQuery.data || [];
    const tasks = tasksQuery.data || [];
    const campaign = campaignQuery.data;

    const sortedEvents = [...events].sort((a, b) => {
        return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
    });

    const startDate = sortedEvents[0].start_time;
    const endDate = sortedEvents[sortedEvents.length - 1].start_time;

    return (
        <>
            <Box className={ classes.responsiveFlexBox }>
                <Box flex={ 1 } p={ 1 }>
                    <Box className={ classes.responsiveText } p={ 1 }>
                        <Typography variant="body1">
                            { campaign?.info_text }
                        </Typography>
                    </Box>
                </Box>
                <Box display="flex" flex={ 1 } p={ 1 }>
                    <Box p={ 1 }>
                        <Avatar></Avatar>
                    </Box>
                    <Box display="flex" flexDirection="column" p={ 1 }>
                        <Typography variant="h6">
                            { campaign?.manager || <Msg id="pages.organizeCampaigns.noManager" /> }
                        </Typography>
                        <Typography variant="subtitle2">
                            <FormattedDate
                                day="2-digit"
                                month="long"
                                value={ startDate }
                            />{ ` - ` }
                            <FormattedDate
                                day="2-digit"
                                month="long"
                                value={ endDate }
                                year="numeric"
                            />
                        </Typography>
                        <Box display="flex" p={ 1 } pl={ 0 }>
                            <Box display="flex" p={ 1 } pl={ 0 }>
                                <Public color="primary" />
                                <NextLink href={ `/o/${orgId}/campaigns/${campId}` } passHref>
                                    <Link underline="always">
                                        <Msg id="pages.organizeCampaigns.linkGroup.public"/>
                                    </Link>
                                </NextLink>
                            </Box>
                            <Box display="flex" p={ 1 }>
                                <Settings color="primary"/>
                                <NextLink href={ `/organize/${orgId}/campaigns/${campId}/settings` } passHref>
                                    <Link underline="always">
                                        <Msg id="pages.organizeCampaigns.linkGroup.settings"/>
                                    </Link>
                                </NextLink>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box className={ classes.responsiveFlexBox }>
                { /* Left Column */ }
                <Box display="flex" flex={ 1 } flexDirection="column">
                    { /* Events */ }
                    <Box border={ 1 } display="flex" flex={ 1 } flexDirection="column" m={ 1 } mt={ 2 }>
                        <Box display="flex" justifyContent="space-between" p={ 3 } pb={ 0 }>
                            <Typography variant="h6">
                                <Msg id="pages.organizeCampaigns.events"/>
                            </Typography>
                            <NextLink href={ `/organize/${orgId}/campaigns/${campId}/calendar` } passHref>
                                <Link underline="always" variant="h6">
                                    <Msg id="pages.organizeCampaigns.calendarView"/>
                                </Link>
                            </NextLink>
                        </Box>
                        <Box p={ 3 } pt={ 0 }>
                            <EventList events={ events } hrefBase={ `/organize/${orgId}/campaigns/${campId}` } />
                        </Box>
                    </Box>
                    { /* Tasks */ }
                    <Box border={ 1 } display="flex" flex={ 1 } flexDirection="column" m={ 1 } mt={ 2 }>
                        <Box display="flex" justifyContent="space-between" p={ 3 } pb={ 0 }>
                            <Typography variant="h6">
                                <Msg id="pages.organizeCampaigns.tasks"/>
                            </Typography>
                        </Box>
                        <Box p={ 3 } pt={ 0 }>
                            <TaskList hrefBase={ `/organize/${orgId}/campaigns/${campId}` } tasks={ tasks } />
                        </Box>
                    </Box>
                </Box>
                { /* Mobilizations & Outreach */ }
                <Box display="flex" flex={ 1 } flexDirection="column" m={ 1 }>
                    <Box border={ 1 } m={ 1 } p={ 3 } pb={ 5 }>
                        <Typography component="h3" variant="h6">
                            <Msg id="pages.organizeCampaigns.mobilization.heading" />
                        </Typography>
                        <Box alignItems="center" display="flex" flexDirection="column">
                            <Phone style={{ color:grey[500], fontSize: 100  }}/>
                            <Box p={ 2 } textAlign="center" width={ 0.5 }>
                                <Typography color="textSecondary" variant="body1">
                                    <Msg id="pages.organizeCampaigns.mobilization.copy" />
                                </Typography>
                            </Box>
                            <NextLink href={ `/organize/${orgId}/campaigns/${campId}/call-assignments/new` } passHref>
                                <Button color="primary" disabled={ true } variant="contained">
                                    <Msg id="pages.organizeCampaigns.mobilization.create" />
                                </Button>
                            </NextLink>
                        </Box>
                    </Box>
                    { /* Feedback and Surveys */ }
                    <Box border={ 1 } m={ 1 } p={ 3 } pb={ 5 }>
                        <Typography component="h3" variant="h6">
                            <Msg id="pages.organizeCampaigns.feedback.heading" />
                        </Typography>
                        <Box alignItems="center" display="flex" flexDirection="column">
                            <PlaylistAddCheck style={{ color:grey[500], fontSize: 100  }}/>
                            <Box p={ 2 } textAlign="center" width={ 0.5 }>
                                <Typography color="textSecondary" variant="body1">
                                    <Msg id="pages.organizeCampaigns.feedback.copy" />
                                </Typography>
                            </Box>
                            <NextLink href={ `/organize/${orgId}/campaigns/${campId}/surveys/new` } passHref>
                                <Button color="primary" disabled={ true } variant="contained">
                                    <Msg id="pages.organizeCampaigns.feedback.create" />
                                </Button>
                            </NextLink>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <ZetkinSpeedDial actions={ [ACTIONS.CREATE_EVENT] } />
        </>
    );
};

CampaignSummaryPage.getLayout = function getLayout(page, props) {
    return (
        <OrganizeCampaignLayout campId={ props.campId as string } orgId={ props.orgId as string }>
            { page }
        </OrganizeCampaignLayout>
    );
};

export default CampaignSummaryPage;
