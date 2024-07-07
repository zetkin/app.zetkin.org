import XLSX from 'xlsx-js-style';
import { NextApiRequest, NextApiResponse } from 'next';

import { createApiFetch } from 'utils/apiFetch';
import { getBrowserLanguage } from 'utils/locale';
import getServerMessages from 'core/i18n/server';
import {
  getTagColumns,
  JourneyTagColumnType,
} from 'features/journeys/utils/journeyInstanceUtils';
import { ZetkinJourney, ZetkinJourneyInstance } from 'utils/types/zetkin';
import messageIds from 'features/journeys/l10n/messageIds';

const FORMAT_TYPES = {
  csv: 'text/csv',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { format = 'csv', orgId, journeyId } = req.query;

  if (
    !orgId ||
    Array.isArray(orgId) ||
    Array.isArray(journeyId) ||
    Array.isArray(format)
  ) {
    return res.status(400).end();
  }

  if (format != 'csv' && format != 'xlsx') {
    return res.status(400).end();
  }
  const formatType = FORMAT_TYPES[format];

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
  if (!instanceRes.ok) {
    return res.status(instanceRes.status).end();
  }
  const data = await instanceRes.json();
  const journeyInstances = data.data as ZetkinJourneyInstance[];

  const columns = getTagColumns(journeyInstances);

  const lang = await getBrowserLanguage(req);
  const messages = await getServerMessages(lang, messageIds);

  const headerRow: string[] = [
    messages.instances.export.headers.journey(),
    messages.instances.export.headers.id(),
    messages.instances.export.headers.title(),
    messages.instances.export.headers.created(),
    messages.instances.export.headers.updated(),
    messages.instances.export.headers.subjects(),
    messages.instances.export.headers.summary(),
    messages.instances.export.headers.nextMilestone(),
    messages.instances.export.headers.nextMilestoneDeadline(),
    messages.instances.export.headers.closed(),
    messages.instances.export.headers.outcome(),
    messages.instances.export.headers.assignees(),
  ].concat(
    columns.map((column) => {
      if (column.type == JourneyTagColumnType.UNSORTED) {
        return messages.instances.export.headers.unsortedTags();
      } else {
        return column.header;
      }
    })
  );

  const dateOrNull = (str: string | null | undefined): Date | null =>
    str ? new Date(str) : null;

  const dataRows = journeyInstances.map((instance) => {
    return [
      instance.journey.title,
      instance.id,
      instance.title,
      dateOrNull(instance.created),
      dateOrNull(instance.updated),
      instance.subjects
        .map((person) => `${person.first_name} ${person.last_name}`)
        .join(', '),
      instance.summary,
      instance.next_milestone?.title,
      dateOrNull(instance.next_milestone?.deadline),
      dateOrNull(instance.closed),
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
            .tagsGetter(instance.tags)
            .map((tag) => tag.title)
            .join(', ');
        }
      })
    );
  });

  const filePrefix = journey ? journey.plural_label : 'journeys';
  const fileName = `${filePrefix}-${new Date().toISOString()}.${format}`;

  let fileData: string | Buffer;

  const wb = XLSX.utils.book_new();
  const sheet = XLSX.utils.aoa_to_sheet([headerRow, ...dataRows], {
    dateNF: 'YYYY-MM-DD HH:mm:ss',
  });
  XLSX.utils.book_append_sheet(wb, sheet);

  if (format == 'csv') {
    // Make header uppercase
    headerRow.forEach((_, idx) => {
      const addr = XLSX.utils.encode_cell({ c: idx, r: 0 });
      sheet[addr].v = sheet[addr].v.toString().toUpperCase();
    });

    fileData = XLSX.write(wb, { bookType: 'csv', type: 'buffer' });
  } else if (format == 'xlsx') {
    sheet['!cols'] = headerRow.map((col, idx) => {
      const allLengths = [
        col.length,
        ...dataRows.map((row) =>
          row[idx] instanceof Date ? 16 : row[idx]?.toString().length ?? 0
        ),
      ];

      return {
        // Set the width to 3 + the max number of characters on any row,
        // but cap to 50 characters to not get super wide columns
        width: 3 + Math.min(50, Math.max.apply(null, allLengths)),
      };
    });

    // Style header as bold
    headerRow.forEach((_, idx) => {
      sheet[XLSX.utils.encode_cell({ c: idx, r: 0 })].s = {
        font: { bold: true },
      };
    });

    fileData = XLSX.write(wb, {
      type: 'buffer',
    });
  } else {
    // This should never happen, because format is already checked
    // at the beginning of this function. We do this anyway to make
    // Typescript aware that fileData will always have a value.
    return res.status(400).end();
  }

  res
    .status(200)
    .setHeader('Content-Disposition', `attachment; filename="${fileName}"`)
    .setHeader('Content-Type', formatType)
    .send(fileData);
}
