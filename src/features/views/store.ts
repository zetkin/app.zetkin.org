import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Call } from 'features/callAssignments/apiTypes';
import { callUpdated } from 'features/callAssignments/store';
import columnTypes from './components/ViewDataTable/columnTypes';
import { DeleteFolderReport } from './rpc/deleteFolder';
import notEmpty from 'utils/notEmpty';
import { PersonViewFilterConfig } from 'features/smartSearch/components/types';
import { ViewTreeData } from 'pages/api/views/tree';
import { ZetkinObjectAccess } from 'core/api/types';
import {
  COLUMN_TYPE,
  ZetkinView,
  ZetkinViewColumn,
  ZetkinViewFolder,
  ZetkinViewRow,
} from './components/types';
import { remoteItem, remoteList, RemoteList } from 'utils/storeUtils';
import { tagAssigned, tagUnassigned } from 'features/tags/store';
import {
  ZetkinOfficial,
  ZetkinOrganizerAction,
  ZetkinQuery,
  ZetkinTag,
} from 'utils/types/zetkin';

type ZetkinObjectAccessWithId = ZetkinObjectAccess & {
  id: number;
};

export interface ViewsStoreSlice {
  accessByViewId: Record<number | string, RemoteList<ZetkinObjectAccessWithId>>;
  columnsByViewId: Record<number | string, RemoteList<ZetkinViewColumn>>;
  folderList: RemoteList<ZetkinViewFolder>;
  officialList: RemoteList<ZetkinOfficial>;
  recentlyCreatedFolder: ZetkinViewFolder | null;
  rowsByViewId: Record<number | string, RemoteList<ZetkinViewRow>>;
  viewList: RemoteList<ZetkinView>;
}

const initialState: ViewsStoreSlice = {
  accessByViewId: {},
  columnsByViewId: {},
  folderList: remoteList(),
  officialList: remoteList(),
  recentlyCreatedFolder: null,
  rowsByViewId: {},
  viewList: remoteList(),
};

