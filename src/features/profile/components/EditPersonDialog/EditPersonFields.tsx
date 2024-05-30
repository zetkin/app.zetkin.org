import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from 'dayjs';
import { FC } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import { CUSTOM_FIELD_TYPE } from 'utils/types/zetkin';
import formatUrl from 'utils/formatUrl';
import globalMessageIds from 'core/i18n/globalMessageIds';
import { makeNaiveDateString } from 'utils/dateUtils';
import messageIds from 'zui/l10n/messageIds';
import { NATIVE_PERSON_FIELDS } from 'features/views/components/types';
import PersonFieldInput from 'zui/ZUICreatePerson/PersonFieldInput';
import useCustomFields from '../../hooks/useCustomFields';
import { Msg, useMessages } from 'core/i18n';

enum GENDERS {
  FEMALE = 'f',
  MALE = 'm',
  OTHER = 'o',
  UNKNOWN = 'unknown',
}

interface EditPersonFieldsProps {
  invalidFields: string[];
  onChange: (field: string, value: string) => void;
  orgId: number;
}

const EditPersonFields: FC<EditPersonFieldsProps> = ({
  invalidFields,
  onChange,
  orgId,
}) => {
  const customFields = useCustomFields(orgId).data ?? [];
  const globalMessages = useMessages(globalMessageIds);

  return (
    <Box display="flex" flexDirection="column" gap={2} paddingTop={1}>
      <Box display="flex" gap={2}>
        <PersonFieldInput
          field={NATIVE_PERSON_FIELDS.FIRST_NAME}
          onChange={(field, value) => onChange(field, value)}
          required
        />
        <PersonFieldInput
          field={NATIVE_PERSON_FIELDS.LAST_NAME}
          onChange={(field, value) => onChange(field, value)}
          required
        />
      </Box>
      <PersonFieldInput
        error={invalidFields.includes(NATIVE_PERSON_FIELDS.EMAIL)}
        field={NATIVE_PERSON_FIELDS.EMAIL}
        onChange={(field, value) => onChange(field, value)}
      />
      <PersonFieldInput
        error={invalidFields.includes(NATIVE_PERSON_FIELDS.PHONE)}
        field={NATIVE_PERSON_FIELDS.PHONE}
        onChange={(field, value) => onChange(field, value)}
      />
      <PersonFieldInput
        error={invalidFields.includes(NATIVE_PERSON_FIELDS.ALT_PHONE)}
        field={NATIVE_PERSON_FIELDS.ALT_PHONE}
        onChange={(field, value) => onChange(field, value === ' ' ? '' : value)}
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
        onChange={(field, value) => onChange(field, value)}
      />
      <PersonFieldInput
        field={NATIVE_PERSON_FIELDS.CO_ADDRESS}
        onChange={(field, value) => onChange(field, value)}
      />
      <Box>
        <PersonFieldInput
          field={NATIVE_PERSON_FIELDS.ZIP_CODE}
          onChange={(field, value) => onChange(field, value)}
          style={{
            pr: 2,
            width: '30%',
          }}
        />
        <PersonFieldInput
          field={NATIVE_PERSON_FIELDS.CITY}
          onChange={(field, value) => onChange(field, value)}
          style={{
            width: '70%',
          }}
        />
      </Box>
      <PersonFieldInput
        field={NATIVE_PERSON_FIELDS.COUNTRY}
        onChange={(field, value) => onChange(field, value)}
      />
      <PersonFieldInput
        field={'ext_id'}
        onChange={(field, value) => onChange(field, value)}
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
              value={null}
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
    </Box>
  );
};

export default EditPersonFields;
