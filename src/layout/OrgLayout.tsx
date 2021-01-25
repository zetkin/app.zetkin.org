import DefaultLayout from './DefaultLayout';
import OrgHeader from './OrgHeader';
import getOrg from '../fetching/getOrg';
import { useQuery } from 'react-query';

interface OrgLayoutProps {
    children: JSX.Element;
    orgId: string;
}

const OrgLayout = ({ children, orgId } : OrgLayoutProps) : JSX.Element => {
    const orgQuery = useQuery(['org', orgId], getOrg(orgId));

    return (
        <DefaultLayout>
            <OrgHeader org={ orgQuery.data }/>
            <nav style={{
                display: 'flex',
                justifyContent: 'flex-start',
                margin: '0',
                padding: '1rem'
            }}>
                <button style={{ display: 'flex', margin: '0 1rem 0 0' }}>Coming up</button>
                <button style={{ display: 'flex', margin: '0 1rem 0 0' }}>Contact</button>
                <button style={{ display: 'flex', margin: '0 1rem 0 0' }}>Some Custom Page</button>
            </nav>
            <div>{ children }</div>
        </DefaultLayout>
    );
};

export default OrgLayout;