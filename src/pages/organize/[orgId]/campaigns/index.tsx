import { GetServerSideProps } from 'next';
import { grey } from '@material-ui/core/colors';
import NextLink from 'next/link';
import { useQuery } from 'react-query';
import { useState } from 'react';
import { Box, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Link, List, ListItem, Typography } from '@material-ui/core';
import { FormattedMessage as Msg, useIntl } from 'react-intl';

import CampaignCard from '../../../../components/CamapignCard';
import getActivities from '../../../../fetching/getActivities';
import getAllCallAssignments from '../../../../fetching/getAllCallAssignments';
import getAllCanvassAssignments from '../../../../fetching/getAllCanvassAssignments';
import getCampaigns from '../../../../fetching/getCampaigns';
import getEvents from '../../../../fetching/getEvents';
import getLocations from '../../../../fetching/getLocations';
import getOrg from '../../../../fetching/getOrg';
import getSurveys from '../../../../fetching/getSurveys';
import getUpcomingEvents from '../../../../fetching/getUpcomingEvents';
import OrganizeTabbedLayout from '../../../../components/layout/OrganizeTabbedLayout';
import { PageWithLayout } from '../../../../types';
import { scaffold } from '../../../../utils/next';
import ZetkinSection from '../../../../components/ZetkinSection';
import ZetkinSpeedDial, { ACTIONS } from '../../../../components/ZetkinSpeedDial';

const scaffoldOptions = {
    authLevelRequired: 2,
    localeScope: [
        'layout.organize', 'misc.breadcrumbs', 'pages.organizeAllCampaigns', 'misc.formDialog', 'misc.speedDial',
    ],
};

