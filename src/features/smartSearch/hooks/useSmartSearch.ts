import { useState } from 'react';
import {
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

const useSmartSearch = (
  initialFilters: InitialFilters = []
): UseSmartSearch => {
  // correctly configure legacy queries to only have the All filter in the first position with op: 'add'
  const indexOfAllFilter = initialFilters
    .map((f) => f.type)
    .lastIndexOf(FILTER_TYPE.ALL);
  const normalizedFiltersWithIds = initialFilters
    .filter(
      (filter, index) =>
        index > indexOfAllFilter ||
        (index === indexOfAllFilter && filter.op !== OPERATION.SUB)
    )
    .map((filter, index) => ({ ...filter, id: index }));

  const [filtersWithIds, setFiltersWithIds] = useState<
    SmartSearchFilterWithId[]
  >(normalizedFiltersWithIds);

  const addFilter = (filter: ZetkinSmartSearchFilter) => {
    const newFilterWithId: SmartSearchFilterWithId = {
      ...filter,
      id: filtersWithIds.length,
    };
    setFiltersWithIds([...filtersWithIds, newFilterWithId]);
  };

  const editFilter = (id: number, newFilterValue: SmartSearchFilterWithId) => {
    const filtersWithEditedFilter = filtersWithIds.map((filter) => {
      if (id === filter.id) {
        return newFilterValue;
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

  const filters = filtersWithIds.map((filterWithId) => {
    const { config, op, type } = filterWithId;
    return {
      config,
      op,
      type,
    };
  });

  const startsWithAll = filtersWithIds[0]?.type === FILTER_TYPE.ALL;

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
      setFiltersWithIds(filters);
    },
  };
};

export default useSmartSearch;
