import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { Flex, Heading, View } from '@adobe/react-spectrum';
import { FunctionComponent, ReactText } from 'react';

import getCampaign from '../../fetching/getCampaign';
import OrganizeCampaignTabs from '../OrganizeCampaignTabs';
import OrganizeLayout from './OrganizeLayout';

interface OrganizeCampaignLayoutProps {
    campId: string;
    orgId: string;
}

const OrganizeCampaignLayout : FunctionComponent<OrganizeCampaignLayoutProps> = ({ orgId, campId, children }) => {
    const router = useRouter();

    const campQuery = useQuery(['campaign', orgId, campId], getCampaign(orgId, campId));

    const path =  router.pathname.split('/');
    let currentTab = path.pop();

    if (currentTab === '[campId]') {
        currentTab = 'summary';
    }

    const onSelectTab = (key : ReactText) : void => {
        if (key === 'summary') {
            router.push(`/organize/${orgId}/campaigns/${campId}`);
        }
        else {
            router.push(`/organize/${orgId}/campaigns/${campId}/${key}`);
        }
    };

    return (
        <OrganizeLayout orgId={ orgId }>
            <Flex direction="column" flexGrow={ 1 }>
                <View flexShrink={ 0 } padding="0 2rem">
                    <Heading level={ 2 }>{ campQuery.data?.title }</Heading>
                </View>
                <OrganizeCampaignTabs currentTab={ currentTab } onSelectTab={ onSelectTab }> { children }</OrganizeCampaignTabs>
            </Flex>
        </OrganizeLayout>
    );
};

export default OrganizeCampaignLayout;