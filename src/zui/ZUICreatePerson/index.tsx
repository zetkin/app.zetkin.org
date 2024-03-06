import {
  Box,
  Button,
  Dialog,
  Divider,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { FC, useState } from 'react';

import messageIds from 'zui/l10n/messageIds';
import { Msg } from 'core/i18n';
import PersonalInfoForm from './PersonalInfoForm';
import useCustomFields from 'features/profile/hooks/useCustomFields';
import useDebounce from 'utils/hooks/useDebounce';
import { useNumericRouteParams } from 'core/hooks';
import { ZetkinCustomField } from 'utils/types/zetkin';

interface ZUICreatePersonProps {
  onClose: () => void;
  open: boolean;
}

export type ZetkinCreatePerson =
  | {
      alt_phone: string | null;
      city: string | null;
      co_address: string | null;
      country: string | null;
      email: string | null;
      ext_id: string | null;
      first_name: string;
      gender: 'f' | 'm' | 'o' | null;
      last_name: string;
      phone: string | null;
      street_address: string | null;
      zip_code: string | null;
    }
  | { [key: string]: string | null };

const ZUICreatePerson: FC<ZUICreatePersonProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const { orgId } = useNumericRouteParams();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const customFields = useCustomFields(orgId).data ?? [];

  const customFieldsKeys = customFields.reduce(
    (acc: { [key: string]: null }, cur: ZetkinCustomField) => {
      acc[cur.slug] = null;
      return acc;
    },
    {}
  );

  const initialValue = {
    ...{
      alt_phone: null,
      city: null,
      co_address: null,
      country: null,
      email: null,
      ext_id: null,
      first_name: '',
      gender: null,
      last_name: '',
      phone: null,
      street_address: null,
      zip_code: null,
    },
    ...customFieldsKeys,
  };

  const [showAllFields, setShowAllFields] = useState(false);
  const [showAllWithEnter, setShowAllWithEnter] = useState(false);
  const [personalInfo, setPersonalInfo] =
    useState<ZetkinCreatePerson>(initialValue);

  const debouncedFinishedTyping = useDebounce(
    async (key: string, value: string | null) => {
      setPersonalInfo((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    300
  );

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth
      onClose={() => {
        onClose();
        setShowAllFields(false);
        setShowAllWithEnter(false);
        setPersonalInfo(initialValue);
      }}
      open={open}
    >
      <Box sx={{ padding: '40px 0 40px 40px' }}>
        <Typography mb={2} variant="h5">
          <Msg id={messageIds.createPerson.title} />
        </Typography>

        <PersonalInfoForm
          debounced={(key, value) => {
            debouncedFinishedTyping(key, value);
          }}
          onClickShowAll={() => setShowAllFields(true)}
          onClickShowAllWithEnter={() => setShowAllWithEnter(true)}
          personalInfo={personalInfo}
          showAllFields={showAllFields}
          showAllWithEnter={showAllWithEnter}
        />
        <Box sx={{ pr: `${showAllFields ? '60px' : '40px'}` }}>
          <Divider />
          <Box
            alignItems="center"
            display="flex"
            justifyContent="space-between"
            mt={2}
          >
            <Box display="flex" flexDirection="column">
              <Typography>Message:</Typography>
              <Typography>Blah blah</Typography>
            </Box>
            <Box>
              <Button
                onClick={() => {
                  onClose();
                  setShowAllFields(false);
                  setShowAllWithEnter(false);
                  setPersonalInfo(initialValue);
                }}
                sx={{ mr: 2 }}
                variant="text"
              >
                <Msg id={messageIds.createPerson.cancel} />
              </Button>
              <Button
                disabled={!personalInfo.first_name || !personalInfo.last_name}
                variant="contained"
              >
                <Msg id={messageIds.createPerson.createBtn} />
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

export default ZUICreatePerson;
