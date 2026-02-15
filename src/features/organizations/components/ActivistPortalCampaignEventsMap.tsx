import { FC, useCallback } from 'react';

import { ActivistPortalEventMap } from 'features/public/components/ActivistPortalEventMap';
import { useAppDispatch, useAppSelector } from 'core/hooks';
import { filtersUpdated } from '../store';
import useFilteredCampaignEvents from 'features/campaigns/hooks/useFilteredCampaignEvents';

type Props = {
  campId: number;
  orgId: number;
};

const ActivistPortalCampaignEventsMap: FC<Props> = ({ campId, orgId }) => {
  const { allEvents } = useFilteredCampaignEvents(orgId, campId);
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.organizations.filters);
  const onLocationFilterChange = useCallback(
    (geojsonToFilterBy: GeoJSON.Feature[]) => {
      dispatch(
        filtersUpdated({
          geojsonToFilterBy,
        })
      );
    },
    [dispatch]
  );

  return (
    <ActivistPortalEventMap
      events={allEvents}
      locationFilter={filters.geojsonToFilterBy}
      setLocationFilter={onLocationFilterChange}
    />
  );
};

export default ActivistPortalCampaignEventsMap;
