import { Box } from '@mui/material';
import { FC, useState } from 'react';

import Configuration from './Configuration';
import messageIds from 'features/import/l10n/messageIds';
import range from 'utils/range';
import { useMessages } from 'core/i18n';
import { ExperimentalFieldTypes, ExperimentColumn } from './Mapping/MappingRow';
import Mapping, { ExperimentRow } from './Mapping';
import SheetSettings, { ExperimentSheet } from './SheetSettings';

export interface ConfiguringData {
  columnId: number;
  type: ExperimentalFieldTypes;
}

interface ConfigureProps {
  sheets: ExperimentSheet[];
}

export const useColumn = (column: (string | number | null)[]) => {
  const rowsWithValues: (string | number)[] = [];
  let numberOfEmptyRows = 0;

  column.forEach((rowValue) => {
    if (typeof rowValue === 'string' || typeof rowValue === 'number') {
      rowsWithValues.push(rowValue);
    } else {
      numberOfEmptyRows += 1;
    }
  });

  const uniqueValues = Array.from(new Set(rowsWithValues));

  return { numberOfEmptyRows, uniqueValues };
};

const useColumns = (
  firstRowIsHeaders: boolean,
  rows: ExperimentRow[]
): ExperimentColumn[] => {
  const messages = useMessages(messageIds);
  const numberOfColumns = rows ? rows[0].data.length : 0;

  const columns: ExperimentColumn[] = [];
  range(numberOfColumns).forEach((number) =>
    columns.push({ data: [], id: number + 1, title: '' })
  );

  rows?.forEach((row, rowIndex) => {
    row.data.forEach((cellValue, cellIndex) => {
      const column = columns[cellIndex];
      if (rowIndex == 0) {
        if (firstRowIsHeaders && cellValue !== null) {
          column.title = cellValue as string;
        } else {
          column.title = messages.configuration.mapping.defaultColumnHeader({
            columnIndex: cellIndex + 1,
          });
          column.data.push(cellValue);
        }
      } else {
        column.data.push(cellValue);
      }
    });
  });

  return columns;
};

const Configure: FC<ConfigureProps> = ({ sheets }) => {
  //settings
  const [firstRowIsHeaders, setFirstRowIsHeaders] = useState(true);
  const [selectedSheetId, setSelectedSheetId] = useState(sheets[0].id);

  //mapping
  const [currentlyConfiguring, setCurrentlyConfiguring] =
    useState<ConfiguringData | null>(null);
  const [selectedColumns, setSelectedColumns] = useState<number[]>([]);

  const selectedSheet = sheets.find((sheet) => {
    return sheet.id == selectedSheetId;
  });

  const columns = useColumns(firstRowIsHeaders, selectedSheet?.data || []);

  return (
    <Box display="flex" flexDirection="column" height="100%" overflow="hidden">
      <Box display="flex" flexGrow={1} overflow="hidden">
        <Box display="flex" flexDirection="column" width="50%">
          <SheetSettings
            firstRowIsHeaders={firstRowIsHeaders}
            onChangeFirstRowIsHeaders={() =>
              setFirstRowIsHeaders(!firstRowIsHeaders)
            }
            onChangeSelectedSheet={(id: number) => {
              setSelectedSheetId(id);
              setSelectedColumns([]);
              setCurrentlyConfiguring(null);
            }}
            selectedSheet={selectedSheetId}
            sheets={sheets}
          />
          <Mapping
            clearCurrentlyConfiguring={() => setCurrentlyConfiguring(null)}
            columns={columns}
            currentlyConfiguring={currentlyConfiguring}
            onMapValues={(columnId: number, type: ExperimentalFieldTypes) =>
              setCurrentlyConfiguring({ columnId, type })
            }
            onSelectColumn={(columnId: number, isChecked: boolean) => {
              if (isChecked) {
                setSelectedColumns([...selectedColumns, columnId]);
              } else {
                setSelectedColumns(
                  selectedColumns.filter((id) => id != columnId)
                );
              }
            }}
            selectedColumns={selectedColumns}
          />
        </Box>
        <Box display="flex" flexDirection="column" width="50%">
          <Configuration
            columns={columns}
            currentlyConfiguring={currentlyConfiguring}
          />
        </Box>
      </Box>
      <Box padding={4}>Preview</Box>
    </Box>
  );
};

export default Configure;
