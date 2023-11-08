import { addFiles } from '../store';
import { parseExcelFile } from '../utils/parseFile';
import { useState } from 'react';
import { ImportedFile, parseCSVFile } from '../utils/parseFile';
import { useAppDispatch, useAppSelector } from 'core/hooks';

export default function useFileImport() {
  const [loading, setLoading] = useState(false);
  const [parsedFile, setParsedFile] = useState<ImportedFile>({
    sheets: [],
    title: '',
  });
  const files = useAppSelector((state) => state.import.files);
  const dispatch = useAppDispatch();

  function parseData(file: File) {
    setLoading(true);
    if (
      file.type === 'text/comma-separated-values' ||
      file.type === 'text/csv' ||
      file.type === 'application/csv'
    ) {
      parseCSVFile(file).then((res) => {
        saveData(res);
        setParsedFile(res);
        setLoading(false);
      });
    } else if (
      file.type === 'application/vnd.ms-excel' ||
      file.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/xls'
    ) {
      parseExcelFile(file).then((res) => {
        saveData(res);
        setParsedFile(res);
        setLoading(false);
      });
    } else {
      return null;
    }
  }

  function saveData(data: ImportedFile) {
    dispatch(addFiles(data));
  }


  return { checkIfFileIsAlreadyInStore, loading, parseData };
}
