import { Content } from '@react-spectrum/view';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { Item, Tabs } from '@react-spectrum/tabs';

import DefaultLayout from './DefaultLayout';
import getOrg from '../fetching/getOrg';
import OrgHeader from './OrgHeader';

interface OrgLayoutProps {
    children: JSX.Element;
    orgId: string;
}

const OrgLayout = ({ children, orgId } : OrgLayoutProps) : JSX.Element => {
    const orgQuery = useQuery(['org', orgId], getOrg(orgId));
    const router = useRouter();

    const onSelectTab = (key) : Promise<boolean> => {
        return router.push(`/o/${orgId}/${key}`);
    };

    const currentTab = router.pathname.split('/').pop();

    return (
        <DefaultLayout>
            <OrgHeader org={ orgQuery.data }/>
            <Tabs
                aria-label='Organization submenu'
                selectedKey={ currentTab }
                onSelectionChange={ onSelectTab }>
                <Item title='Coming up' key='events'>
                    <Content>{ children }</Content>
                </Item>
                <Item title='Contact' key='contact'>
                    <Content>{ children }</Content>
                </Item>
                <Item title='Some Custom Page' key='custom'>
                    <Content>{ children }</Content>
                </Item>
            </Tabs>
        </DefaultLayout>
    );
};

export default OrgLayout;