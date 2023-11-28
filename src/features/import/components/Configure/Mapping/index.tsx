import { FC } from 'react';
import { Box, Divider, Typography } from '@mui/material';

import MappingRow from './MappingRow';
import messageIds from 'features/import/l10n/messageIds';
import { UIDataColumn } from 'features/import/hooks/useUIDataColumns';
import useColumn from 'features/import/hooks/useColumn';
import useColumnOptions from 'features/import/hooks/useColumnOptions';
import { useNumericRouteParams } from 'core/hooks';
import useSelectedOptions from 'features/import/hooks/useSelectedOptions';
import { Msg, useMessages } from 'core/i18n';

interface MappingProps {
  clearConfiguration: () => void;
  columns: UIDataColumn[];
  columnIndexBeingConfigured: number | null;
  onConfigureStart: (columnIndex: number) => void;
}

const Mapping: FC<MappingProps> = ({
  clearConfiguration,
  columns,
  columnIndexBeingConfigured,
  onConfigureStart,
}) => {
  const { orgId } = useNumericRouteParams();
  const messages = useMessages(messageIds);
  const columnOptions = useColumnOptions(orgId);
  const updateColumn = useColumn();
  const optionAlreadySelected = useSelectedOptions();

  return (
    <Box
      display="flex"
      flexDirection="column"
      flexShrink={1}
      height="100%"
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
      <Box flexGrow={1}>
        {columns.map((column, index) => {
          return (
            <Box key={index}>
              {index == 0 && <Divider />}
              <MappingRow
                clearConfiguration={clearConfiguration}
                column={column}
                columnOptions={columnOptions}
                isBeingConfigured={columnIndexBeingConfigured == index}
                onChange={(column) => updateColumn(index, column)}
                onConfigureStart={() => onConfigureStart(index)}
                optionAlreadySelected={optionAlreadySelected}
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
