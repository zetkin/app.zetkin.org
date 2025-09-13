import { useAppSelector } from '../../../core/hooks';

export default function useRowCountValidation() {
  const pendingFile = useAppSelector((state) => state.import.pendingFile);

  const sheet = pendingFile.sheets[pendingFile.selectedSheetIndex];
  const rows = sheet.rows;
  const firstRowIsHeaders = sheet.firstRowIsHeaders;
  const hasData = rows.length >= (firstRowIsHeaders ? 2 : 1);
  return { hasData };
}
