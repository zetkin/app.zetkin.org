import { FC } from 'react';
import { IconButton } from '@mui/material';
import { KeyboardArrowUp } from '@mui/icons-material';

import PageBaseHeader from './pages/PageBaseHeader';
import useLocationVisits from 'features/areaAssignments/hooks/useLocationVisits';
import {
  ZetkinAreaAssignment,
  ZetkinLocation,
} from 'features/areaAssignments/types';
import estimateVisitedHouseholds from 'features/areaAssignments/utils/estimateVisitedHouseholds';

type Props = {
  assignment: ZetkinAreaAssignment;
  location: ZetkinLocation;
};

const ContractedHeader: FC<Props> = ({ assignment, location }) => {
  const visitsFuture = useLocationVisits(
    assignment.organization.id,
    assignment.id,
    location.id
  );

  const numHouseholdsVisitedIndividually =
    location?.households.filter((household) =>
      household.visits.some((visit) => visit.areaAssId == assignment.id)
    ).length ?? 0;

  const numHouseholdsPerLocationVisit =
    visitsFuture.data?.map(estimateVisitedHouseholds) ?? [];

  const numVisitedHouseholds = Math.max(
    numHouseholdsVisitedIndividually,
    ...numHouseholdsPerLocationVisit
  );

  const numHouseholds = Math.max(
    location.households.length,
    numVisitedHouseholds
  );

  return (
    <PageBaseHeader
      iconButtons={
        <IconButton>
          <KeyboardArrowUp />
        </IconButton>
      }
      subtitle={`${numVisitedHouseholds} / ${numHouseholds} households visited`}
      title={location.title || 'Untitled place'}
    />
  );
};

export default ContractedHeader;
