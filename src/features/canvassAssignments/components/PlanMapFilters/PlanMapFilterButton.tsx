import { FC, useContext } from 'react';
import { Badge, Button } from '@mui/material';
import { FilterList } from '@mui/icons-material';

import { areaFilterContext } from 'features/areas/components/AreaFilters/AreaFilterContext';
import { assigneesFilterContext } from './AssigneeFilterContext';

type Props = {
  onToggle: () => void;
};

const PlanMapFilterButton: FC<Props> = ({ onToggle }) => {
  const { activeTagIdsByGroup } = useContext(areaFilterContext);
  const { assigneesFilter } = useContext(assigneesFilterContext);

  const numActiveGroups = Object.values(activeTagIdsByGroup).filter(
    (tagIds) => !!tagIds.length
  ).length;

  const numTotalFilters = assigneesFilter
    ? numActiveGroups + 1
    : numActiveGroups;

  return (
    <Button
      onClick={() => onToggle()}
      startIcon={
        numTotalFilters > 0 ? (
          <Badge badgeContent={numTotalFilters} color="primary">
            <FilterList />
          </Badge>
        ) : (
          <FilterList />
        )
      }
    >
      Filter
    </Button>
  );
};
export default PlanMapFilterButton;
