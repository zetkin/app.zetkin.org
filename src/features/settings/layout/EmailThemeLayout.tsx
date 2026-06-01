import { FunctionComponent, useContext } from 'react';
import { Alert, Box, Button } from '@mui/material';
import { ContentCopy, Delete } from '@mui/icons-material';

import messageIds from 'features/settings/l10n/messageIds';
import { Msg, useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import SimpleLayout from 'utils/layout/SimpleLayout';
import useEmailTheme from 'features/emails/hooks/useEmailTheme';
import { serializeField } from '../utils/serializeField';
import useEmailThemeEditing from '../hooks/useEmailThemeEditing';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';

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
    duplicateEmailTheme,
    deleteEmailTheme,
  } = useEmailTheme(orgId, themeId);

  const { localValues, hasUnsavedChanges } = useEmailThemeEditing(theme);
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);

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
      ellipsisMenuItems={[
        {
          id: 'duplicateTheme',
          label: messages.email.themes.themeCard.duplicate(),
          onSelect: () => duplicateEmailTheme(),
          startIcon: <ContentCopy />,
        },
        {
          id: 'deleteTheme',
          label: messages.email.themes.delete.action(),
          onSelect: () =>
            showConfirmDialog({
              onSubmit: () => deleteEmailTheme(themeId),
              submitText:
                messages.email.themes.delete.confirmDialog.confirmButton({
                  themeId,
                }),
              title: messages.email.themes.delete.confirmDialog.title({
                themeId,
              }),
              warningText:
                messages.email.themes.delete.confirmDialog.warningText({
                  themeId,
                }),
            }),
          startIcon: <Delete />,
        },
      ]}
      fixedHeight={true}
      title={messages.email.themes.themeEditor.title({ themeId: themeId })}
    >
      {children}
    </SimpleLayout>
  );
};

export default EmailThemeLayout;
