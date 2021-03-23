//TODO: Enable eslint rule and fix errors
/* eslint-disable  @typescript-eslint/no-non-null-assertion */
import { Content } from '@adobe/react-spectrum';
import { useQuery } from 'react-query';

import DefaultLayout from './DefaultLayout';
import getOrg from '../../fetching/getOrg';

interface SimpleOrgLayoutProps {
    children: JSX.Element;
    orgId: string;
}

const SimpleOrgLayout = ({ children, orgId } : SimpleOrgLayoutProps) : JSX.Element => {
    const orgQuery = useQuery(['org', orgId], getOrg(orgId));

    return (
        <DefaultLayout org={ orgQuery.data! }>
            <Content>{ children }</Content>
        </DefaultLayout>
    );
};

export default SimpleOrgLayout;