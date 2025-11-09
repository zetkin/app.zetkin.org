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
import globalMessageIds from 'core/i18n/messageIds';
import { makeNaiveDateString } from 'utils/dateUtils';
import messageIds from 'zui/l10n/messageIds';
import PersonField from './PersonField';
import { TagManagerSection } from 'features/tags/components/TagManager';
import useCustomFields from 'features/profile/hooks/useCustomFields';
import useTags from 'features/tags/hooks/useTags';
import { Msg, useMessages } from 'core/i18n';
import {
  CUSTOM_FIELD_TYPE,
  Gender,
  ZetkinAppliedTag,
  ZetkinCreatePerson,
  ZetkinPerson,
} from 'utils/types/zetkin';
import useOrganization from '../../features/organizations/hooks/useOrganization';

dayjs.extend(utc);

type ShowAllTriggeredType = 'keyboard' | 'mouse' | null;

interface PersonalInfoFormProps {
  personalInfo: ZetkinCreatePerson;
  orgId: number;
  onChange: (field: string, value: string | null | number) => void;
  onReset?: (field: string) => void;
  tags: number[];
  editMode?: boolean;
  defaultFormValues?: ZetkinPerson;
}

const PersonalInfoForm: FC<PersonalInfoFormProps> = ({
  personalInfo,
  orgId,
  onChange,
  tags,
  editMode,
  onReset,
  defaultFormValues,
}) => {
  const globalMessages = useMessages(globalMessageIds);
  const messages = useMessages(messageIds);
  const inputRef = useRef<HTMLInputElement>();
  const organization = useOrganization(orgId).data;
  const countryCode = organization?.country as CountryCode;
  const [showAllClickedType, setShowAllClickedType] =
    useState<ShowAllTriggeredType>(null);

  const allTags = useTags(orgId).data ?? [];
  const selectedTags =
    tags.reduce((acc: ZetkinAppliedTag[], item) => {
      const tag = allTags.find((t) => t.id === item);
      if (tag) {
        return acc.concat({ ...tag, value: null });
      }
      return acc;
    }, []) ?? [];
  const customFields = useCustomFields(orgId).data ?? [];

  const shouldShowAllFields = editMode || !!showAllClickedType;

  const hasFieldChanged = (field: string) => {
    if (!editMode || !defaultFormValues) return false;
    return personalInfo[field] !== defaultFormValues[field];
  };

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
        height: !shouldShowAllFields ? '' : '600px',
        overflowY: 'auto',
        p: '0 40px 20px 0',
      }}
    >
      <Box display="flex" mt={1}>
        <Box mr={2} width="50%">
          <PersonField
            editMode={editMode}
            error={invalidFields.includes('first_name')}
            field={'first_name'}
            fieldType="text"
            hasChanges={hasFieldChanged('first_name')}
            onChange={(field, value) => onChange(field, value)}
            onReset={() => onReset?.('first_name')}
            required
            value={personalInfo.first_name || ''}
          />
        </Box>
        <Box width="50%">
          <PersonField
            editMode={editMode}
            error={invalidFields.includes('last_name')}
            field={'last_name'}
            fieldType="text"
            hasChanges={hasFieldChanged('last_name')}
            onChange={(field, value) => onChange(field, value)}
            onReset={() => onReset?.('last_name')}
            required
            value={personalInfo.last_name || ''}
          />
        </Box>
      </Box>
      <PersonField
        editMode={editMode}
        error={invalidFields.includes('email')}
        field={'email'}
        fieldType="text"
        hasChanges={hasFieldChanged('email')}
        onChange={(field, value) => onChange(field, value)}
        onReset={() => onReset?.('email')}
        value={personalInfo.email || ''}
      />
      <PersonField
        editMode={editMode}
        error={invalidFields.includes('phone')}
        field={'phone'}
        fieldType="text"
        hasChanges={hasFieldChanged('phone')}
        onChange={(field, value) => onChange(field, value)}
        onReset={() => onReset?.('phone')}
        value={personalInfo.phone || ''}
      />
      {shouldShowAllFields && (
        <Box display="flex" flexDirection="column" gap={2}>
          <PersonField
            editMode={editMode}
            error={invalidFields.includes('alt_phone')}
            field={'alt_phone'}
            fieldType="text"
            hasChanges={hasFieldChanged('alt_phone')}
            inputRef={inputRef}
            onChange={(field, value) =>
              onChange(field, value === ' ' ? '' : value)
            }
            onReset={() => onReset?.('alt_phone')}
            value={personalInfo.alt_phone || ''}
          />
          <PersonField
            editMode={editMode}
            field="gender"
            fieldType="select"
            hasChanges={hasFieldChanged('gender')}
            onChange={(field, value) =>
              onChange(field, value === Gender.UNKNOWN ? '' : value)
            }
            onReset={() => onReset?.('gender')}
            options={Object.values(Gender).map((key) => ({
              value: key,
              label: messages.createPerson.genders[key](),
            }))}
            value={!personalInfo.gender ? Gender.UNKNOWN : personalInfo.gender}
          />
          <PersonField
            editMode={editMode}
            field={'street_address'}
            fieldType="text"
            hasChanges={hasFieldChanged('street_address')}
            onChange={(field, value) => onChange(field, value)}
            onReset={() => onReset?.('street_address')}
            value={personalInfo.street_address || ''}
          />
          <PersonField
            editMode={editMode}
            field={'co_address'}
            fieldType="text"
            hasChanges={hasFieldChanged('co_address')}
            onChange={(field, value) => onChange(field, value)}
            onReset={() => onReset?.('co_address')}
            value={personalInfo.co_address || ''}
          />
          <Box>
            <PersonField
              editMode={editMode}
              field={'zip_code'}
              fieldType="text"
              hasChanges={hasFieldChanged('zip_code')}
              onChange={(field, value) => onChange(field, value)}
              onReset={() => onReset?.('zip_code')}
              style={{
                pr: 2,
                width: '30%',
              }}
              value={personalInfo.zip_code || ''}
            />
            <PersonField
              editMode={editMode}
              field={'city'}
              fieldType="text"
              hasChanges={hasFieldChanged('city')}
              onChange={(field, value) => onChange(field, value)}
              onReset={() => onReset?.('city')}
              style={{
                width: '70%',
              }}
              value={personalInfo.city || ''}
            />
          </Box>
          <PersonField
            editMode={editMode}
            field={'country'}
            fieldType="text"
            hasChanges={hasFieldChanged('country')}
            onChange={(field, value) => onChange(field, value)}
            onReset={() => onReset?.('country')}
            value={personalInfo.country || ''}
          />
          <PersonField
            editMode={editMode}
            field={'ext_id'}
            fieldType="text"
            hasChanges={hasFieldChanged('ext_id')}
            onChange={(field, value) => onChange(field, value)}
            onReset={() => onReset?.('ext_id')}
            value={personalInfo.ext_id || ''}
          />
        </Box>
      )}
      {shouldShowAllFields &&
        customFields.map((field) => {
          if (
            field.organization.id !== orgId &&
            field.org_write !== 'suborgs'
          ) {
            // Don't show read-only fields from ancestor orgs
            return;
          }
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
              <PersonField
                key={field.slug}
                editMode={editMode}
                error={invalidFields.includes(field.slug)}
                field={field.slug}
                fieldType="text"
                hasChanges={hasFieldChanged(field.slug)}
                isURLField
                label={field.title}
                onChange={(field, value) => {
                  const formattedUrl = formatUrl(value as string);
                  onChange(field, formattedUrl ?? value);
                }}
                onReset={() => onReset?.(field.slug)}
                value={personalInfo[field.slug] || ''}
              />
            );
          } else if (
            field.type === CUSTOM_FIELD_TYPE.ENUM &&
            field.enum_choices
          ) {
            const enumOptions = [
              {
                value: '',
                label: (
                  <span style={{ fontStyle: 'italic' }}>
                    <Msg id={messageIds.createPerson.enumFields.noneOption} />
                  </span>
                ),
              },
              ...field.enum_choices.map((c) => ({
                value: c.key,
                label: c.label,
              })),
            ];
            return (
              <PersonField
                key={field.slug}
                editMode={editMode}
                field={field.slug}
                fieldType="select"
                hasChanges={hasFieldChanged(field.slug)}
                label={field.title}
                onChange={(field, value) => {
                  const finalValue = value === '' ? null : value;
                  onChange(field, finalValue);
                }}
                onReset={() => onReset?.(field.slug)}
                options={enumOptions}
                value={personalInfo[field.slug]?.toString() || ''}
              />
            );
          } else {
            return (
              <PersonField
                key={field.slug}
                editMode={editMode}
                field={field.slug}
                fieldType="text"
                hasChanges={hasFieldChanged(field.slug)}
                label={field.title}
                onChange={(field, value) => onChange(field, value)}
                onReset={() => onReset?.(field.slug)}
                value={personalInfo[field.slug] || ''}
              />
            );
          }
        })}
      {!editMode && (
        <>
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
        </>
      )}
    </Box>
  );
};

export default PersonalInfoForm;
