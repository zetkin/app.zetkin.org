import { FC, useState } from 'react';
import { Box } from '@mui/material';

import useUserMutations from '../hooks/useUserMutations';
import { ZetkinUser } from 'utils/types/zetkin';
import messageIds from '../l10n/messageIds';
import { useMessages } from 'core/i18n';
import ZUISection from 'zui/components/ZUISection';
import ZUISelect from 'zui/components/ZUISelect';
import ZUIButton from 'zui/components/ZUIButton';

export type ZetkinLanguage = 'en' | 'sv' | 'da' | 'nn' | 'de' | null;

type Props = {
  user: ZetkinUser;
};

const AppPreferences: FC<Props> = ({ user }) => {
  const messages = useMessages(messageIds);
  const languageOptions = {
    da: 'Dansk',
    de: 'Deutsch',
    en: 'English',
    nn: 'Norsk',
    sv: 'Svenska',
  } as const;

  const { updateUser } = useUserMutations();
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
                  ...Object.entries(languageOptions).map(([code, label]) => ({
                    label,
                    value: code,
                  })),
                ]}
                label={messages.settings.appPreferences.lang.label()}
                onChange={(newValue) => {
                  if (newValue == 'auto') {
                    setSelectedLanguage(null);
                  } else {
                    setSelectedLanguage(newValue as ZetkinLanguage);
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
            </Box>
          )}
          title={messages.settings.appPreferences.header()}
        />
      </Box>
    </Box>
  );
};

export default AppPreferences;
