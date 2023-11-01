import { Box } from '@mui/material';
import { FC } from 'react';

import range from 'utils/range';
import MappingRow, { ExperimentColumn } from './MappingRow';

interface ExperimentRow {
  data: (string | number | null)[];
}

interface MappingProps {
  rows: ExperimentRow[];
}

const Mapping: FC<MappingProps> = ({ rows }) => {
  const numberOfColumns = rows[0].data.length;

  const columns: ExperimentColumn[] = [];
  range(numberOfColumns).forEach((number) =>
    columns.push({ data: [], id: number + 1, title: '' })
  );

  rows.forEach((row) => {
    row.data.forEach((cellValue, cellIndex) => {
      const column = columns[cellIndex];
      column.data.push(cellValue);
    });
  });

  return (
    <Box>
      {columns.map((column) => (
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
      ))}
    </Box>
  );
};

export default Mapping;
