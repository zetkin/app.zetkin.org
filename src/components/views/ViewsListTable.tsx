/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router';
import { Box, Typography } from '@material-ui/core';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';
import { FormattedMessage, useIntl } from 'react-intl';
import { useContext, useEffect, useState } from 'react';

import { ConfirmDialogContext } from 'hooks/ConfirmDialogProvider';
import SnackbarContext from 'hooks/SnackbarContext';
import { viewsResource } from 'api/views';
import ZetkinDateTime from 'components/ZetkinDateTime';
import ZetkinEllipsisMenu from 'components/ZetkinEllipsisMenu';
import ZetkinQuery from 'components/ZetkinQuery';

const ViewsListTable: React.FunctionComponent = () => {
    const intl = useIntl();
    const router = useRouter();
    const [selectedViewToDelete, setSelectedViewToDelete] = useState<number | undefined>(undefined);
    const { orgId } = router.query;
    const { showConfirmDialog } = useContext(ConfirmDialogContext);
    const { showSnackbar } = useContext(SnackbarContext);
    const deleteMutation = viewsResource(orgId as string).useDelete();
    const viewsQuery = viewsResource(orgId as string).useQuery();

    useEffect(() => {
        if (selectedViewToDelete) deleteView();
    }, [selectedViewToDelete]);

    const deleteView = () => {
        if (viewsQuery.data) {
            const selectedId = viewsQuery.data.find(view => view.id === selectedViewToDelete)?.id;
            showConfirmDialog({
                onCancel: () => setSelectedViewToDelete(undefined),
                onSubmit: () => {
                    deleteMutation.mutate(selectedId as number, {
                        onError: () => {
                            showSnackbar('error', intl.formatMessage({ id: 'pages.people.views.layout.deleteDialog.error' }));
                        },
                        onSettled: () => setSelectedViewToDelete(undefined),
                    });

                },
                title: intl.formatMessage({ id: 'pages.people.views.layout.deleteDialog.title' }),
                warningText:intl.formatMessage({ id: 'pages.people.views.layout.deleteDialog.warningText' }),
            });
        }
    };

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
                    selectedViewToDelete === props.id ? null : <ZetkinEllipsisMenu
                        items={ [{
                            id: 'delete-view',
                            label: intl.formatMessage({
                                id: 'pages.people.views.layout.ellipsisMenu.delete',
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
                                if (row.id !== selectedViewToDelete)
                                    router.push(`/organize/${orgId}/people/views/${row.id}`);
                            } }
                            rows={ rows }
                            style={{
                                border: 'none',
                                cursor: 'pointer',
                            }}
                        />
                    </>
                );
            } }
        </ZetkinQuery>

    );
};

export default ViewsListTable;
