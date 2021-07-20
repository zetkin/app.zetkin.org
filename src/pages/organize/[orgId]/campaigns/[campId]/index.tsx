import { GetServerSideProps } from 'next';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Avatar, Box, Button, Grid, Link, makeStyles, Typography } from '@material-ui/core';
import { FormattedDate, FormattedMessage as Msg, useIntl } from 'react-intl';
import { Public, Settings } from '@material-ui/icons';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import CampaignForm from '../../../../../components/CampaignForm';
import EventList from '../../../../../components/organize/EventList';
import getCampaign from '../../../../../fetching/getCampaign';
import getCampaignEvents from '../../../../../fetching/getCampaignEvents';
import getCampaignTasks from '../../../../../fetching/tasks/getCampaignTasks';
import getOrg from '../../../../../fetching/getOrg';
import OrganizeTabbedLayout from '../../../../../components/layout/OrganizeTabbedLayout';
import { PageWithLayout } from '../../../../../types';
import patchCampaign from '../../../../../fetching/patchCampaign';
import { scaffold } from '../../../../../utils/next';
import TaskList from '../../../../../components/organize/tasks/TaskList';
import ZetkinDialog from '../../../../../components/ZetkinDialog';
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
    const intl = useIntl();
    const queryClient = useQueryClient();
    const router = useRouter();
    const classes = useStyles();
    const eventsQuery = useQuery(['campaignEvents', orgId, campId], getCampaignEvents(orgId, campId));
    const tasksQuery = useQuery(['campaignTasks', orgId, campId], getCampaignTasks(orgId, campId));
    const campaignQuery = useQuery(['campaign', orgId, campId], getCampaign(orgId, campId));
    const events = eventsQuery.data || [];
    const tasks = tasksQuery.data || [];
    const campaign = campaignQuery.data;
    const [formDialogOpen, setFormDialogOpen] = useState<null | string>(null);

    const campaignMutation = useMutation(patchCampaign(orgId, campId), {
        onSettled: () => queryClient.invalidateQueries('campaign'),
    });

    const sortedEvents = [...events].sort((a, b) => {
        return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
    });

    const startDate = sortedEvents[0]?.start_time;
    const endDate = sortedEvents[sortedEvents.length - 1]?.start_time;

    const closeDialog = () => {
        setFormDialogOpen(null);
        router.push(`/organize/${orgId}/campaigns/${campId}`, undefined, { shallow: true });
    };

    const openEditCampaignDialog = () => {
        router.push(`/organize/${orgId}/campaigns/${campId}#edit`, undefined, { shallow: true });
        setFormDialogOpen('campaign');
    };

    const handleDialogClose = () => {
        closeDialog();
    };

    const handleFormCancel = () => {
        closeDialog();
    };

    const handleEditCampaignFormSubmit = (data: Record<string, unknown>) => {
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
                        <Avatar
                            src={ campaign?.manager ?
                                `/api/orgs/${orgId}/people/${campaign?.manager.id}/avatar` : undefined }>
                        </Avatar>
                    </Box>
                    <Box display="flex" flexDirection="column" p={ 1 }>
                        <Typography variant="h6">
                            { campaign?.manager?.name || <Msg id="pages.organizeCampaigns.noManager" /> }
                        </Typography>
                        <Typography variant="subtitle2">
                            { startDate && endDate ? (
                                <>
                                    <FormattedDate
                                        day="2-digit"
                                        month="long"
                                        value={ startDate }
                                    />
                                    { ` - ` }
                                    <FormattedDate
                                        day="2-digit"
                                        month="long"
                                        value={ endDate }
                                        year="numeric"
                                    />
                                </>
                            ) : (
                                <Msg id="pages.organizeCampaigns.indefinite" />
                            ) }
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
                                <Button onClick={ openEditCampaignDialog } startIcon={ <Settings color="primary" /> } variant="contained">
                                    <Msg id="pages.organizeCampaigns.linkGroup.settings"/>
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box p={ 4 }>
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
            </Box>
            { /* Edit Campaign Form */ }
            <ZetkinDialog
                onClose={ handleDialogClose }
                open={ !!formDialogOpen }
                title={ intl.formatMessage({ id: 'misc.formDialog.campaign.edit' }) }>
                { formDialogOpen === 'campaign' && <CampaignForm campaign={ campaign } onCancel={ handleFormCancel } onSubmit={ handleEditCampaignFormSubmit }/> }
            </ZetkinDialog>
            <ZetkinSpeedDial actions={ [ACTIONS.CREATE_EVENT, ACTIONS.CREATE_TASK] }/>
        </>
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
