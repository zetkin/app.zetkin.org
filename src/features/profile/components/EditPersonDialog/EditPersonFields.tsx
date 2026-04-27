import UndoIcon from '@mui/icons-material/Undo';
import {
  Box,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers-pro';
import dayjs from 'dayjs';
import { FC } from 'react';

import globalMessageIds from 'core/i18n/messageIds';
import { NATIVE_PERSON_FIELDS } from 'features/views/components/types';
import { makeNaiveDateString } from 'utils/dateUtils';
import formatUrl from 'utils/formatUrl';
import {
  CUSTOM_FIELD_TYPE,
  ZetkinCreatePerson,
  ZetkinLngLatFieldValue,
  ZetkinPerson,
} from 'utils/types/zetkin';
import messageIds from 'zui/l10n/messageIds';
import PersonLngLatFieldInput from 'zui/ZUICreatePerson/PersonLngLatFieldInput';
import useCustomFields from '../../hooks/useCustomFields';
import EditPersonField from './EditPersonField';
import { Msg, useMessages } from 'core/i18n';
import profileMessageIds from 'features/profile/l10n/messageIds';

enum GENDERS {
  FEMALE = 'f',
  MALE = 'm',
  OTHER = 'o',
  UNKNOWN = 'unknown',
}

interface EditPersonFieldsProps {
  fieldsToUpdate: ZetkinCreatePerson;
  invalidFields: string[];
  onChange: (field: string, newValue: string | null) => void;
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
  const profileMessages = useMessages(profileMessageIds);

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={2}
      paddingRight={1}
      paddingTop={1}
    >
      <Box display="flex" gap={2}>
        <EditPersonField
          error={invalidFields.includes(NATIVE_PERSON_FIELDS.FIRST_NAME)}
          field={NATIVE_PERSON_FIELDS.FIRST_NAME}
          hasChanges={NATIVE_PERSON_FIELDS.FIRST_NAME in fieldsToUpdate}
          onChange={(field, newValue) => onChange(field, newValue)}
          onReset={() => onReset(NATIVE_PERSON_FIELDS.FIRST_NAME)}
          required
          value={fieldValues.first_name}
        />
        <EditPersonField
          error={invalidFields.includes(NATIVE_PERSON_FIELDS.LAST_NAME)}
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
        const isFieldWritable =
          field.organization.id == orgId || field.org_write == 'suborgs';

        const fieldValue = fieldValues[field.slug];

        if (field.type === CUSTOM_FIELD_TYPE.JSON) {
          return null;
        } else if (field.type === CUSTOM_FIELD_TYPE.DATE) {
          return (
            <Box key={field.slug} display="flex">
              <DatePicker
                key={field.slug}
                disabled={!isFieldWritable}
                label={field.title}
                onChange={(date) => {
                  if (date) {
                    const dateStr = makeNaiveDateString(date.utc().toDate());
                    onChange(field.slug, dateStr);
                  }
                }}
                slotProps={{
                  textField: {
                    helperText: !isFieldWritable
                      ? profileMessages.customFields.notEditable()
                      : '',
                  },
                }}
                sx={{ width: '100%' }}
                value={fieldValue ? dayjs(fieldValue.toString()) : null}
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
              disabled={!isFieldWritable}
              error={invalidFields.includes(field.slug)}
              field={field.slug}
              hasChanges={field.slug in fieldsToUpdate}
              helperText={
                !isFieldWritable
                  ? profileMessages.customFields.notEditable()
                  : ''
              }
              isURLField
              label={field.title}
              onChange={(field, newValue) => {
                const formattedUrl = formatUrl(newValue as string);
                onChange(field, formattedUrl ?? newValue);
              }}
              onReset={() => onReset(field.slug)}
              value={fieldValue?.toString() ?? ''}
            />
          );
        } else if (
          field.type === CUSTOM_FIELD_TYPE.ENUM &&
          field.enum_choices
        ) {
          return (
            <Box
              key={field.slug}
              alignItems="flex-start"
              display="flex"
              flex={1}
            >
              <FormControl disabled={!isFieldWritable} fullWidth>
                <InputLabel>{field.title}</InputLabel>
                <Select
                  key={field.slug}
                  disabled={!isFieldWritable}
                  fullWidth
                  label={field.title}
                  onChange={(ev) => {
                    let value: string | null = ev.target.value;
                    if (value === '') {
                      value = null;
                    }
                    onChange(field.slug, value);
                  }}
                  value={fieldValue?.toString() ?? ''}
                >
                  <MenuItem key="" sx={{ fontStyle: 'italic' }} value="">
                    <Msg id={messageIds.createPerson.enumFields.noneOption} />
                  </MenuItem>
                  {field.enum_choices.map((c) => (
                    <MenuItem key={c.key} value={c.key}>
                      {c.label}
                    </MenuItem>
                  ))}
                </Select>
                {!isFieldWritable && (
                  <FormHelperText>
                    <Msg id={profileMessageIds.customFields.notEditable} />
                  </FormHelperText>
                )}
              </FormControl>
            </Box>
          );
        } else if (field.type === CUSTOM_FIELD_TYPE.LNGLAT) {
          const hasChanges = field.slug in fieldsToUpdate;

          let value = null;
          if (hasChanges) {
            if (field.slug) {
              value = fieldsToUpdate[
                field.slug
              ] as unknown as ZetkinLngLatFieldValue;
            }
          } else if (fieldValue) {
            value = fieldValue as unknown as ZetkinLngLatFieldValue;
          }

          return (
            <PersonLngLatFieldInput
              key={field.slug}
              error={invalidFields.includes(field.slug)}
              field={field.slug}
              hasChanges={field.slug in fieldsToUpdate}
              label={field.title}
              onChange={onChange}
              onReset={() => onReset(field.slug)}
              value={value}
            />
          );
        } else {
          return (
            <EditPersonField
              key={field.slug}
              disabled={!isFieldWritable}
              field={field.slug}
              hasChanges={field.slug in fieldsToUpdate}
              helperText={
                !isFieldWritable
                  ? profileMessages.customFields.notEditable()
                  : ''
              }
              label={field.title}
              onChange={(field, newValue) => onChange(field, newValue)}
              onReset={() => onReset(field.slug)}
              value={fieldValue?.toString() ?? ''}
            />
          );
        }
      })}
    </Box>
  );
};

export default EditPersonFields;
