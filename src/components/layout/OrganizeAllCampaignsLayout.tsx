import { FormattedMessage as Msg } from 'react-intl';
import { useRouter } from 'next/router';
import { Flex, Heading, View } from '@adobe/react-spectrum';
import { FunctionComponent, ReactText } from 'react';

import OrganizeCampaignTabs from '../OrganizeCampaignTabs';
import OrganizeLayout from './OrganizeLayout';

interface OrganizeAllCampaignsLayoutProps {
    orgId: string;
}

const OrganizeAllCampaignsLayout : FunctionComponent<OrganizeAllCampaignsLayoutProps> = ({ orgId, children }) => {
    const router = useRouter();

    const path =  router.pathname.split('/');
    let currentTab = path.pop();

    if (currentTab === 'campaigns') {
        currentTab = 'summary';
    }

    const onSelectTab = (key : ReactText) : void => {
        if (key === 'summary') {
            router.push(`/organize/${orgId}/campaigns`);
        }
        else {
            router.push(`/organize/${orgId}/campaigns/${key}`);
        }
    };

    return (
        <OrganizeLayout orgId={ orgId }>
            <Flex direction="column" flexGrow={ 1 }>
                <View flexShrink={ 0 } padding="0 2rem">
                    <Heading level={ 2 }>
                        <Msg id="layout.organize.campaigns.allCampaigns"/>
                    </Heading>
                </View>
                <OrganizeCampaignTabs currentTab={ currentTab } onSelectTab={ onSelectTab }> { children }</OrganizeCampaignTabs>
            </Flex>
        </OrganizeLayout>
    );
};

export default OrganizeAllCampaignsLayout;