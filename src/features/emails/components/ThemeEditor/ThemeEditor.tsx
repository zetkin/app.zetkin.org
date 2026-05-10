import React, { useState } from 'react';
import { Box, Button, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';

import { useMessages } from 'core/i18n';
import messageIds from 'features/emails/l10n/messageIds';
import ThemeEditField, {
  serializeField,
} from 'features/emails/components/ThemeEditor/ThemeEditField';
import { EmailThemePatchBody } from 'features/emails/types';
import useEmailTheme from 'features/emails/hooks/useEmailTheme';

interface ThemeEditorProps {
  orgId: number;
  themeId: number;
  localValues: Record<ThemeSection, string>;
  setLocalValues: React.Dispatch<
    React.SetStateAction<Record<ThemeSection, string>>
  >;
}

type ThemeSection = keyof EmailThemePatchBody;

const ThemeEditor: React.FC<ThemeEditorProps> = ({
  orgId,
  themeId,
  localValues,
  setLocalValues,
}) => {
  const messages = useMessages(messageIds);
  const [activeTab, setActiveTab] = useState<ThemeSection>('frame_mjml');

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
            disabled={!isDirty || mutating.length > 0}
            onClick={handleSaveAll}
            size="small"
            variant="contained"
          >
            {messages.themes.themeEditor.saveButton()}
          </Button>
        </Box>
        {Object.keys(localValues).map((section) => (
          <TabPanel key={section} sx={{ flex: 1, p: 2 }} value={section}>
            <ThemeEditField
              editingSection={section as ThemeSection}
              onChange={(newVal) =>
                setLocalValues((prev) => ({ ...prev, [section]: newVal }))
              }
              value={localValues[section as ThemeSection]}
            />
          </TabPanel>
        ))}
      </TabContext>
    </Box>
  );
};

export default ThemeEditor;