const viewsSlice = createSlice({
  extraReducers: (builder) =>
    builder
      .addCase(tagAssigned, (state, action) => {
        const [personId, tag] = action.payload;
        setTagOnRelevantRows(state, personId, tag.id, tag);
      })
      .addCase(tagUnassigned, (state, action) => {
        const [personId, tagId] = action.payload;
        setTagOnRelevantRows(state, personId, tagId, null);
      })
      .addCase(callUpdated, (state, action) => {
        const [call, mutations] = action.payload;
        updateCallOnRelevantRows(state, call, mutations);
      }),
  initialState,
  name: 'views',
  reducers: {
    accessAdded: (
      state,
      action: PayloadAction<[number, ZetkinObjectAccess]>
    ) => {
      const [viewId, accessObj] = action.payload;
      const list = state.accessByViewId[viewId];
      if (list) {
        let updated = false;
        const newItem = remoteItem(accessObj.person.id, {
          data: {
            id: accessObj.person.id,
            ...accessObj,
          },
        });

        list.items = list.items.map((item) => {
          if (item.id == accessObj.person.id) {
            updated = true;
            return newItem;
          } else {
            return item;
          }
        });

        if (!updated) {
          list.items.push(newItem);
        }
      }
    },
    accessLoad: (state, action: PayloadAction<number>) => {
      if (!state.accessByViewId[action.payload]) {
        state.accessByViewId[action.payload] =
          remoteList<ZetkinObjectAccessWithId>();
      }
      state.accessByViewId[action.payload].isLoading = true;
    },
    accessLoaded: (
      state,
      action: PayloadAction<[number, ZetkinObjectAccess[]]>
    ) => {
      const [viewId, accessList] = action.payload;

      // Add ID which is required by RemoteList
      state.accessByViewId[viewId] = remoteList(
        accessList.map((accessObj) => ({
          ...accessObj,
          id: accessObj.person.id,
        }))
      );
      state.accessByViewId[viewId].loaded = new Date().toISOString();
    },
    accessRevoked: (state, action: PayloadAction<[number, number]>) => {
      const [viewId, personId] = action.payload;
      const list = state.accessByViewId[viewId];
      if (list) {
        list.items = list.items.filter((item) => item.id != personId);
      }
    },
    allItemsLoad: (state) => {
      state.folderList.isLoading = true;
      state.viewList.isLoading = true;
    },
    allItemsLoaded: (state, action: PayloadAction<ViewTreeData>) => {
      const { folders, views } = action.payload;
      const timestamp = new Date().toISOString();
      state.folderList = remoteList(folders);
      state.folderList.loaded = timestamp;
      state.viewList = remoteList(views);
      state.viewList.loaded = timestamp;
    },
    cellUpdate: () => {
      // Todo: Do something to indicate loading status?
    },
    cellUpdated: (
      state,
      action: PayloadAction<[number, number, number, unknown]>
    ) => {
      const [viewId, rowId, colId, newValue] = action.payload;
      const rowList = state.rowsByViewId[viewId];
      const rowItem = rowList.items.find((item) => item.id == rowId);
      const columnList = state.columnsByViewId[viewId];
      const colIndex = columnList.items.findIndex((item) => item.id == colId);
      if (rowItem?.data?.content) {
        rowItem.data.content = rowItem.data.content.map((oldValue, idx) =>
          idx == colIndex ? newValue : oldValue
        );
      }
    },
    columnAdded: (state, action: PayloadAction<[number, ZetkinViewColumn]>) => {
      const [viewId] = action.payload;
      const colList = state.columnsByViewId[viewId];
      if (colList) {
        colList.isStale = true;
        const rowList = state.rowsByViewId[viewId];

        if (rowList) {
          // Force a reload without emptying the view
          rowList.isStale = true;
        }
      }
    },
    columnDeleted: (state, action: PayloadAction<[number, number]>) => {
      const [viewId, columnId] = action.payload;
      const colList = state.columnsByViewId[viewId];

      if (colList) {
        const colItem = colList.items.find((item) => item.id === columnId);
        if (colItem) {
          colItem.deleted = true;
        }

        const rowList = state.rowsByViewId[viewId];
        if (rowList) {
          // Empty the view to force a reload
          rowList.items = [];
          rowList.isStale = true;
        }
      }
    },
    columnOrderUpdated: (state, action: PayloadAction<[number, number[]]>) => {
      const [viewId, columnOrder] = action.payload;
      // Re-arrange columns
      const colList = state.columnsByViewId[viewId];
      if (colList) {
        const newColListItems = columnOrder
          .map((colId) => {
            const col = colList.items.find((col) => col.id == colId);
            if (col) {
              return col;
            } else {
              colList.isStale = true;
            }
          })
          .filter(notEmpty);

        // Re-arrange columns of data-rows
        const rowList = state.rowsByViewId[viewId];
        if (rowList) {
          const newRowListItems = rowList.items.map((row) => {
            if (row.data) {
              return {
                ...row,
                data: {
                  content: columnOrder.map((colId) => {
                    const idx = colList.items.findIndex(
                      (col) => col.id == colId
                    )!;
                    return row.data?.content[idx];
                  }),
                  id: row.data.id,
                },
              };
            } else {
              return row;
            }
          });
          state.columnsByViewId[viewId].items = newColListItems;
          state.rowsByViewId[viewId].items = newRowListItems;
        }
      }
    },
    columnUpdated: (
      state,
      action: PayloadAction<[number, ZetkinViewColumn]>
    ) => {
      const [viewId, column] = action.payload;
      const colList = state.columnsByViewId[viewId];
      if (colList) {
        let configChanged = false;
        colList.items = colList.items.map((item) => {
          if (item.id == column.id) {
            if (
              JSON.stringify(column.config) != JSON.stringify(item.data?.config)
            ) {
              configChanged = true;
            }
            return remoteItem(column.id, { data: column });
          } else {
            return item;
          }
        });

        const rowList = state.rowsByViewId[viewId];
        if (rowList && configChanged) {
          // Empty the view to force a reload when config changes
          rowList.items = [];
          rowList.isStale = true;
        }
      }
    },
    columnsLoad: (state, action: PayloadAction<number>) => {
      const viewId = action.payload;
      if (!state.columnsByViewId[viewId]) {
        state.columnsByViewId[viewId] = remoteList([]);
      }
      state.columnsByViewId[viewId].isLoading = true;
    },
    columnsLoaded: (
      state,
      action: PayloadAction<[number, ZetkinViewColumn[]]>
    ) => {
      const [viewId, columns] = action.payload;
      const supportedColumns = columns.map((column) => {
        const copy: ZetkinViewColumn = { ...column };
        if (!Object.keys(columnTypes).includes(copy.type)) {
          copy.type = COLUMN_TYPE.UNSUPPORTED;
        }

        return copy;
      });

      state.columnsByViewId[viewId] = remoteList(supportedColumns);
      state.columnsByViewId[viewId].loaded = new Date().toISOString();
    },
    folderCreate: (state) => {
      state.folderList.isLoading = true;
      state.recentlyCreatedFolder = null;
    },
    folderCreated: (state, action: PayloadAction<ZetkinViewFolder>) => {
      const folder = action.payload;
      state.folderList.isLoading = false;
      state.folderList.items.push(remoteItem(folder.id, { data: folder }));
      state.recentlyCreatedFolder = folder;
    },
    folderDeleted: (state, action: PayloadAction<DeleteFolderReport>) => {
      const { foldersDeleted, viewsDeleted } = action.payload;
      const deletedFolderItems =
        state.folderList.items.filter((item) =>
          foldersDeleted.includes(item.id)
        ) || [];
      deletedFolderItems.forEach((item) => item.deleted);
      state.folderList.isStale = true;

      const deletedViewItems =
        state.viewList.items.filter((item) => viewsDeleted.includes(item.id)) ||
        [];

      deletedViewItems.forEach((item) => (item.deleted = true));
      state.viewList.isStale = true;
    },
    folderUpdate: (state, action: PayloadAction<[number, string[]]>) => {
      const [id, mutating] = action.payload;
      const item = state.folderList.items.find((item) => item.id == id);
      if (item) {
        item.mutating = mutating;
      }

      // Mutating means that creating the "recently created folder"
      // is no longer the most recent action takeing.
      state.recentlyCreatedFolder = null;
    },
    folderUpdated: (
      state,
      action: PayloadAction<[ZetkinViewFolder, string[]]>
    ) => {
      const [folder, mutating] = action.payload;
      const item = state.folderList.items.find((item) => item.id == folder.id);
      if (item) {
        item.mutating = item.mutating.filter(
          (attr) => !mutating.includes(attr)
        );
        if (item.data) {
          item.data = folder;
        }
      }
    },
    officialsLoad: (state) => {
      state.officialList.isLoading = true;
    },
    officialsLoaded: (state, action: PayloadAction<ZetkinOfficial[]>) => {
      state.officialList = remoteList(action.payload);
      state.officialList.loaded = new Date().toISOString();
    },
    rowAdded: (state, action: PayloadAction<[number, ZetkinViewRow]>) => {
      const [viewId, row] = action.payload;
      const list = state.rowsByViewId[viewId];
      if (list) {
        list.items = list.items
          .filter((item) => item.id != row.id)
          .concat([remoteItem(row.id, { data: row })]);
      } else {
        state.rowsByViewId[viewId] = remoteList([row]);
      }
    },
    rowRemoved: (state, action: PayloadAction<[number, number]>) => {
      const [viewId, rowId] = action.payload;
      const list = state.rowsByViewId[viewId];
      if (list) {
        list.items = list.items.filter((item) => item.id != rowId);
      }
    },
    rowsLoad: (state, action: PayloadAction<number>) => {
      const viewId = action.payload;
      if (!state.rowsByViewId[viewId]) {
        state.rowsByViewId[viewId] = remoteList([]);
      }
      state.rowsByViewId[viewId].isLoading = true;
    },
    rowsLoaded: (state, action: PayloadAction<[number, ZetkinViewRow[]]>) => {
      const [viewId, rows] = action.payload;
      state.rowsByViewId[viewId] = remoteList(rows);
      state.rowsByViewId[viewId].loaded = new Date().toISOString();
      state.rowsByViewId[viewId].isStale = false;
    },
    viewCreate: (state) => {
      state.viewList.isLoading = true;
    },
    viewCreated: (state, action: PayloadAction<ZetkinView>) => {
      const view = action.payload;
      state.viewList.isLoading = false;
      state.viewList.items.push(
        remoteItem(view.id, {
          data: view,
        })
      );
    },
    viewDeleted: (state, action: PayloadAction<number>) => {
      const viewId = action.payload;
      const viewItem = state.viewList.items.find((item) => item.id === viewId);

      if (viewItem) {
        viewItem.deleted = true;
        invalidateDependentViews(viewId, state);
      }
    },
    viewDuplicated: (state, action: PayloadAction<[ZetkinView]>) => {
      const [view] = action.payload;
      state.viewList.items.push(
        remoteItem(view.id, { data: view, loaded: new Date().toISOString() })
      );
    },
    viewLoad: (state, action: PayloadAction<number>) => {
      const viewId = action.payload;
      const item = state.viewList.items.find((item) => item.id == viewId);
      if (item) {
        item.isLoading = true;
      } else {
        state.viewList.items = state.viewList.items.concat([
          remoteItem(viewId, { isLoading: true }),
        ]);
      }
    },
    viewLoaded: (state, action: PayloadAction<ZetkinView>) => {
      const view = action.payload;
      state.viewList.items = state.viewList.items
        .filter((item) => item.id != view.id)
        .concat([
          remoteItem(view.id, { data: view, loaded: new Date().toISOString() }),
        ]);
    },
    viewQueryUpdated: (
      state,
      action: PayloadAction<[number, ZetkinQuery | null]>
    ) => {
      const [viewId, query] = action.payload;
      const item = state.viewList.items.find((item) => item.id == viewId);
      if (item) {
        if (item.data) {
          item.data.content_query = query;
        }
      }
      const rowList = state.rowsByViewId[viewId];
      if (rowList) {
        // Empty view to trigger reload
        rowList.items = [];
        rowList.isStale = true;
        invalidateDependentViews(viewId, state);
      }
    },
    viewUpdate: (state, action: PayloadAction<[number, string[]]>) => {
      const [id, mutating] = action.payload;
      const item = state.viewList.items.find((item) => item.id == id);
      if (item) {
        item.mutating = mutating;
      }
    },
    viewUpdated: (state, action: PayloadAction<[ZetkinView, string[]]>) => {
      const [view, mutating] = action.payload;
      const item = state.viewList.items.find((item) => item.id == view.id);
      if (item) {
        item.mutating = item.mutating.filter(
          (attr) => !mutating.includes(attr)
        );
        if (item.data) {
          item.data = view;
        }
      }
    },
  },
});

