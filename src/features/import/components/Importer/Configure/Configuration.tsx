import { FC } from 'react';
import { ArrowForward, CompareArrows } from '@mui/icons-material';
import { Box, Divider, Typography, useTheme } from '@mui/material';

import { ConfiguringData } from '.';
import { ExperimentalFieldTypes } from './Mapping/MappingRow';
import messageIds from 'features/import/l10n/messageIds';
import TagManager from 'features/tags/components/TagManager';
import ZUIEmptyState from 'zui/ZUIEmptyState';
import { Msg, useMessages } from 'core/i18n';

interface ConfigurationProps {
  currentlyConfiguring: ConfiguringData | null;
}

const Configuration: FC<ConfigurationProps> = ({ currentlyConfiguring }) => {
  const messages = useMessages(messageIds);
  const theme = useTheme();
  return (
    <Box bgcolor={theme.palette.transparentGrey.light} height="100%">
      {currentlyConfiguring &&
        currentlyConfiguring.type === ExperimentalFieldTypes.TAG && (
          <Box padding={2}>
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
                <Typography variant="body2">COLUMN TITLE</Typography>
              </Box>
              <Box width="50%">
                <Typography variant="body2">
                  {messages.configuration.configure.tags
                    .tagsHeader()
                    .toUpperCase()}
                </Typography>
              </Box>
            </Box>
            <Box display="flex" flexDirection="column" flexGrow={1}>
              <Box display="flex">
                <Box
                  alignItems="center"
                  display="flex"
                  flexGrow={2}
                  justifyContent="space-between"
                >
                  <Typography>Cat</Typography>
                  <ArrowForward color="secondary" sx={{ marginRight: 1 }} />
                </Box>
                <Box flexGrow={1}>
                  <TagManager
                    assignedTags={[]}
                    onAssignTag={() => null}
                    onUnassignTag={() => null}
                  />
                </Box>
              </Box>
              <Typography color="secondary">123 rows</Typography>
            </Box>
            <Divider sx={{ marginY: 1 }} />
          </Box>
        )}
      {!currentlyConfiguring && (
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
