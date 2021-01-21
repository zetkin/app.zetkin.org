import getOrg from '../fetching/getOrg';
import { useQuery } from 'react-query';

interface OrgLayoutProps {
    children: JSX.Element;
    orgId: string;
}

const OrgLayout = ({ children, orgId } : OrgLayoutProps) : JSX.Element => {
    const orgQuery = useQuery(['org', orgId], getOrg(orgId));

    return (
        <div>
            <h1>{ orgQuery.data.title }</h1>
            <div>{ children }</div>
        </div>
    );
};

export default OrgLayout;