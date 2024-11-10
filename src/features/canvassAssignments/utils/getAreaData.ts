import { AreaGraphData, Household } from '../types';

function isWithin24Hours(startDate: Date, endDate: Date) {
  const timeDifference = endDate.getTime() - startDate.getTime();
  const hours24InMilliseconds = 24 * 60 * 60 * 1000;

  return timeDifference <= hours24InMilliseconds;
}

export default function getAreaData(
  endDate: Date,
  households: Household[],
  startDate: Date,
  idOfMetricThatDefinesDone: string
): AreaGraphData[] {
  const areaGraphList: AreaGraphData[] = [];

  // Consolidate households by unique ID, merging visits
  const householdMap: Record<string, Household> = {};
  households.forEach((household) => {
    if (!householdMap[household.id]) {
      householdMap[household.id] = { ...household, visits: [] };
    }
    householdMap[household.id].visits.push(...household.visits);
  });
  const uniqueHouseholds = Object.values(householdMap).map((household) => ({
    ...household,
    visits: household.visits.sort((visitA, visitB) => {
      const dateA = new Date(visitA.timestamp);
      const dateB = new Date(visitB.timestamp);
      return dateA.getTime() - dateB.getTime();
    }),
  }));

  const uniqueHouseholdVisits = new Set<string>();
  const uniqueSuccessfulVisits = new Set<string>();

  if (uniqueHouseholds.length) {
    const firstVisitDate = new Date(startDate);
    const lastVisitDate = new Date(endDate);
    const curDate = new Date(firstVisitDate);

    let cumulativeHouseholdVisits = 0;
    let cumulativeSuccessfulVisits = 0;

    const showHours = isWithin24Hours(startDate, endDate);

    // Iterate over each day from the start date to the last date
    while (curDate <= lastVisitDate) {
      const dateStr = curDate.toISOString().slice(0, 10);

      const householdsOnDate = uniqueHouseholds.filter((household) =>
        household.visits.some((visit) => visit.timestamp.startsWith(dateStr))
      );

      if (showHours) {
        // Hourly aggregation if the time range is within 24 hours
        const current = new Date(curDate);
        current.setUTCMinutes(0, 0, 0);
        while (current <= lastVisitDate) {
          const dateStr = current.toISOString().slice(0, 10);
          const hourStr = current.toISOString().slice(11, 13) + ':00';
          const currentHour = current.getUTCHours();

          // Temporary sets for tracking unique visits per hour
          const hourlyHouseholdVisits = new Set<string>();
          const hourlySuccessfulVisits = new Set<string>();

          householdsOnDate.forEach((household) => {
            household.visits.forEach((visit) => {
              const visitDate = new Date(visit.timestamp);

              if (
                visitDate.toISOString().startsWith(dateStr) &&
                visitDate.getUTCHours() === currentHour
              ) {
                if (!uniqueHouseholdVisits.has(household.id)) {
                  uniqueHouseholdVisits.add(household.id);
                  hourlyHouseholdVisits.add(household.id);
                }

                if (
                  visit.responses.some(
                    (response) =>
                      response.metricId === idOfMetricThatDefinesDone &&
                      response.response === 'yes'
                  ) &&
                  !uniqueSuccessfulVisits.has(household.id)
                ) {
                  uniqueSuccessfulVisits.add(household.id);
                  hourlySuccessfulVisits.add(household.id);
                }
              }
            });
          });

          cumulativeHouseholdVisits += hourlyHouseholdVisits.size;
          cumulativeSuccessfulVisits += hourlySuccessfulVisits.size;

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
            const nextHouseholdsOnDate = uniqueHouseholds.filter((household) =>
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
        const dailyHouseholdVisits = new Set<string>();
        const dailySuccessfulVisits = new Set<string>();

        householdsOnDate.forEach((household) => {
          household.visits.forEach((visit) => {
            if (visit.timestamp.startsWith(dateStr)) {
              if (!uniqueHouseholdVisits.has(household.id)) {
                uniqueHouseholdVisits.add(household.id);
                dailyHouseholdVisits.add(household.id);
              }

              if (
                visit.responses.some(
                  (response) =>
                    response.metricId === idOfMetricThatDefinesDone &&
                    response.response === 'yes'
                ) &&
                !uniqueSuccessfulVisits.has(household.id)
              ) {
                uniqueSuccessfulVisits.add(household.id);
                dailySuccessfulVisits.add(household.id);
              }
            }
          });
        });

        cumulativeHouseholdVisits += dailyHouseholdVisits.size;
        cumulativeSuccessfulVisits += dailySuccessfulVisits.size;

        areaGraphList.push({
          date: dateStr,
          hour: '0',
          householdVisits: cumulativeHouseholdVisits,
          successfulVisits: cumulativeSuccessfulVisits,
        });
      }

      curDate.setUTCDate(curDate.getUTCDate() + 1);
    }
  }

  return areaGraphList;
}
