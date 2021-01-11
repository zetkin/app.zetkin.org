import { GetServerSideProps } from 'next';

export const getServerSideProps : GetServerSideProps = async (context) => {
    let props;

    try {
        const { orgId, campId } = context.params;

        const eventsRes = await fetch(`http://api.zetk.in/v1/orgs/${orgId}/campaigns/${campId}/actions`);
        const eventsData = await eventsRes.json();
        const cIdRes = await fetch(`http://api.zetk.in/v1/orgs/${orgId}/campaigns/${campId}`);
        const cIdData = await cIdRes.json();
        const oRes = await fetch(`https://api.zetk.in/v1/orgs/${orgId}`);
        const oData = await oRes.json();

        props = {
            campaign: cIdData.data,
            events: eventsData.data,
            org: oData.data,
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

type OrgCampaignsPageProps = {
    campaign: {
        title: string,
    },
    events: Array<{
        activity: {
            title: string,
        },
        id: number,
        title: string,
    }>,
    org: {
        title: string,
    },
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