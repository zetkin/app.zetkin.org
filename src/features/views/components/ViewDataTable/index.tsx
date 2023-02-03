import { Link } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import NextLink from 'next/link';
import NProgress from 'nprogress';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import { DataGridPro, GridColDef, useGridApiRef } from '@mui/x-data-grid-pro';
import { FunctionComponent, useContext, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import columnTypes from './columnTypes';
import deleteViewColumn from 'features/views/fetching/deleteViewColumn';
import EmptyView from 'features/views/components/EmptyView';
import patchViewColumn from 'features/views/fetching/patchViewColumn';
import postViewColumn from 'features/views/fetching/postViewColumn';
import useModelsFromQueryString from 'zui/ZUIUserConfigurableDataGrid/useModelsFromQueryString';
import useViewDataModel from 'features/views/hooks/useViewDataModel';
import ViewColumnDialog from '../ViewColumnDialog';
import ViewRenameColumnDialog from '../ViewRenameColumnDialog';
import { viewRowsResource } from 'features/views/api/viewRows';
import { viewsResource } from 'features/views/api/views';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import ZUIPersonHoverCard from 'zui/ZUIPersonHoverCard';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';
import { colIdFromFieldName, viewQuickSearch } from './utils';
import {
  SelectedViewColumn,
  ZetkinView,
} from 'features/views/components/types';
import { VIEW_CONTENT_SOURCE, VIEW_DATA_TABLE_ERROR } from './constants';
import ViewDataTableColumnMenu, {
  ViewDataTableColumnMenuProps,
} from './ViewDataTableColumnMenu';
import ViewDataTableFooter, {
  ViewDataTableFooterProps,
} from 'features/views/components/ViewDataTable/ViewDataTableFooter';
import ViewDataTableToolbar, {
  ViewDataTableToolbarProps,
} from './ViewDataTableToolbar';
import { ZetkinViewColumn, ZetkinViewRow } from 'utils/types/zetkin';

const useStyles = makeStyles((theme) => ({
  '@keyframes addedRowAnimation': {
    '0%': {
      backgroundColor: theme.palette.success.main,
    },
    '100%': {
      backgroundColor: 'transparent',
    },
  },
  addedRow: {
    animation: '$addedRowAnimation 2s',
  },
}));

interface ViewDataTableProps {
  columns: ZetkinViewColumn[];
  disableBulkActions?: boolean;
  disableConfigure?: boolean;
  rows: ZetkinViewRow[];
  view: ZetkinView;
}

const ViewDataTable: FunctionComponent<ViewDataTableProps> = ({
  columns,
  disableBulkActions = false,
  disableConfigure,
  rows,
  view,
}) => {
  const intl = useIntl();
  const classes = useStyles();
  const gridApiRef = useGridApiRef();
  const [addedId, setAddedId] = useState(0);
  const [columnToConfigure, setColumnToConfigure] =
    useState<SelectedViewColumn | null>(null);
  const [columnToRename, setColumnToRename] = useState<ZetkinViewColumn | null>(
    null
  );
  const [selection, setSelection] = useState<number[]>([]);
  const [waiting, setWaiting] = useState(false);

  const { gridProps: modelGridProps } = useModelsFromQueryString();

  const [quickSearch, setQuickSearch] = useState('');
  const router = useRouter();
  const { orgId } = router.query;
  const queryClient = useQueryClient();
  const viewId = view.id.toString();
  const { showSnackbar } = useContext(ZUISnackbarContext);
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);

  const model = useViewDataModel();

  const showError = (error: VIEW_DATA_TABLE_ERROR) => {
    showSnackbar(
      'error',
      intl.formatMessage({ id: `misc.views.dataTableErrors.${error}` })
    );
  };

  const addColumnMutation = useMutation(
    postViewColumn(orgId as string, viewId),
    {
      onError: () => {
        showError(VIEW_DATA_TABLE_ERROR.CREATE_COLUMN);
        NProgress.done();
      },
      onSettled: () => {
        NProgress.done();
        queryClient.invalidateQueries(['view', viewId]);
      },
    }
  );

  const updateColumnMutation = useMutation(
    patchViewColumn(orgId as string, viewId),
    {
      onError: () => {
        showError(VIEW_DATA_TABLE_ERROR.MODIFY_COLUMN);
        NProgress.done();
      },
      onSettled: () => {
        NProgress.done();
        queryClient.invalidateQueries(['view', viewId]);
      },
    }
  );

  const removeColumnMutation = useMutation(
    deleteViewColumn(orgId as string, viewId),
    {
      onError: () => {
        showError(VIEW_DATA_TABLE_ERROR.DELETE_COLUMN);
        NProgress.done();
      },
      onSettled: () => {
        NProgress.done();
      },
      onSuccess: (data, colId) => {
        const colsKey = ['view', viewId, 'columns'];
        const cols = queryClient.getQueryData<ZetkinViewColumn[]>(colsKey);
        queryClient.setQueryData(
          colsKey,
          cols?.filter((col) => col.id != colId)
        );
      },
    }
  );

  const addRowMutation = viewRowsResource(
    view.organization.id,
    viewId
  ).useAdd();
  const removeRowsMutation = viewRowsResource(
    view.organization.id,
    viewId
  ).useRemoveMany();

  const onColumnCancel = () => {
    setColumnToConfigure(null);
  };

  const onColumnSave = async (colSpec: SelectedViewColumn) => {
    setColumnToConfigure(null);
    NProgress.start();
    if ('id' in colSpec) {
      // If is an existing column, PATCH it with changed values
      // Get existing column
      const columnPreEdit = columns.find((col) => col.id === colSpec.id);
      if (!columnPreEdit) {
        showError(VIEW_DATA_TABLE_ERROR.MODIFY_COLUMN);
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
      });
    } else {
      // If it's a new view, POST a new column
      await addColumnMutation.mutateAsync({
        config: colSpec.config,
        title: colSpec.title,
        type: colSpec.type,
      });
    }
  };

  const onColumnConfigure = (colFieldName: string) => {
    const colId = colIdFromFieldName(colFieldName);
    const colSpec = columns.find((col) => col.id === colId) || null;
    setColumnToConfigure(colSpec);
  };

  const onColumnCreate = () => {
    setColumnToConfigure({});
  };

  const onColumnDelete = async (colFieldName: string) => {
    const colId = colIdFromFieldName(colFieldName);
    const colSpec = columns.find((col) => col.id === colId) || null;
    // If it's a local column, require confirmation
    if (colSpec?.type.includes('local_')) {
      showConfirmDialog({
        onSubmit: () => {
          removeColumnMutation.mutateAsync(colId);
        },
        title: intl.formatMessage({
          id: `misc.views.columnMenu.delete`,
        }),
        warningText: intl.formatMessage({
          id: `misc.views.columnMenu.confirmDelete`,
        }),
      });
    } else {
      removeColumnMutation.mutateAsync(colId);
    }
  };

  const onColumnRename = (colFieldName: string) => {
    const colId = colIdFromFieldName(colFieldName);
    const colSpec = columns.find((col) => col.id === colId) || null;
    setColumnToRename(colSpec);
  };

  const onColumnRenameSave = async (
    column: Pick<ZetkinViewColumn, 'id' | 'title'>
  ) => {
    setColumnToRename(null);
    await updateColumnMutation.mutateAsync({
      id: column.id,
      title: column.title,
    });
  };

  const createNewViewMutation = viewsResource(orgId as string).useCreate();

  const onRowsRemove = () => {
    setWaiting(true);
    removeRowsMutation.mutate(selection, {
      onSettled: (res) => {
        setWaiting(false);
        if (res?.failed?.length) {
          showError(VIEW_DATA_TABLE_ERROR.REMOVE_ROWS);
        }
      },
    });
  };

  const onViewCreate = () => {
    createNewViewMutation.mutate(
      { rows: selection },
      {
        onSuccess: (newView) =>
          router.push(`/organize/${orgId}/people/views/${newView.id}`),
      }
    );
  };

  const avatarColumn: GridColDef = {
    disableColumnMenu: true,
    disableExport: true,
    disableReorder: true,
    field: 'id',
    filterable: false,
    headerName: ' ',
    renderCell: (params) => {
      const url = `/api/orgs/${orgId}/people/${params.value}/avatar`;
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <ZUIPersonHoverCard personId={params.value as number}>
          <NextLink href={`/organize/${orgId}/people/${params.value}`} passHref>
            <Link
              alt="Avatar"
              component="img"
              onClick={(evt) => evt.stopPropagation()}
              src={url}
              style={{
                cursor: 'pointer',
                maxHeight: '100%',
                maxWidth: '100%',
              }}
              underline="hover"
            />
          </NextLink>
        </ZUIPersonHoverCard>
      );
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
      minWidth: 100,
      resizable: true,
      sortable: true,
      width: 150,
      ...columnTypes[col.type].getColDef(col),
    })),
  ];

  const rowsWithSearch = viewQuickSearch(rows, columns, quickSearch);

  const gridRows = rowsWithSearch.map((input) => {
    const output: Record<string, unknown> = {
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
      showConfigureButton: (): boolean => {
        // TODO: Decide which ones should have a configure option
        return false;
      },
    },
    footer: {
      onRowAdd: (person) => {
        addRowMutation.mutate(person.id, {
          onSettled: (newRow, err, personId: number) => {
            // Store ID for highlighting the new row
            setAddedId(personId);

            // Remove ID again after 2 seconds, unless the state has changed
            setTimeout(() => {
              setAddedId((curState) => (curState == personId ? 0 : curState));
            }, 2000);

            // Scroll (jump) to row after short delay
            setTimeout(() => {
              const gridApi = gridApiRef.current;
              const rowIndex = gridApi.getRowIndex(personId);
              gridApi.scrollToIndexes({ rowIndex });
            }, 200);
          },
        });
      },
      viewId,
    },
    toolbar: {
      disableConfigure,
      disabled: waiting,
      gridColumns,
      isSmartSearch: !!view.content_query,
      onColumnCreate,
      onRowsRemove,
      onSortModelChange: modelGridProps.onSortModelChange,
      onViewCreate,
      selection,
      setQuickSearch,
      sortModel: modelGridProps.sortModel,
    },
  };

  const empty = gridRows.length == 0;
  const contentSource = view.content_query
    ? VIEW_CONTENT_SOURCE.DYNAMIC
    : VIEW_CONTENT_SOURCE.STATIC;

  return (
    <>
      <DataGridPro
        apiRef={gridApiRef}
        autoHeight={empty}
        checkboxSelection={!disableBulkActions}
        columns={gridColumns}
        components={{
          ColumnMenu: ViewDataTableColumnMenu,
          Footer: ViewDataTableFooter,
          Toolbar: ViewDataTableToolbar,
        }}
        componentsProps={componentsProps}
        disableSelectionOnClick={true}
        experimentalFeatures={{ newEditingApi: true }}
        getRowClassName={(params) =>
          params.id == addedId ? classes.addedRow : ''
        }
        hideFooter={empty || contentSource == VIEW_CONTENT_SOURCE.DYNAMIC}
        localeText={{
          noRowsLabel: intl.formatMessage({
            id: `misc.views.empty.notice.${contentSource}`,
          }),
        }}
        onSelectionModelChange={(model) => setSelection(model as number[])}
        processRowUpdate={(after, before) => {
          const changedField = Object.keys(after).find(
            (key) => after[key] != before[key]
          );
          if (changedField) {
            const colId = parseInt(changedField.slice(4));
            const col = columns.find((col) => col.id == colId);
            if (col) {
              const processRowUpdate = columnTypes[col.type].processRowUpdate;
              if (processRowUpdate) {
                processRowUpdate(model, colId, after.id, after[changedField]);
              }
            }
          }
          return after;
        }}
        rows={gridRows}
        style={{
          border: 'none',
        }}
        {...modelGridProps}
      />
      {empty && <EmptyView orgId={orgId as string} view={view} />}
      {columnToRename && (
        <ViewRenameColumnDialog
          column={columnToRename}
          onCancel={() => setColumnToRename(null)}
          onSave={onColumnRenameSave}
        />
      )}
      {columnToConfigure && (
        <ViewColumnDialog
          columns={columns}
          onClose={onColumnCancel}
          onSave={async (columns) => {
            // TODO: Handle these async calls better
            // (maybe custom API endpoint to bulk create/edit columns?)
            for (const col of columns) {
              await onColumnSave(col);
            }
          }}
        />
      )}
    </>
  );
};

export default ViewDataTable;
