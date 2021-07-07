import { GetServerSideProps } from 'next';
import { grey } from '@material-ui/core/colors';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Box, Button, Card, CardActions, CardContent, Checkbox, Collapse, FormControl, FormControlLabel, FormGroup, FormLabel, Link, List, ListItem, makeStyles, Typography } from '@material-ui/core';
import { Event, ExpandLess, ExpandMore, Flag } from '@material-ui/icons';
import { FormattedDate, FormattedMessage as Msg, useIntl } from 'react-intl';
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@material-ui/lab';
import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import CampaignForm from '../../../../components/CampaignForm';
import CreateEventForm from '../../../../components/CreateEventForm';
import getActivities from '../../../../fetching/getActivities';
import getAllCallAssignments from '../../../../fetching/getAllCallAssignments';
import getAllCanvassAssignments from '../../../../fetching/getAllCanvassAssignments';
import getCampaigns from '../../../../fetching/getCampaigns';
import getEvents from '../../../../fetching/getEvents';
import getLocations from '../../../../fetching/getLocations';
import getOrg from '../../../../fetching/getOrg';
import getSurveys from '../../../../fetching/getSurveys';
import getUpcomingEvents from '../../../../fetching/getUpcomingEvents';
import OrganizeAllCampaignsLayout from '../../../../components/layout/OrganizeAllCampaignsLayout';
import { PageWithLayout } from '../../../../types';
import postCampaign from '../../../../fetching/postCampaign';
import postEvent from '../../../../fetching/postEvent';
import { scaffold } from '../../../../utils/next';
import ZetkinDialog from '../../../../components/ZetkinDialog';

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

const useStyles = makeStyles((theme) => ({
    expandButton: {
        textDecoration: 'underline',
        textTransform: 'none',
    },
    speedDial: {
        bottom: theme.spacing(4),
        position: 'fixed',
        right: theme.spacing(4),
    },
}));

type AllCampaignsSummaryPageProps = {
    orgId: string;
};

