import DefaultLayout from './DefaultLayout';
import OrgHeader from './OrgHeader';

interface OrgLayoutProps {
    children: JSX.Element;
    orgId: string;
}

const OrgLayout = ({ children, orgId } : OrgLayoutProps) : JSX.Element => {
    return (
        <DefaultLayout>
            <OrgHeader orgId={ orgId }/>
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