import { FC } from 'react';
import { IconButton } from '@mui/material';
import { KeyboardArrowUp } from '@mui/icons-material';

import PageBaseHeader from './pages/PageBaseHeader';
import usePlaceVisits from 'features/areaAssignments/hooks/usePlaceVisits';
import {
  ZetkinAreaAssignment,
  ZetkinPlace,
} from 'features/areaAssignments/types';
import estimateVisitedHouseholds from 'features/areaAssignments/utils/estimateVisitedHouseholds';

type Props = {
  assignment: ZetkinAreaAssignment;
  place: ZetkinPlace;
};

const ContractedHeader: FC<Props> = ({ assignment, place }) => {
  const visitsFuture = usePlaceVisits(
    assignment.organization.id,
    assignment.id,
    place.id
  );

  const numHouseholdsVisitedIndividually =
    place?.households.filter((household) =>
      household.visits.some((visit) => visit.areaAssId == assignment.id)
    ).length ?? 0;

  const numHouseholdsPerPlaceVisit =
    visitsFuture.data?.map(estimateVisitedHouseholds) ?? [];

  const numVisitedHouseholds = Math.max(
    numHouseholdsVisitedIndividually,
    ...numHouseholdsPerPlaceVisit
  );

  const numHouseholds = Math.max(place.households.length, numVisitedHouseholds);

  return (
    <PageBaseHeader
      iconButtons={
        <IconButton>
          <KeyboardArrowUp />
        </IconButton>
      }
      subtitle={`${numVisitedHouseholds} / ${numHouseholds} households visited`}
      title={place.title || 'Untitled place'}
    />
  );
};

export default ContractedHeader;
