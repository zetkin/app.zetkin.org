import { CompareArrows } from '@mui/icons-material';
import { FC } from 'react';
import { Box, Divider, Typography, useTheme } from '@mui/material';

import messageIds from 'features/import/l10n/messageIds';
import TagConfigRow from './TagConfigRow';
import { UIDataColumn } from 'features/import/hooks/useColumns';
import ZUIEmptyState from 'zui/ZUIEmptyState';
import { Msg, useMessages } from 'core/i18n';

interface ConfigurationProps {
  uiDataColumn: UIDataColumn | null;
}

const Configuration: FC<ConfigurationProps> = ({ uiDataColumn }) => {
  const messages = useMessages(messageIds);
  const theme = useTheme();

  return (
    <Box
      bgcolor={theme.palette.transparentGrey.light}
      display="flex"
      flexDirection="column"
      height="100%"
    >
      {uiDataColumn && (
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
                {uiDataColumn.title.toLocaleUpperCase()}
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
            {uiDataColumn.uniqueValues.map((uniqueValue, index) => (
              <>
                {index != 0 && <Divider sx={{ marginY: 1 }} />}
                {'test'}
                <TagConfigRow
                  numRows={uiDataColumn.numRowsByUniqueValue[uniqueValue]}
                  title={uniqueValue.toString()}
                />
              </>
            ))}
            {uiDataColumn.numberOfEmptyRows > 0 && (
              <>
                <Divider sx={{ marginY: 1 }} />
                <TagConfigRow
                  italic
                  numRows={uiDataColumn.numberOfEmptyRows}
                  title={messages.configuration.configure.tags.empty()}
                />
              </>
            )}
          </Box>
        </Box>
      )}
      {!uiDataColumn && (
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
