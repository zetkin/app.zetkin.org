import React, { useState } from 'react';
import { Alert, Box, Button, Snackbar, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';

import { useMessages } from 'core/i18n';
import messageIds from 'features/settings/l10n/messageIds';
import ThemeEditField, { serializeField } from './ThemeEditField';
import { EmailThemePatchBody, ThemeSection } from 'features/emails/types';
import useEmailTheme from 'features/emails/hooks/useEmailTheme';
import ZUIConfirmDialog from 'zui/ZUIConfirmDialog';
import ThemeActionsEllipsisMenu from '../ThemeActionsEllipsisMenu';
import { useUnsavedChanges } from 'core/hooks/useUnsavedChanges';

interface ThemeEditorProps {
  orgId: number;
  themeId: number;
  localValues: Record<ThemeSection, string>;
  onChange: (section: ThemeSection, newValue: string) => void;
}

const ThemeEditor: React.FC<ThemeEditorProps> = ({
  orgId,
  themeId,
  localValues,
  onChange,
}) => {
  const messages = useMessages(messageIds);
  const [activeTab, setActiveTab] = useState<ThemeSection>('frame_mjml');
  const [error, setError] = useState<string | null>(null);

  const {
    data: theme,
    updateEmailTheme,
    mutating,
  } = useEmailTheme(orgId, themeId);

  const isDirty = theme
    ? localValues.frame_mjml !== JSON.stringify(theme.frame_mjml, null, 2) ||
      localValues.css !== (theme.css || '') ||
      localValues.block_attributes !==
        JSON.stringify(theme.block_attributes, null, 2)
    : false;

  const { confirmOpen, onCancel, onConfirm } = useUnsavedChanges(isDirty);

  const handleSaveAll = async () => {
    setError(null);

    const patch: EmailThemePatchBody = {
      block_attributes: serializeField(
        localValues.block_attributes,
        'block_attributes'
      ),
      css: serializeField(localValues.css, 'css'),
      frame_mjml: serializeField(localValues.frame_mjml, 'frame_mjml'),
    };

    const result = await updateEmailTheme(patch);

    if (typeof result === 'string') {
      setError(result);
    }
  };

  return (
    <>
      {error && (
        <Snackbar
          anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
          open={!!error}
        >
          <Alert onClose={() => setError(null)} severity="error">
            {error}
          </Alert>
        </Snackbar>
      )}
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <TabContext value={activeTab}>
          <Box
            sx={{
              alignItems: 'center',
              borderBottom: 1,
              borderColor: 'divider',
              display: 'flex',
              justifyContent: 'space-between',
              pr: 2,
            }}
          >
            <TabList onChange={(e, val) => setActiveTab(val as ThemeSection)}>
              <Tab
                label={messages.email.themes.themeEditor.tabs.frame()}
                value="frame_mjml"
              />
              <Tab
                label={messages.email.themes.themeEditor.tabs.css()}
                value="css"
              />
              <Tab
                label={messages.email.themes.themeEditor.tabs.block()}
                value="block_attributes"
              />
            </TabList>

            <Box>
              <Button
                color="primary"
                disabled={!isDirty || mutating.length > 0}
                onClick={handleSaveAll}
                size="small"
                variant="contained"
              >
                {messages.email.themes.themeEditor.saveButton()}
              </Button>
              <ThemeActionsEllipsisMenu orgId={orgId} themeId={themeId} />
            </Box>
          </Box>
          {(Object.keys(localValues) as ThemeSection[]).map((section) => (
            <TabPanel key={section} sx={{ flex: 1, p: 2 }} value={section}>
              <ThemeEditField
                editingSection={section}
                onChange={(newVal) => onChange(section, newVal)}
                value={localValues[section]}
              />
            </TabPanel>
          ))}
        </TabContext>
      </Box>
      <ZUIConfirmDialog
        onCancel={onCancel}
        onSubmit={onConfirm}
        open={confirmOpen}
        submitText={messages.email.themes.themeEditor.unsavedChangesConfirm()}
        warningText={messages.email.themes.themeEditor.unsavedChangesWarning()}
      />
    </>
  );
};

export default ThemeEditor;
