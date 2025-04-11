import { FC, useState } from 'react';
import {
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';

import useUserMutations from '../hooks/useUserMutations';
import { ZetkinUser } from 'utils/types/zetkin';
import ZUICard from 'zui/ZUICard';
import messageIds from '../l10n/messageIds';
import { Msg, useMessages } from 'core/i18n';

export type ZetkinLanguage = 'en' | 'sv' | 'da' | 'nn' | 'de' | null;

type SettingListProps = {
  user: ZetkinUser;
};

const SettingsList: FC<SettingListProps> = ({ user }) => {
  const messages = useMessages(messageIds);
  const languageOptions = {
    da: 'Dansk',
    de: 'Deutsch',
    en: 'English',
    nn: 'Norsk',
    sv: 'Svenska',
  } as const;

  const { changeUserLanguage } = useUserMutations();
  const [selectedLanguage, setSelectedLanguage] = useState<ZetkinLanguage>(
    user?.lang as ZetkinLanguage
  );

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={1}
      overflow="hidden"
      position="relative"
    >
      <Box mt={2}>
        <ZUICard header={messages.settings.appPreferences.header()}>
          <Divider />
          <Box
            sx={{
              alignItems: 'flex-end',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel shrink>
                <Msg id={messageIds.settings.appPreferences.lang.label} />
              </InputLabel>
              <Select
                label={messages.settings.appPreferences.lang.label()}
                onChange={(e) => {
                  if (e.target.value == 'auto') {
                    setSelectedLanguage(null);
                  } else {
                    setSelectedLanguage(e.target.value as ZetkinLanguage);
                  }
                }}
                value={selectedLanguage || 'auto'}
              >
                <MenuItem key="auto" value="auto">
                  <Msg id={messageIds.settings.appPreferences.lang.auto} />
                </MenuItem>
                {Object.entries(languageOptions).map(([code, label]) => (
                  <MenuItem key={code} value={code}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              disabled={selectedLanguage == user.lang}
              onClick={() => {
                changeUserLanguage(selectedLanguage);
                location.reload();
              }}
              variant="contained"
            >
              <Msg id={messageIds.settings.appPreferences.lang.saveButton} />
            </Button>
          </Box>
        </ZUICard>
      </Box>
    </Box>
  );
};

export default SettingsList;
