import { GetServerSideProps } from 'next';

export const getServerSideProps : GetServerSideProps = async (context) => {
    let props;

    try {
        const { orgId, eventId } = context.params;

        const cRes = await fetch(`http://api.zetk.in/v1/orgs/${orgId}/campaigns`);
        const cData = await cRes.json();
        const oRes = await fetch(`https://api.zetk.in/v1/orgs/${orgId}`);
        const oData = await oRes.json();

        let allEventsData = [];
        let eventData = [];

        for (const obj of cData.data) {
            const eventsRes = await fetch(`https://api.zetk.in/v1/orgs/${orgId}/campaigns/${obj.id}/actions`);
            const campaignEvents = await eventsRes.json();
            allEventsData = allEventsData.concat(campaignEvents.data);
            eventData = allEventsData.find(event => event.id == eventId);
            if (eventData) {
                break;
            }
        }

        if (eventData) {
            props = {
                org: oData.data,
                eventData,
            };
        }
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

type OrgEventsPageProps = {
    eventData: {
        title: string,
    },
    org: {
        title: string,
    },
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