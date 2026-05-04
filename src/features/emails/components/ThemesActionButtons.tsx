import React from 'react';
import { Box } from '@mui/system';
import { Button } from '@mui/material';

import { Msg } from 'core/i18n';
import messageIds from 'features/emails/l10n/messageIds';
import { useNumericRouteParams } from 'core/hooks';
import useCreateEmailTheme from 'features/emails/hooks/useCreateEmailTheme';

const ThemesActionButtons: React.FunctionComponent = () => {
  const { orgId, themeId } = useNumericRouteParams();
  const { createEmailTheme } = useCreateEmailTheme(orgId);

  if (themeId) {
    return null;
  }

  return (
    <Box display="flex">
      <Box mr={1}>
        <Button
          color="primary"
          onClick={() => {
            createEmailTheme();
          }}
          variant="contained"
        >
          <Msg id={messageIds.themes.addTheme} />
        </Button>
      </Box>
    </Box>
  );
};

export default ThemesActionButtons;
