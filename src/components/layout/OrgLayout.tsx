//TODO: Enable eslint rule and fix errors
/* eslint-disable  @typescript-eslint/no-non-null-assertion */
import { Content } from '@react-spectrum/view';
import { ReactText } from 'react';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { Item, Tabs } from '@react-spectrum/tabs';

import DefaultLayout from './DefaultLayout';
import getOrg from '../../fetching/getOrg';
import OrgHeader from './OrgHeader';

interface OrgLayoutProps {
    children: JSX.Element;
    orgId: string;
}

const OrgLayout = ({ children, orgId } : OrgLayoutProps) : JSX.Element => {
    const orgQuery = useQuery(['org', orgId], getOrg(orgId));
    const router = useRouter();

    const onSelectTab = (key : ReactText) : void => {
        router.push(`/o/${orgId}/${key}`);
    };

    const currentTab = router.pathname.split('/').pop();

    return (
        <DefaultLayout>
            <OrgHeader org={ orgQuery.data! }/>
            <Tabs
                aria-label="Organization submenu"
                onSelectionChange={ onSelectTab }
                selectedKey={ currentTab }>
                <Item key="events" title="Coming up">
                    <Content>{ children }</Content>
                </Item>
                <Item key="contact" title="Contact">
                    <Content>{ children }</Content>
                </Item>
                <Item key="custom" title="Some Custom Page">
                    <Content>{ children }</Content>
                </Item>
            </Tabs>
        </DefaultLayout>
    );
};

export default OrgLayout;