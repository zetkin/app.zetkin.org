//TODO: Enable eslint rule and fix errors
/* eslint-disable  @typescript-eslint/no-non-null-assertion */
import { FunctionComponent } from 'react';
import { useQuery } from 'react-query';

import DefaultLayout from './DefaultLayout';
import getOrg from '../../fetching/getOrg';

interface DefaultOrgLayoutProps {
    orgId: string;
}

const DefaultOrgLayout : FunctionComponent<DefaultOrgLayoutProps> = ({ children, orgId }) => {
    const orgQuery = useQuery(['org', orgId], getOrg(orgId));

    return (
        <DefaultLayout org={ orgQuery.data! }>
            { children }
        </DefaultLayout>
    );
};

export default DefaultOrgLayout;