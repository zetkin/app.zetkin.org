import React, { useState } from 'react';
import { Badge, Box, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';

import { useMessages } from 'core/i18n';
import messageIds from 'features/settings/l10n/messageIds';
import { ThemeSection } from 'features/emails/types';
import ZUITextField from 'zui/components/ZUITextField';
import useEmailTheme from 'features/emails/hooks/useEmailTheme';
import { useNumericRouteParams } from 'core/hooks';

interface ThemeEditorProps {
  localValues: Record<ThemeSection, string>;
  onChange: (section: ThemeSection, newValue: string) => void;
}

const ThemeEditor: React.FC<ThemeEditorProps> = ({ localValues, onChange }) => {
  const { orgId, themeId } = useNumericRouteParams();
  const messages = useMessages(messageIds);
  const [activeTab, setActiveTab] = useState<ThemeSection>('frame_mjml');
  const { themeJsonError } = useEmailTheme(orgId, themeId);

  return (
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
              label={
                !themeJsonError.frame_mjml ? (
                  messages.email.themes.themeEditor.tabs.frame()
                ) : (
                  <Badge badgeContent="!" color="primary">
                    <Box component="span" sx={{ mr: 1.5 }}>
                      {messages.email.themes.themeEditor.tabs.frame()}
                    </Box>
                  </Badge>
                )
              }
              value="frame_mjml"
            />
            <Tab
              label={
                !themeJsonError.css ? (
                  messages.email.themes.themeEditor.tabs.css()
                ) : (
                  <Badge badgeContent="!" color="primary">
                    <Box component="span" sx={{ mr: 1.5 }}>
                      {messages.email.themes.themeEditor.tabs.css()}
                    </Box>
                  </Badge>
                )
              }
              value="css"
            />
            <Tab
              label={
                !themeJsonError.block_attributes ? (
                  messages.email.themes.themeEditor.tabs.block()
                ) : (
                  <Badge badgeContent="!" color="primary">
                    <Box component="span" sx={{ mr: 1.5 }}>
                      {messages.email.themes.themeEditor.tabs.block()}
                    </Box>
                  </Badge>
                )
              }
              value="block_attributes"
            />
          </TabList>
        </Box>
        {(Object.keys(localValues) as ThemeSection[]).map((section) => (
          <TabPanel key={section} sx={{ flex: 1, p: 2 }} value={section}>
            <Box
              sx={{
                '& .MuiFormControl-root': { height: '100%' },
                '& .MuiInputBase-input': {
                  height: '100% !important',
                  overflow: 'auto !important',
                },
                '& .MuiInputBase-root': { height: '100%' },
                height: '100%',
              }}
            >
              <ZUITextField
                error={themeJsonError[section]}
                fullWidth
                maxRows={0}
                monospaced={true}
                multiline
                onChange={(newVal) => onChange(section, newVal)}
                value={localValues[section]}
              />
            </Box>
          </TabPanel>
        ))}
      </TabContext>
    </Box>
  );
};

export default ThemeEditor;
