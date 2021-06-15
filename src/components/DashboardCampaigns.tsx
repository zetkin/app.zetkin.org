import grey from '@material-ui/core/colors/grey';
import { FormattedMessage as Msg } from 'react-intl';
import NextLink from 'next/link';
import { useQuery } from 'react-query';
import { Box, Button, Link, List, ListItem, makeStyles, Typography } from '@material-ui/core';

import getCampaigns from '../fetching/getCampaigns';
import { ZetkinCampaign } from '../types/zetkin';

interface DashboardCampaignProps {
    orgId: string;
}

const useStyles = makeStyles((theme) => ({
    responsiveFlexBox: {
        alignItems: 'center',
        display: 'flex',
        gap: '5%',
        justifyContent: 'flex-end',
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
        },
    },
}));

const DashboardCampaigns = ({ orgId } : DashboardCampaignProps) : JSX.Element => {
    const campaignsQuery = useQuery(['campaigns', orgId], getCampaigns(orgId));
    const campaigns = campaignsQuery.data;
    const classes = useStyles();

    return (
        <Box border={ 1 } m={ 2 } p={ 2 }>
            <Typography component="h2" variant="body1">
                <Msg id="pages.organize.currentProjects.title"/>
            </Typography>
            { campaigns && (
                <Typography variant="h5">
                    <List>
                        { campaigns.map((item: ZetkinCampaign) => (
                            <ListItem key={ item.id } style={{ background: grey[200], border: '1px solid', margin: '1rem 0'  }}>
                                <NextLink href={ `/organize/${orgId}/campaigns/${item.id}` } passHref>
                                    <Link color="inherit">
                                        { item.title }
                                    </Link>
                                </NextLink>
                            </ListItem>
                        )) }
                    </List>
                </Typography>
            ) }
            <Box className={ classes.responsiveFlexBox }>
                <NextLink href={ `/organize/${orgId}/campaigns` } passHref>
                    <Link>
                        <Msg id="pages.organize.currentProjects.all"/>
                    </Link>
                </NextLink>
                <NextLink href={ `/organize/${orgId}/campaigns/new` } passHref>
                    <Button color="primary" variant="outlined">
                        <Msg id="pages.organize.currentProjects.new"/>
                    </Button>
                </NextLink>
            </Box>
        </Box>
    );
};

export default DashboardCampaigns;
