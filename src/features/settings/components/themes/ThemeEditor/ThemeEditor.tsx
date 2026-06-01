import React, { useState } from 'react';
import { Alert, Box, Snackbar, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';

import { useMessages } from 'core/i18n';
import messageIds from 'features/settings/l10n/messageIds';
import ThemeEditField from './ThemeEditField';
import { ThemeSection } from 'features/emails/types';

interface ThemeEditorProps {
  localValues: Record<ThemeSection, string>;
  onChange: (section: ThemeSection, newValue: string) => void;
}

const ThemeEditor: React.FC<ThemeEditorProps> = ({ localValues, onChange }) => {
  const messages = useMessages(messageIds);
  const [activeTab, setActiveTab] = useState<ThemeSection>('frame_mjml');
  const [error, setError] = useState<string | null>(null);

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
    </>
  );
};

export default ThemeEditor;
