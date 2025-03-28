import { FC, useState } from 'react';
import {
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';

import messageIds from '../../breadcrumbs/l10n/messageIds';
import useUserMutations from '../hooks/useUserMutations';
import { useMessages } from 'core/i18n';
import ZUICard from 'zui/ZUICard';
import { ZetkinUser } from 'utils/types/zetkin';

export type ZetkinLanguage = 'en' | 'sv' | 'da' | 'nn' | 'de' | null;

type SettingListProps = {
  user: ZetkinUser;
};

const SettingsList: FC<SettingListProps> = ({ user }) => {
  const messages = useMessages(messageIds);

  const languageOptions: { [key: string]: string } = {
    da: 'Danish',
    de: 'German',
    en: 'English',
    nn: 'Norwegian Nynorsk',
    sv: 'Swedish',
  };

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
      <Typography>
        String that changes the language: {messages.elements.activities()}
      </Typography>
      {user && (
        <ZUICard header={'App settings'}>
          <Divider />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel shrink>Language</InputLabel>
            <Select
              onChange={(e) => {
                const lang = e.target.value as ZetkinLanguage;
                setSelectedLanguage(lang), changeUserLanguage(lang);
              }}
              value={selectedLanguage}
            >
              {Object.entries(languageOptions).map(([code, label]) => (
                <MenuItem key={code} value={code}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </ZUICard>
      )}

      <Button />
    </Box>
  );
};

export default SettingsList;
