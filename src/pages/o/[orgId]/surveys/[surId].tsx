import { GetServerSideProps } from 'next';

export const getServerSideProps : GetServerSideProps = async (context) => {
    const { orgId, surId } = context.params;
    let props;

    try {
        const { orgId, surId } = context.params;

        const sIdRes = await fetch(`http://api.zetk.in/v1/orgs/${orgId}/surveys/${surId}`);
        const sIdData = await sIdRes.json();
        const oRes = await fetch(`https://api.zetk.in/v1/orgs/${orgId}`);
        const oData = await oRes.json();

        props = {
            org: oData.data,
            survey: sIdData.data,
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