import { 
    GetServerSideProps,
    NextPageContext,
} from 'next';

export const getServerSideProps : GetServerSideProps = async (context : NextPageContext) => {
    const { orgId, eventId } = context.params;
    let allEventsData = [];
    let eventData = [];
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
        eventData = allEventsData.find(event => event.id == eventId);
        if (eventData) {
            break;
        }
    }

    try {
        const oRes = await fetch(`https://api.zetk.in/v1/orgs/${orgId}`);
        oData = await oRes.json();
    } catch {
        return {
            notFound: true,
        };
    }

    if (!eventData || !cData || !oData) {
        return {
            notFound: true,
        };
    }

    return { 
        props: { 
            org: oData.data,
            eventData: eventData,
        } 
    };
};

type OrgEventsPageProps = {
    org: Record<string, unknown>,
    eventData: Record<string, unknown>,
}

export default function OrgEventsPage(props : OrgEventsPageProps) : JSX.Element {
    const { org, eventData } = props;

    return (
        <>
            <h1>{ org.title }</h1>
            <h1>{ eventData.title }</h1>
        </>
    );
}