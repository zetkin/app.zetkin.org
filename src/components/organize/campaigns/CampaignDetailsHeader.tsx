import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Avatar, Box, Button, makeStyles, Typography } from '@material-ui/core';
import { FormattedDate, FormattedMessage as Msg, useIntl } from 'react-intl';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import CampaignForm from '../../CampaignForm';
import ZetkinDialog from '../../ZetkinDialog';

import getCampaignEvents from '../../../fetching/getCampaignEvents';
import patchCampaign from '../../../fetching/patchCampaign';
import { ZetkinCampaign } from '../../../types/zetkin';

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

interface CampaignDetailsHeaderProps {
    campaign: ZetkinCampaign;
}

const CampaignDetailsHeader: React.FunctionComponent<CampaignDetailsHeaderProps> = ({ campaign }) => {
    const intl = useIntl();
    const queryClient = useQueryClient();
    const [editCampaignDialogOpen, setEditCampaignDialogOpen] = useState(false);
    const { campId, orgId } = useRouter().query;
    const classes = useStyles();

    const { data: events } = useQuery(
        ['campaignEvents', orgId, campId],
        getCampaignEvents(orgId as string, campId as string),
    );

    const sortedEvents = events ? [...events].sort((a, b) => {
        return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
    }): [];

    const startDate = sortedEvents[0]?.start_time;
    const endDate = sortedEvents[sortedEvents.length - 1]?.start_time;

    const campaignMutation = useMutation(patchCampaign(orgId as string, campId as string), {
        onSettled: () => queryClient.invalidateQueries('campaign'),
    });

    const handleEditCampaignFormSubmit = (data: Record<string, unknown>) => {
        campaignMutation.mutate(data);
        setEditCampaignDialogOpen(false);
    };

    return (
        <>
            <Box p={ 4 }>
                { campaign.info_text && (
                    <Typography variant="body1">
                        { campaign.info_text }
                    </Typography>
                ) }

                { /* First Row */ }
                <Box className={ classes.responsiveFlexBox } mt={ 2 }>
                    { /* Campaign Dates */ }
                    <Box flexGrow={ 1 } mb={ 2 }>
                        <Typography variant="h4">
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
                    </Box>
                    { /* Action Buttons */ }
                    <Box alignItems="center" display="flex" mb={ 2 }>
                        { /* Public Page Link */ }
                        <Box mr={ 1 }>
                            <NextLink href={ `/o/${orgId}/campaigns/${campId}` } passHref>
                                <Button color="primary">
                                    <Msg id="pages.organizeCampaigns.linkGroup.public"/>
                                </Button>
                            </NextLink>
                        </Box>
                        { /* Edit Campiagn Activator */ }
                        <Button color="primary" onClick={ () => setEditCampaignDialogOpen(true) } variant="contained">
                            <Msg id="pages.organizeCampaigns.linkGroup.settings"/>
                        </Button>
                    </Box>
                </Box>
                { /* Campaign Manager */ }
                { campaign.manager ? (
                    <NextLink href={ `/organize/${orgId}/people/${campaign.manager.id}` }>
                        <Box alignItems="center" display="flex">
                            <Box mr={ 1 }>
                                <Avatar
                                    src={ `/api/orgs/${orgId}/people/${campaign.manager.id}/avatar` }
                                />
                            </Box>
                            <Box display="flex" flexDirection="column">
                                <Typography variant="h6">{ campaign.manager.name }</Typography>
                                <Typography variant="body2">Role</Typography>
                            </Box>
                        </Box>
                    </NextLink>
                ) :
                    // If no campaign manager
                    <Typography variant="body1">
                        <Msg id="No campaign manager" />
                    </Typography>
                }

            </Box>

            <ZetkinDialog
                onClose={ () => setEditCampaignDialogOpen(false) }
                open={ editCampaignDialogOpen }
                title={ intl.formatMessage({ id: 'misc.formDialog.campaign.edit' }) }>
                <CampaignForm
                    campaign={ campaign }
                    onCancel={ () => setEditCampaignDialogOpen(false) }
                    onSubmit={ handleEditCampaignFormSubmit }
                />
            </ZetkinDialog>
        </>
    );
};

export default CampaignDetailsHeader;
