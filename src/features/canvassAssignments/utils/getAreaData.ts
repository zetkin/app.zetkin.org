import { AreaGraphData, Household } from '../types';

function isWithin24Hours(startDate: Date, endDate: Date) {
  // Calculate the difference in milliseconds
  const timeDifference = endDate.getTime() - startDate.getTime();

  // Convert 24 hours to milliseconds
  const hours24InMilliseconds = 24 * 60 * 60 * 1000;

  // Check if the difference is within 24 hours
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
        // Iterate over each hour of the current day
        while (
          current.getUTCHours() <= endDate.getUTCHours() &&
          current.toISOString().startsWith(dateStr)
        ) {
          // Get the hour in local time (or use `getUTCHours` for UTC)
          const hour = current.getUTCHours();
          const hourStr = hour.toString().padStart(2, '0') + ':00';

          let totalHouseholdVisits = 0;
          let totalSuccessfulVisits = 0;

          householdsOnDate.forEach((household) => {
            household.visits.forEach((visit) => {
              const visitDate = new Date(visit.timestamp);
              const visitHour = visitDate.getUTCHours();

              if (
                visitDate.toISOString().startsWith(dateStr) &&
                visitHour === hour
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

          // Move to the next hour
          current.setUTCHours(current.getUTCHours() + 1);
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
