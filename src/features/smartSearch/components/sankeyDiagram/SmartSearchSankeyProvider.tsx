import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import makeSankeySegments from './makeSankeySegments';
import oldTheme from 'theme';
import useSmartSearchStats from 'features/smartSearch/hooks/useSmartSearchStats';
import {
  CallerFilterConfig,
  FILTER_TYPE,
  OPERATION,
  ZetkinSmartSearchFilter,
} from '../types';
import { SankeyConfig, SankeySegment } from './types';
import { ZetkinSmartSearchFilterStats } from 'features/smartSearch/types';
import { useApiClient, useNumericRouteParams } from 'core/hooks';

type SmartSearchSankeyProviderProps = {
  arrowDepth?: number;
  arrowWidth?: number;
  children: ReactNode;
  color?: string;
  diagWidth?: number;
  filters: ZetkinSmartSearchFilter[];
  filtersForStats?: ZetkinSmartSearchFilter[];
  hoverColor?: string;
  margin?: number;
};

type SankeyContextValue = {
  config: SankeyConfig;
  segments: SankeySegment[];
};

const SankeyContext = createContext<SankeyContextValue | null>(null);

const SmartSearchSankeyProvider: FC<SmartSearchSankeyProviderProps> = ({
  arrowDepth = 10,
  arrowWidth = 20,
  children,
  color = oldTheme.palette.grey[300],
  diagWidth = 200,
  hoverColor = oldTheme.palette.grey[400],
  margin = 30,
  filters,
  filtersForStats = filters,
}) => {
  const apiClient = useApiClient();
  const { orgId } = useNumericRouteParams();
  const stats = useSmartSearchStats(filtersForStats);
  const exactMatchGroups = getExactMatchGroups(filters, filtersForStats);
  const exactMatchGroupsKey = JSON.stringify(exactMatchGroups);
  const [exactMatchCounts, setExactMatchCounts] = useState<
    Record<number, number>
  >({});

  useEffect(() => {
    let wasCanceled = false;
    const groups = JSON.parse(exactMatchGroupsKey) as {
      filterIndex: number;
      filters: ZetkinSmartSearchFilter[];
    }[];

    if (!groups.length) {
      setExactMatchCounts({});
      return;
    }

    Promise.all(
      groups.map((group) =>
        apiClient
          .post<unknown[], { filter_spec: ZetkinSmartSearchFilter[] }>(
            `/api/orgs/${orgId}/people/queries/ephemeral/matches`,
            {
              filter_spec: group.filters,
            }
          )
          .then((matches) => [group.filterIndex, matches.length] as const)
      )
    )
      .then((counts) => {
        if (!wasCanceled) {
          setExactMatchCounts(
            Object.fromEntries(counts) as Record<number, number>
          );
        }
      })
      .catch(() => {
        if (!wasCanceled) {
          setExactMatchCounts({});
        }
      });

    return () => {
      wasCanceled = true;
    };
  }, [apiClient, exactMatchGroupsKey, orgId]);

  const groupedStats = stats
    ? groupStatsByVisibleFilter(filters, stats, exactMatchCounts)
    : [];
  const segments = stats ? makeSankeySegments(groupedStats, orgId) : [];
  const config: SankeyConfig = {
    arrowDepth,
    arrowWidth,
    color,
    diagWidth,
    highlightColor: hoverColor,
    lineWidth: 2,
    margin,
  };

  return (
    <SankeyContext.Provider
      value={{
        config,
        segments,
      }}
    >
      {children}
    </SankeyContext.Provider>
  );
};

function getFilterStatsCount(filter: ZetkinSmartSearchFilter): number {
  if (filter.type !== FILTER_TYPE.CALLER) {
    return 1;
  }

  const config = filter.config as CallerFilterConfig;
  return config.assignment ? 1 : config.assignmentIds?.length || 0;
}

function getExactMatchGroups(
  filters: ZetkinSmartSearchFilter[],
  filtersForStats: ZetkinSmartSearchFilter[]
): { filterIndex: number; filters: ZetkinSmartSearchFilter[] }[] {
  let statsIndex = 0;

  return filters.flatMap((filter, filterIndex) => {
    const statsCount = getFilterStatsCount(filter);
    const group = filtersForStats.slice(statsIndex, statsIndex + statsCount);
    statsIndex += statsCount;

    if (filter.type !== FILTER_TYPE.CALLER || statsCount < 2) {
      return [];
    }

    return [
      {
        filterIndex,
        filters: group.map((filter) => ({
          ...filter,
          op: OPERATION.ADD,
        })),
      },
    ];
  });
}

function groupStatsByVisibleFilter(
  filters: ZetkinSmartSearchFilter[],
  stats: ZetkinSmartSearchFilterStats[],
  exactMatchCounts: Record<number, number>
): ZetkinSmartSearchFilterStats[] {
  let statsIndex = 0;
  let previousResult = 0;

  return filters.flatMap((filter, filterIndex) => {
    const statsCount = getFilterStatsCount(filter);
    const group = stats.slice(statsIndex, statsIndex + statsCount);
    statsIndex += statsCount;

    const lastStats = group[group.length - 1];
    if (!lastStats) {
      return [];
    }

    const change = lastStats.result - previousResult;
    const groupedStats = {
      change,
      filter,
      matches:
        exactMatchCounts[filterIndex] ??
        Math.max(Math.abs(change), ...group.map((stats) => stats.matches)),
      result: lastStats.result,
    };
    previousResult = lastStats.result;

    return [groupedStats];
  });
}

export function useSankey() {
  const context = useContext(SankeyContext);

  if (!context) {
    throw new Error(
      'Sankey segments must be wrapped in a SmartSearchSankeyProvider'
    );
  }

  const segmentsCopy = context.segments.concat();
  const entrySegment = segmentsCopy.shift();
  const exitSegment = segmentsCopy.pop();
  const filterSegments = segmentsCopy;

  return {
    config: context.config,
    entrySegment,
    exitSegment,
    filterSegments,
  };
}

export default SmartSearchSankeyProvider;
