import slugify from 'slugify';
import XLSX from 'xlsx-js-style';
import { NextApiRequest, NextApiResponse } from 'next';

import BackendApiClient from 'core/api/client/BackendApiClient';
import columnTypes from 'features/views/components/ViewDataTable/columnTypes';
import {
  ZetkinView,
  ZetkinViewColumn,
  ZetkinViewRow,
} from 'utils/types/zetkin';

const FORMAT_TYPES = {
  csv: 'text/csv',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { format = 'csv', orgId, viewId } = req.query;

  if (
    !orgId ||
    Array.isArray(orgId) ||
    Array.isArray(viewId) ||
    Array.isArray(format)
  ) {
    return res.status(400).end();
  }

  if (format != 'csv' && format != 'xlsx') {
    return res.status(400).end();
  }
  const formatType = FORMAT_TYPES[format];

  const apiClient = new BackendApiClient(req.headers);

  const view = await apiClient.get<ZetkinView>(
    `/api/orgs/${orgId}/people/views/${viewId}`
  );
  const columns = await apiClient.get<ZetkinViewColumn[]>(
    `/api/orgs/${orgId}/people/views/${viewId}/columns`
  );
  const rows = await apiClient.get<ZetkinViewRow[]>(
    `/api/orgs/${orgId}/people/views/${viewId}/rows`
  );

  const headerRow: string[] = ['ID'].concat(columns.map((col) => col.title));

  const dataRows: string[][] = rows.map((row) =>
    [row.id.toString()].concat(
      row.content.map((cell, index) => {
        const col = columns[index];
        return columnTypes[col.type].cellToString(cell, col);
      })
    )
  );

  const filePrefix = slugify(view.title).toLowerCase();
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
        ...dataRows.map((row) => row[idx]?.toString().length ?? 0),
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
