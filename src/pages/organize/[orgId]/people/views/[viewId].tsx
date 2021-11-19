import getOrg from 'fetching/getOrg';
import { GetServerSideProps } from 'next';
import getView from 'fetching/views/getView';

import { PageWithLayout } from 'types';
import { scaffold } from 'utils/next';
import SingleViewLayout from 'components/layout/organize/SingleViewLayout';


const scaffoldOptions = {
    authLevelRequired: 2,
    localeScope: [
    ],
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { orgId, viewId } = ctx.params!;

    await ctx.queryClient.prefetchQuery(
        ['org', orgId],
        getOrg(orgId as string, ctx.apiFetch),
    );
    const orgState = ctx.queryClient.getQueryState(['org', orgId]);

    await ctx.queryClient.prefetchQuery(
        ['views', viewId],
        getView(orgId as string, viewId as string, ctx.apiFetch),
    );

    const viewState = ctx.queryClient.getQueryState(['views', viewId]);

    if (orgState?.data && viewState?.data) {
        return {
            props: {
                orgId,
                viewId,
            },
        };
    }
    else {
        return {
            notFound: true,
        };
    }
}, scaffoldOptions);

type SingleViewPageProps = {
    orgId: string;
};

const SingleViewPage: PageWithLayout<SingleViewPageProps> = () => {
    return (
        <>
        </>
    );
};

SingleViewPage.getLayout = function getLayout(page) {
    return (
        <SingleViewLayout>
            { page }
        </SingleViewLayout>
    );
};

export default SingleViewPage;
