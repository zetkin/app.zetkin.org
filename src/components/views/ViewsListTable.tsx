import { useRouter } from 'next/router';
import { useState } from 'react';
import { Box, Typography } from '@material-ui/core';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';
import { FormattedMessage, useIntl } from 'react-intl';

import ViewDeleteConfirmDialog from './ViewDeleteConfirmDialog';
import { viewsResource } from 'api/views';
import ZetkinDateTime from 'components/ZetkinDateTime';
import ZetkinEllipsisMenu from 'components/ZetkinEllipsisMenu';
import ZetkinQuery from 'components/ZetkinQuery';

const ViewsListTable: React.FunctionComponent = () => {
    const intl = useIntl();
    const router = useRouter();
    const [selectedViewToDelete, setSelectedViewToDelete] = useState<number | undefined>(undefined);
    const { orgId } = router.query;
    const viewsQuery = viewsResource(orgId as string).useQuery();

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
        {
            field: 'menu',
            headerName: ' ',
            renderCell: (props) => {
                return (
                    <ZetkinEllipsisMenu
                        items={ [{
                            id: 'delete-view',
                            label: intl.formatMessage({
                                id: 'pages.people.views.viewsList.columns.menu.delete.label',
                            }),
                            onSelect: () => setSelectedViewToDelete(props.id as number),
                        }] }
                    />
                );
            },
            sortable: false,
            width: 50,
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

                const deleteView = viewsQuery.data.find(view => view.id === selectedViewToDelete);

                return (
                    <>
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
                        {
                            deleteView && <ViewDeleteConfirmDialog
                                onClose={ () => setSelectedViewToDelete(undefined) }
                                open={ Boolean(selectedViewToDelete) }
                                view={ deleteView }
                            />
                        }
                    </>
                );
            } }
        </ZetkinQuery>

    );
};

export default ViewsListTable;
