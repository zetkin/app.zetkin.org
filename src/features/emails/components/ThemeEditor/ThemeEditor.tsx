import React, { useEffect, useState } from 'react';
import { Box, Button, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';

import { useMessages } from 'core/i18n';
import messageIds from 'features/emails/l10n/messageIds';
import ThemeEditField, { parseField, serializeField } from './ThemeEditField';
import { EmailThemePatchBody } from 'features/emails/types';
import useEmailTheme from 'features/emails/hooks/useEmailTheme';

interface ThemeEditorProps {
  orgId: number;
  themeId: number;
}

type ThemeSection = keyof EmailThemePatchBody;

const ThemeEditor: React.FC<ThemeEditorProps> = ({ orgId, themeId }) => {
  const messages = useMessages(messageIds);
  const [activeTab, setActiveTab] = useState<ThemeSection>('frame_mjml');

  const {
    data: theme,
    updateEmailTheme,
    mutating,
  } = useEmailTheme(orgId, themeId);

  const [localValues, setLocalValues] = useState<Record<ThemeSection, string>>({
    block_attributes: '',
    css: '',
    frame_mjml: '',
  });

  useEffect(() => {
    if (theme) {
      setLocalValues({
        block_attributes: parseField(
          theme.block_attributes,
          'block_attributes'
        ),
        css: parseField(theme.css, 'css'),
        frame_mjml: parseField(theme.frame_mjml, 'frame_mjml'),
      });
    }
  }, [theme]);

  const isDirty = theme
    ? localValues.frame_mjml !== parseField(theme.frame_mjml, 'frame_mjml') ||
      localValues.css !== parseField(theme.css, 'css') ||
      localValues.block_attributes !==
        parseField(theme.block_attributes, 'block_attributes')
    : false;

  const hasJsonError = (() => {
    try {
      if (localValues.frame_mjml) {
        JSON.parse(localValues.frame_mjml);
      }
      if (localValues.block_attributes) {
        JSON.parse(localValues.block_attributes);
      }
      return false;
    } catch {
      return true;
    }
  })();

  const handleSaveAll = async () => {
    const patch: EmailThemePatchBody = {
      block_attributes: serializeField(
        localValues.block_attributes,
        'block_attributes'
      ),
      css: serializeField(localValues.css, 'css'),
      frame_mjml: serializeField(localValues.frame_mjml, 'frame_mjml'),
    };
    await updateEmailTheme(patch);
  };

  return (
    <Box
      sx={{ display: 'flex', flex: 1, flexDirection: 'column', height: '100%' }}
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
              label={messages.themes.themeEditor.tabs.frame()}
              value="frame_mjml"
            />
            <Tab label={messages.themes.themeEditor.tabs.css()} value="css" />
            <Tab
              label={messages.themes.themeEditor.tabs.block()}
              value="block_attributes"
            />
          </TabList>

          <Button
            color="primary"
            disabled={!isDirty || hasJsonError || mutating.length > 0}
            onClick={handleSaveAll}
            size="small"
            variant="contained"
          >
            {messages.themes.themeEditor.saveButton()}
          </Button>
        </Box>

        {(['frame_mjml', 'css', 'block_attributes'] as ThemeSection[]).map(
          (section) => (
            <TabPanel
              key={section}
              sx={{ flex: 1, overflowY: 'auto', p: 2 }}
              value={section}
            >
              <ThemeEditField
                editingSection={section}
                onChange={(newVal) =>
                  setLocalValues((prev) => ({ ...prev, [section]: newVal }))
                }
                value={localValues[section]}
              />
            </TabPanel>
          )
        )}
      </TabContext>
    </Box>
  );
};

export default ThemeEditor;
