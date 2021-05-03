import { FormattedMessage as Msg } from 'react-intl';
import NextLink from 'next/link';
import { useQuery } from 'react-query';
import { Button, Flex, Heading, Item, Link, ListBox, View } from '@adobe/react-spectrum';

import getCampaigns from '../fetching/getCampaigns';

interface DashboardCampaignProps {
    orgId: string;
}

const DashboardCampaigns = ({ orgId } : DashboardCampaignProps) : JSX.Element => {
    const campaignsQuery = useQuery(['campaigns', orgId], getCampaigns(orgId));

    return (
        <View>
            <Heading level={ 2 }>
                <Msg id="pages.organize.currentProjects.title"/>
            </Heading>
            <ListBox items={ campaignsQuery?.data } selectionMode="none">
                { (item) => <Item>{ item.title }</Item> }
            </ListBox>
            <Flex justifyContent="end">
                <Link>
                    <NextLink href={ `/organize/${orgId}/campaigns` }>
                        <a>
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
