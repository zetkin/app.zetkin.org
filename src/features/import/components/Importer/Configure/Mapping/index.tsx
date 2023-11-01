import { FC } from 'react';
import { Box, Divider, Typography } from '@mui/material';

import messageIds from 'features/import/l10n/messageIds';
import range from 'utils/range';
import { useMessages } from 'core/i18n';
import MappingRow, { ExperimentColumn } from './MappingRow';

export interface ExperimentRow {
  data: (string | number | null)[];
}

interface MappingProps {
  firstRowIsHeaders: boolean;
  rows: ExperimentRow[];
}

const Mapping: FC<MappingProps> = ({ firstRowIsHeaders, rows }) => {
  const messages = useMessages(messageIds);
  const numberOfColumns = rows[0].data.length;

  const columns: ExperimentColumn[] = [];
  range(numberOfColumns).forEach((number) =>
    columns.push({ data: [], id: number + 1, title: '' })
  );

  rows.forEach((row, rowIndex) => {
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
        {columns.map((column, index) => (
          <>
            {index == 0 && <Divider />}
            <MappingRow
              key={column.id}
              column={column}
              currentlyMapping={null}
              isEnabled={false}
              mappingResults={null}
              onEnable={() => null}
              onMapValues={() => null}
              onSelectField={() => null}
              selectedZetkinFieldId={''}
              zetkinFields={[]}
            />
            <Divider />
          </>
        ))}
      </Box>
    </Box>
  );
};

export default Mapping;
