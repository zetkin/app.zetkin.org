import { ChangeEvent, useEffect, useMemo, useState } from 'react';

import useLocalStorage from 'zui/hooks/useLocalStorage';
import useDebounce from 'utils/hooks/useDebounce';
import { ACTIVITIES } from '../types';

const DEFAULT_FILTERS: ACTIVITIES[] = [
  ACTIVITIES.CALL_ASSIGNMENT,
  ACTIVITIES.AREA_ASSIGNMENT,
  ACTIVITIES.SURVEY,
  ACTIVITIES.TASK,
  ACTIVITIES.EMAIL,
];

export default function useActivityFilters(orgId: number, campId?: number) {
  const filtersKey = useMemo(
    () => `activities:${orgId}:${campId ?? 'all'}:filters`,
    [campId, orgId]
  );
  const searchKey = useMemo(
    () => `activities:${orgId}:${campId ?? 'all'}:search`,
    [campId, orgId]
  );

  const [filters, setFilters] = useLocalStorage<ACTIVITIES[]>(
    filtersKey,
    DEFAULT_FILTERS
  );
  const [storedSearchString, setStoredSearchString] = useLocalStorage<string>(
    searchKey,
    ''
  );
  const [searchString, setSearchString] = useState(storedSearchString);

  useEffect(() => {
    setSearchString(storedSearchString);
  }, [storedSearchString]);

  const persistSearchString = useDebounce(async (value: string) => {
    setStoredSearchString(value);
  }, 400);

  const onFiltersChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const filter = evt.target.value as ACTIVITIES;
    if (filters.includes(filter)) {
      setFilters(filters.filter((a) => a !== filter));
    } else {
      setFilters([...filters, filter]);
    }
  };

  const onSearchStringChange = (value: string) => {
    setSearchString(value);
    persistSearchString(value);
  };

  return { filters, onFiltersChange, onSearchStringChange, searchString };
}
