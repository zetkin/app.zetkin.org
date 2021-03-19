//TODO: Enable eslint rule and fix errors
/* eslint-disable  @typescript-eslint/no-non-null-assertion */
import { FormattedMessage as Msg } from 'react-intl';
import { ReactText } from 'react';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { Content, Header, Image } from '@adobe/react-spectrum';
import { Item, Tabs } from '@react-spectrum/tabs';

import DefaultLayout from './DefaultLayout';
import getOrg from '../../fetching/getOrg';
import OrgHeader from './OrgHeader';

interface OrgLayoutProps {
    children: JSX.Element;
    mainPage: boolean;
    orgId: string;
}

const OrgLayout = ({ children, mainPage, orgId } : OrgLayoutProps) : JSX.Element => {
    const orgQuery = useQuery(['org', orgId], getOrg(orgId));
    const router = useRouter();
    const path =  router.pathname.split('/');
    let currentTab = path.pop();

    if (mainPage) {

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
            //TODO: Break out into separate meta layout component
            <DefaultLayout org={ orgQuery.data! }>
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
            </DefaultLayout>
        );
    }
    return (
        //TODO: Break out into separate meta layout component
        <DefaultLayout org={ orgQuery.data! }>
            <Header>
                <Image
                    alt="Cover image"
                    height="size-2000"
                    objectFit="cover"
                    src="/cover.jpg"
                    width="100%"
                />
            </Header>
            <Content>{ children }</Content>
        </DefaultLayout>
    );
};

export default OrgLayout;