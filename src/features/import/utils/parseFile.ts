import * as XLSX from 'xlsx';
import { parse } from 'papaparse';

export type ImportedFile = Array<Sheet>;
type Sheet = { [key: string]: Array<Rows> };
type Rows = Array<Record<string | number, string | number>>;

export async function parseCSVFile(file: File): Promise<ImportedFile> {
  return new Promise((resolve, reject) => {
    const rawData: ImportedFile = [];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = function () {
      parse(file, {
        complete: (result) => {
          if (result.data) {
            const sheetObject = {
              //use name of file as key
              [file.name.split('.csv').join('')]: result.data as Rows[],
            };
            rawData.push(sheetObject);
          }
          resolve(rawData);
        },
        header: true,
      });
    };

    reader.onerror = function (error) {
      reject(error);
    };
  });
}

export async function parseExcelFile(file: File): Promise<ImportedFile> {
  return new Promise((resolve, reject) => {
    const rawData: ImportedFile = [];
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const workbook = XLSX.read(bstr, { type: 'binary' });

      workbook.SheetNames.forEach((sheetName) => {
        const ws = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json<Rows>(ws);

        const sheetObject = {
          [sheetName]: data,
        };
        rawData.push(sheetObject);
      });
      resolve(rawData);
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
}
