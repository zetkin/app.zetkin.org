import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Box, Button, makeStyles, Typography } from '@material-ui/core';
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
            { /* First Row */ }
            <Box className={ classes.responsiveFlexBox } p={ 5 }>
                { /* Campaign Dates */ }
                <Box flexGrow={ 1 }>
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
                <Box alignItems="center" display="flex">
                    { /* Public Page Link */ }
                    <NextLink href={ `/o/${orgId}/campaigns/${campId}` } passHref>
                        <Button color="primary">
                            <Msg id="pages.organizeCampaigns.linkGroup.public"/>
                        </Button>
                    </NextLink>
                    { /* Edit Campiagn Activator */ }
                    <Button color="primary" onClick={ () => setEditCampaignDialogOpen(true) } variant="contained">
                        <Msg id="pages.organizeCampaigns.linkGroup.settings"/>
                    </Button>
                </Box>
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
