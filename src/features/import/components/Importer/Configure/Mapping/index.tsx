import { FC } from 'react';
import { Box, Divider, Typography } from '@mui/material';

import messageIds from 'features/import/l10n/messageIds';
import range from 'utils/range';
import useFields from 'features/import/hooks/useFields';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import MappingRow, { ExperimentColumn } from './MappingRow';

export interface ExperimentRow {
  data: (string | number | null)[];
}

interface MappingProps {
  currentlyMapping: number | null;
  firstRowIsHeaders: boolean;
  onMapValues: (id: number) => void;
  onSelectColumn: (columnId: number, isChecked: boolean) => void;
  rows?: ExperimentRow[];
  selectedColumns: number[];
}

const Mapping: FC<MappingProps> = ({
  currentlyMapping,
  firstRowIsHeaders,
  onMapValues,
  onSelectColumn,
  rows,
  selectedColumns,
}) => {
  const { orgId } = useNumericRouteParams();
  const messages = useMessages(messageIds);
  const fields = useFields(orgId);

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

  return (
    <Box>
      <Box alignItems="center" display="flex" paddingBottom={1}>
        <Box paddingLeft={2} width="50%">
          <Typography variant="body2">
            {messages.configuration.mapping.fileHeader().toUpperCase()}
          </Typography>
        </Box>
        <Box paddingLeft={3.2} width="50%">
          <Typography variant="body2">
            {messages.configuration.mapping.zetkinHeader().toUpperCase()}
          </Typography>
        </Box>
      </Box>
      <Box>
        {columns.map((column, index) => {
          const isSelected = !!selectedColumns.find((id) => id == column.id);
          return (
            <Box key={column.id}>
              {index == 0 && <Divider />}
              <MappingRow
                column={column}
                currentlyMapping={currentlyMapping}
                isSelected={isSelected}
                mappingResults={null}
                onCheck={(isChecked: boolean) => {
                  onSelectColumn(column.id, isChecked);
                }}
                onMapValues={() => onMapValues(column.id)}
                zetkinFields={fields}
              />
              <Divider />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default Mapping;
