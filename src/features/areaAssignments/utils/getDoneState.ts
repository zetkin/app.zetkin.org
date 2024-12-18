import { Household } from '../types';
import { ProgressState } from './getVisitState';

export default function getDoneState(
  households: Household[],
  areaAssId: string,
  metricId: string
): ProgressState {
  let numberOfDoneHouseholds = 0;
  households.forEach((household) => {
    household.visits.forEach((visit) => {
      if (visit.areaAssId == areaAssId) {
        const done = visit.responses.find(
          (response) =>
            response.metricId == metricId && response.response == 'yes'
        );

        if (done) {
          numberOfDoneHouseholds++;
        }
      }
    });
  });

  if (
    numberOfDoneHouseholds > 0 &&
    numberOfDoneHouseholds == households.length
  ) {
    return 'all';
  } else if (
    numberOfDoneHouseholds > 0 &&
    numberOfDoneHouseholds < households.length
  ) {
    return 'some';
  } else {
    return 'none';
  }
}
