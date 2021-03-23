//TODO: Enable eslint rule and fix errors
/* eslint-disable  @typescript-eslint/no-non-null-assertion */
import { Content } from '@adobe/react-spectrum';
import { FormattedMessage as Msg } from 'react-intl';
import { ReactText } from 'react';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { Item, Tabs } from '@react-spectrum/tabs';

import DefaultOrgLayout from './DefaultOrgLayout';
import getOrg from '../../fetching/getOrg';
import OrgHeader from './OrgHeader';

interface MainOrgLayoutProps {
    children: JSX.Element;
    orgId: string;
}

const MainOrgLayout = ({ children, orgId } : MainOrgLayoutProps) : JSX.Element => {
    const orgQuery = useQuery(['org', orgId], getOrg(orgId));
    const router = useRouter();
    const path =  router.pathname.split('/');
    let currentTab = path.pop();

    if (currentTab === '[orgId]') {
        currentTab = 'home';
    }

    const onSelectTab = (key : ReactText) : void => {
        if (key === 'home') {
            router.push(`/o/${orgId}`);
        }
        else {
            router.push(`/o/${orgId}/${key}`);
        }
    };

    const tab1 = <Msg id="layout.org.tabs.home"/>;
    const tab2 = <Msg id="layout.org.tabs.comingUp"/>;
    const tab3 = <Msg id="layout.org.tabs.campaigns"/>;

    return (
        <DefaultOrgLayout orgId={ orgId }>
            <>
                <OrgHeader org={ orgQuery.data! }/>
                <Tabs
                    aria-label="Organization submenu"
                    onSelectionChange={ onSelectTab }
                    selectedKey={ currentTab }>
                    <Item key="home" title={ tab1 }>
                        <Content>{ children }</Content>
                    </Item>
                    <Item key="events" title={ tab2 }>
                        <Content>{ children }</Content>
                    </Item>
                    <Item key="campaigns" title={ tab3 }>
                        <Content>{ children }</Content>
                    </Item>
                </Tabs>
            </>
        </DefaultOrgLayout>
    );
};

export default MainOrgLayout;