import { GetServerSideProps } from 'next';

export const getServerSideProps : GetServerSideProps = async (context) => {
    let props;

    try {
        const { orgId } = context.params;

        const cRes = await fetch(`http://api.zetk.in/v1/orgs/${orgId}/campaigns`);
        const cData = await cRes.json();
        const oRes = await fetch(`https://api.zetk.in/v1/orgs/${orgId}`);
        const oData = await oRes.json();

        props = {
            org: oData.data,
            campaigns: cData.data,
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
    org: Record<string, unknown>,
    campaigns: array<Record<string, unknown>>,
}

export default function OrgCampaignsPage(props : OrgCampaignsPageProps) : JSX.Element {
    const { org, campaigns } = props;

    return (
        <>
            <h1>Campaigns for { org.title }</h1>
            <ul>
                { campaigns.map((c) => (
                    <li key={ c.id }>{ c.title }</li>
                )) }
            </ul>
        </>
    );
}