import Link from 'next/link';
import getOrg from '../fetching/getOrg';
import { useQuery } from 'react-query';

interface OrgHeaderProps {
    orgId: string;
}

const OrgHeader = ({ orgId } : OrgHeaderProps) : JSX.Element => {
    const orgQuery = useQuery(['org', orgId], getOrg(orgId));

    return (
        <header style={{
            position: 'relative',
        }}>
            <figure style={{
                alignItems: 'flex-end',
                background: 'url(/cover.jpg)',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                boxSizing: 'border-box',
                display: 'flex',
                height: '500px',
                justifyContent: 'flex-end',
                margin: '0',
                padding: '1rem',
                width: '100%'
            }}>
                <Link href='/'>
                    <a style={{ color: 'white' }}>Edit Page</a>
                </Link>
                <button style={{ marginLeft: '20px' }}>Unfollow</button>
            </figure>
            <img
                alt='Organization avatar'
                src={ `https://api.zetk.in/v1/orgs/${orgId}/avatar` }
                style={{
                    height: 'auto',
                    left: '1rem',
                    position: 'absolute',
                    top: '450px',
                    width: '100px'
                }}
            />
            <h1 style={{
                height: '100%',
                margin: '1rem 2rem 1rem 10rem',
                textAlign: 'left'
            }}>
                { orgQuery.data.title }
            </h1>
        </header>
    );
};

export default OrgHeader;