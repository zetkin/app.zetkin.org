import { 
    GetServerSideProps,
    NextPageContext,
} from 'next';

export const getServerSideProps : GetServerSideProps = async (context : NextPageContext) => {
    const { orgId } = context.params;
    let allEventsData = [];
    let cData;
    let oData;

    try {
        const cRes = await fetch(`http://api.zetk.in/v1/orgs/${orgId}/campaigns`);
        cData = await cRes.json();
    } catch {
        return {
            notFound: true,
        };
    }

    for (const obj of cData.data) {
        const eventsRes = await fetch(`https://api.zetk.in/v1/orgs/${orgId}/campaigns/${obj.id}/actions`);
        const campaignEvents = await eventsRes.json();
        allEventsData = allEventsData.concat(campaignEvents.data);
    }

    try {
        const oRes = await fetch(`https://api.zetk.in/v1/orgs/${orgId}`);
        oData = await oRes.json();
    } catch {
        return {
            notFound: true,
        };
    }

    if (!allEventsData || !oData) {
        return {
            notFound: true,
        };
    }

    return { 
        props: { 
            org: oData.data, 
            events: allEventsData,
        } 
    };
};

type OrgEventsPageProps = {
    org: Record<string, unknown>,
    events: array<Record<string, unknown>>,
}

export default function OrgEventsPage(props : OrgEventsPageProps) : JSX.Element {
    const { org, events } = props;

    return (
        <>
            <h1>Events for { org.title }</h1>
            <ul>
                { events.map((e) => (
                    <li key={ e.id }>{ e.title }</li>
                )) }
            </ul>
        </>
    );
}