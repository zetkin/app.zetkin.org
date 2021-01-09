import { GetServerSideProps } from 'next';
import Link from 'next/link';

export const getServerSideProps : GetServerSideProps = async (context) => {
    let props;

    try {
        const { orgId } = context.params;

        const res = await fetch(`http://api.zetk.in/v1/orgs/${orgId}`);
        const data = await res.json();

        props = {
            org: data.data,
        };
    }
    catch (err) {
        if (err.name != 'FetchError') {
            throw err;
        }
    }

    if (props) {
        return { props };
    }
    else {
        return {
            notFound: true,
        };
    }
};

type OrgPageProps = {
    org: Record<string, unknown>,
}

export default function OrgPage(props : OrgPageProps) : JSX.Element {
    const { org } = props;

    return ( 
        <>
            <h1>{ org.title }</h1>
            <ul>
                <li><Link href={ `/o/${org.id}/campaigns` }>Campaigns</Link></li>
                <li><Link href={ `/o/${org.id}/events` }>Events</Link></li>
            </ul>
        </>
    );
}