import { AreaGraphData, Household, Visit } from '../types';

function isWithin24Hours(startDate: Date, endDate: Date) {
  const timeDifference = endDate.getTime() - startDate.getTime();
  const hours24InMilliseconds = 24 * 60 * 60 * 1000;

  return timeDifference <= hours24InMilliseconds;
}

function visitSuccesful(visit: Visit, idOfMetricThatDefinesDone: string) {
  return visit.responses?.some(
    (response) =>
      response.metricId === idOfMetricThatDefinesDone &&
      response.response === 'yes'
  );
}

type VisitFlat = Visit & {
  householdId: string;
};

export default function getAreaData(
  endDate: Date,
  households: Household[],
  startDate: Date,
  idOfMetricThatDefinesDone: string
): AreaGraphData[] {
  if (households.length === 0) {
    return [];
  }
  const areaGraphList: AreaGraphData[] = [];

  const visits: VisitFlat[] = [];

  households.forEach((household: Household) => {
    visits.push(
      ...household.visits.map((vis) => ({ ...vis, householdId: household.id }))
    );
  });

  const firstVisits = Object.values(
    visits.reduce((acc: Record<string, VisitFlat>, visit) => {
      const visitDate = new Date(visit.timestamp);

      if (visitDate >= startDate && visitDate <= endDate) {
        if (
          !acc[visit.householdId] ||
          visitDate < new Date(acc[visit.householdId].timestamp)
        ) {
          acc[visit.householdId] = visit;
        }
      }
      return acc;
    }, {})
  );

  const successfulVisits = Object.values(
    visits
      .filter(
        (vis) =>
          visitSuccesful(vis, idOfMetricThatDefinesDone) &&
          new Date(vis.timestamp) >= startDate &&
          new Date(vis.timestamp) <= endDate
      )
      .reduce((acc: Record<string, VisitFlat>, visit) => {
        const visitDate = new Date(visit.timestamp);

        if (
          !acc[visit.householdId] ||
          visitDate < new Date(acc[visit.householdId].timestamp)
        ) {
          acc[visit.householdId] = visit;
        }
        return acc;
      }, {})
  );

  const firstVisitDate = new Date(startDate);
  const lastVisitDate = new Date(endDate);
  const curDate = new Date(firstVisitDate);

  let cumulativeHouseholdVisits = 0;
  let cumulativeSuccessfulVisits = 0;

  const showHours = isWithin24Hours(startDate, endDate);

  if (showHours) {
    while (curDate <= lastVisitDate) {
      const hourStr = curDate.toISOString().slice(11, 13) + ':00';
      const currentHour = curDate.getUTCHours();
      const dateStr = curDate.toISOString().slice(0, 10);

      const visitsOnDate = firstVisits.filter(
        (visit) =>
          visit.timestamp?.startsWith(dateStr) &&
          new Date(visit.timestamp).getUTCHours() === currentHour
      );

      if (visitsOnDate.length > 0) {
        cumulativeHouseholdVisits += visitsOnDate.length;
      }

      const successfulVisitsOnDate = successfulVisits.filter(
        (visit) =>
          visit.timestamp?.startsWith(dateStr) &&
          new Date(visit.timestamp).getUTCHours() === currentHour
      );

      if (successfulVisitsOnDate.length > 0) {
        cumulativeSuccessfulVisits += successfulVisitsOnDate.length;
      }

      areaGraphList.push({
        date: dateStr,
        hour: hourStr,
        householdVisits: cumulativeHouseholdVisits,
        successfulVisits: cumulativeSuccessfulVisits,
      });

      curDate.setUTCHours(curDate.getUTCHours() + 1);
    }
  } else {
    while (curDate <= lastVisitDate) {
      const dateStr = curDate.toISOString().slice(0, 10);

      const visitsOnDate = firstVisits.filter((visit) =>
        visit.timestamp.startsWith(dateStr)
      );
      if (visitsOnDate.length > 0) {
        cumulativeHouseholdVisits += visitsOnDate.length;
      }

      const successfulVisitsOnDate = successfulVisits.filter((visit) =>
        visit.timestamp.startsWith(dateStr)
      );
      if (successfulVisitsOnDate.length > 0) {
        cumulativeSuccessfulVisits += successfulVisitsOnDate.length;
      }

      areaGraphList.push({
        date: dateStr,
        hour: '0',
        householdVisits: cumulativeHouseholdVisits,
        successfulVisits: cumulativeSuccessfulVisits,
      });
      curDate.setUTCDate(curDate.getUTCDate() + 1);
    }
  }

  return areaGraphList;
}
