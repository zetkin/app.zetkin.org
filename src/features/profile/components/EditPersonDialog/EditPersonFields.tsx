import { DatePicker } from '@mui/x-date-pickers-pro';
import { FC } from 'react';
import UndoIcon from '@mui/icons-material/Undo';
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';

import EditPersonField from './EditPersonField';
import formatUrl from 'utils/formatUrl';
import globalMessageIds from 'core/i18n/globalMessageIds';
import { makeNaiveDateString } from 'utils/dateUtils';
import messageIds from 'zui/l10n/messageIds';
import { NATIVE_PERSON_FIELDS } from 'features/views/components/types';
import useCustomFields from '../../hooks/useCustomFields';
import {
  CUSTOM_FIELD_TYPE,
  ZetkinCreatePerson,
  ZetkinPerson,
} from 'utils/types/zetkin';
import { Msg, useMessages } from 'core/i18n';

enum GENDERS {
  FEMALE = 'f',
  MALE = 'm',
  OTHER = 'o',
  UNKNOWN = 'unknown',
}

interface EditPersonFieldsProps {
  fieldsToUpdate: ZetkinCreatePerson;
  invalidFields: string[];
  onChange: (field: string, newValue: string) => void;
  onReset: (field: string) => void;
  orgId: number;
  fieldValues: ZetkinPerson;
}

