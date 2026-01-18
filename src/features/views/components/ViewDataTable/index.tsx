import NextLink from 'next/link';
import NProgress from 'nprogress';
import {
  DataGridPro,
  DataGridProProps,
  getGridDefaultColumnTypes,
  getGridStringOperators,
  GRID_CHECKBOX_SELECTION_COL_DEF,
  GridCellEditStartReasons,
  GridCellParams,
  GridColDef,
  GridColumnOrderChangeParams,
  GridColumnResizeParams,
  GridRowClassNameParams,
  GridRowSelectionModel,
  GridSortModel,
  MuiEvent,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Box, Link, useTheme } from '@mui/material';
import { GridCellEditStartParams } from '@mui/x-data-grid/models/params/gridEditCellParams';

import columnTypes from './columnTypes';
import EmptyView from 'features/views/components/EmptyView';
import useAccessLevel from 'features/views/hooks/useAccessLevel';
import useConfigurableDataGridColumns from 'zui/ZUIUserConfigurableDataGrid/useConfigurableDataGridColumns';
import useCreateView from 'features/views/hooks/useCreateView';
import { useMessages } from 'core/i18n';
import useModelsFromQueryString from 'zui/ZUIUserConfigurableDataGrid/useModelsFromQueryString';
import UseViewDataTableMutations from 'features/views/hooks/useViewDataTableMutations';
import useViewGrid from 'features/views/hooks/useViewGrid';
import ViewColumnDialog from '../ViewColumnDialog';
import ViewRenameColumnDialog from '../ViewRenameColumnDialog';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import ZUIPersonHoverCard from 'zui/ZUIPersonHoverCard';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';
import { colIdFromFieldName, viewQuickSearch } from './utils';
import {
  SelectedViewColumn,
  ZetkinView,
} from 'features/views/components/types';
import {
  useApiClient,
  useAppDispatch,
  useAppSelector,
  useNumericRouteParams,
} from 'core/hooks';
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
import {
  ZetkinPerson,
  ZetkinViewColumn,
  ZetkinViewRow,
} from 'utils/types/zetkin';
import messageIds from 'features/views/l10n/messageIds';
import useDebounce from 'utils/hooks/useDebounce';
import useViewMutations from 'features/views/hooks/useViewMutations';
import oldTheme from 'theme';
import useViewBulkActions from 'features/views/hooks/useViewBulkActions';

declare module '@mui/x-data-grid-pro' {
  interface ColumnMenuPropsOverrides {
    onConfigure: (colId: string) => void;
    onDelete: (colId: string) => void;
    onRename: (colId: string) => void;
    showConfigureButton: (field: GridColDef['field']) => boolean;
  }

  interface FooterPropsOverrides {
    onRowAdd: (person: ZetkinPerson) => void;
  }

  interface ToolbarPropsOverrides {
    disableConfigure?: boolean;
    disabled: boolean;
    gridColumns: GridColDef[];
    isSmartSearch: boolean;
    onColumnCreate: () => void;
    onRowsRemove: () => void;
    onViewCreate: () => void;
    selection: number[];
    setQuickSearch: (quickSearch: string) => void;
    onSortModelChange: DataGridProProps['onSortModelChange'];
    sortModel: GridSortModel;
  }
}

const getFilterOperators = (col: Omit<GridColDef, 'field'>) => {
  const stringOperators = getGridStringOperators().filter(
    (op) => op.value !== 'isAnyOf'
  );
  if (col.filterOperators) {
    return col.filterOperators;
  } else {
    const defaultTypes = getGridDefaultColumnTypes();
    if (col.type && col.type in defaultTypes) {
      return (
        defaultTypes[col.type].filterOperators?.filter(
          (op) => op.value !== 'isAnyOf'
        ) ?? stringOperators
      );
    } else {
      return stringOperators;
    }
  }
};

interface ViewDataTableProps {
  columns: ZetkinViewColumn[];
  disableAdd?: boolean;
  disableConfigure?: boolean;
  rows: ZetkinViewRow[];
  rowSelection?: {
    mode: 'select' | 'selectWithBulkActions';
    onSelectionChange?: (selectedIds: number[]) => void;
    selectedIds?: number[];
  };
  view: ZetkinView;
}

const pinnedColumns = {
  left: ['id', GRID_CHECKBOX_SELECTION_COL_DEF.field],
};

const style = {
  border: 'none',
};

