import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ExpandMore } from '@mui/icons-material';
import isEmail from 'validator/lib/isEmail';
import isURL from 'validator/lib/isURL';
import { isValidPhoneNumber } from 'libphonenumber-js';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { FC, useEffect, useRef } from 'react';

import globalMessageIds from 'core/i18n/globalMessageIds';
import messageIds from 'zui/l10n/messageIds';
import { TagManagerSection } from 'features/tags/components/TagManager';
import useCustomFields from 'features/profile/hooks/useCustomFields';
import { useNumericRouteParams } from 'core/hooks';
import { ZetkinCreatePerson } from './index';
import { ZetkinTag } from 'utils/types/zetkin';
import { Msg, useMessages } from 'core/i18n';

type GenderKeyType = 'f' | 'm' | 'o' | 'unknown';

interface PersonalInfoFormProps {
  debounced: (field: keyof ZetkinCreatePerson, value: string | null) => void;
  personalInfo: ZetkinCreatePerson;
  onClickShowAll: () => void;
  showAllFields: boolean;
  showAllWithEnter: boolean;
  onClickShowAllWithEnter: () => void;
}
const PersonalInfoForm: FC<PersonalInfoFormProps> = ({
  debounced,
  onClickShowAll,
  personalInfo,
  showAllFields,
  showAllWithEnter,
  onClickShowAllWithEnter,
}) => {
  const { orgId } = useNumericRouteParams();
  const globalMessages = useMessages(globalMessageIds);
  const messages = useMessages(messageIds);
  const inputRef = useRef<HTMLInputElement>();
  const customFields = useCustomFields(orgId).data ?? [];
  const genderKeys = Object.keys(
    messageIds.createPerson.genders
  ) as GenderKeyType[];

  useEffect(() => {
    if (showAllFields && showAllWithEnter) {
      inputRef.current?.focus();
    }
  }, [showAllWithEnter, showAllFields]);

  const invalidEmail =
    !isEmail(personalInfo.email || '') && personalInfo.email !== null;
  const invalidPhoneNum =
    !isValidPhoneNumber(personalInfo.phone || '') &&
    personalInfo.phone !== null;
  const invalidAltPhoneNum =
    !isValidPhoneNumber(personalInfo.alt_phone || '') &&
    personalInfo.alt_phone !== null;

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
        onChange={(e) => debounced(field, e.target.value)}
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
            debounced(field, null);
          }
        }}
        onChange={(e) => debounced(field, e.target.value)}
      />
    );
  };

  return (
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
                debounced('alt_phone', null);
              }
            }}
            onChange={(e) => debounced('alt_phone', e.target.value)}
          />
          <FormControl fullWidth>
            <InputLabel>
              <Msg id={globalMessageIds.personFields.gender} />
            </InputLabel>
            <Select
              defaultValue=""
              label={globalMessages.personFields.gender()}
              onChange={(e) =>
                debounced(
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
            onClick={onClickShowAll}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onClickShowAllWithEnter();
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
  );
};

export default PersonalInfoForm;
