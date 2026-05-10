import React from 'react';
import { Box } from '@mui/system';
import { Button } from '@mui/material';

import { Msg } from 'core/i18n';
import messageIds from 'features/emails/l10n/messageIds';
import { useNumericRouteParams } from 'core/hooks';
import useCreateEmailTheme from 'features/emails/hooks/useCreateEmailTheme';
import useEmailTheme from 'features/emails/hooks/useEmailTheme';

const ThemesActionButtons: React.FunctionComponent = () => {
  const { orgId, themeId } = useNumericRouteParams();

  return (
    <Box display="flex">
      <Box mr={1}>
        {themeId ? (
          <DuplicateButton orgId={orgId} themeId={themeId} />
        ) : (
          <CreateButton orgId={orgId} />
        )}
      </Box>
    </Box>
  );
};

const DuplicateButton = ({
  orgId,
  themeId,
}: {
  orgId: number;
  themeId: number;
}) => {
  const { duplicateEmailTheme } = useEmailTheme(orgId, themeId);

  return (
    <Button
      color="secondary"
      onClick={() => duplicateEmailTheme()}
      variant="contained"
    >
      <Msg id={messageIds.themes.duplicateTheme} />
    </Button>
  );
};

const CreateButton = ({ orgId }: { orgId: number }) => {
  const { createEmailTheme } = useCreateEmailTheme(orgId);

  return (
    <Button
      color="primary"
      onClick={() => createEmailTheme()}
      variant="contained"
    >
      <Msg id={messageIds.themes.addTheme} />
    </Button>
  );
};

export default ThemesActionButtons;
