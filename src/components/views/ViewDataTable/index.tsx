import { Alert } from '@material-ui/lab';
import { FunctionComponent } from 'react';
import NProgress from 'nprogress';
import { Snackbar } from '@material-ui/core';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';
import { FormattedMessage, useIntl } from 'react-intl';
import { useMutation, useQueryClient } from 'react-query';

import createNewView from 'fetching/views/createNewView';
import { defaultFetch } from 'fetching';
import deleteViewColumn from 'fetching/views/deleteViewColumn';
import EmptyView from 'components/views/EmptyView';
import patchViewColumn from 'fetching/views/patchViewColumn';
import postViewColumn from 'fetching/views/postViewColumn';
import ViewRenameColumnDialog from '../ViewRenameColumnDialog';
import { colIdFromFieldName, makeGridColDef } from './utils';
import { SelectedViewColumn, ZetkinView } from 'types/views';
import { VIEW_CONTENT_SOURCE, VIEW_DATA_TABLE_ERROR } from './constants';
import ViewColumnDialog, { AUTO_SAVE_TYPES } from 'components/views/ViewColumnDialog';
import ViewDataTableColumnMenu, { ViewDataTableColumnMenuProps } from './ViewDataTableColumnMenu';
import ViewDataTableFooter, { ViewDataTableFooterProps } from './ViewDataTableFooter';
import ViewDataTableToolbar, { ViewDataTableToolbarProps } from './ViewDataTableToolbar';
import { ZetkinPerson, ZetkinViewColumn, ZetkinViewRow } from 'types/zetkin';


interface ViewDataTableProps {
    columns: ZetkinViewColumn[];
    rows: ZetkinViewRow[];
    view: ZetkinView;
}

