import { GetServerSideProps } from 'next';
import { grey } from '@material-ui/core/colors';
import NextLink from 'next/link';
import { Box, Button, Card, CardActions, CardContent, Checkbox, Collapse, FormControl, FormControlLabel, FormGroup, FormLabel, Link, List, ListItem, makeStyles, Typography } from '@material-ui/core';
import { Event, ExpandLess, ExpandMore, People } from '@material-ui/icons';
import { FormattedDate, FormattedMessage as Msg, useIntl } from 'react-intl';
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@material-ui/lab';
import { useEffect, useRef, useState } from 'react';

import getAllCallAssignments from '../../../../fetching/getAllCallAssignments';
import getCampaigns from '../../../../fetching/getCampaigns';
import getCanvasses from '../../../../fetching/getCanvasses';
import getEvents from '../../../../fetching/getEvents';
import getOrg from '../../../../fetching/getOrg';
import getSurveys from '../../../../fetching/getSurveys';
import OrganizeAllCampaignsLayout from '../../../../components/layout/OrganizeAllCampaignsLayout';
import { PageWithLayout } from '../../../../types';
import { scaffold } from '../../../../utils/next';
import { useQuery } from 'react-query';

const scaffoldOptions = {
    authLevelRequired: 2,
    localeScope: [
        'layout.organize', 'misc.breadcrumbs', 'pages.organizeAllCampaigns',
    ],
};

export const getServerSideProps : GetServerSideProps = scaffold(async (ctx) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { orgId } = ctx.params!;

    await ctx.queryClient.prefetchQuery(['org', orgId], getOrg(orgId as string, ctx.apiFetch));
    const orgState = ctx.queryClient.getQueryState(['org', orgId]);

    await ctx.queryClient.prefetchQuery(['campaigns', orgId], getCampaigns(orgId as string, ctx.apiFetch));
    const campaignsState = ctx.queryClient.getQueryState(['campaigns', orgId]);

    await ctx.queryClient.prefetchQuery(['events', orgId], getEvents(orgId as string, ctx.apiFetch));
    const eventsState = ctx.queryClient.getQueryState(['events', orgId]);

    await ctx.queryClient.prefetchQuery(['surveys', orgId], getSurveys(orgId as string, ctx.apiFetch));
    const surveysState = ctx.queryClient.getQueryState(['surveys', orgId]);

    await ctx.queryClient.prefetchQuery(['calls', orgId], getAllCallAssignments(orgId as string, ctx.apiFetch));
    const allCallAssignmentsState = ctx.queryClient.getQueryState(['calls', orgId]);

    await ctx.queryClient.prefetchQuery(['canvasses', orgId], getCanvasses(orgId as string, ctx.apiFetch));
    const canvassesState = ctx.queryClient.getQueryState(['canvasses', orgId]);

    if (orgState?.status === 'success' && campaignsState?.status === 'success' && eventsState?.status === 'success'  && allCallAssignmentsState?.status === 'success' && canvassesState?.status === 'success' && surveysState?.status === 'success') {
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
    const classes = useStyles();
    const intl = useIntl();
    const campaignsQuery = useQuery(['campaigns', orgId], getCampaigns(orgId));
    const eventsQuery = useQuery(['events', orgId], getEvents(orgId));
    const surveysQuery = useQuery(['surveys', orgId], getSurveys(orgId));
    const callsQuery = useQuery(['calls', orgId], getAllCallAssignments(orgId));
    const canvassesQuery = useQuery(['canvasses', orgId], getCanvasses(orgId));

    const [expandedList, setExpandedList] = useState(false);
    const [speedDialOpen, setSpeedDialOpen] = useState(false);
    const [filtered, setfiltered] = useState({
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

    let campaigns = campaignsQuery.data || [];
    campaigns = Array.from({ length: 7 }, () => [...campaigns]).flat();
    //TODO : data has been multiplied here don't do that IRL

    const events = eventsQuery.data || [];
    const surveys = surveysQuery.data || [];
    const callAssignments = callsQuery.data || [];
    const canvasses = canvassesQuery.data || [];
    const standalones = events.filter(e => !e.campaign.id);

    let unsorted = [
        ... filtered.surveys ? [...surveys] : [],
        ... filtered.canvasses ? [...canvasses] : [],
        ... filtered.callAssignments ? [...callAssignments] : [],
        ... filtered.standalones ? [...standalones] : [],
    ];

    if (Object.values(filtered).every(v => !v)) {
        unsorted = [...surveys, ...canvasses, ...callAssignments, ...standalones];
    }

    const sortedEvents = [...events].sort((a, b) => {
        return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setfiltered({ ...filtered, [event.target.name]: event.target.checked });
    };

    const actions = [
        { icon: <Event />, name: 'Create new Event' },
        { icon: <People />, name: 'Create new Campaign' },
    ];

    const handleClose = () => {
        setSpeedDialOpen(false);
    };

    return (
        <>
            <Box m={ 1 } p={ 1 }>
                <Typography variant="h5">
                    <Msg id="pages.organizeAllCampaigns.heading"/>
                </Typography>
            </Box>
            <Box m={ 1 } p={ 1 }>
                <Collapse collapsedHeight={ cardHeight + 18 } in={ expandedList }>
                    <Box display="grid" gridGap={ 20 } gridTemplateColumns="repeat( auto-fit, minmax(450px, 1fr) )">
                        { campaigns.map(camp => {
                            const campaignEvents = sortedEvents.filter(e => e.campaign.id === camp.id);
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
                                            { `${campaignEvents.length} upcoming events` }
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
                        onClick={ () => setExpandedList(!expandedList) }
                        startIcon={ expandedList ? <ExpandLess /> : <ExpandMore /> } variant="text">
                        <Typography variant="subtitle1">
                            { expandedList ? (
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
                        { unsorted.map(item => (
                            <ListItem key={ item.id } style={{ background: grey[200], height: '4rem', margin: '1rem 0', paddingLeft:'0.5rem' }}>
                                <NextLink href="/" passHref>
                                    <Link color="inherit" variant="subtitle2">
                                        { `${item.title} ID: ${item.id}` }
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
                                control={ <Checkbox checked={ filtered.standalones } color="primary" name="standalones" onChange={ handleChange }/> }
                                label={ intl.formatMessage(
                                    { id: 'pages.organizeAllCampaigns.filter.standalones' }) }
                            />
                            <FormControlLabel
                                control={ <Checkbox checked={ filtered.surveys } color="primary" name="surveys" onChange={ handleChange } /> }
                                label={ intl.formatMessage(
                                    { id: 'pages.organizeAllCampaigns.filter.surveys' }) }
                            />
                            <FormControlLabel
                                control={ <Checkbox checked={ filtered.callAssignments } color="primary" name="callAssignments" onChange={ handleChange } /> }
                                label={ intl.formatMessage(
                                    { id: 'pages.organizeAllCampaigns.filter.calls' }) }
                            />
                            <FormControlLabel
                                control={ <Checkbox checked={ filtered.canvasses } color="primary"
                                    name="canvasses" onChange={ handleChange }
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
                icon={ <SpeedDialIcon /> }
                onClose={ handleClose }
                onOpen={ () => setSpeedDialOpen(true) }
                open={ speedDialOpen }>
                { actions.map((action) => (
                    <SpeedDialAction
                        key={ action.name }
                        icon={ action.icon }
                        onClick={ handleClose }
                        tooltipTitle={ action.name }
                    />
                )) }
            </SpeedDial>
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
