import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';
import { FormattedMessage, useIntl } from 'react-intl';

import getViews from 'fetching/views/getViews';
import ZetkinDateTime from 'components/ZetkinDateTime';
import ZetkinQuery from 'components/ZetkinQuery';
import { Box, Typography } from '@material-ui/core';

const ViewsListTable: React.FunctionComponent = () => {
    const intl = useIntl();
    const router = useRouter();
    const { orgId } = router.query;
    const viewsQuery = useQuery(['views', orgId], getViews(orgId as string));

    // Columns
    const columns: GridColDef[] = [
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
                // If there are no views, display indicator to user
                if (viewsQuery.data.length === 0) {
                    return (
                        <Box data-testid="empty-views-list-indicator" textAlign="center">
                            <Typography><FormattedMessage id="pages.people.views.viewsList.empty" /></Typography>
                        </Box>
                    );
                }

                const rows = viewsQuery.data.map(view => {
                    return {
                        ...view,
                        owner: view.owner.name,
                    };
                });

                return (
                    <DataGridPro
                        autoHeight
                        columns={ columns }
                        disableColumnMenu
                        disableColumnResize
                        disableSelectionOnClick
                        hideFooter
                        onRowClick={ (row) => {
                            router.push(`/organize/${orgId}/people/views/${row.id}`);
                        } }
                        rows={ rows }
                        style={{
                            border: 'none',
                            cursor: 'pointer',
                        }}
                    />
                );
            } }
        </ZetkinQuery>

    );
};

export default ViewsListTable;
