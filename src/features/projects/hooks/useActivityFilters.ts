import { ChangeEvent, useMemo } from 'react';

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

export default function useActivityFilters(
  location: 'activities' | 'archive',
  orgId: number,
  projectId?: number
) {
  const filtersKey = useMemo(
    () => `activities:${orgId}:${projectId ?? 'all'}:${location}:filters`,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [projectId, orgId]
  );
  const searchKey = useMemo(
    () => `activities:${orgId}:${projectId ?? 'all'}:${location}:search`,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [projectId, orgId]
  );

  const [filters, setFilters] = useLocalStorage<ACTIVITIES[]>(
    filtersKey,
    DEFAULT_FILTERS
  );
  const [searchString, setSearchString] = useLocalStorage<string>(
    searchKey,
    ''
  );

  const persistSearchString = useDebounce(async (value: string) => {
    setSearchString(value);
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
