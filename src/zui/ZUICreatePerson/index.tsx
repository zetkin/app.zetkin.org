import {
  Box,
  Button,
  Dialog,
  Divider,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { FC, useEffect, useState } from 'react';

import messageIds from 'zui/l10n/messageIds';
import { Msg } from 'core/i18n';
import PersonalInfoForm from './PersonalInfoForm';
import useCustomFields from 'features/profile/hooks/useCustomFields';
import useDebounce from 'utils/hooks/useDebounce';
import { useNumericRouteParams } from 'core/hooks';
import { ZetkinCreatePerson, ZetkinCustomField } from 'utils/types/zetkin';

interface ZUICreatePersonProps {
  onClose: () => void;
  open: boolean;
}

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
  const initialValue: ZetkinCreatePerson = {
    ...{
      alt_phone: null,
      city: null,
      co_address: null,
      country: null,
      customFields: { ...customFieldsKeys },
      email: null,
      ext_id: null,
      first_name: '',
      gender: null,
      last_name: '',
      phone: null,
      tags: [],
      street_address: null,
      zip_code: null,
    },
  };
  const [personalInfo, setPersonalInfo] =
    useState<ZetkinCreatePerson>(initialValue);

  useEffect(() => {
    setPersonalInfo(initialValue);
  }, [customFieldsKeys.length]);

  const [showAllFields, setShowAllFields] = useState(false);
  const [showAllWithEnter, setShowAllWithEnter] = useState(false);

  const debouncedFinishedTyping = useDebounce(
    async (key: string, value: string | null, customFields = false) => {
      setPersonalInfo((prev) => {
        if (customFields) {
          return {
            ...prev,
            customFields: { ...prev.customFields, [key]: value },
          };
        } else if (key === 'tags') {
          return {
            ...prev,
            tags: [...prev.tags, value as string],
          };
        } else {
          return {
            ...prev,
            [key]: value,
          };
        }
      });
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
          debounced={(slug, value, custom) => {
            debouncedFinishedTyping(slug, value, custom);
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
