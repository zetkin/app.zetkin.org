//TODO: Enable eslint rule and fix errors
/* eslint-disable  @typescript-eslint/no-non-null-assertion */
import { Content } from '@adobe/react-spectrum';
import { useQuery } from 'react-query';

import DefaultLayout from './DefaultLayout';
import getOrg from '../../fetching/getOrg';

interface OrgLayoutProps {
    children: JSX.Element;
    orgId: string;
}

const OrgLayout = ({ children, orgId } : OrgLayoutProps) : JSX.Element => {
    const orgQuery = useQuery(['org', orgId], getOrg(orgId));

    return (
        <DefaultLayout org={ orgQuery.data! }>
            <Content>{ children }</Content>
        </DefaultLayout>
    );
};

export default OrgLayout;