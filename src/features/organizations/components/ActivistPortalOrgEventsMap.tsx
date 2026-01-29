import { FC, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import useFilteredOrgEvents from '../hooks/useFilteredOrgEvents';
import { ActivistPortalEventMap } from './ActivistPortalEventMap';
import { useAppDispatch, useAppSelector } from 'core/hooks';
import { filtersUpdated } from '../store';

type Props = {
  orgId: number;
};

const ActivistPortalOrgEventsMap: FC<Props> = ({ orgId }) => {
  const { allEvents } = useFilteredOrgEvents(orgId);
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.organizations.filters);
  const path = usePathname();
  const router = useRouter();
  const lastSegment = path?.split('/')[3] ?? 'home';

  const onLocationFilterChange = useCallback(
    (geojsonToFilterBy: GeoJSON.Feature[]) => {
      dispatch(
        filtersUpdated({
          geojsonToFilterBy,
        })
      );

      if (lastSegment === 'suborgs') {
        router.push(`/o/${orgId}`);
      }
    },
    [dispatch, filtersUpdated, lastSegment, router.push, orgId]
  );

  return (
    <ActivistPortalEventMap
      events={allEvents}
      locationFilter={filters.geojsonToFilterBy}
      setLocationFilter={onLocationFilterChange}
    />
  );
};

export default ActivistPortalOrgEventsMap;
