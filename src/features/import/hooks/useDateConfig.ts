import { useState } from 'react';

import { columnUpdate } from '../store';
import { DateColumn } from '../utils/types';
import { useAppDispatch, useAppSelector } from 'core/hooks';
import dateParsingIsValid from '../utils/dateParsing/dateParsingIsValid';

export default function useDateConfig(column: DateColumn, columnIndex: number) {
  const dispatch = useAppDispatch();

  const selectedSheetIndex = useAppSelector(
    (state) => state.import.pendingFile.selectedSheetIndex
  );
  const sheet = useAppSelector(
    (state) => state.import.pendingFile.sheets[selectedSheetIndex]
  );

  const firstRowIsHeaders = sheet.firstRowIsHeaders;
  const rows = sheet.rows;
  const cellValues = rows.map((row) => row.data[columnIndex]);

  const [dateFormat, setDateFormat] = useState(column.dateFormat || null);

  const wrongDateFormat = cellValues.some((value, index) => {
    if (index === 0 && firstRowIsHeaders) {
      return false;
    }

    if (!value) {
      return false;
    }

    if (column.dateFormat) {
      return !dateParsingIsValid(value, column.dateFormat);
    }

    return false;
  });

  const updateDateFormat = (dateFormat: string) => {
    dispatch(columnUpdate([columnIndex, { ...column, dateFormat }]));
  };

  type PersonNumberFormat = 'se' | 'dk' | 'no';

  const personNumberFormats: PersonNumberFormat[] = ['se', 'dk', 'no'];

  const dateFormats = {
    ['MM-DD-YYYY']: '10-06-2024',
    ['YY-MM-DD']: '24-10-06',
    ['YYYY-MM-DD']: '2024-10-06',
  };

  const isPersonNumberFormat = (
    dateFormat: string
  ): dateFormat is PersonNumberFormat => {
    return !!personNumberFormats.find((format) => format == dateFormat);
  };

  const onDateFormatChange = (newFormat: string) => {
    if (newFormat === 'custom') {
      setDateFormat('');
    } else {
      setDateFormat(newFormat);
      updateDateFormat(newFormat);
    }
  };

  const isCustomFormat =
    dateFormat != null &&
    !Object.keys(dateFormats).includes(dateFormat) &&
    !isPersonNumberFormat(dateFormat);

  return {
    dateFormat,
    dateFormats,
    isCustomFormat,
    isPersonNumberFormat,
    onDateFormatChange,
    personNumberFormats,
    updateDateFormat,
    wrongDateFormat,
  };
}
