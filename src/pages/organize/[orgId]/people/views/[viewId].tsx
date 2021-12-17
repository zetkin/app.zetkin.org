import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useQuery } from 'react-query';

import getView from 'fetching/views/getView';
import getViewColumns from 'fetching/views/getViewColumns';
import getViewRows from 'fetching/views/getViewRows';
import { PageWithLayout } from 'types';
import { scaffold } from 'utils/next';
import SingleViewLayout from 'components/layout/organize/SingleViewLayout';
import ViewDataTable from 'components/views/ViewDataTable';
import ZetkinQuery from 'components/ZetkinQuery';
import getOrg, { getOrgQueryKey } from 'fetching/getOrg';


const scaffoldOptions = {
    authLevelRequired: 2,
    localeScope: [
    ],
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { orgId, viewId } = ctx.params!;

    await ctx.queryClient.prefetchQuery(
        getOrgQueryKey(orgId as string),
        getOrg(orgId as string, ctx.apiFetch),
    );
    const orgState = ctx.queryClient.getQueryState(getOrgQueryKey(orgId as string));

    await ctx.queryClient.prefetchQuery(
        ['view', viewId],
        getView(orgId as string, viewId as string, ctx.apiFetch),
    );

    const viewState = ctx.queryClient.getQueryState(['view', viewId]);

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
    viewId: string;
};

const SingleViewPage: PageWithLayout<SingleViewPageProps> = ({ orgId, viewId }) => {
    return (
        <ZetkinQuery queries={{
            colsQuery: useQuery(['view', viewId, 'columns'], getViewColumns(orgId, viewId)),
            rowsQuery: useQuery(['view', viewId, 'rows'], getViewRows(orgId, viewId)),
            viewQuery: useQuery(['view', viewId], getView(orgId, viewId)),
        }}>
            { ({ queries: { colsQuery, rowsQuery, viewQuery } }) => (
                <>
                    <Head>
                        <title>{ viewQuery.data.title }</title>
                    </Head>
                    <ViewDataTable
                        columns={ colsQuery.data }
                        rows={ rowsQuery.data }
                        viewId={ viewId }
                    />
                </>
            ) }
        </ZetkinQuery>
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
