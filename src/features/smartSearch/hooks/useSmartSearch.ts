import { useState } from 'react';

import {
  CallerFilterConfig,
  FILTER_TYPE,
  OPERATION,
  SmartSearchFilterWithId,
  ZetkinSmartSearchFilter,
} from 'features/smartSearch/components/types';

type InitialFilters = ZetkinSmartSearchFilter[];

type UseSmartSearch = {
  addFilter: (filter: ZetkinSmartSearchFilter) => void; // addSmartSearchFilter
  deleteFilter: (id: number) => void; // removeSmartSearchFilter
  editFilter: (id: number, newFilterValue: SmartSearchFilterWithId) => void; // editSmartSearchFilter
  filters: ZetkinSmartSearchFilter[];
  filtersWithIds: SmartSearchFilterWithId[];
  setStartsWithAll: (startsWithAll: boolean) => void;
  startsWithAll: boolean;
  update: (filters: SmartSearchFilterWithId[]) => void;
};

function withoutInvalidCallerConfigFields<
  FilterType extends SmartSearchFilterWithId | ZetkinSmartSearchFilter,
>(filter: FilterType): FilterType {
  if (filter.type !== FILTER_TYPE.CALLER) {
    return filter;
  }

  const config = { ...filter.config } as typeof filter.config & {
    active?: boolean;
    assignmentStatus?: string;
  };
  delete config.active;
  delete config.assignmentStatus;

  return {
    ...filter,
    config,
  };
}

function callerFiltersCanCollapse(
  firstFilter: ZetkinSmartSearchFilter,
  secondFilter: ZetkinSmartSearchFilter
): boolean {
  if (
    firstFilter.type !== FILTER_TYPE.CALLER ||
    secondFilter.type !== FILTER_TYPE.CALLER
  ) {
    return false;
  }

  const firstConfig = firstFilter.config as CallerFilterConfig;
  const secondConfig = secondFilter.config as CallerFilterConfig;
  const firstAssignmentIds =
    firstConfig.assignmentIds ||
    (firstConfig.assignment ? [firstConfig.assignment] : []);
  const secondAssignmentIds =
    secondConfig.assignmentIds ||
    (secondConfig.assignment ? [secondConfig.assignment] : []);

  return (
    firstFilter.op !== OPERATION.LIMIT &&
    firstFilter.op === secondFilter.op &&
    firstConfig.operator === secondConfig.operator &&
    JSON.stringify(firstConfig.organizations) ===
      JSON.stringify(secondConfig.organizations) &&
    firstAssignmentIds.length > 0 &&
    secondAssignmentIds.length > 0
  );
}

function collapseCallerFilters(
  filters: ZetkinSmartSearchFilter[]
): ZetkinSmartSearchFilter[] {
  return filters.reduce<ZetkinSmartSearchFilter[]>(
    (collapsedFilters, filter) => {
      const lastFilter = collapsedFilters[collapsedFilters.length - 1];

      if (!lastFilter || !callerFiltersCanCollapse(lastFilter, filter)) {
        return collapsedFilters.concat(filter);
      }

      const lastConfig = lastFilter.config as CallerFilterConfig;
      const config = filter.config as CallerFilterConfig;
      const lastAssignmentIds =
        lastConfig.assignmentIds ||
        (lastConfig.assignment ? [lastConfig.assignment] : []);
      const assignmentIds =
        config.assignmentIds || (config.assignment ? [config.assignment] : []);

      return collapsedFilters.slice(0, -1).concat({
        ...lastFilter,
        config: {
          ...lastConfig,
          assignment: undefined,
          assignmentIds: lastAssignmentIds.concat(assignmentIds),
        },
      });
    },
    []
  );
}

const useSmartSearch = (
  initialFilters: InitialFilters = []
): UseSmartSearch => {
  // correctly configure legacy queries to only have the All filter in the first position with op: 'add'
  const indexOfAllFilter = initialFilters.findLastIndex(
    (filter) =>
      filter.type == FILTER_TYPE.ALL &&
      (!('config' in filter) || !('organizations' in filter.config))
  );

  const normalizedFilters = initialFilters
    .filter(
      (filter, index) =>
        index > indexOfAllFilter ||
        (index === indexOfAllFilter && filter.op !== OPERATION.SUB)
    )
    .map(withoutInvalidCallerConfigFields);

  const normalizedFiltersWithIds = collapseCallerFilters(normalizedFilters).map(
    (filter, index) =>
      withoutInvalidCallerConfigFields({ ...filter, id: index })
  );

  const [filtersWithIds, setFiltersWithIds] = useState<
    SmartSearchFilterWithId[]
  >(normalizedFiltersWithIds);

  const addFilter = (filter: ZetkinSmartSearchFilter) => {
    const newFilterWithId: SmartSearchFilterWithId = {
      ...filter,
      id: filtersWithIds.length,
    };
    setFiltersWithIds([
      ...filtersWithIds,
      withoutInvalidCallerConfigFields(newFilterWithId),
    ]);
  };

  const editFilter = (id: number, newFilterValue: SmartSearchFilterWithId) => {
    const filtersWithEditedFilter = filtersWithIds.map((filter) => {
      if (id === filter.id) {
        return withoutInvalidCallerConfigFields(newFilterValue);
      } else {
        return filter;
      }
    });
    setFiltersWithIds(filtersWithEditedFilter);
  };

  const deleteFilter = (id: number) => {
    const filtersWithoutSelected = filtersWithIds.filter(
      (filter) => filter.id !== id
    );
    setFiltersWithIds(filtersWithoutSelected);
  };

  const filters = filtersWithIds
    .map((filterWithId) => {
      const { config, op, type } = filterWithId;
      return {
        config,
        op,
        type,
      };
    })
    .map(withoutInvalidCallerConfigFields);

  const firstFilter = filtersWithIds[0];
  const firstFilterHasConfig = firstFilter && 'config' in firstFilter;

  const firstFilterHasOrgConfig =
    firstFilterHasConfig && 'organizations' in firstFilter.config;

  const startsWithAll =
    !!firstFilter &&
    firstFilter.type === FILTER_TYPE.ALL &&
    (!firstFilterHasConfig || !firstFilterHasOrgConfig);

  const setStartsWithAll = (shouldStartWithAll: boolean) => {
    if (startsWithAll && !shouldStartWithAll) {
      setFiltersWithIds(filtersWithIds.slice(1));
    } else if (!startsWithAll && shouldStartWithAll) {
      setFiltersWithIds([
        {
          config: {},
          id: filtersWithIds.length,
          op: OPERATION.ADD,
          type: FILTER_TYPE.ALL,
        },
        ...filtersWithIds,
      ]);
    }
  };

  return {
    addFilter,
    deleteFilter,
    editFilter,
    filters,
    filtersWithIds,
    setStartsWithAll,
    startsWithAll,
    update: (filters) => {
      setFiltersWithIds(filters.map(withoutInvalidCallerConfigFields));
    },
  };
};

export default useSmartSearch;
