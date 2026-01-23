import {
  MetricResponse,
  ZetkinHouseholdVisit,
  ZetkinLocationVisit,
} from '../types';

export default function summarizeMetrics(
  visits: Pick<ZetkinHouseholdVisit, 'household_id' | 'metrics'>[]
): Pick<ZetkinLocationVisit, 'num_households_visited' | 'metrics'> {
  const responsesByMetricId: Record<number, MetricResponse[]> = {};
  const householdSet = new Set(visits.map((visit) => visit.household_id));

  visits.forEach((visit) => {
    visit.metrics.forEach((response) => {
      responsesByMetricId[response.metric_id] ||= [];
      responsesByMetricId[response.metric_id].push(response);
    });
  });

  return {
    metrics: Object.values(responsesByMetricId).map((responses) => {
      const firstResp = responses[0].response;
      const isBool = firstResp === 'yes' || firstResp === 'no';

      if (isBool) {
        return {
          metric_id: responses[0].metric_id,
          num_no: responses.filter((resp) => resp.response === 'no').length,
          num_yes: responses.filter((resp) => resp.response === 'yes').length,
        };
      } else {
        return {
          metric_id: responses[0].metric_id,
          num_values: [
            responses.filter((resp) => Number(resp.response) === 1).length,
            responses.filter((resp) => Number(resp.response) === 2).length,
            responses.filter((resp) => Number(resp.response) === 3).length,
            responses.filter((resp) => Number(resp.response) === 4).length,
            responses.filter((resp) => Number(resp.response) === 5).length,
          ],
        };
      }
    }),
    num_households_visited: householdSet.size,
  };
}
