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

import { checkInvalidFields } from '.';
import globalMessageIds from 'core/i18n/globalMessageIds';
import { makeNaiveDateString } from 'utils/dateUtils';
import messageIds from 'zui/l10n/messageIds';
import { TagManagerSection } from 'features/tags/components/TagManager';
import useCustomFields from 'features/profile/hooks/useCustomFields';
import { useNumericRouteParams } from 'core/hooks';
import useTags from 'features/tags/hooks/useTags';
import { Msg, useMessages } from 'core/i18n';
import { ZetkinCreatePerson, ZetkinTag } from 'utils/types/zetkin';
import InfoTextField from './InfoTextField';
import formatUrl from 'utils/formatUrl';

dayjs.extend(utc);

type ShowAllTriggeredType = 'enter' | 'mouse' | 'none';
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
  const [showAllClickedType, setShowAllClickedType] =
    useState<ShowAllTriggeredType>('none');

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
    if (showAllClickedType === 'enter') {
      inputRef.current?.focus();
    }
  }, [showAllClickedType]);

  const invalidFields = checkInvalidFields(customFields, personalInfo);

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
          <InfoTextField
            field={'first_name'}
            onChange={(field, value) => onChange(field, value)}
            required
          />
        </Box>
        <Box width="50%">
          <InfoTextField
            field={'last_name'}
            onChange={(field, value) => onChange(field, value)}
            required
          />
        </Box>
      </Box>
      <InfoTextField
        error={invalidFields.includes('email')}
        field={'email'}
        onChange={(field, value) => onChange(field, value)}
      />
      <InfoTextField
        error={invalidFields.includes('phone')}
        field={'phone'}
        onChange={(field, value) => onChange(field, value)}
      />
      {showAllClickedType !== 'none' && (
        <Box display="flex" flexDirection="column" gap={2}>
          <InfoTextField
            error={invalidFields.includes('alt_phone')}
            field={'alt_phone'}
            inputRef={inputRef}
            onChange={(field, value) => onChange(field, value)}
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
          <InfoTextField
            field={'street_address'}
            onChange={(field, value) => onChange(field, value)}
          />
          <InfoTextField
            field={'co_address'}
            onChange={(field, value) => onChange(field, value)}
          />
          <Box>
            <InfoTextField
              field={'zip_code'}
              onChange={(field, value) => onChange(field, value)}
              style={{
                pr: 2,
                width: '30%',
              }}
            />
            <InfoTextField
              field={'city'}
              onChange={(field, value) => onChange(field, value)}
              style={{
                width: '70%',
              }}
            />
          </Box>
          <InfoTextField
            field={'country'}
            onChange={(field, value) => onChange(field, value)}
          />
          <InfoTextField
            field={'ext_id'}
            onChange={(field, value) => onChange(field, value)}
          />
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
            return (
              <InfoTextField
                error={invalidFields.includes(field.slug)}
                label={field.title}
                field={field.slug}
                isURLField
                onChange={(field, value) =>
                  onChange(field, value ?? formatUrl(value))
                }
              />
            );
          } else {
            return (
              <InfoTextField
                label={field.title}
                field={field.slug}
                onChange={(field, value) => onChange(field, value)}
              />
            );
          }
        })}
      <Box display="flex" justifyContent="flex-end">
        {showAllClickedType === 'none' && (
          <Button
            onClick={() => setShowAllClickedType('mouse')}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
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
          onChange('tags', tag.id);
        }}
        onUnassignTag={(tag) => {
          onChange('tags', tag.id);
        }}
      />
    </Box>
  );
};

export default PersonalInfoForm;
