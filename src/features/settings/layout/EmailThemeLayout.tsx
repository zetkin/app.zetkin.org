import { FunctionComponent } from 'react';
import { Alert, Box, Button } from '@mui/material';

import messageIds from 'features/settings/l10n/messageIds';
import { Msg, useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import SimpleLayout from 'utils/layout/SimpleLayout';
import useEmailTheme from 'features/emails/hooks/useEmailTheme';
import { serializeField } from '../utils/serializeField';
import useEmailThemeEditing from '../hooks/useEmailThemeEditing';

interface EmailThemeLayoutProps {
  children: React.ReactNode;
}

const EmailThemeLayout: FunctionComponent<EmailThemeLayoutProps> = ({
  children,
}) => {
  const { orgId, themeId } = useNumericRouteParams();
  const messages = useMessages(messageIds);
  const {
    clearUpdateEmailThemeError,
    data: theme,
    updateEmailTheme,
    mutating,
    themeUpdateError,
  } = useEmailTheme(orgId, themeId);

  const { localValues, hasUnsavedChanges } = useEmailThemeEditing(theme);

  const title = themeId
    ? messages.email.themes.themeEditor.title({ themeId: themeId })
    : messages.email.themes.title();

  return (
    <SimpleLayout
      actionButtons={
        <Button
          disabled={!hasUnsavedChanges()}
          loading={mutating.length > 0}
          onClick={async () => {
            updateEmailTheme({
              block_attributes: serializeField(
                localValues.block_attributes,
                'block_attributes'
              ),
              css: serializeField(localValues.css, 'css'),
              frame_mjml: serializeField(localValues.frame_mjml, 'frame_mjml'),
            });
          }}
          variant="contained"
        >
          <Msg id={messageIds.email.themes.themeEditor.saveButton} />
        </Button>
      }
      belowActionButtons={
        themeUpdateError ? (
          <Box sx={{ paddingTop: 2 }}>
            <Alert
              onClose={() => clearUpdateEmailThemeError()}
              severity="error"
            >
              There was an error updating the theme, try again. If it keeps
              failing - contact support.
            </Alert>
          </Box>
        ) : undefined
      }
      fixedHeight={true}
      title={title}
    >
      {children}
    </SimpleLayout>
  );
};

export default EmailThemeLayout;
