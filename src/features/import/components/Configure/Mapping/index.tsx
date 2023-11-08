import { FC } from 'react';
import { Box, Divider, Typography } from '@mui/material';

import { ConfiguringData } from '..';
import messageIds from 'features/import/l10n/messageIds';
import useFields from 'features/import/hooks/useFields';
import { useNumericRouteParams } from 'core/hooks';
import MappingRow, {
  ExperimentalFieldTypes,
  ExperimentColumn,
} from './MappingRow';
import { Msg, useMessages } from 'core/i18n';

export interface ExperimentRow {
  data: (string | number | null)[];
}

interface MappingProps {
  clearCurrentlyConfiguring: () => void;
  columns: ExperimentColumn[];
  currentlyConfiguring: ConfiguringData | null;
  onMapValues: (columnId: number, type: ExperimentalFieldTypes) => void;
  onSelectColumn: (columnId: number, isChecked: boolean) => void;
  selectedColumns: number[];
}

const Mapping: FC<MappingProps> = ({
  clearCurrentlyConfiguring,
  columns,
  currentlyConfiguring,
  onMapValues,
  onSelectColumn,
  selectedColumns,
}) => {
  const { orgId } = useNumericRouteParams();
  const messages = useMessages(messageIds);
  const fields = useFields(orgId);

  return (
    <Box
      display="flex"
      flexDirection="column"
      flexShrink={1}
      height="100%"
      overflow="hidden"
      padding={1}
    >
      <Typography sx={{ paddingBottom: 2, paddingX: 1 }} variant="h5">
        <Msg id={messageIds.configuration.mapping.header} />
      </Typography>
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
      <Box flexGrow={1} sx={{ overflowY: 'scroll' }}>
        {columns.map((column, index) => {
          const isSelected = !!selectedColumns.find((id) => id == column.id);
          return (
            <Box key={column.id}>
              {index == 0 && <Divider />}
              <MappingRow
                clearCurrentlyConfiguring={clearCurrentlyConfiguring}
                column={column}
                currentlyConfiguring={currentlyConfiguring}
                isSelected={isSelected}
                mappingResults={null}
                onCheck={(isChecked: boolean) => {
                  onSelectColumn(column.id, isChecked);
                }}
                onMapValues={(type: ExperimentalFieldTypes) =>
                  onMapValues(column.id, type)
                }
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
