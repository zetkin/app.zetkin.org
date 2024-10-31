import { AreaGraphData, Household } from '../types';

export default function getAreasData(
  endDate: Date,
  households: Household[],
  startDate: Date,
  idOfMetricThatDefinesDone: string
): AreaGraphData[] {
  let areaGraphList: AreaGraphData[] = [];

  // Sort household visits per date
  const sortedHouseholds = households.map((household) => ({
    ...household,
    visits: household.visits.sort((visitA, visitB) => {
      const dateA = new Date(visitA.timestamp);
      const dateB = new Date(visitB.timestamp);
      return dateA.getTime() - dateB.getTime();
    }),
  }));

  if (sortedHouseholds.length) {
    const firstVisitDate = new Date(startDate);
    const lastVisitDate = new Date(endDate);

    let curDate = new Date(firstVisitDate);
    let cumulativeHouseholdVisits = 0;
    let cumulativeSuccessfulVisits = 0;

    // Iterate over each day from the start date to the last date
    while (curDate <= lastVisitDate) {
      const dateStr = curDate.toISOString().slice(0, 10);

      // Get households with visits on the current date
      const householdsOnDate = sortedHouseholds.filter((household) =>
        household.visits.some((visit) => visit.timestamp.startsWith(dateStr))
      );

      let totalHouseholdVisits = 0;
      let totalSuccessfulVisits = 0;

      householdsOnDate.forEach((household) => {
        household.visits.forEach((visit) => {
          if (visit.timestamp.startsWith(dateStr)) {
            totalHouseholdVisits++;

            if (
              visit.responses.some(
                (response) =>
                  response.metricId === idOfMetricThatDefinesDone &&
                  response.response === 'yes'
              )
            ) {
              totalSuccessfulVisits++;
            }
          }
        });
      });

      cumulativeHouseholdVisits += totalHouseholdVisits;
      cumulativeSuccessfulVisits += totalSuccessfulVisits;

      areaGraphList.push({
        date: dateStr,
        householdVisits: cumulativeHouseholdVisits,
        successfulVisits: cumulativeSuccessfulVisits,
      });

      curDate.setDate(curDate.getDate() + 1);
    }
  }

  return areaGraphList;
}
