import { FunctionComponent } from 'react';
import NProgress from 'nprogress';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Add, Person } from '@material-ui/icons';
import { Box, Fab } from '@material-ui/core';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';
import { useMutation, useQueryClient } from 'react-query';

import postViewColumn from 'fetching/views/postViewColumn';
import ViewColumnDialog, { ColumnEditorColumnSpec } from 'components/views/ViewColumnDialog';
import { ZetkinViewColumn, ZetkinViewRow } from 'types/zetkin';


interface ViewDataTableProps {
    columns: ZetkinViewColumn[];
    rows: ZetkinViewRow[];
    viewId: string;
}

const ViewDataTable: FunctionComponent<ViewDataTableProps> = ({ columns, rows, viewId }) => {
    const [columnDialogOpen, setColumnDialogOpen] = useState(false);
    const { orgId } = useRouter().query;
    const queryClient = useQueryClient();

    const addColumnMutation = useMutation(postViewColumn(orgId as string, viewId), {
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

    const avatarColumn : GridColDef = {
        disableColumnMenu: true,
        disableExport: true,
        disableReorder: true,
        field: 'id',
        filterable: false,
        headerName: ' ',
        renderCell: (params) => {
            const url = `/api/orgs/1/people/${params.value}/avatar`;
            return (
                <img
                    alt="Avatar"
                    src={ url }
                    style={{
                        maxHeight: '100%',
                        maxWidth: '100%',
                    }}
                />
            );
        },
        renderHeader: () => {
            return <Person/>;
        },
        resizable: false,
        sortable: false,
        width: 50,
    };

    const newColumn = {
        disableColumnMenu: true,
        disableExport: true,
        disableReorder: true,
        field: 'add',
        filterable: false,
        renderHeader: () => {
            return (
                <Box>
                    <Fab onClick={ () => setColumnDialogOpen(true) } size="small">
                        <Add/>
                    </Fab>
                </Box>
            );
        },
        resizable: false,
        sortable: false,
        width: 80,
    };

    const gridColumns = [
        avatarColumn,
        ...columns.map((col, index) => ({
            field: index.toString(),
            headerName: col.title,
            minWidth: 200,
        })),
        newColumn,
    ];

    const gridRows = rows.map(row => ({
        id: row.id,
        ...row.content,
    }));

    return (
        <>
            <DataGridPro
                columns={ gridColumns }
                rows={ gridRows }
            />
            { columnDialogOpen && (
                <ViewColumnDialog onCancel={ onColumnCancel } onSave={ onColumnSave }/>
            ) }
        </>
    );
};

export default ViewDataTable;
