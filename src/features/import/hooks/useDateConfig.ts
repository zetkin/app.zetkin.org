import { useState } from 'react';

import { columnUpdate } from '../store';
import { DateColumn } from '../utils/types';
import parseDate from '../utils/parseDate';
import useOrganization from 'features/organizations/hooks/useOrganization';
import {
  useAppDispatch,
  useAppSelector,
  useNumericRouteParams,
} from 'core/hooks';

export default function useDateConfig(column: DateColumn, columnIndex: number) {
  const dispatch = useAppDispatch();
  const { orgId } = useNumericRouteParams();
  const organization = useOrganization(orgId).data;

  const selectedSheetIndex = useAppSelector(
    (state) => state.import.pendingFile.selectedSheetIndex
  );
  const sheet = useAppSelector(
    (state) => state.import.pendingFile.sheets[selectedSheetIndex]
  );

  const firstRowIsHeaders = sheet.firstRowIsHeaders;
  const rows = sheet.rows;
  const cellValues = rows.map((row) => row.data[columnIndex]);

  const [dateFormat, setDateFormat] = useState(
    column.dateFormat ?? 'YYYY-MM-DD'
  );

  const wrongDateFormat = cellValues.some((value, index) => {
    if (index === 0 && firstRowIsHeaders) {
      return false;
    }

    if (!value) {
      return false;
    }

    if (column.dateFormat) {
      return !parseDate(value, column.dateFormat);
    }

    return false;
  });

  const updateDateFormat = (dateFormat: string) => {
    dispatch(columnUpdate([columnIndex, { ...column, dateFormat }]));
  };

  type PersonNumberFormat = 'se' | 'dk' | 'no';

  const personNumberFormats: PersonNumberFormat[] = [];

  if (organization) {
    personNumberFormats.push(
      organization.country.toLowerCase() as PersonNumberFormat
    );
  } else {
    personNumberFormats.push('se', 'dk', 'no');
  }

  enum DateFormats {
    'YYYY-MM-DD' = 'YYYY-MM-DD',
    'YY-MM-DD' = 'YY-MM-DD',
    'MM-DD-YYYY' = 'MM-DD-YYYY',
  }

  const dateFormats: DateFormats[] = [
    DateFormats['YYYY-MM-DD'],
    DateFormats['YY-MM-DD'],
    DateFormats['MM-DD-YYYY'],
  ];

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
    !dateFormats.includes(dateFormat as DateFormats) &&
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
