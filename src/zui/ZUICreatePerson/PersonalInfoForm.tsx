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
import { FC, useEffect, useRef, useState } from 'react';

import { checkInvalidFields } from '.';
import globalMessageIds from 'core/i18n/globalMessageIds';
import { makeNaiveDateString } from 'utils/dateUtils';
import messageIds from 'zui/l10n/messageIds';
import { TagManagerSection } from 'features/tags/components/TagManager';
import useCustomFields from 'features/profile/hooks/useCustomFields';
import { useNumericRouteParams } from 'core/hooks';
import useTags from 'features/tags/hooks/useTags';
import { Msg, useMessages } from 'core/i18n';
import {
  ZetkinCreatePerson,
  ZetkinPersonNativeFields,
  ZetkinTag,
} from 'utils/types/zetkin';

dayjs.extend(utc);

type ShowAllTriggeredType = 'enter' | 'mouse' | 'none';
type GenderKeyType = 'f' | 'm' | 'o' | 'unknown';

interface PersonalInfoFormProps {
  onChange: (field: string, value: string | null) => void;
  personalInfo: ZetkinCreatePerson;
  tags: string[];
}
const PersonalInfoForm: FC<PersonalInfoFormProps> = ({
  onChange,
  personalInfo,
  tags,
}) => {
  const { orgId } = useNumericRouteParams();
  const globalMessages = useMessages(globalMessageIds);
  const messages = useMessages(messageIds);
  const inputRef = useRef<HTMLInputElement>();
  const [showAllClickedType, setShowAllClickedType] =
    useState<ShowAllTriggeredType>('none');

  const allTags = useTags(orgId).data ?? [];
  const selectedTags =
    tags.reduce((acc: ZetkinTag[], item) => {
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

  const invalidFields = checkInvalidFields(customFields, personalInfo);

  const renderTextField = (
    field: keyof ZetkinCreatePerson,
    label = '',
    style = {},
    required = false
  ) => {
    return (
      <TextField
        fullWidth
        label={
          label
            ? label
            : globalMessages.personFields[
                field as keyof ZetkinPersonNativeFields
              ]()
        }
        onChange={(e) => onChange(field, e.target.value)}
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
        error={invalidFields.includes(field)}
        helperText={
          invalidFields.includes(field) && (
            <Msg
              id={messageIds.createPerson.validationWarning}
              values={{
                field: messages.createPerson.url(),
              }}
            />
          )
        }
        label={
          label ||
          globalMessages.personFields[field as keyof ZetkinPersonNativeFields]()
        }
        onBlur={() => {
          if (personalInfo[field] === '') {
            onChange(field, null);
          }
        }}
        onChange={(e) => onChange(field, e.target.value)}
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
          {renderTextField('first_name', '', {}, false)}
        </Box>
        <Box width="50%">{renderTextField('last_name', '', {}, false)}</Box>
      </Box>
      {renderTextfieldWithHelperOnError('email')}
      {renderTextfieldWithHelperOnError('phone')}
      {showAllClickedType !== 'none' && (
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            error={invalidFields.includes('alt_phone')}
            helperText={
              invalidFields.includes('alt_phone') && (
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
                onChange('alt_phone', null);
              }
            }}
            onChange={(e) => onChange('alt_phone', e.target.value)}
          />
          <FormControl fullWidth>
            <InputLabel>
              <Msg id={globalMessageIds.personFields.gender} />
            </InputLabel>
            <Select
              defaultValue=""
              label={globalMessages.personFields.gender()}
              onChange={(e) =>
                onChange(
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
      {showAllClickedType !== 'none' &&
        customFields.map((field) => {
          if (field.type === 'json') {
            return;
          } else if (field.type === 'date') {
            return (
              <DatePicker
                format="DD-MM-YYYY"
                label={field.title}
                onChange={(date: Dayjs | null) => {
                  if (date) {
                    const dateStr = makeNaiveDateString(date.utc().toDate());
                    onChange(field.slug, dateStr);
                  }
                }}
                value={null}
              />
            );
          } else if (field.type === 'url') {
            return renderTextfieldWithHelperOnError(field.slug, field.title);
          } else {
            return renderTextField(field.slug, field.title, {});
          }
        })}
      <Box display="flex" justifyContent="flex-end">
        {showAllClickedType === 'none' && (
          <Button
            onClick={() => setShowAllClickedType('mouse')}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                // onClickShowAll('enter');
                setShowAllClickedType('enter');
              }
            }}
            startIcon={<ExpandMore />}
          >
            <Msg id={messageIds.createPerson.showAllFields} />
          </Button>
        )}
      </Box>
      <TagManagerSection
        assignedTags={selectedTags}
        disableEditTags
        disableValueTags
        onAssignTag={(tag) => {
          onChange('tags', tag.id.toString());
        }}
        onUnassignTag={(tag) => {
          onChange('tags', tag.id.toString());
        }}
      />
    </Box>
  );
};

export default PersonalInfoForm;
