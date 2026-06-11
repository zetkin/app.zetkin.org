import { Box, Typography, useTheme } from '@mui/material';
import {
  Dispatch,
  ReactNode,
  Ref,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { List, RowComponentProps, useListRef } from 'react-window';
import { ArrowDownward, ArrowUpward } from '@mui/icons-material';

import { ViewBrowserItem } from 'features/views/hooks/useViewBrowserItems';
import BrowserRow from 'features/views/components/ViewBrowser/BrowserRow';

type GridColDefWidthSpec = {
  width: number;
};

type GridColDefFlexSpec = {
  flex: number;
};

type GridColDefSizeSpec = GridColDefWidthSpec | GridColDefFlexSpec;

export type GridColDef = GridColDefSizeSpec & {
  field: string;
  headerName: string;
  renderCell: (params: {
    index: number;
    renaming: boolean;
    row: ViewBrowserItem;
  }) => ReactNode;
  sortable?: boolean;
};

export type GridSortDirection = 'asc' | 'desc';

export type GridSortModel = readonly {
  field: string;
  sort: GridSortDirection;
}[];

export type ViewBrowserRow = {
  item: ViewBrowserItem;
  renaming: boolean;
};

type RowProps = {
  columns: GridColDef[];
  enableDragAndDrop?: boolean;
  header?: ReactNode;
  headerRef: Ref<HTMLDivElement | null>;
  nonHeaderOpacity: string;
  rows: ViewBrowserRow[];
  sorting: Record<string, GridSortDirection | undefined>;
  updateSorting: (field: string, sort: GridSortDirection | null) => void;
};

function Row({
  columns,
  enableDragAndDrop,
  header,
  headerRef,
  rows,
  index,
  style,
  nonHeaderOpacity,
  sorting,
  updateSorting,
}: RowComponentProps<RowProps>) {
  const theme = useTheme();

  if (index === 0) {
    return (
      <Box style={style}>
        <Box
          ref={headerRef}
          sx={{
            overflow: 'hidden',
          }}
        >
          {header}
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'row',
              height: '56px',
              width: '100%',
            }}
          >
            {columns.map((col, colIndex) => {
              const sort = sorting[col.field];

              return (
                <Box
                  key={colIndex}
                  onClick={() => {
                    let nextSort: GridSortDirection | null = null;
                    if (!sort) {
                      nextSort = 'asc';
                    } else if (sort === 'asc') {
                      nextSort = 'desc';
                    }
                    updateSorting(col.field, nextSort);
                  }}
                  sx={{
                    '&:hover .sort-control-indicator-icon': {
                      color: theme.palette.grey[500],
                    },
                    alignItems: 'center',
                    cursor: 'pointer',
                    display: 'flex',
                    flex: 'flex' in col ? col.flex : undefined,
                    flexDirection: 'row',
                    height: '100%',
                    width: 'width' in col ? `${col.width}px` : undefined,
                  }}
                >
                  {colIndex !== 0 && (
                    <Box
                      sx={{
                        backgroundColor: theme.palette.grey[300],
                        height: '20px',
                        width: '2px',
                      }}
                    />
                  )}
                  <Box
                    sx={{
                      alignItems: 'center',
                      display: 'flex',
                      flexDirection: 'row',
                      gap: '10px',
                      padding: '0px 10px',
                    }}
                  >
                    <Typography
                      sx={{
                        color: theme.palette.primary.light,
                        fontSize: '0.875rem',
                        fontWeight: 'bold',
                        userSelect: 'none',
                      }}
                    >
                      {col.headerName}
                    </Typography>
                    {col.sortable && (
                      <Box
                        className={'sort-control-indicator-icon'}
                        sx={{
                          alignItems: 'center',
                          color: sort
                            ? theme.palette.primary.light
                            : 'transparent',
                          display: 'flex',
                          fontSize: 'md',
                          transition: 'color 200ms ease',
                        }}
                      >
                        {sort === 'desc' ? (
                          <ArrowDownward fontSize={'inherit'} />
                        ) : (
                          <ArrowUpward fontSize={'inherit'} />
                        )}
                      </Box>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    );
  }

  const row = rows[index - 1];

  return (
    <BrowserRow enableDragAndDrop={enableDragAndDrop} item={row.item}>
      <Box
        data-testid={'view-browser-row'}
        style={style}
        sx={{
          '&:hover': {
            backgroundColor: theme.palette.grey[200],
          },
          alignItems: 'center',
          borderTop: `1px solid ${theme.palette.grey[300]}`,
          display: 'flex',
          flexDirection: 'row',
          opacity: nonHeaderOpacity,
          width: '100%',
        }}
      >
        {columns.map((col, colIndex) => (
          <Box
            key={colIndex}
            sx={{
              alignItems: 'center',
              display: 'flex',
              flex: 'flex' in col ? col.flex : undefined,
              flexDirection: 'row',
              padding: '0px 10px',
              width: 'width' in col ? `${col.width}px` : undefined,
            }}
          >
            {col.renderCell({
              index,
              renaming: row.renaming,
              row: row.item,
            })}
          </Box>
        ))}
      </Box>
    </BrowserRow>
  );
}

function BrowserList({
  cols,
  enableDragAndDrop,
  header,
  rows,
  setSortModel,
  sortModel,
}: {
  cols: GridColDef[];
  enableDragAndDrop?: boolean;
  header: ReactNode;
  rows: ViewBrowserRow[];
  setSortModel: Dispatch<SetStateAction<GridSortModel>>;
  sortModel: GridSortModel;
}) {
  const listRef = useListRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [hasEvaluatedHeightOnce, setHasEvaluatedHeightOnce] = useState(false);

  const resizeObserverRef = useRef<ResizeObserver>();

  const headerRef: Ref<HTMLDivElement | null> = useCallback(
    (el: HTMLDivElement | null) => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }

      if (!el) {
        return;
      }

      const ro = new ResizeObserver(() => {
        requestAnimationFrame(() => {
          const h = el.getBoundingClientRect().height;
          setHeaderHeight(h);
          setHasEvaluatedHeightOnce(true);
        });
      });
      ro.observe(el);
      resizeObserverRef.current = ro;
    },
    []
  );

  useEffect(() => {
    const timeoutToEnsureUIEnabledOnUnexpectedState = setTimeout(() => {
      setHasEvaluatedHeightOnce(true);
    }, 1000);

    return () => {
      clearTimeout(timeoutToEnsureUIEnabledOnUnexpectedState);
    };
  }, []);

  const hasHeader = !!header;

  const getRowHeight = useCallback(
    (index: number) => (index === 0 && hasHeader ? headerHeight : 50),
    [hasHeader, headerHeight]
  );

  const sorting = useMemo(
    () =>
      sortModel.reduce(
        (prev, cur) => {
          prev[cur.field] = cur.sort;
          return prev;
        },
        {} as Record<string, GridSortDirection | undefined>
      ),
    [sortModel]
  );

  const updateSorting = useCallback(
    (field: string, dir: GridSortDirection | null) => {
      setSortModel((current) => {
        const hasField = current.some((entry) => entry.field === field);
        if (hasField && dir) {
          return current.map((entry) =>
            entry.field === field ? { field: field, sort: dir } : entry
          );
        } else if (dir) {
          return [...current, { field: field, sort: dir }];
        } else if (hasField) {
          return current.filter((entry) => entry.field !== field);
        }
        return current;
      });
    },
    [setSortModel]
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        width: '100%',
      }}
    >
      <List
        listRef={listRef}
        rowComponent={Row}
        rowCount={rows.length + 1}
        rowHeight={getRowHeight}
        rowProps={{
          columns: cols,
          enableDragAndDrop,
          header: header,
          headerRef: headerRef,
          nonHeaderOpacity: hasEvaluatedHeightOnce ? '100%' : '0',
          rows: rows,
          sorting,
          updateSorting,
        }}
      />
    </Box>
  );
}

export default BrowserList;
