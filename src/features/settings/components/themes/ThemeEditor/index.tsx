import React, { useState } from 'react';
import { Badge, Box, Tab, TextField } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';

import { useMessages } from 'core/i18n';
import messageIds from 'features/settings/l10n/messageIds';
import { ThemeSection } from 'features/emails/types';
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
      sx={(theme) => ({
        borderLeft: `1px solid ${theme.palette.grey[300]}`,
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        padding: 0,
      })}
    >
      <TabContext value={activeTab}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
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
          <TabPanel key={section} sx={{ flex: 1, padding: 0 }} value={section}>
            <Box
              sx={{
                '& .MuiFormControl-root': { height: '100%' },
                '& .MuiInputBase-input': {
                  height: '100% !important',
                  overflowY: 'auto !important',
                },
                '& .MuiInputBase-root': {
                  borderRadius: '0px',
                  height: '100%',
                  padding: 0,
                },
                height: '100%',
              }}
            >
              <TextField
                error={themeJsonError[section]}
                fullWidth
                maxRows={0}
                multiline
                onChange={(ev) => onChange(section, ev.target.value)}
                slotProps={{
                  htmlInput: {
                    sx: {
                      fontFamily:
                        'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                      fontSize: '0.875rem',
                      letterSpacing: '0',
                      lineHeight: '1.4rem',
                      whiteSpace: 'pre-line',
                    },
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      border: 'none',
                    },
                    paddingLeft: 1,
                    paddingTop: 1,
                  },
                }}
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
