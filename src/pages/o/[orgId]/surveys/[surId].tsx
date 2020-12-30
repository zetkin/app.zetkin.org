import { 
    GetServerSideProps,
    NextPageContext,
} from 'next';

export const getServerSideProps : GetServerSideProps = async (context : NextPageContext) => {
    const { orgId } = context.params;
    const { surId } = context.params;

    const sIdRes = await fetch(`http://api.zetk.in/v1/orgs/${orgId}/surveys/${surId}`);
    const sIdData = await sIdRes.json();

    const oRes = await fetch(`https://api.zetk.in/v1/orgs/${orgId}`);
    const oData = await oRes.json();

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