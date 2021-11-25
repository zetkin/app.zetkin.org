import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';
// import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';

import getViews from 'fetching/views/getViews';
import ZetkinDateTime from 'components/ZetkinDateTime';
import ZetkinQuery from 'components/ZetkinQuery';

const ViewsListTable: React.FunctionComponent = () => {
    const intl = useIntl();
    const { orgId } = useRouter().query;
    const viewsQuery = useQuery(['views', orgId], getViews(orgId as string));

    // Columns
    const gridColumns: GridColDef[] = [
        {
            field: 'title',
            flex: 1,
            headerName: intl.formatMessage({ id: 'pages.people.views.viewsList.columns.title' }),
        },
        {
            field: 'created',
            flex: 1,
            headerName: intl.formatMessage({ id: 'pages.people.views.viewsList.columns.created' }),
            renderCell: (params) => <ZetkinDateTime datetime={ params.value as string } />,
        },
        {
            field: 'owner',
            flex: 1,
            headerName: intl.formatMessage({ id: 'pages.people.views.viewsList.columns.owner' }),
        },
    ];

    return (
        <ZetkinQuery queries={{ viewsQuery }}>
            { ({ queries: { viewsQuery } }) => {
                const viewRows = viewsQuery.data.map(view => {
                    return {
                        ...view,
                        owner: view.owner.name,
                    };
                });
                return (
                    <DataGridPro
                        columns={ gridColumns }
                        rows={ viewRows }
                    />
                );
            } }
        </ZetkinQuery>

    );
};

export default ViewsListTable;