const AllCampaignsSummaryPage: PageWithLayout<AllCampaignsSummaryPageProps> = ({ orgId }) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const classes = useStyles();
    const intl = useIntl();
    const campaignsQuery = useQuery(['campaigns', orgId], getCampaigns(orgId));
    const upcomingEventsQuery = useQuery(['upcomingEvents', orgId], getUpcomingEvents(orgId));
    const eventsQuery = useQuery(['events', orgId], getEvents(orgId));
    const surveysQuery = useQuery(['surveys', orgId], getSurveys(orgId));
    const callsQuery = useQuery(['calls', orgId], getAllCallAssignments(orgId));
    const canvassesQuery = useQuery(['canvasses', orgId], getAllCanvassAssignments(orgId));

    const eventMutation = useMutation(postEvent(orgId), {
        onSettled: () => queryClient.invalidateQueries('events'),
    });
    const campaignMutation = useMutation(postCampaign(orgId), {
        onSettled: () => queryClient.invalidateQueries('campaigns'),
    });

    const [CampaignListExpanded, setCampaignListExpanded] = useState(false);
    const [speedDialOpen, setSpeedDialOpen] = useState(false);
    const [formDialogOpen, setFormDialogOpen] = useState<null | string>(null);
    const [filters, setFilters] = useState({
        callAssignments: false,
        canvasses: false,
        standalones: false,
        surveys: false,
    });
    const [cardHeight, setCardHeight] = useState(0);
    const card = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setCardHeight(card.current?.offsetHeight || 0);
    }, []);

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

    const actions = [
        { icon: <Event />, id: 'event', name: intl.formatMessage({ id: 'misc.speedDial.createEvent' }) },
        { icon: <Flag />, id: 'campaign', name: intl.formatMessage({ id: 'misc.speedDial.createCampaign' }) },
    ];

    const closeDialog = () => {
        setFormDialogOpen(null);
        router.push(`/organize/${orgId}/campaigns`, undefined, { shallow: true });
    };

    const openCreateCampaignDialog = () => {
        router.push(`/organize/${orgId}/campaigns#new_campaign`, undefined, { shallow: true });
        setFormDialogOpen('campaign');
    };

    const openCreateEventDialog = () => {
        router.push(`/organize/${orgId}/campaigns#new_event`, undefined, { shallow: true });
        setFormDialogOpen('event');
    };

    const handleSpeedDialClose = (id: string) => {
        setSpeedDialOpen(false);
        if (id === 'campaign') {
            openCreateCampaignDialog();
        }
        else if (id === 'event') {
            openCreateEventDialog();
        }
    };

    const handleDialogClose = () => {
        closeDialog();
    };

    const handleFormCancel = () => {
        closeDialog();
    };

    const handleCreateEventFormSubmit = (data: Record<string,unknown>) => {
        eventMutation.mutate(data);
        closeDialog();
    };

    const handleCreateCampaignFormSubmit = (data: Record<string,unknown>) => {
        campaignMutation.mutate(data);
        closeDialog();
    };

    useEffect(() => {
        const current = router.asPath.split('/').pop();
        if (current?.includes('#new_campaign')) {
            setFormDialogOpen('campaign');
        }
        else if (current?.includes('#new_event')) {
            setFormDialogOpen('event');
        }
    }, [router.asPath]);

    return (
        <>
            <Box m={ 1 } p={ 1 }>
                <Typography variant="h5">
                    <Msg id="pages.organizeAllCampaigns.heading"/>
                </Typography>
            </Box>
            <Box m={ 1 } p={ 1 }>
                <Collapse collapsedHeight={ cardHeight + 18 } in={ CampaignListExpanded }>
                    <Box display="grid" gridGap={ 20 } gridTemplateColumns="repeat( auto-fit, minmax(450px, 1fr) )">
                        { campaigns.map(camp => {
                            const campaignEvents = events.filter(e => e.campaign.id === camp.id);
                            const campaignUpcomingEvents = upcomingEvents.filter(e => e.campaign?.id === camp.id);
                            const startDate = campaignEvents[0]?.start_time;
                            const endDate = campaignEvents[campaignEvents.length - 1]?.start_time;
                            return (
                                <Card key={ camp.id } ref={ card } square style={{  padding: '1rem', width:'100%' }} variant="outlined">
                                    <CardContent>
                                        <Typography gutterBottom noWrap variant="h6">
                                            { camp.title }
                                        </Typography>
                                        <Typography gutterBottom variant="body2">
                                            { startDate && endDate ? (
                                                <>
                                                    <FormattedDate
                                                        day="numeric"
                                                        month="long"
                                                        value={ new Date(startDate)
                                                        }
                                                    /> { ' - ' }
                                                    <FormattedDate
                                                        day="numeric"
                                                        month="long"
                                                        value={ new Date(endDate) }
                                                    />
                                                </>
                                            ) : <Msg id="pages.organizeAllCampaigns.indefinite" /> }
                                        </Typography>
                                        <Typography>
                                            <Msg id="pages.organizeAllCampaigns.upcoming" values={{ numEvents:campaignUpcomingEvents.length,
                                            }}
                                            />
                                        </Typography>
                                        { /*TODO: labels for calls and surveys*/ }
                                    </CardContent>
                                    <CardActions>
                                        <NextLink href={ `/organize/${orgId}/campaigns/${camp.id}` } passHref>
                                            <Link underline="always" variant="subtitle1">
                                                <Msg id="pages.organizeAllCampaigns.cardCTA" />
                                            </Link>
                                        </NextLink>
                                    </CardActions>
                                </Card>
                            );
                        }) }
                    </Box>
                </Collapse>
                <Box display="flex" justifyContent="flex-end">
                    <Button
                        className={ classes.expandButton }
                        color="primary"
                        disableRipple={ true }
                        onClick={ () => setCampaignListExpanded(!CampaignListExpanded) }
                        startIcon={ CampaignListExpanded ? <ExpandLess /> : <ExpandMore /> } variant="text">
                        <Typography variant="subtitle1">
                            { CampaignListExpanded ? (
                                <Msg id="pages.organizeAllCampaigns.collapse" />
                            ) :
                                <Msg id="pages.organizeAllCampaigns.showAll" /> }
                        </Typography>
                    </Button>
                </Box>
            </Box>
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
            <SpeedDial
                ariaLabel="SpeedDial example"
                className={ classes.speedDial }
                FabProps={{ onClick: () => handleSpeedDialClose('campaign') }}
                icon={ <SpeedDialIcon /> }
                onClose={ () => setSpeedDialOpen(false) }
                onOpen={ () => setSpeedDialOpen(true) }
                open={ speedDialOpen }>
                { actions.map((action) => (
                    <SpeedDialAction
                        key={ action.id }
                        icon={ action.icon }
                        onClick={ () => handleSpeedDialClose(action.id) }
                        tooltipTitle={ action.name }
                    />
                )) }
            </SpeedDial>
            <ZetkinDialog
                onClose={ handleDialogClose }
                open={ !!formDialogOpen }
                title={ intl.formatMessage({ id: `misc.formDialog.${formDialogOpen}.create` }) }>
                { formDialogOpen === 'campaign' && <CampaignForm onCancel={ handleFormCancel } onSubmit={ handleCreateCampaignFormSubmit }/> }
                { formDialogOpen === 'event' && <CreateEventForm onCancel={ handleFormCancel } onSubmit={ handleCreateEventFormSubmit } orgId={ orgId.toString() }/> }
            </ZetkinDialog>
        </>
    );
};

AllCampaignsSummaryPage.getLayout = function getLayout(page, props) {
    return (
        <OrganizeAllCampaignsLayout orgId={ props.orgId as string }>
            { page }
        </OrganizeAllCampaignsLayout>
    );
};

export default AllCampaignsSummaryPage;
