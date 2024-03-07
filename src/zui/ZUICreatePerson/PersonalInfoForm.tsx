import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ExpandMore } from '@mui/icons-material';
import utc from 'dayjs/plugin/utc';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { FC, useEffect, useRef } from 'react';

import globalMessageIds from 'core/i18n/globalMessageIds';
import { makeNaiveDateString } from 'utils/dateUtils';
import messageIds from 'zui/l10n/messageIds';
import { TagManagerSection } from 'features/tags/components/TagManager';
import useCustomFields from 'features/profile/hooks/useCustomFields';
import { useNumericRouteParams } from 'core/hooks';
import useTags from 'features/tags/hooks/useTags';
import { Msg, useMessages } from 'core/i18n';
import { checkInvalidFields, ShowAllTriggeredType } from '.';
import { ZetkinCreatePerson, ZetkinTag } from 'utils/types/zetkin';

dayjs.extend(utc);

type GenderKeyType = 'f' | 'm' | 'o' | 'unknown';
type ZetkinCreatePersonFields = keyof Omit<
  ZetkinCreatePerson,
  'tags' | 'customFields'
>;

interface PersonalInfoFormProps {
  debounced: (
    field: keyof ZetkinCreatePerson,
    value: string | null,
    custom: boolean
  ) => void;
  personalInfo: ZetkinCreatePerson;
  onClickShowAll: (value: ShowAllTriggeredType) => void;
  showAllClickedType: ShowAllTriggeredType;
}
const PersonalInfoForm: FC<PersonalInfoFormProps> = ({
  debounced,
  onClickShowAll,
  personalInfo,
  showAllClickedType,
}) => {
  const { orgId } = useNumericRouteParams();
  const globalMessages = useMessages(globalMessageIds);
  const messages = useMessages(messageIds);
  const inputRef = useRef<HTMLInputElement>();
  const allTags = useTags(orgId).data ?? [];
  const tags =
    personalInfo.tags.reduce((acc: ZetkinTag[], item) => {
      const tag = allTags.find((t) => t.id.toString() === item);
      if (tag) {
        return acc.concat(tag);
      }
      return acc;
    }, []) ?? [];

  const customFields = useCustomFields(orgId).data ?? [];
  const genderKeys = Object.keys(
    messageIds.createPerson.genders
  ) as GenderKeyType[];

  useEffect(() => {
    if (showAllClickedType === 'enter') {
      inputRef.current?.focus();
    }
  }, [showAllClickedType]);

  const invalidField = checkInvalidFields(customFields, personalInfo);

  const renderTextField = (
    field: ZetkinCreatePersonFields,
    label = '',
    style = {},
    custom = false,
    required = false
  ) => {
    return (
      <TextField
        fullWidth
        label={label ? label : globalMessages.personFields[field]()}
        onChange={(e) => debounced(field, e.target.value, custom)}
        required={required}
        sx={style}
      />
    );
  };

  const renderTextfieldWithHelperOnError = (
    field: ZetkinCreatePersonFields,
    label = '',
    custom = false
  ) => {
    return (
      <TextField
        error={invalidField.includes(field)}
        helperText={
          invalidField.includes(field) && (
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
          if (
            personalInfo[field] === '' ||
            personalInfo.customFields[field] === ''
          ) {
            debounced(field, null, custom);
          }
        }}
        onChange={(e) => debounced(field, e.target.value, custom)}
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
        height: showAllClickedType === 'none' ? '' : '600px',
        overflowY: 'auto',
        p: '0 40px 20px 0',
      }}
    >
      <Box display="flex" mt={1}>
        <Box mr={2} width="50%">
          {renderTextField('first_name', '', {}, false, true)}
        </Box>
        <Box width="50%">
          {renderTextField('last_name', '', {}, false, true)}
        </Box>
      </Box>
      {renderTextfieldWithHelperOnError('email')}
      {renderTextfieldWithHelperOnError('phone')}
      {showAllClickedType !== 'none' && (
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            error={invalidField.includes('alt_phone')}
            helperText={
              invalidField.includes('alt_phone') && (
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
                debounced('alt_phone', null, false);
              }
            }}
            onChange={(e) => debounced('alt_phone', e.target.value, false)}
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
                  e.target.value === 'unknown' ? null : e.target.value,
                  false
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
      {showAllClickedType !== 'none' &&
        customFields.map((field) => {
          if (field.type === 'date') {
            return (
              <DatePicker
                format="DD-MM-YYYY"
                label={field.title}
                onChange={(date: Dayjs | null) => {
                  if (date) {
                    const dateStr = makeNaiveDateString(date.utc().toDate());
                    debounced(
                      field.slug as ZetkinCreatePersonFields,
                      dateStr,
                      true
                    );
                  }
                }}
                value={null}
              />
            );
          } else if (field.type === 'url') {
            return renderTextfieldWithHelperOnError(
              field.slug as ZetkinCreatePersonFields,
              field.title,
              true
            );
          } else {
            return renderTextField(
              field.slug as ZetkinCreatePersonFields,
              field.title,
              {},
              true
            );
          }
        })}
      <Box display="flex" justifyContent="flex-end">
        {showAllClickedType === 'none' && (
          <Button
            onClick={() => onClickShowAll('mouse')}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onClickShowAll('enter');
              }
            }}
            startIcon={<ExpandMore />}
          >
            <Msg id={messageIds.createPerson.showAllFields} />
          </Button>
        )}
      </Box>
      <TagManagerSection
        assignedTags={tags}
        disableEditTags
        disableValueTags
        onAssignTag={(tag) => {
          debounced('tags', tag.id.toString(), false);
        }}
        onUnassignTag={(tag) => {
          debounced('tags', tag.id.toString(), false);
        }}
      />
    </Box>
  );
};

export default PersonalInfoForm;
