import { Avatar } from '@material-ui/core';
import { GetServerSideProps } from 'next';
import { Heading } from '@adobe/react-spectrum';
import { useQuery } from 'react-query';
import {
    GridColDef,
    GridColumns,
    GridRowData,
    GridRowsProp,
    XGrid,
} from '@material-ui/x-grid';

import { defaultFetch } from '../../../../../fetching';
import getOrg from '../../../../../fetching/getOrg';
import OrganizeLayout from '../../../../../components/layout/OrganizeLayout';
import { PageWithLayout } from '../../../../../types';
import { scaffold } from '../../../../../utils/next';

const scaffoldOptions = {
    authLevelRequired: 2,
    localeScope: [
        'layout.organize', 'misc.breadcrumbs',
    ],
};

export const getServerSideProps : GetServerSideProps = scaffold(async (ctx) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { orgId, viewId } = ctx.params!;

    await ctx.queryClient.prefetchQuery(['org', orgId], getOrg(orgId as string, ctx.apiFetch));
    await ctx.queryClient.prefetchQuery(['view', viewId], async () => {
        const res = await ctx.apiFetch(`/orgs/${orgId}/people/views/${viewId}`);
        return res.json();
    });

    const orgState = ctx.queryClient.getQueryState(['org', orgId]);

    if (orgState?.status === 'success') {
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

type OrganizeViewPageProps = {
    orgId: string;
    viewId: string;
};

interface ViewRow {
    id: number;
    content: unknown[];
}

interface ViewColumn {
    title: string;
    type: 'local_bool' | 'person_field' | 'person_tag' | 'person_query';
}

const OrganizeViewPage : PageWithLayout<OrganizeViewPageProps> = ({ orgId, viewId } : OrganizeViewPageProps) => {
    const viewQuery = useQuery(['view', viewId], async () => {
        const res = await defaultFetch(`/orgs/${orgId}/people/views/${viewId}`);
        return res.json();
    });

    const viewRowsQuery = useQuery(['view', viewId, 'rows'], async () => {
        const res = await defaultFetch(`/orgs/${orgId}/people/queries/11/matches?view_id=1`);
        return res.json();
    });

    const viewColsQuery = useQuery(['view', viewId, 'columns'], async () => {
        const res = await defaultFetch(`/orgs/${orgId}/people/views/${viewId}/columns`);
        return res.json();
    });

    const columns : GridColumns = [{
        field: 'image',
        filterable: false,
        headerName: 'Image',
        renderCell: function AvatarCell(params) {
            return (
                <Avatar
                    src={ `/api/orgs/${orgId}/people/${params.row.id}/avatar` }
                />
            );
        },
        sortable: false,
    }];

    viewColsQuery?.data?.data?.forEach((col : ViewColumn, idx : number) => {
        const colDef : GridColDef = {
            editable: true,
            field: idx.toString(),
            headerName: col.title,
            type: (col.type === 'person_tag' || col.type === 'person_query' || col.type === 'local_bool')? 'boolean' : 'string',
            valueGetter: (params) => {
                return params.row.content[parseInt(params.field)];
            },
            width: 150,
        };

        columns.push(colDef);
    });

    const rows : GridRowsProp = viewRowsQuery.data?.data?.map((row : ViewRow) => {
        const rowDef : GridRowData = {
            ...row,
        };

        return rowDef;
    }) ?? [];

    return (
        <>
            <Heading level={ 1 }>
                { viewQuery.data?.data.title }
            </Heading>
            { !!columns && !!rows &&
                <XGrid
                    columns={ columns }
                    pageSize={ 100 }
                    pagination={ true }
                    rowHeight={ 50 }
                    rows={ rows }
                />
            }
        </>
    );
};

OrganizeViewPage.getLayout = function getLayout(page, props) {
    return (
        <OrganizeLayout orgId={ props.orgId as string }>
            { page }
        </OrganizeLayout>
    );
};

export default OrganizeViewPage;
