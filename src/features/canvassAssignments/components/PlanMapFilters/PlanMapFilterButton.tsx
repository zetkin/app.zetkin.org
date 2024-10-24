import { FC, useContext } from 'react';
import { Badge } from '@mui/material';
import { FilterList } from '@mui/icons-material';

import { areaFilterContext } from 'features/areas/components/AreaFilters/AreaFilterContext';
import { assigneesFilterContext } from './AssigneeFilterContext';

const PlanMapFilterBadge: FC = () => {
  const { activeTagIdsByGroup } = useContext(areaFilterContext);
  const { assigneesFilter } = useContext(assigneesFilterContext);

  const numActiveGroups = Object.values(activeTagIdsByGroup).filter(
    (tagIds) => !!tagIds.length
  ).length;

  const numTotalFilters = assigneesFilter
    ? numActiveGroups + 1
    : numActiveGroups;

  return numTotalFilters > 0 ? (
    <Badge badgeContent={numTotalFilters} sx={{ color: 'white' }}>
      <FilterList sx={{ color: 'white' }} />
    </Badge>
  ) : (
    <FilterList sx={{ color: 'white' }} />
  );
};
export default PlanMapFilterBadge;
