import { FC, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { SxProps } from '@mui/material';

import { ActivistPortalEventMap } from './ActivistPortalEventMap';
import { useAppDispatch, useAppSelector } from 'core/hooks';
import { filtersUpdated } from '../store';
import useFilteredCampaignEvents from 'features/campaigns/hooks/useFilteredCampaignEvents';

type Props = {
  campId: number;
  orgId: number;
  sx?: SxProps;
};

const ActivistPortalCampaignEventsMap: FC<Props> = ({ campId, orgId, sx }) => {
  const { allEvents } = useFilteredCampaignEvents(orgId, campId);
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
    },
    [lastSegment, router.push, orgId]
  );

  return (
    <ActivistPortalEventMap
      events={allEvents}
      locationFilter={filters.geojsonToFilterBy}
      setLocationFilter={onLocationFilterChange}
      sx={sx}
    />
  );
};

export default ActivistPortalCampaignEventsMap;
