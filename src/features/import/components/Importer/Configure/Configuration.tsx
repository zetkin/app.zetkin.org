import { CompareArrows } from '@mui/icons-material';
import { FC } from 'react';
import { Box, useTheme } from '@mui/material';

import { ConfiguringData } from '.';
import messageIds from 'features/import/l10n/messageIds';
import { useMessages } from 'core/i18n';
import ZUIEmptyState from 'zui/ZUIEmptyState';

interface ConfigurationProps {
  currentlyConfiguring: ConfiguringData | null;
}

const Configuration: FC<ConfigurationProps> = ({ currentlyConfiguring }) => {
  const messages = useMessages(messageIds);
  const theme = useTheme();
  return (
    <>
      {currentlyConfiguring && <>Mapping</>}
      {!currentlyConfiguring && (
        <Box
          alignItems="center"
          bgcolor={theme.palette.transparentGrey.light}
          display="flex"
          height="100%"
          justifyContent="center"
        >
          <ZUIEmptyState
            message={messages.configuration.mapping.emptyStateMessage()}
            renderIcon={(props) => <CompareArrows {...props} />}
          />
        </Box>
      )}
    </>
  );
};

export default Configuration;
