import { 
    GetServerSideProps,
    NextPageContext,
} from 'next';

export const getServerSideProps : GetServerSideProps = async (context : NextPageContext) => {
    const { orgId, campId } = context.params;
    let eventsData;
    let cIdData;
    let oData;

    try {
        const eventsRes = await fetch(`http://api.zetk.in/v1/orgs/${orgId}/campaigns/${campId}/actions`);
        eventsData = await eventsRes.json();

        const cIdRes = await fetch(`http://api.zetk.in/v1/orgs/${orgId}/campaigns/${campId}`);
        cIdData = await cIdRes.json();

        const oRes = await fetch(`https://api.zetk.in/v1/orgs/${orgId}`);
        oData = await oRes.json();
    } catch {
        return {
            notFound: true,
        };
    }

    if (!eventsData || !cIdData || !oData) {
        return {
            notFound: true,
        };
    }

    return { 
        props: { 
            org: oData.data,
            campaign: cIdData.data,
            events: eventsData.data,
        } 
    };
};

type OrgCampaignsPageProps = {
    org: Record<string, unknown>,
    campaign: array<Record<string, unknown>>,
    events: array<Record<string, unknown>>,
}

export default function OrgCampaignEventsPage(props : OrgCampaignsPageProps) : JSX.Element {
    const { org, campaign, events } = props;

    return (
        <>
            <h1>{ org.title }</h1>
            <h1>{ campaign.title }</h1>
            <ul>
                { events.map((e) => (
                    <li key={ e.id }>{ e.activity.title }</li>
                )) }
            </ul>
        </>
    );
}