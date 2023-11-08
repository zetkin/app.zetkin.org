import * as XLSX from 'xlsx';
import { parse } from 'papaparse';

export type ImportedFile = {
  sheets: Sheet[];
  title: string;
};
type Sheet = {
  data: Row[];
  title: string;
};
type Row = {
  data: (string | number | null)[];
};

type ListMeta = {
  items: {
    data: (string | number | null)[];
  };
};

export function createList(meta: ListMeta) {
  return {
    items: createListItems(meta.items.data),
  };
}

export function createListItems(rawList: (string | number | null)[]) {
  return rawList.map((i) => createListItem(i));
}

export function createListItem(data: string | number | null) {
  return {
    data,
  };
}

export async function parseCSVFile(file: File): Promise<ImportedFile> {
  return new Promise((resolve, reject) => {
    const rawData: ImportedFile = {
      sheets: [],
      title: file.name,
    };
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = function () {
      parse(file, {
        complete: (result) => {
          if (result.data) {
            const sheetObject = {
              data: result.data,
              title: file.name,
            };
            rawData.sheets = [sheetObject as Sheet];
            rawData.title = file.name;
          }
          resolve(rawData);
        },
        header: false,
      });
    };

    reader.onerror = function (error) {
      reject(error);
    };
  });
}

export async function parseExcelFile(file: File): Promise<ImportedFile> {
  return new Promise((resolve, reject) => {
    const rawData: ImportedFile = {
      sheets: [],
      title: file.name,
    };
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    (reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const workbook = XLSX.read(bstr, {
        cellStyles: true,
        dateNF: 'yyyy"-"mm"-"dd',
        type: 'binary',
      });
      workbook.SheetNames.forEach((name) => {
        const sheet = workbook.Sheets[name];
        if ('!ref' in sheet && sheet['!ref'] !== undefined) {
          const range = XLSX.utils.decode_range(sheet['!ref']);

          const table = {
            columnList: createList({
              items: {
                data: [],
              },
            }),
            name: name,
            numEmptyColumnsRemoved: 0,
            rows: [] as Row[],
            useFirstRowAsHeader: false,
          };

          for (let c = range.s.c; c <= range.e.c; c++) {
            table.columnList.items.push(createListItem(null));
          }

          for (let r = range.s.r; r <= range.e.r; r++) {
            const rowValues = table.columnList.items.map((col, idx) => {
              const addr = XLSX.utils.encode_cell({ c: idx, r });
              const cell = sheet[addr];
              return cell ? cell.d || cell.w || cell.v : undefined;
            });

            // Only include if there are non-null values in the row
            if (rowValues.find((v) => v != null)) {
              table.rows.push({
                data: rowValues.flat(),
              });
            }
          }
          rawData.sheets.push({ data: table.rows, title: table.name });
        }
      });
      resolve(rawData);
    }),
      (reader.onerror = (error) => {
        reject(error);
      });
  });
}
