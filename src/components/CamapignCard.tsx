import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Card, CardActions, CardContent, Link, Typography } from '@material-ui/core';
import { FormattedDate, FormattedMessage as Msg } from 'react-intl';

import { getNaiveDate } from '../utils/getNaiveDate';
import { ZetkinCampaign, ZetkinEvent } from '../types/zetkin';

interface CampaignCardProps {
    campaign: ZetkinCampaign;
    events: ZetkinEvent[];
    upcomingEvents: ZetkinEvent[];
}

const CamapignCard = ({ campaign, events, upcomingEvents }: CampaignCardProps) : JSX.Element => {
    const { orgId } = useRouter().query;
    const { id, title } = campaign;

    const campaignEvents = events.filter(e => e.campaign.id === id);
    const campaignUpcomingEvents = upcomingEvents.filter(e => e.campaign?.id === id);

    let endDate, startDate;

    const firstEvent = campaignEvents[0];
    const lastEvent = campaignEvents[campaignEvents.length - 1];
    if (firstEvent && lastEvent) {
        startDate = getNaiveDate(firstEvent.start_time) ;
        endDate = getNaiveDate(lastEvent.end_time);
    }

    return (
        <Card style={{  padding: '1rem', width:'100%' }}>
            <CardContent>
                <Typography gutterBottom noWrap variant="h6">
                    { title }
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
                <NextLink href={ `/organize/${orgId}/campaigns/${id}` } passHref>
                    <Link underline="always" variant="subtitle1">
                        <Msg id="pages.organizeAllCampaigns.cardCTA" />
                    </Link>
                </NextLink>
            </CardActions>
        </Card>
    );
};

export default CamapignCard;
