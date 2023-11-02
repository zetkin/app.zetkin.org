import { parseCSVFile, parseExcelFile } from '../utils/parseFile';

export default function useImportedFile() {
  function importData(file: File) {
    if (
      file.type === 'text/comma-separated-values' ||
      file.type === 'text/csv' ||
      file.type === 'application/csv'
    ) {
      return parseCSVFile(file);
    } else if (
      file.type === 'application/vnd.ms-excel' ||
      file.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/xls'
    ) {
      return parseExcelFile(file);
    } else {
      return null;
    }
  }

  return { importData };
}
