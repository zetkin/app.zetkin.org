import * as XLSX from 'xlsx';
import { parse } from 'papaparse';
import { CellData, ImportedFile, Row, Sheet } from './types';

export async function parseCSVFile(file: File): Promise<ImportedFile> {
  return new Promise((resolve, reject) => {
    const rawData: ImportedFile = {
      selectedSheetIndex: 0,
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
              columns: [],
              currentlyConfiguring: null,
              firstRowIsHeaders: true,
              rows: result.data as Sheet['rows'],
              title: file.name,
            };
            rawData.sheets = [sheetObject];
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

interface ExcelTable {
  columnList: CellData[];
  name: string;
  numEmptyColumnsRemoved: number;
  rows: Row[];
  useFirstRowAsHeader: boolean;
}

export async function parseExcelFile(file: File): Promise<ImportedFile> {
  return new Promise((resolve, reject) => {
    const rawData: ImportedFile = {
      selectedSheetIndex: 0,
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

          const table: ExcelTable = {
            columnList: [],
            name: name,
            numEmptyColumnsRemoved: 0,
            rows: [],
            useFirstRowAsHeader: false,
          };

          for (let c = range.s.c; c <= range.e.c; c++) {
            table.columnList.push(null);
          }

          for (let r = range.s.r; r <= range.e.r; r++) {
            const rowValues = table.columnList.map((col, idx) => {
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
          rawData.sheets.push({
            columns: [],
            firstRowIsHeaders: true,
            rows: table.rows,
            title: table.name,
          });
        }
      });
      resolve(rawData);
    }),
      (reader.onerror = (error) => {
        reject(error);
      });
  });
}