/**
 * Find all rows and columns that are relevant when assigning/unassigning a
 * tag to a person, and update the rows to reflect the new state.
 */
function setTagOnRelevantRows(
  state: ViewsStoreSlice,
  personId: number,
  tagId: number,
  tag: ZetkinTag | null
) {
  Object.entries(state.columnsByViewId).forEach(([viewId, columnList]) => {
    // Find indices of relevant columns
    const relevantColumnIndices: number[] = [];
    columnList.items.forEach((colItem, index) => {
      if (
        colItem.data?.type == COLUMN_TYPE.PERSON_TAG &&
        colItem.data.config.tag_id == tagId
      ) {
        relevantColumnIndices.push(index);
      }
    });

    // If there are relevant columns in this view
    if (relevantColumnIndices.length) {
      const rowItems = state.rowsByViewId[viewId]?.items;
      if (rowItems) {
        rowItems.forEach((item) => {
          if (item.data?.id == personId) {
            for (const colIndex of relevantColumnIndices) {
              item.data.content[colIndex] = tag;
            }
          }
        });
      }
    }
  });
}

function updateCallOnRelevantRows(
  state: ViewsStoreSlice,
  call: Call,
  mutations: string[]
) {
  Object.entries(state.columnsByViewId).forEach(([viewId, columnList]) => {
    const personId = call.target.id;

    // Find indices of relevant columns
    const relevantColumnIndices: number[] = [];
    columnList.items.forEach((colItem, index) => {
      if (colItem.data?.type == COLUMN_TYPE.ORGANIZER_ACTION) {
        relevantColumnIndices.push(index);
      }
    });

    // If there are relevant columns in this view
    if (relevantColumnIndices.length) {
      const rowItems = state.rowsByViewId[viewId]?.items;
      if (rowItems) {
        rowItems.forEach((item) => {
          if (item.data?.id == personId) {
            for (const colIndex of relevantColumnIndices) {
              const calls = item.data.content[
                colIndex
              ] as ZetkinOrganizerAction[];
              for (const c of calls) {
                if (call.id == c.id) {
                  if (mutations.includes('organizer_action_taken')) {
                    c.organizer_action_taken = call.organizer_action_taken;
                  }
                }
              }
            }
          }
        });
      }
    }
  });
}

