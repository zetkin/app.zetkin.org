import { GetServerSideProps } from 'next';
import Head from 'next/head';
import NProgress from 'nprogress';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import getOrg from 'fetching/getOrg';
import getView from 'fetching/views/getView';
import getViewColumns from 'fetching/views/getViewColumns';
import getViewRows from 'fetching/views/getViewRows';
import { PageWithLayout } from 'types';
import postViewColumn from 'fetching/views/postViewColumn';
import { scaffold } from 'utils/next';
import SingleViewLayout from 'components/layout/organize/SingleViewLayout';
import ViewDataTable from 'components/views/ViewDataTable';
import ZetkinQuery from 'components/ZetkinQuery';
import ViewColumnDialog, { ColumnEditorColumnSpec } from 'components/views/ViewColumnDialog';


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
    viewId: string;
};

const SingleViewPage: PageWithLayout<SingleViewPageProps> = ({ orgId, viewId }) => {
    const [columnDialogOpen, setColumnDialogOpen] = useState(false);
    const queryClient = useQueryClient();

    const addColumnMutation = useMutation(postViewColumn(orgId, viewId), {
        onError: () => {
            // TODO: Show error dialog
            NProgress.done();
        },
        onSettled: () => {
            NProgress.done();
            queryClient.invalidateQueries(['views', orgId]);
        },
        onSuccess: () => queryClient.invalidateQueries(['views', viewId]),
    });

    const onColumnCancel = () => {
        setColumnDialogOpen(false);
    };

    const onColumnSave = (colSpec : ColumnEditorColumnSpec) => {
        setColumnDialogOpen(false);
        NProgress.start();
        addColumnMutation.mutate(colSpec);
    };

    return (
        <ZetkinQuery queries={{
            colsQuery: useQuery(['views', viewId, 'columns'], getViewColumns(orgId, viewId)),
            rowsQuery: useQuery(['views', viewId, 'rows'], getViewRows(orgId, viewId)),
            viewQuery: useQuery(['views', viewId], getView(orgId, viewId)),
        }}>
            { ({ queries: { colsQuery, rowsQuery, viewQuery } }) => (
                <>
                    <Head>
                        <title>{ viewQuery.data.title }</title>
                    </Head>
                    <ViewDataTable
                        columns={ colsQuery.data }
                        onAddColumn={ () => setColumnDialogOpen(true) }
                        rows={ rowsQuery.data }
                    />
                    { columnDialogOpen && (
                        <ViewColumnDialog onCancel={ onColumnCancel } onSave={ onColumnSave }/>
                    ) }
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
