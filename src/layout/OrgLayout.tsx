import getOrg from '../fetching/getOrg';
import { useQuery } from 'react-query';

import OrgHeader from '../components/OrgHeader';

interface OrgLayoutProps {
    children: JSX.Element;
    orgId: string;
}

const OrgLayout = ({ children, orgId } : OrgLayoutProps) : JSX.Element => {
    const orgQuery = useQuery(['org', orgId], getOrg(orgId));

    return (
        <div>
            <OrgHeader org={ orgQuery.data }/>
            <div>{ children }</div>
        </div>
    );
};

export default OrgLayout;