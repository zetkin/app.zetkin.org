import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ExpandMore } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { FC, useEffect, useRef, useState } from 'react';

import globalMessageIds from 'core/i18n/globalMessageIds';
import isEmail from 'validator/lib/isEmail';
import isURL from 'validator/lib/isURL';
import { isValidPhoneNumber } from 'libphonenumber-js';
import messageIds from 'zui/l10n/messageIds';
import { TagManagerSection } from 'features/tags/components/TagManager';
import useCustomFields from 'features/profile/hooks/useCustomFields';
import useDebounce from 'utils/hooks/useDebounce';
import { useNumericRouteParams } from 'core/hooks';
import { Msg, useMessages } from 'core/i18n';
import { ZetkinCustomField, ZetkinTag } from 'utils/types/zetkin';

interface ZUICreatePersonProps {
  onClose: () => void;
  open: boolean;
}
type GenderKeyType = 'f' | 'm' | 'o' | 'unknown';

type ZetkinCreatePerson =
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
  const globalMessages = useMessages(globalMessageIds);
  const messages = useMessages(messageIds);
  const customFields = useCustomFields(orgId).data ?? [];
  const genderKeys = Object.keys(
    messageIds.createPerson.genders
  ) as GenderKeyType[];

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

  const inputRef = useRef<HTMLInputElement>();

  const invalidEmail =
    !isEmail(personalInfo.email || '') && personalInfo.email !== null;
  const invalidPhoneNum =
    !isValidPhoneNumber(personalInfo.phone || '') &&
    personalInfo.phone !== null;
  const invalidAltPhoneNum =
    !isValidPhoneNumber(personalInfo.alt_phone || '') &&
    personalInfo.alt_phone !== null;

  const debouncedFinishedTyping = useDebounce(
    async (key: string, value: string | null) => {
      setPersonalInfo((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    300
  );

  const renderTextField = (
    field: keyof ZetkinCreatePerson,
    label = '',
    style = {},
    fullWidth = false,
    required = false
  ) => {
    return (
      <TextField
        fullWidth={fullWidth}
        label={label ? label : globalMessages.personFields[field]()}
        onChange={(e) => debouncedFinishedTyping(field, e.target.value)}
        required={required}
        sx={style}
      />
    );
  };

  const renderTextfieldWithHelperOnError = (
    field: keyof ZetkinCreatePerson,
    label = ''
  ) => {
    return (
      <TextField
        error={
          field === 'email'
            ? invalidEmail
            : field === 'phone'
            ? invalidPhoneNum
            : !isURL(personalInfo[field] || '') && personalInfo[field] !== null
        }
        helperText={
          (field === 'email'
            ? invalidEmail
            : field === 'phone'
            ? invalidPhoneNum
            : !isURL(personalInfo[field] || '') &&
              personalInfo[field] !== null) && (
            <Msg
              id={messageIds.createPerson.validationWarning}
              values={{
                field:
                  field === 'email' || field === 'phone'
                    ? globalMessages.personFields[field]()
                    : messages.createPerson.url(),
              }}
            />
          )
        }
        label={label || globalMessages.personFields[field]()}
        onBlur={() => {
          if (personalInfo[field] === '') {
            debouncedFinishedTyping(field, null);
          }
        }}
        onChange={(e) => debouncedFinishedTyping(field, e.target.value)}
      />
    );
  };

  useEffect(() => {
    if (showAllFields && showAllWithEnter) {
      inputRef.current?.focus();
    }
  }, [showAllWithEnter, showAllFields]);

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
        <Box
          display="flex"
          flex={1}
          flexDirection="column"
          gap={2}
          sx={{
            height: showAllFields ? '600px' : '',
            overflowY: 'auto',
            p: '0 40px 20px 0',
          }}
        >
          <Box display="flex" mt={1}>
            <Box mr={2} width="50%">
              {renderTextField('first_name', '', {}, true, true)}
            </Box>
            <Box width="50%">
              {renderTextField('last_name', '', {}, true, true)}
            </Box>
          </Box>
          {renderTextfieldWithHelperOnError('email')}
          {renderTextfieldWithHelperOnError('phone')}
          {showAllFields && (
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                error={invalidAltPhoneNum}
                helperText={
                  invalidAltPhoneNum && (
                    <Msg
                      id={messageIds.createPerson.validationWarning}
                      values={{
                        field: globalMessages.personFields.alt_phone(),
                      }}
                    />
                  )
                }
                inputRef={inputRef}
                label={globalMessages.personFields.alt_phone()}
                onBlur={() => {
                  if (personalInfo.alt_phone === '') {
                    debouncedFinishedTyping('alt_phone', null);
                  }
                }}
                onChange={(e) =>
                  debouncedFinishedTyping('alt_phone', e.target.value)
                }
              />
              <FormControl fullWidth>
                <InputLabel>
                  <Msg id={globalMessageIds.personFields.gender} />
                </InputLabel>
                <Select
                  defaultValue=""
                  label={globalMessages.personFields.gender()}
                  onChange={(e) =>
                    debouncedFinishedTyping(
                      'gender',
                      e.target.value === 'unknown' ? null : e.target.value
                    )
                  }
                >
                  {genderKeys.map((genderKey) => (
                    <MenuItem key={genderKey} value={genderKey}>
                      {messages.createPerson.genders[genderKey]()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {renderTextField('street_address')}
              {renderTextField('co_address')}
              <Box>
                {renderTextField('zip_code', undefined, {
                  pr: 2,
                  width: '30%',
                })}
                {renderTextField('city', undefined, { width: '70%' })}
              </Box>
              {renderTextField('country')}
              {renderTextField('ext_id')}
            </Box>
          )}
          {showAllFields &&
            customFields.map((field) => {
              if (field.type === 'date') {
                return <DatePicker format="DD-MM-YYYY" label={field.title} />;
              } else if (field.type === 'url') {
                return renderTextfieldWithHelperOnError(
                  field.slug as keyof ZetkinCreatePerson,
                  field.title
                );
              } else {
                return renderTextField(
                  field.slug as keyof ZetkinCreatePerson,
                  field.title
                );
              }
            })}
          <Box display="flex" justifyContent="flex-end">
            {!showAllFields && (
              <Button
                onClick={() => {
                  setShowAllFields(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setShowAllWithEnter(true);
                  }
                }}
                startIcon={<ExpandMore />}
              >
                <Msg id={messageIds.createPerson.showAllFields} />
              </Button>
            )}
          </Box>
          <TagManagerSection
            assignedTags={[] as ZetkinTag[]}
            onAssignTag={(tag) => {}}
            onUnassignTag={(tag) => {}}
          />
        </Box>
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
