import { CompareArrows } from '@mui/icons-material';
import { FC } from 'react';
import { Box, Divider, Typography, useTheme } from '@mui/material';

import messageIds from 'features/import/l10n/messageIds';
import TagConfigRow from './TagConfigRow';
import useColumn from 'features/import/hooks/useColumn';
import ZUIEmptyState from 'zui/ZUIEmptyState';
import {
  Column,
  ConfiguringData,
  FieldTypes,
} from 'features/import/utils/types';
import { Msg, useMessages } from 'core/i18n';

interface ConfigurationProps {
  columns: Column[];
  currentlyConfiguring: ConfiguringData | null;
}

const Configuration: FC<ConfigurationProps> = ({
  columns,
  currentlyConfiguring,
}) => {
  const messages = useMessages(messageIds);
  const theme = useTheme();

  const column = columns.find(
    (column) => column.id == currentlyConfiguring?.columnId
  );

  const { numberOfEmptyRows, uniqueValues } = useColumn(column?.data || []);

  return (
    <Box
      bgcolor={theme.palette.transparentGrey.light}
      display="flex"
      flexDirection="column"
      height="100%"
    >
      {currentlyConfiguring &&
        column &&
        currentlyConfiguring.type === FieldTypes.TAG && (
          <Box
            display="flex"
            flexDirection="column"
            overflow="hidden"
            padding={2}
          >
            <Typography variant="h5">
              <Msg id={messageIds.configuration.configure.tags.header} />
            </Typography>
            <Box
              alignItems="center"
              display="flex"
              paddingBottom={2}
              paddingTop={2}
            >
              <Box width="50%">
                <Typography variant="body2">
                  {column.title.toLocaleUpperCase()}
                </Typography>
              </Box>
              <Box width="50%">
                <Typography variant="body2">
                  {messages.configuration.configure.tags
                    .tagsHeader()
                    .toLocaleUpperCase()}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ overflowY: 'scroll' }}>
              {uniqueValues.map((uniqueValue, index) => (
                <>
                  {index != 0 && <Divider sx={{ marginY: 1 }} />}
                  <TagConfigRow
                    numRows={
                      column.data.filter((value) => value == uniqueValue).length
                    }
                    title={uniqueValue as string}
                  />
                </>
              ))}
              {numberOfEmptyRows > 0 && (
                <>
                  <Divider sx={{ marginY: 1 }} />
                  <TagConfigRow
                    italic
                    numRows={numberOfEmptyRows}
                    title={messages.configuration.configure.tags.empty()}
                  />
                </>
              )}
            </Box>
          </Box>
        )}
      {!currentlyConfiguring && !column && (
        <Box alignItems="center" display="flex" justifyContent="center">
          <ZUIEmptyState
            message={messages.configuration.mapping.emptyStateMessage()}
            renderIcon={(props) => <CompareArrows {...props} />}
          />
        </Box>
      )}
    </Box>
  );
};

export default Configuration;
