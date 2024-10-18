import { FC, useContext } from 'react';
import { Badge, Button } from '@mui/material';
import { FilterList } from '@mui/icons-material';

import { areaFilterContext } from './AreaFilterContext';

type Props = {
  onToggle: () => void;
};

const AreaFilterButton: FC<Props> = ({ onToggle }) => {
  const { activeTagIdsByGroup } = useContext(areaFilterContext);
  const numActiveGroups = Object.values(activeTagIdsByGroup).length;

  return (
    <Button
      onClick={() => onToggle()}
      startIcon={
        numActiveGroups > 0 ? (
          <Badge badgeContent={numActiveGroups} color="primary">
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
export default AreaFilterButton;
