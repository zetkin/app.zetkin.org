import isEmail from 'validator/lib/isEmail';
import isURL from 'validator/lib/isURL';
import { isValidPhoneNumber } from 'libphonenumber-js';
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
  let obejct = {};

  const customFieldsKeys = customFields.reduce(
    (acc: { [key: string]: null }, cur: ZetkinCustomField) => {
      if (cur.type !== 'json') {
        acc[cur.slug] = null;
      }
      return acc;
    },
    {}
  );
  const initialValue: ZetkinCreatePerson = {
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
    street_address: null,
    tags: [],
    zip_code: null,
  };
  const [personalInfo, setPersonalInfo] =
    useState<ZetkinCreatePerson>(initialValue);

  useEffect(() => {
    setPersonalInfo(initialValue);
  }, [Object.keys(customFieldsKeys).length]);

  const debouncedFinishedTyping = useDebounce(
    async (key: string, value: string | null, customFields = false) => {
      setPersonalInfo((prev) => {
        if (customFields) {
          return {
            ...prev,
            customFields: { ...prev.customFields, [key]: value },
          };
        } else if (key === 'tags') {
          const tagValues = prev.tags.includes(value!)
            ? prev.tags.filter((item) => item !== value)
            : [...prev.tags, value!];
          return {
            ...prev,
            tags: tagValues,
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
          personalInfo={personalInfo}
        />
        <Box>
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
                  // setShowAllClickedType('none');
                  setPersonalInfo(initialValue);
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
                  // let { customFields: _, ...rest } = personalInfo;
                  const clone = (({ customFields, ...hello }) => hello)(
                    personalInfo
                  );
                  console.log(clone, ' ??');
                  // createPerson();
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

  //urls
  customFieldURLSlugs.forEach((slug) => {
    if (
      !isURL(personalInfo.customFields[slug] || '') &&
      personalInfo.customFields[slug] !== null
    ) {
      invalidFields.push(slug);
    } else {
      invalidFields = invalidFields.filter((item) => item !== slug);
    }
  });

  return invalidFields;
};