type Row = Record<string, unknown> & {
  id: number;
};

const slots = {
  columnMenu: ViewDataTableColumnMenu,
  footer: ViewDataTableFooter,
  toolbar: ViewDataTableToolbar,
};

const ViewDataTable: FunctionComponent<ViewDataTableProps> = ({
  columns,
  disableAdd = false,
  disableConfigure,
  rows,
  rowSelection: selectionModel,
  view,
}) => {
  const theme = useTheme();
  const messages = useMessages(messageIds);
  const dispatch = useAppDispatch();
  const apiClient = useApiClient();
  const tagListState = useAppSelector((state) => state.tags.tagList);
  const gridApiRef = useGridApiRef();
  const [addedId, setAddedId] = useState(0);
  const [columnToCreate, setColumnToCreate] =
    useState<SelectedViewColumn | null>(null);
  const [columnToConfigure, setColumnToConfigure] =
    useState<ZetkinViewColumn | null>(null);
  const [columnToRename, setColumnToRename] = useState<ZetkinViewColumn | null>(
    null
  );
  const [selection, setSelection] = useState<number[]>(
    selectionModel?.selectedIds ?? []
  );
  useEffect(() => {
    if (
      selectionModel?.onSelectionChange &&
      JSON.stringify(selection) !== JSON.stringify(selectionModel.selectedIds)
    ) {
      selectionModel.onSelectionChange(selection);
    }
  }, [selection]);
  const [waiting, setWaiting] = useState(false);

  const { gridProps: modelGridProps } = useModelsFromQueryString();
  const [, accessLevel] = useAccessLevel();

  const [quickSearch, setQuickSearch] = useState('');
  const { orgId } = useNumericRouteParams();

  const { showSnackbar } = useContext(ZUISnackbarContext);
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);
  const { addColumn, addPerson, deleteColumn } = UseViewDataTableMutations(
    orgId,
    view.id
  );
  const { createView, isLoading } = useCreateView(orgId);
  const viewGrid = useViewGrid(orgId, view.id);
  const { updateColumnOrder } = useViewMutations(orgId);
  const { bulkDeletePersons } = useViewBulkActions(orgId);

  const showError = useCallback(
    (error: VIEW_DATA_TABLE_ERROR) => {
      showSnackbar('error', messages.dataTableErrors[error]());
    },
    [showSnackbar]
  );

  const updateColumn = useCallback(
    async (id: number, data: Omit<Partial<ZetkinViewColumn>, 'id'>) => {
      NProgress.start();
      try {
        await viewGrid.updateColumn(id, data);
      } catch (err) {
        showError(VIEW_DATA_TABLE_ERROR.MODIFY_COLUMN);
      } finally {
        NProgress.done();
      }
    },
    [viewGrid, showError]
  );

  const onCreateColumnCancel = useCallback(() => {
    setColumnToCreate(null);
  }, [setColumnToCreate]);

  const onConfigureColumnCancel = useCallback(() => {
    setColumnToConfigure(null);
  }, [setColumnToConfigure]);

  const onConfigureColumnSave = useCallback(
    (id: number, config: ZetkinViewColumn['config']) => {
      setColumnToConfigure(null);

      const columnPreEdit = columns.find((col) => col.id === id);
      if (!columnPreEdit) {
        showError(VIEW_DATA_TABLE_ERROR.MODIFY_COLUMN);
        return;
      }

      updateColumn(id, { config: config });
    },
    [setColumnToConfigure, columns, showError, updateColumn]
  );

  const onCreateColumnSave = useCallback(
    async (colSpec: SelectedViewColumn) => {
      setColumnToCreate(null);
      try {
        await addColumn({
          config: colSpec.config,
          title: colSpec.title,
          type: colSpec.type,
        });
      } catch (err) {
        showError(VIEW_DATA_TABLE_ERROR.CREATE_COLUMN);
      } finally {
        NProgress.done();
      }
    },
    [setColumnToCreate, addColumn, showError]
  );

  const onColumnConfigure = useCallback(
    (colFieldName: string) => {
      const colId = colIdFromFieldName(colFieldName);
      const colSpec = columns.find((col) => col.id === colId) || null;
      setColumnToConfigure(colSpec);
    },
    [colIdFromFieldName, columns, setColumnToConfigure]
  );

  const onColumnCreate = useCallback(() => {
    setColumnToCreate({});
  }, [setColumnToCreate]);

  const onColumnDelete = useCallback(
    async (colFieldName: string) => {
      const colId = colIdFromFieldName(colFieldName);
      const colSpec = columns.find((col) => col.id === colId) || null;

      async function doDelete() {
        try {
          await deleteColumn(colId);
        } catch (err) {
          showError(VIEW_DATA_TABLE_ERROR.DELETE_COLUMN);
          NProgress.done();
        } finally {
          NProgress.done();
        }
      }

      // If it's a local column, require confirmation
      if (colSpec?.type.includes('local_')) {
        showConfirmDialog({
          onSubmit: doDelete,
          title: messages.columnMenu.delete(),
          warningText: messages.columnMenu.confirmDelete(),
        });
      } else {
        doDelete();
      }
    },
    [
      colIdFromFieldName,
      columns,
      deleteColumn,
      showError,
      showConfirmDialog,
      messages.columnMenu,
    ]
  );

  const onColumnRename = useCallback(
    (colFieldName: string) => {
      const colId = colIdFromFieldName(colFieldName);
      const colSpec = columns.find((col) => col.id === colId) || null;
      setColumnToRename(colSpec);
    },
    [colIdFromFieldName, columns, setColumnToRename]
  );

  const onColumnRenameSave = useCallback(
    async (column: Pick<ZetkinViewColumn, 'id' | 'title'>) => {
      setColumnToRename(null);
      updateColumn(column.id, { title: column.title });
    },
    [setColumnToRename, updateColumn]
  );

  const onRowsDelete = useCallback(async () => {
    bulkDeletePersons(selection);
  }, [selection]);

  const onRowsRemove = useCallback(async () => {
    setWaiting(true);
    try {
      viewGrid.removeRows(selection);
    } catch (err) {
      showError(VIEW_DATA_TABLE_ERROR.REMOVE_ROWS);
    } finally {
      setWaiting(false);
    }
  }, [viewGrid.removeRows, showError, setWaiting]);

  const onViewCreate = useCallback(() => {
    createView(view.folder?.id ?? 0, selection);
  }, [createView, view.folder, selection]);

  const avatarColumn: GridColDef = useMemo(
    () => ({
      disableColumnMenu: true,
      disableExport: true,
      disableReorder: true,
      field: 'id',
      filterable: false,
      headerName: ' ',
      renderCell: (params) => {
        const url = `/api/orgs/${orgId}/people/${params.value}/avatar`;
        return (
          <ZUIPersonHoverCard personId={params.value as number}>
            <NextLink
              href={`/organize/${orgId}/people/${params.value}`}
              legacyBehavior
              passHref
            >
              <Link
                onClick={(evt) => evt.stopPropagation()}
                style={{ cursor: 'pointer' }}
                underline="hover"
              >
                <Box
                  alt={'Avatar'}
                  component="img"
                  src={url}
                  sx={{ maxHeight: '100%', maxWidth: '100%' }}
                />
              </Link>
            </NextLink>
          </ZUIPersonHoverCard>
        );
      },
      resizable: false,
      sortable: false,
      width: 50,
    }),
    [orgId]
  );

  const debouncedUpdateColumnOrder = useDebounce((order: number[]) => {
    return updateColumnOrder(view.id, order);
  }, 1000);

  const moveColumn = useCallback(
    (field: string, targetIndex: number) => {
      // The column index is offset by 2 compared to the API (avatar and checkbox)
      targetIndex -= 2;
      const columnId = colIdFromFieldName(field);
      const origIndex = columns.findIndex((col) => col.id == columnId);
      const columnOrder = columns.map((col) => col.id);

      // Remove column and place it in new location
      columnOrder.splice(origIndex, 1);
      const newColumnOrder = [
        ...columnOrder.slice(0, targetIndex),
        columnId,
        ...columnOrder.slice(targetIndex),
      ];
      debouncedUpdateColumnOrder(newColumnOrder);
    },
    [colIdFromFieldName, columns, debouncedUpdateColumnOrder]
  );

  const unConfiguredGridColumns = useMemo(
    () => [
      avatarColumn,
      ...columns.map((col) => ({
        field: `col_${col.id}`,
        filterOperators: getFilterOperators(
          columnTypes[col.type].getColDef(
            col,
            accessLevel,
            tagListState,
            apiClient,
            dispatch,
            orgId
          )
        ),
        headerName: col.title,
        minWidth: 100,
        resizable: true,
        sortable: true,
        width: 150,
        ...columnTypes[col.type].getColDef(
          col,
          accessLevel,
          tagListState,
          apiClient,
          dispatch,
          orgId
        ),
      })),
    ],
    [
      avatarColumn,
      columns,
      accessLevel,
      tagListState,
      apiClient,
      dispatch,
      orgId,
    ]
  );

  const { columns: gridColumns, setColumnWidth } =
    useConfigurableDataGridColumns('viewInstances', unConfiguredGridColumns);

  const gridRows = useMemo(() => {
    const rowsWithSearch = viewQuickSearch(rows, columns, quickSearch);
    return rowsWithSearch.map((input) => {
      const output: Row = {
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
  }, [rows, columns, quickSearch]);

  const componentsProps: {
    columnMenu: ViewDataTableColumnMenuProps;
    footer: ViewDataTableFooterProps;
    toolbar: ViewDataTableToolbarProps;
  } = useMemo(
    () => ({
      columnMenu: {
        onConfigure: onColumnConfigure,
        onDelete: onColumnDelete,
        onRename: onColumnRename,
        showConfigureButton: (field): boolean => {
          const column = columns.find(
            (column) => column.id === colIdFromFieldName(field)
          );

          if (!column) {
            return false;
          }

          return !!columnTypes[column.type].renderConfigDialog;
        },
      },
      footer: {
        onRowAdd: async (person) => {
          await addPerson(person.id);

          // Store ID for highlighting the new row
          setAddedId(person.id);

          // Remove ID again after 2 seconds, unless the state has changed
          setTimeout(() => {
            setAddedId((curState) => (curState == person.id ? 0 : curState));
          }, 2000);

          // Scroll (jump) to row after short delay
          setTimeout(() => {
            const gridApi = gridApiRef.current;
            const rowIndex = gridApi.getRowIndexRelativeToVisibleRows(
              person.id
            );
            gridApi.scrollToIndexes({ rowIndex });
          }, 200);
        },
      },
      toolbar: {
        disableBulkActions: selectionModel?.mode !== 'selectWithBulkActions',
        disableConfigure,
        disabled: waiting,
        gridColumns,
        isLoading,
        isSmartSearch: !!view.content_query,
        onColumnCreate,
        onRowsDelete,
        onRowsRemove,
        onSortModelChange: modelGridProps.onSortModelChange,
        onViewCreate,
        selection,
        setQuickSearch,
        sortModel: modelGridProps.sortModel,
      },
    }),
    [
      onColumnConfigure,
      onColumnDelete,
      onColumnRename,
      columns,
      colIdFromFieldName,
      addPerson,
      setAddedId,
      gridApiRef,
      selectionModel,
      disableConfigure,
      waiting,
      gridColumns,
      isLoading,
      view.content_query,
      onColumnCreate,
      onRowsRemove,
      modelGridProps.onSortModelChange,
      onViewCreate,
      selection,
      setQuickSearch,
      modelGridProps.sortModel,
    ]
  );

  const empty = gridRows.length == 0;
  const contentSource = view.content_query
    ? VIEW_CONTENT_SOURCE.DYNAMIC
    : VIEW_CONTENT_SOURCE.STATIC;

  const renderConfigDialog =
    columnToConfigure && columnTypes[columnToConfigure.type].renderConfigDialog;

  const getRowClassName = useCallback(
    (params: GridRowClassNameParams): string =>
      params.id == addedId ? 'addedRow' : '',
    [addedId]
  );

  const localeText = useMemo(
    () => ({
      ...theme.components?.MuiDataGrid?.defaultProps?.localeText,
      noRowsLabel: messages.empty.notice[contentSource](),
    }),
    [theme.components, messages.empty.notice]
  );

  const onCellEditStart = useCallback(
    (
      params: GridCellEditStartParams,
      event: MuiEvent<React.KeyboardEvent | React.MouseEvent>
    ) => {
      if (params.reason == GridCellEditStartReasons.printableKeyDown) {
        // Don't enter edit mode when the user just presses a printable character.
        // Doing so is the default DataGrid behaviour (as in spreadsheets) but it
        // means the user will overwrite the original value, which is rarely what
        // you want with the precious data that exists in views (when there is no
        // undo feature).
        event.defaultMuiPrevented = true;
      }
    },
    []
  );

  const onCellKeyDown = useCallback(
    (
      params: GridCellParams<ZetkinViewRow, unknown>,
      ev: MuiEvent<React.KeyboardEvent<HTMLElement>>
    ) => {
      if (!params.isEditable) {
        const col = colFromFieldName(params.field, columns);
        if (col) {
          const handleKeyDown = columnTypes[col.type].handleKeyDown;
          if (handleKeyDown) {
            handleKeyDown(
              viewGrid,
              col,
              params.row.id,
              params.value,
              ev,
              accessLevel
            );
          }
        }
      }
    },
    [columns, viewGrid, accessLevel]
  );

  const onColumnOrderChange = useCallback(
    (params: GridColumnOrderChangeParams) => {
      moveColumn(params.column.field, params.targetIndex);
    },
    [moveColumn]
  );

  const onColumnResize = useCallback(
    (params: GridColumnResizeParams) => {
      setColumnWidth(params.colDef.field, params.width);
    },
    [setColumnWidth]
  );

  const onRowSelectionModelChange = useCallback(
    (model: GridRowSelectionModel) => setSelection(model as number[]),
    [setSelection]
  );

  const processRowUpdate = useCallback(
    (after: Row, before: Row): Row => {
      const changedField = Object.keys(after).find(
        (key) => after[key] != before[key]
      );
      if (changedField) {
        const col = colFromFieldName(changedField, columns);
        if (col) {
          const proc = columnTypes[col.type].processRowUpdate;
          if (proc) {
            proc(viewGrid, col, after.id, after[changedField]);
          }
        }
      }
      return after;
    },
    [columns]
  );

  const mainSx = useMemo(
    () => ({
      ...(accessLevel === 'readonly' && {
        '& .MuiDataGrid-cell:focus': {
          outline: 'none',
        },
        '& .MuiDataGrid-cell:focus-within': {
          outline: 'none',
        },
        '& .MuiDataGrid-cell:hover': {
          backgroundColor: 'transparent',
          cursor: 'default',
        },
      }),
    }),
    [accessLevel]
  );

  const onCancelRename = useCallback(
    () => setColumnToRename(null),
    [setColumnToRename]
  );

  const onSaveCreateColumn = useCallback(
    async (columns: SelectedViewColumn[]) => {
      for (const col of columns) {
        await onCreateColumnSave(col);
      }
    },
    [onCreateColumnSave]
  );

  return (
    <>
      <DataGridPro
        apiRef={gridApiRef}
        autoHeight={empty}
        checkboxSelection={!!selectionModel?.mode}
        columns={gridColumns}
        disableRowSelectionOnClick={true}
        getRowClassName={getRowClassName}
        hideFooter={
          disableAdd || empty || contentSource == VIEW_CONTENT_SOURCE.DYNAMIC
        }
        localeText={localeText}
        onCellEditStart={onCellEditStart}
        onCellKeyDown={onCellKeyDown}
        onColumnOrderChange={onColumnOrderChange}
        onColumnResize={onColumnResize}
        onRowSelectionModelChange={onRowSelectionModelChange}
        pinnedColumns={pinnedColumns}
        processRowUpdate={processRowUpdate}
        rows={gridRows}
        slotProps={componentsProps}
        slots={slots}
        style={style}
        sx={[
          mainSx,
          {
            '.addedRow': {
              '@keyframes addedRowAnimation': {
                from: {
                  backgroundColor: oldTheme.palette.success.main,
                },
                to: {
                  backgroundColor: 'transparent',
                },
              },
              animation: 'addedRowAnimation 2s',
            },
          },
        ]}
        {...modelGridProps}
      />

      {empty && <EmptyView orgId={orgId} view={view} />}
      {columnToRename && (
        <ViewRenameColumnDialog
          column={columnToRename}
          onCancel={onCancelRename}
          onSave={onColumnRenameSave}
        />
      )}
      {columnToCreate && (
        <ViewColumnDialog
          columns={columns}
          onClose={onCreateColumnCancel}
          onSave={onSaveCreateColumn}
        />
      )}
      {renderConfigDialog &&
        renderConfigDialog(
          columnToConfigure,
          onConfigureColumnCancel,
          onConfigureColumnSave
        )}
    </>
  );
};

function colFromFieldName(
  fieldName: string,
  columns: ZetkinViewColumn[]
): ZetkinViewColumn | undefined {
  const colId = parseInt(fieldName.slice(4));
  return columns.find((col) => col.id == colId);
}

export default ViewDataTable;
