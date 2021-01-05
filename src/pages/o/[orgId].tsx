import {
    GetServerSideProps,
    NextPageContext,
} from 'next';
import Link from 'next/link';

export const getServerSideProps : GetServerSideProps = async (context : NextPageContext) => {
    const { orgId } = context.params;
    let data;

    try {
        const res = await fetch(`http://api.zetk.in/v1/orgs/${orgId}`);
        data = await res.json();
    } catch {
        return {
            notFound: true,
        };
    }

    if (!data) {
        return {
            notFound: true,
        };
    }

    return { 
        props: { 
            org: data.data, 
        } 
    };
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