interface Dependency {
  from: number;
  to: number;
}

function invalidateDependentViews(
  updatedViewId: number | undefined,
  state: ViewsStoreSlice
) {
  const dependencies = getViewDependencies(state);
  const viewsCheckedForDependencies = [];
  const viewsQueue = [];

  while (dependencies.length > 0 && updatedViewId) {
    viewsCheckedForDependencies.push(updatedViewId);

    for (let i = 0; i < dependencies.length; i++) {
      const dependency = dependencies[i];
      const isDependentOnUpdatedView = dependency.to == updatedViewId;

      if (isDependentOnUpdatedView) {
        const alreadyChecked = viewsCheckedForDependencies.includes(
          dependency.from
        );

        if (!alreadyChecked) {
          viewsQueue.push(dependency.from);
        }

        const viewRowsToInvalidate = state.rowsByViewId[dependency.from];
        if (viewRowsToInvalidate) {
          viewRowsToInvalidate.items = [];
          viewRowsToInvalidate.isStale = true;
        }

        dependencies.splice(i, 1);
        i--;
      }
    }
    updatedViewId = viewsQueue.pop();
  }
}

function getViewDependencies(state: ViewsStoreSlice): Dependency[] {
  const dependencies: Dependency[] = [];

  state.viewList.items.forEach((viewItem) => {
    const viewData = viewItem.data;
    const viewQuery = viewData?.content_query;

    if (viewQuery) {
      viewQuery.filter_spec.forEach((queryType) => {
        if (queryType.type === 'person_view') {
          dependencies.push({
            from: viewData.id,
            to: (queryType.config as PersonViewFilterConfig).view,
          });
        }
      });
    }
  });

  return dependencies;
}

export default viewsSlice;
export const {
  accessAdded,
  accessLoad,
  accessLoaded,
  accessRevoked,
  allItemsLoad,
  allItemsLoaded,
  cellUpdate,
  cellUpdated,
  columnAdded,
  columnDeleted,
  columnOrderUpdated,
  columnUpdated,
  columnsLoad,
  columnsLoaded,
  folderCreate,
  folderCreated,
  folderDeleted,
  folderUpdate,
  folderUpdated,
  officialsLoad,
  officialsLoaded,
  rowAdded,
  rowRemoved,
  rowsLoad,
  rowsLoaded,
  viewCreate,
  viewCreated,
  viewDeleted,
  viewLoad,
  viewLoaded,
  viewQueryUpdated,
  viewUpdate,
  viewUpdated,
  viewDuplicated,
} = viewsSlice.actions;
