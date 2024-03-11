import isEmail from 'validator/lib/isEmail';
import isURL from 'validator/lib/isURL';
import { isValidPhoneNumber } from 'libphonenumber-js';
import {
  Box,
  Button,
  CircularProgress,
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
import { useNumericRouteParams } from 'core/hooks';
import { ZetkinCreatePerson, ZetkinCustomField } from 'utils/types/zetkin';
import useCreatePerson from 'features/profile/hooks/useCreatePerson';

interface ZUICreatePersonProps {
  onClose: () => void;
  open: boolean;
}

const ZUICreatePerson: FC<ZUICreatePersonProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const { orgId } = useNumericRouteParams();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const customFields = useCustomFields(orgId).data ?? [];
  const createPerson = useCreatePerson(orgId);
  const [fieldsLoaded, setFieldsLoaded] = useState(false);
  const [tags, setTags] = useState<string[]>([]);

  const initialValue = {
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
  };

  const customFieldKeys = customFields.reduce(
    (acc: { [key: string]: null }, cur: ZetkinCustomField) => {
      if (cur.type !== 'json') {
        acc[cur.slug] = null;
      }
      return acc;
    },
    {}
  );

  const [personalInfo, setPersoanInfo] =
    useState<ZetkinCreatePerson>(initialValue);

  useEffect(() => {
    setPersoanInfo({
      ...initialValue,
      ...customFieldKeys,
    });
    setFieldsLoaded(true);
  }, [Object.keys(customFieldKeys).length]);

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth
      onClose={() => {
        onClose();
        setPersoanInfo({ ...initialValue, ...customFieldKeys });
      }}
      open={open}
    >
      <Box sx={{ padding: '40px 0 40px 40px' }}>
        <Typography mb={2} variant="h5">
          <Msg id={messageIds.createPerson.title} />
        </Typography>
        {!fieldsLoaded && (
          <Box
            sx={{ display: 'flex', justifyContent: 'center', m: 8, pr: '40px' }}
          >
            <CircularProgress />
          </Box>
        )}
        {fieldsLoaded && (
          <PersonalInfoForm
            onChange={(slug, value) => {
              if (slug === 'tags') {
                setTags((prev) => [...prev, value!]);
              } else {
                setPersoanInfo((prev) => {
                  return { ...prev, [slug]: value };
                });
              }
            }}
            tags={tags}
            personalInfo={personalInfo}
          />
        )}
        <Box sx={{ pr: '40px' }}>
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
                  setPersoanInfo({ ...initialValue, ...customFieldKeys });
                }}
                sx={{ mr: 2 }}
                variant="text"
              >
                <Msg id={messageIds.createPerson.cancel} />
              </Button>
              <Button
                disabled={
                  !personalInfo.first_name ||
                  !personalInfo.last_name ||
                  checkInvalidFields(customFields, personalInfo).length !== 0
                }
                onClick={() => {
                  createPerson(personalInfo, tags);
                }}
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

export const checkInvalidFields = (
  customFields: ZetkinCustomField[],
  personalInfo: ZetkinCreatePerson
) => {
  let invalidFields: string[] = [];

  const customFieldURLSlugs = customFields
    .filter((item) => item.type === 'url')
    .map((item) => item.slug);

  //email
  if (!isEmail(personalInfo.email || '') && personalInfo.email !== null) {
    invalidFields.push('email');
  } else {
    invalidFields = invalidFields.filter((item) => item !== 'email');
  }

  //phones
  if (
    !isValidPhoneNumber(personalInfo.phone || '') &&
    personalInfo.phone !== null
  ) {
    invalidFields.push('phone');
  } else {
    invalidFields = invalidFields.filter((item) => item !== 'phone');
  }
  if (
    !isValidPhoneNumber(personalInfo.alt_phone || '') &&
    personalInfo.alt_phone !== null
  ) {
    invalidFields.push('alt_phone');
  } else {
    invalidFields = invalidFields.filter((item) => item !== 'alt_phone');
  }

  //urls;
  customFieldURLSlugs.forEach((slug) => {
    if (!isURL(personalInfo[slug] || '') && personalInfo[slug] !== null) {
      invalidFields.push(slug);
    } else {
      invalidFields = invalidFields.filter((item) => item !== slug);
    }
  });

  return invalidFields;
};
