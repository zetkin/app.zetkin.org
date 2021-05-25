import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { Content, Flex, Heading, View } from '@adobe/react-spectrum';
import { FunctionComponent, ReactText } from 'react';
import { Item, Tabs } from '@react-spectrum/tabs';

import getCampaign from '../../fetching/getCampaign';
import OrganizeLayout from './OrganizeLayout';

interface OrganizeCampaignLayoutProps {
    campId: string;
    orgId: string;
}

const OrganizeCampaignLayout : FunctionComponent<OrganizeCampaignLayoutProps> = ({ children, orgId, campId }) => {
    const router = useRouter();
    const intl = useIntl();

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
                <View flexGrow={ 1 } padding="0 1rem" width="100%">
                    <Tabs aria-label="Campaign Menu"
                        onSelectionChange={ onSelectTab }
                        selectedKey={ currentTab }>
                        <Item key="summary" title={ intl.formatMessage({
                            id: 'layout.organize.campaigns.summary',
                        }) }>
                            <Content>{ children }</Content>
                        </Item>
                        <Item key="calendar" title={ intl.formatMessage({
                            id: 'layout.organize.campaigns.calendar',
                        }) }>
                            <View flexGrow={ 1 } maxHeight="90vh">
                                { children }
                            </View>
                        </Item>
                        <Item key="insights" title={ intl.formatMessage({
                            id: 'layout.organize.campaigns.insights',
                        }) }>
                            <Content>{ children }</Content>
                        </Item>
                    </Tabs>
                </View>
            </Flex>
        </OrganizeLayout>
    );
};

export default OrganizeCampaignLayout;