export const getServerSideProps : GetServerSideProps = scaffold(async (ctx) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { orgId } = ctx.params!;

    await ctx.queryClient.prefetchQuery(['org', orgId], getOrg(orgId as string, ctx.apiFetch));
    const orgState = ctx.queryClient.getQueryState(['org', orgId]);

    await ctx.queryClient.prefetchQuery(['campaigns', orgId], getCampaigns(orgId as string, ctx.apiFetch));
    const campaignsState = ctx.queryClient.getQueryState(['campaigns', orgId]);

    await ctx.queryClient.prefetchQuery(['upcomingEvents', orgId], getUpcomingEvents(orgId as string, ctx.apiFetch));
    const upcomingEventsState = ctx.queryClient.getQueryState(['upcomingEvents', orgId]);

    await ctx.queryClient.prefetchQuery(['events', orgId], getEvents(orgId as string, ctx.apiFetch));
    const eventsState = ctx.queryClient.getQueryState(['events', orgId]);

    await ctx.queryClient.prefetchQuery(['surveys', orgId], getSurveys(orgId as string, ctx.apiFetch));
    const surveysState = ctx.queryClient.getQueryState(['surveys', orgId]);

    await ctx.queryClient.prefetchQuery(['calls', orgId], getAllCallAssignments(orgId as string, ctx.apiFetch));
    const allCallAssignmentsState = ctx.queryClient.getQueryState(['calls', orgId]);

    await ctx.queryClient.prefetchQuery(['canvasses', orgId], getAllCanvassAssignments(orgId as string, ctx.apiFetch));
    const canvassesState = ctx.queryClient.getQueryState(['canvasses', orgId]);

    await ctx.queryClient.prefetchQuery(['activities', orgId], getActivities(orgId as string, ctx.apiFetch));
    const activitiesState = ctx.queryClient.getQueryState(['activities', orgId]);

    await ctx.queryClient.prefetchQuery(['locations', orgId], getLocations(orgId as string, ctx.apiFetch));
    const locationsState = ctx.queryClient.getQueryState(['locations', orgId]);

    if (orgState?.status === 'success' && campaignsState?.status === 'success' && eventsState?.status === 'success'  && allCallAssignmentsState?.status === 'success' && canvassesState?.status === 'success' && surveysState?.status === 'success' && upcomingEventsState?.status === 'success' && activitiesState?.status === 'success' && locationsState?.status === 'success') {
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

const AllCampaignsSummaryPage: PageWithLayout<AllCampaignsSummaryPageProps> = ({ orgId }) => {
    const intl = useIntl();
    const campaignsQuery = useQuery(['campaigns', orgId], getCampaigns(orgId));
    const upcomingEventsQuery = useQuery(['upcomingEvents', orgId], getUpcomingEvents(orgId));
    const eventsQuery = useQuery(['events', orgId], getEvents(orgId));
    const surveysQuery = useQuery(['surveys', orgId], getSurveys(orgId));
    const callsQuery = useQuery(['calls', orgId], getAllCallAssignments(orgId));
    const canvassesQuery = useQuery(['canvasses', orgId], getAllCanvassAssignments(orgId));

    const [filters, setFilters] = useState({
        callAssignments: false,
        canvasses: false,
        standalones: false,
        surveys: false,
    });

    const campaigns = campaignsQuery.data || [];

    const upcomingEvents = upcomingEventsQuery.data || [];
    const events = eventsQuery.data || [];
    const surveys = surveysQuery.data?.map(s => ({ data: s, type: 'survey' })) || [];
    const callAssignments = callsQuery.data?.map(c => ({ data: c, type: 'call_assignment' })) || [];
    const canvasses = canvassesQuery.data?.map(c => ({ data: c, type: 'canvass_assignment' })) || [];
    const standalones = events.filter(e => !e.campaign.id).map(s => ({ data: s, type: 'standalone_event' }));

    let unsortedProjects = [
        ... filters.surveys ? [...surveys] : [],
        ... filters.canvasses ? [...canvasses] : [],
        ... filters.callAssignments ? [...callAssignments] : [],
        ... filters.standalones ? [...standalones] : [],
    ];

    // if no filters are applied show all unsorted items
    if (Object.values(filters).every(v => !v)) {
        unsortedProjects = [...surveys, ...canvasses, ...callAssignments, ...standalones];
    }

    const handleFilterBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilters({ ...filters, [event.target.name]: event.target.checked });
    };

    return (
        <>
            <ZetkinSection title={ intl.formatMessage({ id: 'pages.organizeAllCampaigns.heading' }) }>
                <Box display="grid" gridGap={ 20 } gridTemplateColumns="repeat( auto-fit, minmax(450px, 1fr) )">
                    { campaigns.map(campaign => (
                        <CampaignCard key={ campaign.id } campaign={ campaign } events={ events } upcomingEvents={ upcomingEvents }/>
                    )) }
                </Box>
            </ZetkinSection>
            <Box m={ 1 } p={ 1 }>
                <Typography variant="h5">
                    <Msg id="pages.organizeAllCampaigns.unsorted"/>
                </Typography>
            </Box>
            <Box alignItems="start" display="flex" justifyContent="flex-start" m={ 1 } p={ 1 } pt={ 0 }>
                <Box flexGrow={ 0 } width={ 0.5 }>
                    <List disablePadding={ true }>
                        { unsortedProjects.map(item => (
                            <ListItem key={ `${item.type}-${item.data.id}` } style={{ background: grey[200], height: '4rem', margin: '1rem 0', paddingLeft:'0.5rem' }}>
                                <NextLink href="/" passHref>
                                    <Link color="inherit" variant="subtitle2">
                                        { `${item.type} ID: ${item.data.id}` }
                                    </Link>
                                </NextLink>
                            </ListItem>
                        )) }
                    </List>
                </Box>
                <Box border={ 1 } borderColor={ grey[400] } flexGrow={ 0 } m={ 3 } mt={ 2 } p={ 2 }>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">
                            <Typography color="textPrimary" variant="subtitle1">
                                <Msg id="pages.organizeAllCampaigns.filter.filter" />
                            </Typography>
                        </FormLabel>
                        <FormGroup>
                            <FormControlLabel
                                control={ <Checkbox checked={ filters.standalones } color="primary" name="standalones" onChange={ handleFilterBoxChange }/> }
                                label={ intl.formatMessage(
                                    { id: 'pages.organizeAllCampaigns.filter.standalones' }) }
                            />
                            <FormControlLabel
                                control={ <Checkbox checked={ filters.surveys } color="primary" name="surveys" onChange={ handleFilterBoxChange } /> }
                                label={ intl.formatMessage(
                                    { id: 'pages.organizeAllCampaigns.filter.surveys' }) }
                            />
                            <FormControlLabel
                                control={ <Checkbox checked={ filters.callAssignments } color="primary" name="callAssignments" onChange={ handleFilterBoxChange } /> }
                                label={ intl.formatMessage(
                                    { id: 'pages.organizeAllCampaigns.filter.calls' }) }
                            />
                            <FormControlLabel
                                control={ <Checkbox checked={ filters.canvasses } color="primary"
                                    name="canvasses" onChange={ handleFilterBoxChange }
                                /> }
                                label={ intl.formatMessage(
                                    { id: 'pages.organizeAllCampaigns.filter.canvasses' }) }
                            />
                        </FormGroup>
                    </FormControl>
                </Box>
            </Box>
            <ZetkinSpeedDial actions={ [ACTIONS.CREATE_EVENT, ACTIONS.CREATE_CAMPAIGN] } />
        </>
    );
};

AllCampaignsSummaryPage.getLayout = function getLayout(page) {
    return (
        <OrganizeTabbedLayout>
            { page }
        </OrganizeTabbedLayout>
    );
};

export default AllCampaignsSummaryPage;
