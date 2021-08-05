import { useState } from 'react';
import { FILTER_TYPE, OPERATION, SmartSearchFilterWithId, ZetkinSmartSearchFilter } from 'types/smartSearch';

type InitialFilters = ZetkinSmartSearchFilter[]

type UseSmartSearch = {
    addFilter: (filter: ZetkinSmartSearchFilter) => void; // addSmartSearchFilter
    addFilterToStart: (filter: ZetkinSmartSearchFilter) => void; // add All Filter to start
    deleteFilter: (id: number) => void; // removeSmartSearchFilter
    editFilter: (id: number, newFilterValue: SmartSearchFilterWithId) => void; // editSmartSearchFilter
    filters: ZetkinSmartSearchFilter[];
    filtersWithIds: SmartSearchFilterWithId[];
}

const useSmartSearch = (initialFilters: InitialFilters = []): UseSmartSearch => {

    // correctly configure legacy queries to only have the All filter in the first position with op: 'add'
    const indexOfAllFilter = initialFilters.findIndex(f => f.type === FILTER_TYPE.ALL);
    const normalizedFiltersWithIds = initialFilters
        .filter((filter, index) => index > indexOfAllFilter ||
        (index === indexOfAllFilter && filter.op === OPERATION.ADD))
        .map((filter, index) => ({ ...filter, id: index }));

    const [filtersWithIds, setFiltersWithIds] = useState<SmartSearchFilterWithId[]>(normalizedFiltersWithIds);

    const addFilter = (filter: ZetkinSmartSearchFilter) => {
        const newFilterWithId: SmartSearchFilterWithId = {
            ...filter,
            id: filtersWithIds.length,
        };
        setFiltersWithIds([
            ...filtersWithIds,
            newFilterWithId,
        ]);
    };

    const addFilterToStart = (filter: ZetkinSmartSearchFilter) => {
        const newFilterWithId: SmartSearchFilterWithId = {
            ...filter,
            id: filtersWithIds.length,
        };
        setFiltersWithIds([
            newFilterWithId,
            ...filtersWithIds,
        ]);
    };

    const editFilter = (id: number, newFilterValue: SmartSearchFilterWithId) => {
        const filtersWithEditedFilter = filtersWithIds.map(filter => {
            if (id === filter.id) return newFilterValue;
            else return filter;
        });
        setFiltersWithIds(filtersWithEditedFilter);
    };

    const deleteFilter = (id: number) => {
        const filtersWithoutSelected = filtersWithIds.filter(filter => filter.id !== id);
        setFiltersWithIds(filtersWithoutSelected);
    };

    const filters = filtersWithIds.map(filterWithId => {
        const { config, op, type } = filterWithId;
        return {
            config, op, type,
        };
    });

    return {
        addFilter,
        addFilterToStart,
        deleteFilter,
        editFilter,
        filters,
        filtersWithIds,
    };
};

export default useSmartSearch;
