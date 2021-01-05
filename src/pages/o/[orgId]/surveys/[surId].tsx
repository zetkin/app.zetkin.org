import { 
    GetServerSideProps,
    NextPageContext,
} from 'next';

export const getServerSideProps : GetServerSideProps = async (context : NextPageContext) => {
    const { orgId, surId } = context.params;
    let sIdData;
    let oData;

    try {
        const sIdRes = await fetch(`http://api.zetk.in/v1/orgs/${orgId}/surveys/${surId}`);
        sIdData = await sIdRes.json();

        const oRes = await fetch(`https://api.zetk.in/v1/orgs/${orgId}`);
        oData = await oRes.json();
    } catch {
        return {
            notFound: true,
        };
    }

    if (!sIdData || !oData) {
        return {
            notFound: true,
        };
    }

    return { 
        props: {
            org: oData.data,
            survey: sIdData.data,
        } 
    };
};

type OrgSurveyPageProps = {
    org: Record<string, unknown>,
    survey: array<Record<string, unknown>>,
}

export default function OrgSurveyPage(props : OrgSurveyPageProps) : JSX.Element {
    const { survey, org } = props;

    return (
        <>
            <h1>{ org.title }</h1>
            <h1>{ survey.title }</h1>
        </>
    );
}