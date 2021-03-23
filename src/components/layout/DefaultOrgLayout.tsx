//TODO: Enable eslint rule and fix errors
/* eslint-disable  @typescript-eslint/no-non-null-assertion */
import { useQuery } from 'react-query';

import DefaultLayout from './DefaultLayout';
import getOrg from '../../fetching/getOrg';

interface DefaultOrgLayoutProps {
    children: JSX.Element;
    orgId: string;
}

const DefaultOrgLayout = ({ children, orgId } : DefaultOrgLayoutProps) : JSX.Element => {
    const orgQuery = useQuery(['org', orgId], getOrg(orgId));

    return (
        <DefaultLayout org={ orgQuery.data! }>
            { children }
        </DefaultLayout>
    );
};

export default DefaultOrgLayout;