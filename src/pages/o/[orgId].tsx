import { GetServerSideProps } from 'next';
import { useQuery } from 'react-query';

import getOrg from '../../fetching/getOrg';
import MainOrgLayout from '../../components/layout/MainOrgLayout';
import { PageWithLayout } from '../../types';
import { scaffold } from '../../utils/next';

export const getServerSideProps : GetServerSideProps = scaffold(async (context) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { orgId } = context.params!;

    await context.queryClient.prefetchQuery(['org', orgId], getOrg(orgId as string));

    const orgState = context.queryClient.getQueryState(['org', orgId]);

    if (orgState?.status === 'success') {
        return {
            props: {
                orgId,
            },
        };
    }
    else {
        return {
            notFound: true,
        };
    }
});

type OrgPageProps = {
    orgId: string;
};

const OrgPage : PageWithLayout<OrgPageProps> = (props) =>{
    const { orgId } = props;
    const orgQuery = useQuery(['org', orgId], getOrg(orgId));

    return (
        <>
            <h1>{ orgQuery.data?.title }</h1>
        </>
    );
};

OrgPage.getLayout = function getLayout(page, props) {
    return (
        <MainOrgLayout orgId={ props.orgId as string }>
            { page }
        </MainOrgLayout>
    );
};

export default OrgPage;