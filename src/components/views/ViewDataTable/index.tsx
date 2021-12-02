import { FunctionComponent } from 'react';
import NProgress from 'nprogress';
import { Person } from '@material-ui/icons';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';
import { useMutation, useQueryClient } from 'react-query';

import { colIdFromFieldName } from './utils';
import deleteViewColumn from 'fetching/views/deleteViewColumn';
import patchViewColumn from 'fetching/views/patchViewColumn';
import postViewColumn from 'fetching/views/postViewColumn';
import { SelectedViewColumn } from 'types/views';
import ViewColumnDialog from 'components/views/ViewColumnDialog';
import ViewDataTableColumnMenu from './ViewDataTableColumnMenu';
import ViewDataTableToolbar from './ViewDataTableToolbar';
import ViewRenameColumnDialog from '../ViewRenameColumnDialog';
import { ZetkinViewColumn, ZetkinViewRow } from 'types/zetkin';


interface ViewDataTableProps {
    columns: ZetkinViewColumn[];
    rows: ZetkinViewRow[];
    viewId: string;
}

const ViewDataTable: FunctionComponent<ViewDataTableProps> = ({ columns, rows, viewId }) => {
    const [selectedColumn, setSelectedColumn] = useState<SelectedViewColumn | null>(null);
    const [columnToRename, setColumnToRename] = useState<ZetkinViewColumn | null>(null);
    const { orgId } = useRouter().query;
    const queryClient = useQueryClient();

    const addColumnMutation = useMutation(postViewColumn(orgId as string, viewId), {
        onError: () => {
            // TODO: Show error dialog
            NProgress.done();
        },
        onSettled: () => {
            NProgress.done();
            queryClient.invalidateQueries(['views', viewId]);
        },
    });

    const updateColumnMutation = useMutation(patchViewColumn(orgId as string, viewId), {
        onError: () => {
            // TODO: Show error dialog
            NProgress.done();
        },
        onSettled: () => {
            NProgress.done();
            queryClient.invalidateQueries(['views', viewId]);
        },
    });

    const removeColumnMutation = useMutation(deleteViewColumn(orgId as string, viewId), {
        onError: () => {
            // TODO: Show error dialog
            NProgress.done();
        },
        onSettled: () => {
            NProgress.done();
            queryClient.invalidateQueries(['views', viewId]);
        },
        onSuccess: () => {
            queryClient.removeQueries(['views', viewId, 'rows']);
        },
    });

    const onColumnCancel = () => {
        setSelectedColumn(null);
    };

    const onColumnSave = (colSpec : SelectedViewColumn) => {
        setSelectedColumn(null);
        NProgress.start();
        if ('id' in colSpec) { // If is an existing column, PATCH it
            updateColumnMutation.mutate(colSpec);
        }
        else { // If it's a new view, POST a new column
            addColumnMutation.mutate({
                config: colSpec.config,
                title: colSpec.title,
                type: colSpec.type,
            });
        }
    };

    const onColumnConfigure = (colFieldName : string) => {
        const colId = colIdFromFieldName(colFieldName);
        const colSpec = columns.find(col => col.id === colId) || null;
        setSelectedColumn(colSpec);
    };

    const onColumnCreate = () => {
        setSelectedColumn({});
    };

    const onColumnDelete = (colFieldName : string) => {
        const colId = colIdFromFieldName(colFieldName);
        removeColumnMutation.mutate(colId);
    };

    const onColumnRename = (colFieldName : string) => {
        const colId = colIdFromFieldName(colFieldName);
        const colSpec = columns.find(col => col.id === colId) || null;
        setColumnToRename(colSpec);
    };

    const onColumnRenameSave = (column : Pick<ZetkinViewColumn, 'id' | 'title'>) => {
        setColumnToRename(null);
        updateColumnMutation.mutate({
            id: column.id,
            title: column.title,
        });
    };

    const onColumnRenameCancel = () => {
        setColumnToRename(null);
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

    const gridColumns = [
        avatarColumn,
        ...columns.map((col) => ({
            field: `col_${col.id}`,
            headerName: col.title,
            minWidth: 200,
        })),
    ];

    const gridRows = rows.map(input => {
        const output : Record<string,unknown> = {
            id: input.id,
        };
        input.content.forEach((cellValue, colIndex) => {
            const col = columns[colIndex];
            const fieldName = `col_${col.id}`;
            output[fieldName] = cellValue;
        });

        return output;
    });

    return (
        <>
            <DataGridPro
                columns={ gridColumns }
                components={{
                    ColumnMenu: ViewDataTableColumnMenu,
                    Toolbar: ViewDataTableToolbar,
                }}
                componentsProps={{
                    columnMenu: {
                        onConfigure: onColumnConfigure,
                        onDelete: onColumnDelete,
                        onRename: onColumnRename,
                    },
                    toolbar: {
                        onColumnCreate,
                    },
                }}
                rows={ gridRows }
            />
            { columnToRename && (
                <ViewRenameColumnDialog
                    column={ columnToRename }
                    onCancel={ onColumnRenameCancel }
                    onSave={ onColumnRenameSave }
                />
            ) }
            { selectedColumn && (
                <ViewColumnDialog
                    column={ selectedColumn }
                    onCancel={ onColumnCancel }
                    onSave={ onColumnSave }
                />
            ) }
        </>
    );
};

export default ViewDataTable;
