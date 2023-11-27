import { addFile } from '../store';
import { parseExcelFile } from '../utils/parseFile';
import { useAppDispatch } from 'core/hooks';
import { useState } from 'react';
import { ImportedFile, parseCSVFile } from '../utils/parseFile';

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
      saveData(res);
      setLoading(false);
    } else if (
      file.type === 'application/vnd.ms-excel' ||
      file.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/xls'
    ) {
      const res = await parseExcelFile(file);
      saveData(res);
      setLoading(false);
    } else {
      return null;
    }
  }

  function saveData(data: ImportedFile) {
    dispatch(addFile(data));
  }

  return { loading, parseData };
}
