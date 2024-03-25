import { FC } from 'react';
import { Box, Divider, Typography, useTheme } from '@mui/material';

import { Column } from 'features/import/utils/types';
import MappingRow from './MappingRow';
import messageIds from 'features/import/l10n/messageIds';
import { UIDataColumn } from 'features/import/hooks/useUIDataColumns';
import useColumn from 'features/import/hooks/useColumn';
import { useNumericRouteParams } from 'core/hooks';
import { Msg, useMessages } from 'core/i18n';

interface MappingProps {
  clearConfiguration: () => void;
  columns: UIDataColumn<Column>[];
  columnIndexBeingConfigured: number | null;
  onConfigureStart: (columnIndex: number) => void;
}

const Mapping: FC<MappingProps> = ({
  clearConfiguration,
  columns,
  columnIndexBeingConfigured,
  onConfigureStart,
}) => {
  const theme = useTheme();
  const { orgId } = useNumericRouteParams();
  const messages = useMessages(messageIds);
  const { fieldOptions, optionAlreadySelected, updateColumn } =
    useColumn(orgId);

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
      <Box
        border={1}
        borderColor={theme.palette.grey[300]}
        borderRadius={1}
        flexGrow={1}
      >
        {columns.map((column, index) => {
          return (
            <Box key={index}>
              {index !== 0 && <Divider />}
              <MappingRow
                clearConfiguration={clearConfiguration}
                column={column}
                fieldOptions={fieldOptions}
                isBeingConfigured={columnIndexBeingConfigured == index}
                onChange={(column) => updateColumn(index, column)}
                onConfigureStart={() => onConfigureStart(index)}
                optionAlreadySelected={optionAlreadySelected}
              />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default Mapping;
