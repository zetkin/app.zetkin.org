import slugify from 'slugify';
import XLSX from 'xlsx-js-style';
import { NextApiRequest, NextApiResponse } from 'next';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { COLUMN_TYPE } from 'features/views/components/types';
import { SurveyResponse } from 'features/views/components/ViewDataTable/cells/SurveyResponseViewCell';
import { SurveySubmission } from 'features/views/components/ViewDataTable/cells/SurveySubmittedViewCell';
import {
  ZetkinNote,
  ZetkinPerson,
  ZetkinSurveyOption,
  ZetkinView,
  ZetkinViewColumn,
  ZetkinViewRow,
} from 'utils/types/zetkin';

const FORMAT_TYPES = {
  csv: 'text/csv',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};

type CellValue = string | number | boolean | Date;
type ValueFunc = (cell: unknown, col: ZetkinViewColumn) => CellValue;
const directFormatter: ValueFunc = (cell: unknown) => cell as CellValue;

/* ============================================================================
 * Getting an error here? READ THIS!
 * ----------------------------------------------------------------------------
 * The valueFormatters object contains a mapping between view column type and
 * a function which returns a value that can be rendered in an output file,
 * either CSV or XLSX.
 *
 * If you're getting a typescript error here after implementing a new view
 * column type, it's probably because you have not yet implemented a formatter
 * for the export in this object.
 *
 * This is intentional! It's easy to forget adding a formatter here, so we
 * have implemented this logic in a way that causes typescript to report an
 * error if any of the COLUMN_TYPE values does not have a formatter.
 *
 * Copy one of the existing ones, but change the formatter function to read
 * the value correctly. If the value that's returned from the Zetkin API is
 * fine as is (i.e. it's a simple number, string, boolean or date) you can
 * use the directFormatter shortcut.
 *
 * Ironically, it seems like the only way to cause typescript to error here
 * when not all COLUMN_TYPE values have a mapper, is to use this slightly
 * type unsafe approach with the object. If you know a way to refactor for
 * better type safety, let us know!
 */
const valueFormatters: Record<ZetkinViewColumn['type'], ValueFunc> = {
  [COLUMN_TYPE.JOURNEY_ASSIGNEE]: ((cell) => {
    return (cell as unknown[]).length;
  }) as ValueFunc,
  [COLUMN_TYPE.LOCAL_BOOL]: directFormatter,
  [COLUMN_TYPE.LOCAL_PERSON]: ((cell) => {
    const person = cell as ZetkinPerson | null;
    return person ? `${person.first_name} ${person.last_name}` : '';
  }) as ValueFunc,
  [COLUMN_TYPE.LOCAL_TEXT]: directFormatter,
  [COLUMN_TYPE.PERSON_FIELD]: directFormatter,
  [COLUMN_TYPE.PERSON_NOTES]: ((cell) => {
    const notes = cell as ZetkinNote[];
    return notes.length ? notes[0].text : '';
  }) as ValueFunc,
  [COLUMN_TYPE.PERSON_QUERY]: directFormatter,
  [COLUMN_TYPE.PERSON_TAG]: directFormatter,
  [COLUMN_TYPE.SURVEY_OPTION]: directFormatter,
  [COLUMN_TYPE.SURVEY_OPTIONS]: ((cell) => {
    const responses = cell as ZetkinSurveyOption[];
    return responses.length ? responses[0].text : '';
  }) as ValueFunc,
  [COLUMN_TYPE.SURVEY_RESPONSE]: ((cell) => {
    const responses = cell as SurveyResponse[];
    return responses.length ? responses[0].text : '';
  }) as ValueFunc,
  [COLUMN_TYPE.SURVEY_SUBMITTED]: ((cell) => {
    const submissions = cell as SurveySubmission[];
    return submissions.length ? submissions[0].submitted : '';
  }) as ValueFunc,
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

  const dataRows: CellValue[][] = rows.map((row) =>
    [row.id as CellValue].concat(
      row.content.map((cell, index) => {
        const col = columns[index];
        return valueFormatters[col.type](cell, col);
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
