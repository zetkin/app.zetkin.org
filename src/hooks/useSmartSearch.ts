import { useState } from 'react';
import { SmartSearchFilterWithId, ZetkinSmartSearchFilter } from 'types/smartSearch';

type InitialFilters = ZetkinSmartSearchFilter[] | SmartSearchFilterWithId[]

type UseSmartSearch = {
    addFilter: (filter: ZetkinSmartSearchFilter) => void; // addSmartSearchFilter
    deleteFilter: (id: number) => void; // removeSmartSearchFilter
    editFilter: (id: number, newFilterValue: SmartSearchFilterWithId) => void; // editSmartSearchFilter
    filters: ZetkinSmartSearchFilter[];
    filtersWithIds: SmartSearchFilterWithId[];
}

const useSmartSearch = (initialFilters: InitialFilters = []): UseSmartSearch => {
    const initialFiltersWithIds = initialFilters.map((filter, index) => ({ ...filter, id: index }));
    const [filtersWithIds, setFiltersWithIds] = useState<SmartSearchFilterWithId[]>(initialFiltersWithIds);

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
        deleteFilter,
        editFilter,
        filters,
        filtersWithIds,
    };
};

export default useSmartSearch;
