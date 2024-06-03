import { DatePicker } from '@mui/x-date-pickers-pro';
import { FC } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';

import formatUrl from 'utils/formatUrl';
import globalMessageIds from 'core/i18n/globalMessageIds';
import { makeNaiveDateString } from 'utils/dateUtils';
import messageIds from 'zui/l10n/messageIds';
import { NATIVE_PERSON_FIELDS } from 'features/views/components/types';
import PersonFieldInput from 'zui/ZUICreatePerson/PersonFieldInput';
import useCustomFields from '../../hooks/useCustomFields';
import { CUSTOM_FIELD_TYPE, ZetkinPerson } from 'utils/types/zetkin';
import { Msg, useMessages } from 'core/i18n';

enum GENDERS {
  FEMALE = 'f',
  MALE = 'm',
  OTHER = 'o',
  UNKNOWN = 'unknown',
}

interface EditPersonFieldsProps {
  invalidFields: string[];
  onChange: (field: string, newValue: string) => void;
  orgId: number;
  fieldValues: ZetkinPerson;
}

const EditPersonFields: FC<EditPersonFieldsProps> = ({
  invalidFields,
  onChange,
  orgId,
  fieldValues,
}) => {
  const customFields = useCustomFields(orgId).data ?? [];
  const globalMessages = useMessages(globalMessageIds);

  return (
    <Box display="flex" flexDirection="column" gap={2} paddingTop={1}>
      <Box display="flex" gap={2}>
        <PersonFieldInput
          field={NATIVE_PERSON_FIELDS.FIRST_NAME}
          onChange={(field, newValue) => onChange(field, newValue)}
          required
          value={fieldValues.first_name}
        />
        <PersonFieldInput
          field={NATIVE_PERSON_FIELDS.LAST_NAME}
          onChange={(field, newValue) => onChange(field, newValue)}
          required
          value={fieldValues.last_name}
        />
      </Box>
      <PersonFieldInput
        error={invalidFields.includes(NATIVE_PERSON_FIELDS.EMAIL)}
        field={NATIVE_PERSON_FIELDS.EMAIL}
        onChange={(field, newValue) => onChange(field, newValue)}
        value={fieldValues.email ?? ''}
      />
      <PersonFieldInput
        error={invalidFields.includes(NATIVE_PERSON_FIELDS.PHONE)}
        field={NATIVE_PERSON_FIELDS.PHONE}
        onChange={(field, newValue) => onChange(field, newValue)}
        value={fieldValues.phone ?? ''}
      />
      <PersonFieldInput
        error={invalidFields.includes(NATIVE_PERSON_FIELDS.ALT_PHONE)}
        field={NATIVE_PERSON_FIELDS.ALT_PHONE}
        onChange={(field, newValue) =>
          onChange(field, newValue === ' ' ? '' : newValue)
        }
        value={fieldValues.alt_phone ?? ''}
      />
      <FormControl fullWidth>
        <InputLabel>
          <Msg id={globalMessageIds.personFields.gender} />
        </InputLabel>
        <Select
          defaultValue={fieldValues.gender ?? ''}
          label={globalMessages.personFields.gender()}
          onChange={(e) =>
            onChange(
              NATIVE_PERSON_FIELDS.GENDER,
              e.target.value === GENDERS.UNKNOWN ? '' : e.target.value
            )
          }
        >
          {Object.values(GENDERS).map((gender) => (
            <MenuItem key={gender} value={gender}>
              <Msg id={messageIds.createPerson.genders[gender]} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <PersonFieldInput
        field={NATIVE_PERSON_FIELDS.STREET_ADDRESS}
        onChange={(field, newValue) => onChange(field, newValue)}
        value={fieldValues.street_address ?? ''}
      />
      <PersonFieldInput
        field={NATIVE_PERSON_FIELDS.CO_ADDRESS}
        onChange={(field, newValue) => onChange(field, newValue)}
        value={fieldValues.co_address ?? ''}
      />
      <Box>
        <PersonFieldInput
          field={NATIVE_PERSON_FIELDS.ZIP_CODE}
          onChange={(field, newValue) => onChange(field, newValue)}
          style={{
            pr: 2,
            width: '30%',
          }}
          value={fieldValues.zip_code ?? ''}
        />
        <PersonFieldInput
          field={NATIVE_PERSON_FIELDS.CITY}
          onChange={(field, newValue) => onChange(field, newValue)}
          style={{
            width: '70%',
          }}
          value={fieldValues.city ?? ''}
        />
      </Box>
      <PersonFieldInput
        field={NATIVE_PERSON_FIELDS.COUNTRY}
        onChange={(field, newValue) => onChange(field, newValue)}
        value={fieldValues.country ?? ''}
      />
      <PersonFieldInput
        field={'ext_id'}
        onChange={(field, newValue) => onChange(field, newValue)}
        value={fieldValues.ext_id ? fieldValues.ext_id : undefined}
      />
      {customFields.map((field) => {
        if (field.type === CUSTOM_FIELD_TYPE.JSON) {
          return;
        } else if (field.type === CUSTOM_FIELD_TYPE.DATE) {
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
              value={
                fieldValues[field.slug]
                  ? dayjs(fieldValues[field.slug]?.toString())
                  : null
              }
            />
          );
        } else if (field.type === CUSTOM_FIELD_TYPE.URL) {
          return (
            <PersonFieldInput
              key={field.slug}
              error={invalidFields.includes(field.slug)}
              field={field.slug}
              isURLField
              label={field.title}
              onChange={(field, newValue) => {
                const formattedUrl = formatUrl(newValue as string);
                onChange(field, formattedUrl ?? newValue);
              }}
              value={fieldValues[field.slug]?.toString() ?? ''}
            />
          );
        } else {
          return (
            <PersonFieldInput
              key={field.slug}
              field={field.slug}
              label={field.title}
              onChange={(field, newValue) => onChange(field, newValue)}
              value={fieldValues[field.slug]?.toString() ?? ''}
            />
          );
        }
      })}
    </Box>
  );
};

export default EditPersonFields;
