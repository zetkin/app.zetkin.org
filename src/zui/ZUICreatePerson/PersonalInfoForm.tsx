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
} from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { FC, useEffect, useRef, useState } from 'react';
import { CountryCode } from 'libphonenumber-js';

import checkInvalidFields from './checkInvalidFields';
import formatUrl from 'utils/formatUrl';
import globalMessageIds from 'core/i18n/globalMessageIds';
import { makeNaiveDateString } from 'utils/dateUtils';
import messageIds from 'zui/l10n/messageIds';
import PersonFieldInput from './PersonFieldInput';
import { TagManagerSection } from 'features/tags/components/TagManager';
import useCustomFields from 'features/profile/hooks/useCustomFields';
import { useNumericRouteParams } from 'core/hooks';
import useTags from 'features/tags/hooks/useTags';
import { Msg, useMessages } from 'core/i18n';
import { ZetkinCreatePerson, ZetkinTag } from 'utils/types/zetkin';
import useOrganization from '../../features/organizations/hooks/useOrganization';

dayjs.extend(utc);

type ShowAllTriggeredType = 'keyboard' | 'mouse' | null;
type GenderKeyType = 'f' | 'm' | 'o' | 'unknown';

interface PersonalInfoFormProps {
  onChange: (field: string, value: string | null | number) => void;
  personalInfo: ZetkinCreatePerson;
  tags: number[];
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
  const organization = useOrganization(orgId).data;
  const countryCode = organization?.country as CountryCode;
  const [showAllClickedType, setShowAllClickedType] =
    useState<ShowAllTriggeredType>(null);

  const allTags = useTags(orgId).data ?? [];
  const selectedTags =
    tags.reduce((acc: ZetkinTag[], item) => {
      const tag = allTags.find((t) => t.id === item);
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
    if (showAllClickedType === 'keyboard') {
      inputRef.current?.focus();
    }
  }, [showAllClickedType]);
  const invalidFields = checkInvalidFields(
    customFields,
    personalInfo,
    countryCode
  );

  return (
    <Box
      display="flex"
      flex={1}
      flexDirection="column"
      gap={2}
      sx={{
        height: !showAllClickedType ? '' : '600px',
        overflowY: 'auto',
        p: '0 40px 20px 0',
      }}
    >
      <Box display="flex" mt={1}>
        <Box mr={2} width="50%">
          <PersonFieldInput
            field={'first_name'}
            onChange={(field, value) => onChange(field, value)}
            required
          />
        </Box>
        <Box width="50%">
          <PersonFieldInput
            field={'last_name'}
            onChange={(field, value) => onChange(field, value)}
            required
          />
        </Box>
      </Box>
      <PersonFieldInput
        error={invalidFields.includes('email')}
        field={'email'}
        onChange={(field, value) => onChange(field, value)}
      />
      <PersonFieldInput
        error={invalidFields.includes('phone')}
        field={'phone'}
        onChange={(field, value) => onChange(field, value)}
      />
      {!!showAllClickedType && (
        <Box display="flex" flexDirection="column" gap={2}>
          <PersonFieldInput
            error={invalidFields.includes('alt_phone')}
            field={'alt_phone'}
            inputRef={inputRef}
            onChange={(field, value) =>
              onChange(field, value === ' ' ? '' : value)
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
                onChange(
                  'gender',
                  e.target.value === 'unknown' ? '' : e.target.value
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
          <PersonFieldInput
            field={'street_address'}
            onChange={(field, value) => onChange(field, value)}
          />
          <PersonFieldInput
            field={'co_address'}
            onChange={(field, value) => onChange(field, value)}
          />
          <Box>
            <PersonFieldInput
              field={'zip_code'}
              onChange={(field, value) => onChange(field, value)}
              style={{
                pr: 2,
                width: '30%',
              }}
            />
            <PersonFieldInput
              field={'city'}
              onChange={(field, value) => onChange(field, value)}
              style={{
                width: '70%',
              }}
            />
          </Box>
          <PersonFieldInput
            field={'country'}
            onChange={(field, value) => onChange(field, value)}
          />
          <PersonFieldInput
            field={'ext_id'}
            onChange={(field, value) => onChange(field, value)}
          />
        </Box>
      )}
      {!!showAllClickedType &&
        customFields.map((field) => {
          if (field.type === 'json') {
            return;
          } else if (field.type === 'date') {
            return (
              <DatePicker
                key={field.slug}
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
            return (
              <PersonFieldInput
                key={field.slug}
                error={invalidFields.includes(field.slug)}
                field={field.slug}
                isURLField
                label={field.title}
                onChange={(field, value) => {
                  const formattedUrl = formatUrl(value as string);
                  onChange(field, formattedUrl ?? value);
                }}
              />
            );
          } else {
            return (
              <PersonFieldInput
                key={field.slug}
                field={field.slug}
                label={field.title}
                onChange={(field, value) => onChange(field, value)}
              />
            );
          }
        })}
      <Box display="flex" justifyContent="flex-end">
        {!showAllClickedType && (
          <Button
            onClick={() => setShowAllClickedType('mouse')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setShowAllClickedType('keyboard');
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
          onChange('tags', tag.id);
        }}
        onUnassignTag={(tag) => {
          onChange('tags', tag.id);
        }}
        submitCreateTagLabel={messages.createPerson.tagCreateAndApplyLabel()}
      />
    </Box>
  );
};

export default PersonalInfoForm;
