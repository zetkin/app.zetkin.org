import { AreaGraphData, Household } from '../types';

function isWithin24Hours(startDate: Date, endDate: Date) {
  const timeDifference = endDate.getTime() - startDate.getTime();
  const hours24InMilliseconds = 24 * 60 * 60 * 1000;

  return timeDifference <= hours24InMilliseconds;
}

export default function getAreasData(
  endDate: Date,
  households: Household[],
  startDate: Date,
  idOfMetricThatDefinesDone: string
): AreaGraphData[] {
  const areaGraphList: AreaGraphData[] = [];

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
    const curDate = new Date(firstVisitDate);

    let cumulativeHouseholdVisits = 0;
    let cumulativeSuccessfulVisits = 0;

    // Iterate over each day from the start date to the last date
    while (curDate <= lastVisitDate) {
      const showHours = isWithin24Hours(startDate, endDate);
      const dateStr = curDate.toISOString().slice(0, 10);

      const householdsOnDate = sortedHouseholds.filter((household) =>
        household.visits.some((visit) => visit.timestamp.startsWith(dateStr))
      );

      const current = new Date(firstVisitDate);
      // Reset `current` to start exactly on the hour
      current.setUTCMinutes(0, 0, 0);

      if (showHours) {
        while (current <= lastVisitDate) {
          // Update `dateStr` and `hourStr` at each iteration to reflect current hour and date
          const dateStr = current.toISOString().slice(0, 10);
          const hourStr = current.toISOString().slice(11, 13) + ':00';
          const currentHour = current.getUTCHours();

          let totalHouseholdVisits = 0;
          let totalSuccessfulVisits = 0;

          householdsOnDate.forEach((household) => {
            household.visits.forEach((visit) => {
              const visitDate = new Date(visit.timestamp);

              if (
                visitDate.toISOString().startsWith(dateStr) &&
                visitDate.getUTCHours() === currentHour
              ) {
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
            hour: hourStr,
            householdVisits: cumulativeHouseholdVisits,
            successfulVisits: cumulativeSuccessfulVisits,
          });

          current.setUTCHours(current.getUTCHours() + 1);

          // Check if we crossed into the next day
          if (current.getUTCHours() === 0) {
            const nextDateStr = current.toISOString().slice(0, 10);
            const nextHouseholdsOnDate = sortedHouseholds.filter((household) =>
              household.visits.some((visit) =>
                visit.timestamp.startsWith(nextDateStr)
              )
            );

            // Update the householdsOnDate for the next hour
            if (nextHouseholdsOnDate.length > 0) {
              householdsOnDate.length = 0;
              householdsOnDate.push(...nextHouseholdsOnDate);
            }
          }
        }
      } else {
        // Aggregate data for the day if not showing hours
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
          hour: '0',
          householdVisits: cumulativeHouseholdVisits,
          successfulVisits: cumulativeSuccessfulVisits,
        });
      }

      curDate.setDate(curDate.getDate() + 1);
    }
  }
  return areaGraphList;
}
