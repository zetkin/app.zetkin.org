import { useState } from 'react';
import { SmartSearchFilterWithId, ZetkinSmartSearchFilter } from 'types/smartSearch';

type InitialFilters = ZetkinSmartSearchFilter[] | SmartSearchFilterWithId[]

type UseSmartSearch = [
    SmartSearchFilterWithId[],
    (filter: ZetkinSmartSearchFilter) => void, // addSmartSearchFilter
    (id: number, newFilterValue: SmartSearchFilterWithId) => void, // editSmartSearchFilter
    (id: number) => void // removeSmartSearchFilter
]

const useSmartSearch = (initialFilters: InitialFilters = []): UseSmartSearch => {
    const filtersWithIds = initialFilters.map((filter, index) => ({ ...filter, id: index }));
    const [smartSearchFilters, setSmartSearchFilters] = useState<SmartSearchFilterWithId[]>(filtersWithIds);

    const addSmartSearchFilter = (filter: ZetkinSmartSearchFilter) => {
        const newFilterWithId: SmartSearchFilterWithId = {
            ...filter,
            id: smartSearchFilters.length,
        };
        setSmartSearchFilters([
            ...smartSearchFilters,
            newFilterWithId,
        ]);
    };

    const editSmartSearchFilter = (id: number, newFilterValue: SmartSearchFilterWithId) => {
        const filtersWithEditedFilter = smartSearchFilters.map(filter => {
            if (id === filter.id) return newFilterValue;
            else return filter;
        });
        setSmartSearchFilters(filtersWithEditedFilter);
    };

    const removeSmartSearchFilter = (id: number) => {
        const filtersWithoutSelected = smartSearchFilters.filter(filter => filter.id !== id);
        setSmartSearchFilters(filtersWithoutSelected);
    };


    return [
        smartSearchFilters,
        addSmartSearchFilter,
        editSmartSearchFilter,
        removeSmartSearchFilter,
    ];
};

export default useSmartSearch;
