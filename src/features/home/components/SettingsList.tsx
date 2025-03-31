import { FC, useState } from 'react';
import {
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';

import useUserMutations from '../hooks/useUserMutations';
import { ZetkinUser } from 'utils/types/zetkin';
import ZUICard from 'zui/ZUICard';

export type ZetkinLanguage = 'en' | 'sv' | 'da' | 'nn' | 'de' | null;

type SettingListProps = {
  user: ZetkinUser;
};

const SettingsList: FC<SettingListProps> = ({ user }) => {
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
      <Box mt={2}>
        <ZUICard header={'App settings'}>
          <Divider />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel shrink>Language</InputLabel>
            <Select
              onChange={(e) => {
                const lang = e.target.value as ZetkinLanguage;
                setSelectedLanguage(lang), changeUserLanguage(lang);
                location.reload();
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
      </Box>

      <Box mt={2}>
        <ZUICard header={'Account settings'}>
          <Divider />
          {user.phone && (
            <TextField fullWidth sx={{ mt: 2 }} value={user.phone} />
          )}
        </ZUICard>
        <Button />
      </Box>
    </Box>
  );
};

export default SettingsList;
