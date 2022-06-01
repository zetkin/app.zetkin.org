import { stringify as csvStringify } from 'csv-stringify';
import { NextApiRequest, NextApiResponse } from 'next';

import { createApiFetch } from 'utils/apiFetch';
import {
  getTagColumns,
  JourneyTagColumnType,
} from 'utils/journeyInstanceUtils';
import { ZetkinJourney, ZetkinJourneyInstance } from 'types/zetkin';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { orgId, journeyId } = req.query;

  if (!orgId || Array.isArray(orgId) || Array.isArray(journeyId)) {
    return res.status(400).end();
  }

  const apiFetch = createApiFetch(req.headers);
  const url = journeyId
    ? `/orgs/${orgId}/journeys/${journeyId}/instances`
    : `/orgs/${orgId}/journey_instances`;

  let journey: ZetkinJourney | null = null;
  if (journeyId) {
    const journeyRes = await apiFetch(`/orgs/${orgId}/journeys/${journeyId}`);
    const journeyData = await journeyRes.json();
    journey = journeyData.data as ZetkinJourney;
  }

  const instanceRes = await apiFetch(url);
  const data = await instanceRes.json();
  const journeyInstances = data.data as ZetkinJourneyInstance[];

  const columns = getTagColumns(journeyInstances);

  const headerRow: string[] = [
    'JOURNEY',
    'ID',
    'TITLE',
    'CREATED',
    'UPDATED',
    'SUBJECTS',
    'SUMMARY',
    'NEXT_MILESTONE',
    'CLOSED',
    'OUTCOME',
    'ASSIGNEES',
  ].concat(
    columns.map((column) => {
      if (column.type == JourneyTagColumnType.UNSORTED) {
        return 'UNSORTED TAGS';
      } else {
        return column.header.toUpperCase();
      }
    })
  );

  const dataRows = journeyInstances.map((instance) => {
    return [
      instance.journey.title,
      instance.id,
      instance.title,
      instance.created,
      instance.updated,
      instance.subjects
        .map((person) => `${person.first_name} ${person.last_name}`)
        .join(', '),
      instance.summary,
      instance.next_milestone?.title,
      instance.closed,
      instance.outcome,
      instance.assignees
        .map((person) => `${person.first_name} ${person.last_name}`)
        .join(', '),
    ].concat(
      columns.map((column) => {
        if (column.type == JourneyTagColumnType.VALUE_TAG) {
          return column.valueGetter(instance);
        } else {
          return column
            .tagsGetter(instance)
            .map((tag) => tag.title)
            .join(', ');
        }
      })
    );
  });

  const csv = await new Promise((resolve, reject) =>
    csvStringify([headerRow, ...dataRows], (err, output) =>
      err ? reject(err) : resolve(output)
    )
  );

  const filePrefix = journey ? journey.plural_label : 'journeys';

  const fileName = `${filePrefix}-${new Date().toISOString()}.csv`;

  res
    .status(200)
    .setHeader('Content-Disposition', `attachment; filename="${fileName}"`)
    .setHeader('Content-Type', 'text/csv')
    .send(csv);
}
