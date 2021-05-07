import { FormattedMessage as Msg } from 'react-intl';
import NextLink from 'next/link';
import { useQuery } from 'react-query';
import { Button, Flex, Heading, Link, View } from '@adobe/react-spectrum';

import getCampaigns from '../fetching/getCampaigns';
import { ZetkinCampaign } from '../types/zetkin';

interface DashboardCampaignProps {
    orgId: string;
}

const DashboardCampaigns = ({ orgId } : DashboardCampaignProps) : JSX.Element => {
    const campaignsQuery = useQuery(['campaigns', orgId], getCampaigns(orgId));
    const campaigns = campaignsQuery.data;

    return (
        <View>
            <Heading level={ 2 }>
                <Msg id="pages.organize.currentProjects.title"/>
            </Heading>
            { campaigns && (
                <ul style={{ padding: 0 }}>
                    { campaigns.map((item: ZetkinCampaign) => (
                        <li key={ item.id } style={{
                            border: '2px solid gray',
                            listStyle: 'none',
                            padding: '1rem',
                        }}>
                            <Link>
                                <NextLink href={ `/organize/${orgId}/campaigns/${item.id}` }>
                                    <a>{ item.title }</a>
                                </NextLink>
                            </Link>
                        </li>
                    )) }
                </ul>) }
            <Flex alignItems="center" justifyContent="end" margin="1rem 0rem">
                <Link>
                    <NextLink href={ `/organize/${orgId}/campaigns` }>
                        <a style={{ color: 'mediumpurple', margin:'0 2rem' }}>
                            <Msg id="pages.organize.currentProjects.all"/>
                        </a>
                    </NextLink>
                </Link>
                <NextLink href={ `/organize/${orgId}/campaigns/new` }>
                    <Button variant="cta">
                        <Msg id="pages.organize.currentProjects.new"/>
                    </Button>
                </NextLink>
            </Flex>
        </View>
    );
};

export default DashboardCampaigns;
