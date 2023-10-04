import { Link } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import NextLink from 'next/link';
import NProgress from 'nprogress';
import { useRouter } from 'next/router';
import {
  DataGridPro,
  GRID_CHECKBOX_SELECTION_COL_DEF,
  GridCellEditStartReasons,
  GridCellParams,
  GridColDef,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import { FunctionComponent, useContext, useState } from 'react';

import columnTypes from './columnTypes';
import EmptyView from 'features/views/components/EmptyView';
import useAccessLevel from 'features/views/hooks/useAccessLevel';
import useConfigurableDataGridColumns from 'zui/ZUIUserConfigurableDataGrid/useConfigurableDataGridColumns';
import { useMessages } from 'core/i18n';
import useModel from 'core/useModel';
import useModelsFromQueryString from 'zui/ZUIUserConfigurableDataGrid/useModelsFromQueryString';
import useViewDataModel from 'features/views/hooks/useViewDataModel';
import ViewBrowserModel from 'features/views/models/ViewBrowserModel';
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

import messageIds from 'features/views/l10n/messageIds';
import useViewBrowserMutation from 'features/views/hooks/useViewBrowserMutation';

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
  const messages = useMessages(messageIds);
  const classes = useStyles();
  const gridApiRef = useGridApiRef();
  const [addedId, setAddedId] = useState(0);
  const [columnToCreate, setColumnToCreate] =
    useState<SelectedViewColumn | null>(null);
  const [columnToConfigure, setColumnToConfigure] =
    useState<ZetkinViewColumn | null>(null);
  const [columnToRename, setColumnToRename] = useState<ZetkinViewColumn | null>(
    null
  );
  const [selection, setSelection] = useState<number[]>([]);
  const [waiting, setWaiting] = useState(false);

  const { gridProps: modelGridProps } = useModelsFromQueryString();
  const [, accessLevel] = useAccessLevel();

  const [quickSearch, setQuickSearch] = useState('');
  const router = useRouter();
  const { orgId } = router.query;
  const { showSnackbar } = useContext(ZUISnackbarContext);
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);

  const model = useViewDataModel();
  const browserModel = useModel(
    (env) => new ViewBrowserModel(env, parseInt(orgId as string))
  );
  const { createView } = useViewBrowserMutation(parseInt(orgId as string));

  const showError = (error: VIEW_DATA_TABLE_ERROR) => {
    showSnackbar('error', messages.dataTableErrors[error]());
  };

  const updateColumn = async (
    id: number,
    data: Omit<Partial<ZetkinViewColumn>, 'id'>
  ) => {
    NProgress.start();
    try {
      await model.updateColumn(id, data);
    } catch (err) {
      showError(VIEW_DATA_TABLE_ERROR.MODIFY_COLUMN);
    } finally {
      NProgress.done();
    }
  };

  const onCreateColumnCancel = () => {
    setColumnToCreate(null);
  };

  const onConfigureColumnCancel = () => {
    setColumnToConfigure(null);
  };

  const onConfigureColumnSave = (
    id: number,
    config: ZetkinViewColumn['config']
  ) => {
    setColumnToConfigure(null);

    const columnPreEdit = columns.find((col) => col.id === id);
    if (!columnPreEdit) {
      showError(VIEW_DATA_TABLE_ERROR.MODIFY_COLUMN);
      return;
    }

    updateColumn(id, { config: config });
  };

  const onCreateColumnSave = async (colSpec: SelectedViewColumn) => {
    setColumnToCreate(null);
    try {
      await model.addColumn({
        config: colSpec.config,
        title: colSpec.title,
        type: colSpec.type,
      });
    } catch (err) {
      showError(VIEW_DATA_TABLE_ERROR.CREATE_COLUMN);
    } finally {
      NProgress.done();
    }
  };

  const onColumnConfigure = (colFieldName: string) => {
    const colId = colIdFromFieldName(colFieldName);
    const colSpec = columns.find((col) => col.id === colId) || null;
    setColumnToConfigure(colSpec);
  };

  const onColumnCreate = () => {
    setColumnToCreate({});
  };

  const onColumnDelete = async (colFieldName: string) => {
    const colId = colIdFromFieldName(colFieldName);
    const colSpec = columns.find((col) => col.id === colId) || null;

    async function doDelete() {
      try {
        await model.deleteColumn(colId);
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
    updateColumn(column.id, { title: column.title });
  };

  const onRowsRemove = async () => {
    setWaiting(true);
    try {
      await model.removeRows(selection);
    } catch (err) {
      showError(VIEW_DATA_TABLE_ERROR.REMOVE_ROWS);
    } finally {
      setWaiting(false);
    }
  };

  const onViewCreate = () => {
    console.log('yeah');
    browserModel.createView(view.folder?.id ?? 0, selection);
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

  const unConfiguredGridColumns = [
    avatarColumn,
    ...columns.map((col) => ({
      field: `col_${col.id}`,
      headerName: col.title,
      minWidth: 100,
      resizable: true,
      sortable: true,
      width: 150,
      ...columnTypes[col.type].getColDef(col, accessLevel),
    })),
  ];
  const { columns: gridColumns, setColumnWidth } =
    useConfigurableDataGridColumns('viewInstances', unConfiguredGridColumns);

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
        await model.addPerson(person);

        // Store ID for highlighting the new row
        setAddedId(person.id);

        // Remove ID again after 2 seconds, unless the state has changed
        setTimeout(() => {
          setAddedId((curState) => (curState == person.id ? 0 : curState));
        }, 2000);

        // Scroll (jump) to row after short delay
        setTimeout(() => {
          const gridApi = gridApiRef.current;
          const rowIndex = gridApi.getRowIndex(person.id);
          gridApi.scrollToIndexes({ rowIndex });
        }, 200);
      },
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

  const renderConfigDialog =
    columnToConfigure && columnTypes[columnToConfigure.type].renderConfigDialog;

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
          noRowsLabel: messages.empty.notice[contentSource](),
        }}
        onCellEditStart={(params, event) => {
          if (params.reason == GridCellEditStartReasons.printableKeyDown) {
            // Don't enter edit mode when the user just presses a printable character.
            // Doing so is the default DataGrid behaviour (as in spreadsheets) but it
            // means the user will overwrite the original value, which is rarely what
            // you want with the precious data that exists in views (when there is no
            // undo feature).
            event.defaultMuiPrevented = true;
          }
        }}
        onCellKeyDown={(params: GridCellParams<unknown, ZetkinViewRow>, ev) => {
          if (!params.isEditable) {
            const col = colFromFieldName(params.field, columns);
            if (col) {
              const handleKeyDown = columnTypes[col.type].handleKeyDown;
              if (handleKeyDown) {
                handleKeyDown(
                  model,
                  col,
                  params.row.id,
                  params.value,
                  ev,
                  accessLevel
                );
              }
            }
          }
        }}
        onColumnResize={(params) => {
          setColumnWidth(params.colDef.field, params.width);
        }}
        onSelectionModelChange={(model) => setSelection(model as number[])}
        pinnedColumns={{
          left: ['id', GRID_CHECKBOX_SELECTION_COL_DEF.field],
        }}
        processRowUpdate={(after, before) => {
          const changedField = Object.keys(after).find(
            (key) => after[key] != before[key]
          );
          if (changedField) {
            const col = colFromFieldName(changedField, columns);
            if (col) {
              const processRowUpdate = columnTypes[col.type].processRowUpdate;
              if (processRowUpdate) {
                processRowUpdate(model, col.id, after.id, after[changedField]);
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
      {columnToCreate && (
        <ViewColumnDialog
          columns={columns}
          onClose={onCreateColumnCancel}
          onSave={async (columns) => {
            for (const col of columns) {
              await onCreateColumnSave(col);
            }
          }}
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
