import { FC, useContext, useState } from 'react';
import { Box } from '@mui/material';

import useUserMutations from '../hooks/useUserMutations';
import { ZetkinUser } from 'utils/types/zetkin';
import messageIds from '../l10n/messageIds';
import { useMessages } from 'core/i18n';
import ZUISection from 'zui/components/ZUISection';
import ZUISelect from 'zui/components/ZUISelect';
import ZUIButton from 'zui/components/ZUIButton';
import { SupportedLanguage } from 'core/i18n/languages';
import { DarkModeSettingContext } from '../../../zui/theme/ZUIThemeProvider';

export type ZetkinUserLanguage = SupportedLanguage | null;

type Props = {
  user: ZetkinUser;
};

const AppPreferences: FC<Props> = ({ user }) => {
  const messages = useMessages(messageIds);
  const languageOptions: Record<SupportedLanguage, string> = {
    da: 'Dansk',
    de: 'Deutsch',
    en: 'English',
    nl: 'Nederlands',
    nn: 'Norsk',
    sv: 'Svenska',
  };

  const { updateUser } = useUserMutations();
  const [selectedLanguage, setSelectedLanguage] = useState<ZetkinUserLanguage>(
    user?.lang as ZetkinUserLanguage
  );

  const { set: setDarkModeSetting, value: darkModeSetting } = useContext(
    DarkModeSettingContext
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
        <ZUISection
          renderContent={() => (
            <Box
              sx={{
                alignItems: 'flex-end',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <ZUISelect
                fullWidth
                items={[
                  {
                    label: messages.settings.appPreferences.lang.auto(),
                    value: 'auto',
                  },
                  ...Object.entries(languageOptions)
                    // TODO: Remove this filter once nl is supported on server
                    .filter((entry) => entry[0] != 'nl')
                    .map(([code, label]) => ({
                      label,
                      value: code,
                    })),
                ]}
                label={messages.settings.appPreferences.lang.label()}
                onChange={(newValue) => {
                  if (newValue == 'auto') {
                    setSelectedLanguage(null);
                  } else {
                    setSelectedLanguage(newValue as ZetkinUserLanguage);
                  }
                }}
                selectedOption={selectedLanguage || 'auto'}
                size="large"
              />
              <ZUIButton
                disabled={selectedLanguage == user.lang}
                label={messages.settings.appPreferences.lang.saveButton()}
                onClick={async () => {
                  await updateUser({ lang: selectedLanguage });
                  location.reload();
                }}
                size="large"
                variant="primary"
              />
              <ZUISelect
                fullWidth
                items={[
                  {
                    label: messages.settings.appPreferences.darkMode.auto(),
                    value: 'auto',
                  },
                  {
                    label: messages.settings.appPreferences.darkMode.dark(),
                    value: 'true',
                  },
                  {
                    label: messages.settings.appPreferences.darkMode.light(),
                    value: 'false',
                  },
                ]}
                label={messages.settings.appPreferences.darkMode.label()}
                onChange={(newValue) => {
                  if (newValue == 'auto') {
                    setDarkModeSetting('auto');
                  } else {
                    setDarkModeSetting(newValue === 'true');
                  }
                }}
                selectedOption={darkModeSetting + ''}
                size="large"
              />
            </Box>
          )}
          title={messages.settings.appPreferences.header()}
        />
      </Box>
    </Box>
  );
};

export default AppPreferences;
