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
import { FC, useState } from 'react';

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
  const [tags, setTags] = useState<number[]>([]);

  const [personalInfo, setPersonalInfo] = useState<ZetkinCreatePerson>({});

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth
      onClose={() => {
        onClose();
        setPersonalInfo({});
        setTags([]);
      }}
      open={open}
    >
      <Box sx={{ padding: '40px 0 40px 40px' }}>
        <Typography mb={2} variant="h5">
          <Msg id={messageIds.createPerson.title} />
        </Typography>
        {customFields.length === 0 && (
          <Box
            sx={{ display: 'flex', justifyContent: 'center', m: 8, pr: '40px' }}
          >
            <CircularProgress />
          </Box>
        )}
        {customFields.length > 0 && (
          <PersonalInfoForm
            onChange={(field, value) => {
              if (value === '') {
                const copied = { ...personalInfo };
                delete copied[field];
                setPersonalInfo(copied);
              } else {
                if (field === 'tags') {
                  setTags((prev) =>
                    tags.includes(value! as number)
                      ? tags.filter((item) => item !== value)
                      : [...prev, value! as number]
                  );
                } else {
                  setPersonalInfo((prev) => {
                    return { ...prev, [field]: value as string };
                  });
                }
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
                  setPersonalInfo({});
                  setTags([]);
                }}
                sx={{ mr: 2 }}
                variant="text"
              >
                <Msg id={messageIds.createPerson.cancel} />
              </Button>
              <Button
                disabled={
                  personalInfo.first_name === undefined ||
                  personalInfo.last_name === undefined ||
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
  if (!isEmail(personalInfo.email || '') && personalInfo.email !== undefined) {
    invalidFields.push('email');
  } else {
    invalidFields = invalidFields.filter((item) => item !== 'email');
  }

  //phones
  if (
    !isValidPhoneNumber(personalInfo.phone || '') &&
    personalInfo.phone !== undefined
  ) {
    invalidFields.push('phone');
  } else {
    invalidFields = invalidFields.filter((item) => item !== 'phone');
  }
  if (
    !isValidPhoneNumber(personalInfo.alt_phone || '') &&
    personalInfo.alt_phone !== undefined
  ) {
    invalidFields.push('alt_phone');
  } else {
    invalidFields = invalidFields.filter((item) => item !== 'alt_phone');
  }

  //urls;
  customFieldURLSlugs.forEach((slug) => {
    if (!isURL(personalInfo[slug] || '') && personalInfo[slug] !== undefined) {
      invalidFields.push(slug);
    } else {
      invalidFields = invalidFields.filter((item) => item !== slug);
    }
  });
  console.log(invalidFields, ' invalid');

  return invalidFields;
};