const ViewDataTable: FunctionComponent<ViewDataTableProps> = ({ columns, rows, view }) => {
    const intl = useIntl();
    const [columnToConfigure, setColumnToConfigure] = useState<SelectedViewColumn | null>(null);
    const [columnToRename, setColumnToRename] = useState<ZetkinViewColumn | null>(null);
    const [selection, setSelection] = useState<number[]>([]);
    const [error, setError] = useState<VIEW_DATA_TABLE_ERROR>();
    const router = useRouter();
    const { orgId } = router.query;
    const queryClient = useQueryClient();
    const viewId = view.id.toString();

    const addColumnMutation = useMutation(postViewColumn(orgId as string, viewId), {
        onError: () => {
            setError(VIEW_DATA_TABLE_ERROR.CREATE_COLUMN);
            NProgress.done();
        },
        onSettled: () => {
            NProgress.done();
            queryClient.invalidateQueries(['view', viewId]);
        },
    });

    const updateColumnMutation = useMutation(patchViewColumn(orgId as string, viewId), {
        onError: () => {
            setError(VIEW_DATA_TABLE_ERROR.MODIFY_COLUMN);
            NProgress.done();
        },
        onSettled: () => {
            NProgress.done();
            queryClient.invalidateQueries(['view', viewId]);
        },
    });

    const removeColumnMutation = useMutation(deleteViewColumn(orgId as string, viewId), {
        onError: () => {
            setError(VIEW_DATA_TABLE_ERROR.DELETE_COLUMN);
            NProgress.done();
        },
        onSettled: () => {
            NProgress.done();
        },
        onSuccess: (data, colId) => {
            const colsKey = ['view', viewId, 'columns'];
            const cols = queryClient.getQueryData<ZetkinViewColumn[]>(colsKey);
            queryClient.setQueryData(colsKey, cols?.filter(col => col.id != colId));
        },
    });

    // TODO: Create mutation using new factory pattern
    const addRowMutation = useMutation(async (person: ZetkinPerson) => {
        const res = await defaultFetch(`/orgs/${orgId}/people/views/${view.id}/rows/${person.id}`, {
            method: 'PUT',
        });
        const data = await res.json();
        return data.data;
    }, {
        onSuccess: (newRow) => {
            // Add created row directly to view, to avoid waiting for entire collection to reload
            const rowsKey = ['view', viewId, 'rows'];
            const prevRows: ZetkinViewRow[] = queryClient.getQueryData<ZetkinViewRow[]>(rowsKey) || [];
            const allRows = prevRows.concat([newRow as ZetkinViewRow]);
            queryClient.setQueryData(rowsKey, allRows);
        },
    });

    const onColumnCancel = () => {
        setColumnToConfigure(null);
    };

    const onColumnSave = async (colSpec : SelectedViewColumn) => {
        setColumnToConfigure(null);
        NProgress.start();
        if ('id' in colSpec) { // If is an existing column, PATCH it with changed values
            // Get existing column
            const columnPreEdit = columns.find(col => col.id === colSpec.id);
            if (!columnPreEdit) {
                setError(VIEW_DATA_TABLE_ERROR.MODIFY_COLUMN);
                return;
            }
            // Extract out only fields which changed
            const changedFields: Partial<ZetkinViewColumn> = {};
            Object.entries(colSpec).forEach(([key, value]) => {
                const typedKey = key as keyof ZetkinViewColumn;
                if (columnPreEdit[typedKey] !== value) {
                    changedFields[typedKey] = value;
                }
            });
            await updateColumnMutation.mutateAsync({
                ...changedFields,
                id: colSpec.id,
            },
            );
        }
        else { // If it's a new view, POST a new column
            await addColumnMutation.mutateAsync({
                config: colSpec.config,
                title: colSpec.title,
                type: colSpec.type,
            });
        }
    };

    const onColumnConfigure = (colFieldName : string) => {
        const colId = colIdFromFieldName(colFieldName);
        const colSpec = columns.find(col => col.id === colId) || null;
        setColumnToConfigure(colSpec);
    };

    const onColumnCreate = () => {
        setColumnToConfigure({});
    };

    const onColumnDelete = async (colFieldName : string) => {
        const colId = colIdFromFieldName(colFieldName);
        await removeColumnMutation.mutateAsync(colId);
    };

    const onColumnRename = (colFieldName : string) => {
        const colId = colIdFromFieldName(colFieldName);
        const colSpec = columns.find(col => col.id === colId) || null;
        setColumnToRename(colSpec);
    };

    const onColumnRenameSave = async (column : Pick<ZetkinViewColumn, 'id' | 'title'>) => {
        setColumnToRename(null);
        await updateColumnMutation.mutateAsync({
            id: column.id,
            title: column.title,
        });
    };

    const createNewViewMutation = useMutation(createNewView(orgId as string), {
        onError: () => {
            NProgress.done();
        },
        onMutate: () => NProgress.start(),
        onSettled: () => queryClient.invalidateQueries(['views', orgId]),
        onSuccess: (newView) => router.push(`/organize/${orgId}/people/views/${newView.id}`),
    });

    const onViewCreate = () => {
        createNewViewMutation.mutate(selection);
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
        resizable: false,
        sortable: false,
        width: 50,
    };

    const gridColumns = [
        avatarColumn,
        ...columns.map(col => makeGridColDef(col, orgId as string)),
    ];

    const gridRows = rows.map(input => {
        const output : Record<string,unknown> = {
            id: input.id,
        };
        input.content.forEach((cellValue, colIndex) => {
            const col = columns[colIndex];
            if (col) {
                const fieldName = `col_${col.id}`;
                output[fieldName] = cellValue;
            }
        });

        return output;
    });

    const componentsProps: {
        columnMenu: ViewDataTableColumnMenuProps;
        footer: ViewDataTableFooterProps;
        toolbar: ViewDataTableToolbarProps;
    } = {
        columnMenu: {
            onConfigure: onColumnConfigure,
            onDelete: onColumnDelete,
            onRename: onColumnRename,
            showConfigureButton: (field: GridColDef['field']): boolean => {
                const colId = colIdFromFieldName(field);
                const column = columns.find(column => column.id === colId);
                if (column) {
                    return !AUTO_SAVE_TYPES.includes(column.type);
                }
                return false;
            },
        },
        footer: {
            onRowAdd: person => {
                addRowMutation.mutate(person);
            },
        },
        toolbar: {
            onColumnCreate,
            onViewCreate,
            selection,
        },
    };

    const empty = gridRows.length == 0;
    const contentSource = view.content_query? VIEW_CONTENT_SOURCE.DYNAMIC : VIEW_CONTENT_SOURCE.STATIC;

    return (
        <>
            <DataGridPro
                autoHeight={ empty }
                checkboxSelection={ true }
                columns={ gridColumns }
                components={{
                    ColumnMenu: ViewDataTableColumnMenu,
                    Footer: ViewDataTableFooter,
                    Toolbar: ViewDataTableToolbar,
                }}
                componentsProps={ componentsProps }
                hideFooter={ empty || contentSource == VIEW_CONTENT_SOURCE.DYNAMIC }
                localeText={{
                    noRowsLabel: intl.formatMessage({ id: `misc.views.empty.notice.${contentSource}` }),
                }}
                onSelectionModelChange={ model => setSelection(model as number[]) }
                rows={ gridRows }
                style={{
                    border: 'none',
                }}
            />
            { empty && (
                <EmptyView
                    orgId={ orgId as string }
                    view={ view }
                />
            ) }
            { columnToRename && (
                <ViewRenameColumnDialog
                    column={ columnToRename }
                    onCancel={ () => setColumnToRename(null) }
                    onSave={ onColumnRenameSave }
                />
            ) }
            { columnToConfigure && (
                <ViewColumnDialog
                    onCancel={ onColumnCancel }
                    onSave={ onColumnSave }
                    selectedColumn={ columnToConfigure }
                />
            ) }
            { /* Error alert */ }
            <Snackbar
                data-testid="data-table-error-indicator"
                onClose={ () => setError(undefined) }
                open={ Boolean(error) }>
                <Alert severity="error">
                    <FormattedMessage id={ `misc.views.dataTableErrors.${error}` } />
                </Alert>
            </Snackbar>
        </>
    );
};

export default ViewDataTable;