const EditPersonFields: FC<EditPersonFieldsProps> = ({
  fieldsToUpdate,
  invalidFields,
  onChange,
  onReset,
  orgId,
  fieldValues,
}) => {
  const customFields = useCustomFields(orgId).data ?? [];
  const globalMessages = useMessages(globalMessageIds);

  return (
    <Box display="flex" flexDirection="column" gap={2} paddingTop={1}>
      <Box display="flex" gap={2}>
        <EditPersonField
          field={NATIVE_PERSON_FIELDS.FIRST_NAME}
          hasChanges={NATIVE_PERSON_FIELDS.FIRST_NAME in fieldsToUpdate}
          onChange={(field, newValue) => onChange(field, newValue)}
          onReset={() => onReset(NATIVE_PERSON_FIELDS.FIRST_NAME)}
          required
          value={fieldValues.first_name}
        />
        <EditPersonField
          field={NATIVE_PERSON_FIELDS.LAST_NAME}
          hasChanges={NATIVE_PERSON_FIELDS.LAST_NAME in fieldsToUpdate}
          onChange={(field, newValue) => onChange(field, newValue)}
          onReset={() => onReset(NATIVE_PERSON_FIELDS.LAST_NAME)}
          required
          value={fieldValues.last_name}
        />
      </Box>
      <EditPersonField
        error={invalidFields.includes(NATIVE_PERSON_FIELDS.EMAIL)}
        field={NATIVE_PERSON_FIELDS.EMAIL}
        hasChanges={NATIVE_PERSON_FIELDS.EMAIL in fieldsToUpdate}
        onChange={(field, newValue) => onChange(field, newValue)}
        onReset={() => onReset(NATIVE_PERSON_FIELDS.EMAIL)}
        value={fieldValues.email ?? ''}
      />
      <EditPersonField
        error={invalidFields.includes(NATIVE_PERSON_FIELDS.PHONE)}
        field={NATIVE_PERSON_FIELDS.PHONE}
        hasChanges={NATIVE_PERSON_FIELDS.PHONE in fieldsToUpdate}
        onChange={(field, newValue) => onChange(field, newValue)}
        onReset={() => onReset(NATIVE_PERSON_FIELDS.PHONE)}
        value={fieldValues.phone ?? ''}
      />
      <EditPersonField
        error={invalidFields.includes(NATIVE_PERSON_FIELDS.ALT_PHONE)}
        field={NATIVE_PERSON_FIELDS.ALT_PHONE}
        hasChanges={NATIVE_PERSON_FIELDS.ALT_PHONE in fieldsToUpdate}
        onChange={(field, newValue) =>
          onChange(field, newValue === ' ' ? '' : newValue)
        }
        onReset={() => onReset(NATIVE_PERSON_FIELDS.ALT_PHONE)}
        value={fieldValues.alt_phone ?? ''}
      />
      <Box display="flex">
        <FormControl fullWidth>
          <InputLabel>
            <Msg id={globalMessageIds.personFields.gender} />
          </InputLabel>
          <Select
            label={globalMessages.personFields.gender()}
            onChange={(e) =>
              onChange(
                NATIVE_PERSON_FIELDS.GENDER,
                e.target.value === GENDERS.UNKNOWN ? '' : e.target.value
              )
            }
            value={!fieldValues.gender ? GENDERS.UNKNOWN : fieldValues.gender}
          >
            {Object.values(GENDERS).map((gender) => (
              <MenuItem key={gender} value={gender}>
                <Msg id={messageIds.createPerson.genders[gender]} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {NATIVE_PERSON_FIELDS.GENDER in fieldsToUpdate && (
          <IconButton onClick={() => onReset(NATIVE_PERSON_FIELDS.GENDER)}>
            <UndoIcon />
          </IconButton>
        )}
      </Box>
      <EditPersonField
        field={NATIVE_PERSON_FIELDS.STREET_ADDRESS}
        hasChanges={NATIVE_PERSON_FIELDS.STREET_ADDRESS in fieldsToUpdate}
        onChange={(field, newValue) => onChange(field, newValue)}
        onReset={() => onReset(NATIVE_PERSON_FIELDS.STREET_ADDRESS)}
        value={fieldValues.street_address ?? ''}
      />
      <EditPersonField
        field={NATIVE_PERSON_FIELDS.CO_ADDRESS}
        hasChanges={NATIVE_PERSON_FIELDS.CO_ADDRESS in fieldsToUpdate}
        onChange={(field, newValue) => onChange(field, newValue)}
        onReset={() => onReset(NATIVE_PERSON_FIELDS.CO_ADDRESS)}
        value={fieldValues.co_address ?? ''}
      />
      <Box display="flex" gap={2}>
        <Box flex={0.3}>
          <EditPersonField
            field={NATIVE_PERSON_FIELDS.ZIP_CODE}
            hasChanges={NATIVE_PERSON_FIELDS.ZIP_CODE in fieldsToUpdate}
            onChange={(field, newValue) => onChange(field, newValue)}
            onReset={() => onReset(NATIVE_PERSON_FIELDS.ZIP_CODE)}
            value={fieldValues.zip_code ?? ''}
          />
        </Box>
        <EditPersonField
          field={NATIVE_PERSON_FIELDS.CITY}
          hasChanges={NATIVE_PERSON_FIELDS.CITY in fieldsToUpdate}
          onChange={(field, newValue) => onChange(field, newValue)}
          onReset={() => onReset(NATIVE_PERSON_FIELDS.CITY)}
          value={fieldValues.city ?? ''}
        />
      </Box>
      <EditPersonField
        field={NATIVE_PERSON_FIELDS.COUNTRY}
        hasChanges={NATIVE_PERSON_FIELDS.COUNTRY in fieldsToUpdate}
        onChange={(field, newValue) => onChange(field, newValue)}
        onReset={() => onReset(NATIVE_PERSON_FIELDS.COUNTRY)}
        value={fieldValues.country ?? ''}
      />
      <EditPersonField
        field={NATIVE_PERSON_FIELDS.EXT_ID}
        hasChanges={NATIVE_PERSON_FIELDS.EXT_ID in fieldsToUpdate}
        onChange={(field, newValue) => onChange(field, newValue)}
        onReset={() => onReset(NATIVE_PERSON_FIELDS.EXT_ID)}
        value={fieldValues.ext_id ? fieldValues.ext_id : ''}
      />
      {customFields.map((field) => {
        if (field.type === CUSTOM_FIELD_TYPE.JSON) {
          return;
        } else if (field.type === CUSTOM_FIELD_TYPE.DATE) {
          return (
            <Box display="flex">
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
                sx={{ width: '100%' }}
                value={
                  fieldValues[field.slug]
                    ? dayjs(fieldValues[field.slug]?.toString())
                    : null
                }
              />
              {field.slug in fieldsToUpdate && (
                <IconButton onClick={() => onReset(field.slug)}>
                  <UndoIcon />
                </IconButton>
              )}
            </Box>
          );
        } else if (field.type === CUSTOM_FIELD_TYPE.URL) {
          return (
            <EditPersonField
              key={field.slug}
              error={invalidFields.includes(field.slug)}
              field={field.slug}
              hasChanges={field.slug in fieldsToUpdate}
              isURLField
              label={field.title}
              onChange={(field, newValue) => {
                const formattedUrl = formatUrl(newValue as string);
                onChange(field, formattedUrl ?? newValue);
              }}
              onReset={() => onReset(field.slug)}
              value={fieldValues[field.slug]?.toString() ?? ''}
            />
          );
        } else {
          return (
            <EditPersonField
              key={field.slug}
              field={field.slug}
              hasChanges={field.slug in fieldsToUpdate}
              label={field.title}
              onChange={(field, newValue) => onChange(field, newValue)}
              onReset={() => onReset(field.slug)}
              value={fieldValues[field.slug]?.toString() ?? ''}
            />
          );
        }
      })}
    </Box>
  );
};

export default EditPersonFields;
