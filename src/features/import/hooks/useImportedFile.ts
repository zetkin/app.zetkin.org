import { addFile } from '../store';
import { parseCSVFile } from '../utils/parseFile';
import { parseExcelFile } from '../utils/parseFile';
import { useAppDispatch } from 'core/hooks';
import { useState } from 'react';
import { ColumnKind, ImportedFile } from '../utils/types';

function fileWithColumns(file: ImportedFile): ImportedFile {
  return {
    ...file,
    sheets: file.sheets.map((sheet) => ({
      ...sheet,
      columns: sheet.rows[0].data.map(() => ({
        kind: ColumnKind.UNKNOWN,
        selected: false,
      })),
    })),
  };
}

export default function useFileImport() {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  async function parseData(file: File) {
    setLoading(true);
    if (
      file.type === 'text/comma-separated-values' ||
      file.type === 'text/csv' ||
      file.type === 'application/csv'
    ) {
      const res = await parseCSVFile(file);
      const withColumns = fileWithColumns(res);
      saveData(withColumns);
      setLoading(false);
    } else if (
      file.type === 'application/vnd.ms-excel' ||
      file.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/xls'
    ) {
      parseExcelFile(file).then((res) => {
        saveData(res);
        setLoading(false);
      });
    } else {
      return null;
    }
  }

  function saveData(data: ImportedFile) {
    dispatch(addFile(fileWithColumns(data)));
  }

  return { loading, parseData };
}
