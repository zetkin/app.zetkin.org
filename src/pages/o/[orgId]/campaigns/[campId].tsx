import { 
    GetServerSideProps,
    NextPageContext,
} from 'next';

export const getServerSideProps : GetServerSideProps = async (context : NextPageContext) => {
    const { orgId, campId } = context.params;
    let cIdData;
    let oData;

    try {
        const cIdRes = await fetch(`http://api.zetk.in/v1/orgs/${orgId}/campaigns/${campId}`);
        cIdData = await cIdRes.json();

        const oRes = await fetch(`https://api.zetk.in/v1/orgs/${orgId}`);
        oData = await oRes.json();
    } catch {
        return {
            notFound: true,
        };
    }

    if (!cIdData || !oData) {
        return {
            notFound: true,
        };
    }

    return { 
        props: { 
            campaign: cIdData.data,
            org: oData.data,
        } 
    };
};

type OrgCampaignsPageProps = {
    org: Record<string, unknown>,
    campaign: array<Record<string, unknown>>,
}

export default function OrgCampaignPage(props : OrgCampaignsPageProps) : JSX.Element {
    const { campaign, org } = props;

    return (
        <>
            <h1>{ org.title }</h1>
            <h1>{ campaign.title }</h1>
        </>
    );
}