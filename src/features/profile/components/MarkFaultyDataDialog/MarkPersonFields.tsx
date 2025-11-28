import { FC } from 'react';
import {
  Box,
} from '@mui/material';

import EditPersonField from './MarkPersonField';
import { NATIVE_PERSON_FIELDS } from 'features/views/components/types';
import useCustomFields from '../../hooks/useCustomFields';
import {
  CUSTOM_FIELD_TYPE,
  ZetkinCreatePerson,
  ZetkinPerson,
} from 'utils/types/zetkin';

interface EditPersonFieldsProps {
  fieldsToUpdate: ZetkinCreatePerson;
  invalidFields: string[];
  markedFields: string[];
  onChange: (field: string, newValue: string | null) => void;
  onReset: (field: string) => void;
  orgId: number;
  fieldValues: ZetkinPerson;
}

const EditPersonFields: FC<EditPersonFieldsProps> = ({
  fieldsToUpdate,
  invalidFields,
    markedFields,
  onChange,
  onReset,
  orgId,
  fieldValues,
}) => {
  const customFields = useCustomFields(orgId).data ?? [];

  return (
    <Box display="flex" flexDirection="column" gap={2} paddingTop={1}>
      <Box display="flex" gap={2}>
        <EditPersonField
          error={invalidFields.includes(NATIVE_PERSON_FIELDS.FIRST_NAME)}
          field={NATIVE_PERSON_FIELDS.FIRST_NAME}
          hasChanges={NATIVE_PERSON_FIELDS.FIRST_NAME in fieldsToUpdate}
          markedFields={markedFields}
          onChange={(field, newValue) => onChange(field, newValue)}
          onReset={() => onReset(NATIVE_PERSON_FIELDS.FIRST_NAME)}
          required
          value={fieldValues.first_name}
        />
        <EditPersonField
          error={invalidFields.includes(NATIVE_PERSON_FIELDS.LAST_NAME)}
          field={NATIVE_PERSON_FIELDS.LAST_NAME}
          hasChanges={NATIVE_PERSON_FIELDS.LAST_NAME in fieldsToUpdate}
          markedFields={markedFields}
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
        markedFields={markedFields}
        onChange={(field, newValue) => onChange(field, newValue)}
        onReset={() => onReset(NATIVE_PERSON_FIELDS.EMAIL)}
        value={fieldValues.email ?? ''}
      />
      <EditPersonField
        error={invalidFields.includes(NATIVE_PERSON_FIELDS.PHONE)}
        field={NATIVE_PERSON_FIELDS.PHONE}
        hasChanges={NATIVE_PERSON_FIELDS.PHONE in fieldsToUpdate}
        markedFields={markedFields}
        onChange={(field, newValue) => onChange(field, newValue)}
        onReset={() => onReset(NATIVE_PERSON_FIELDS.PHONE)}
        value={fieldValues.phone ?? ''}
      />
      <EditPersonField
        field={NATIVE_PERSON_FIELDS.ALT_PHONE}
        hasChanges={NATIVE_PERSON_FIELDS.ALT_PHONE in fieldsToUpdate}
        markedFields={markedFields}
        onChange={(field, newValue) =>
          onChange(field, newValue === ' ' ? '' : newValue)
        }
        onReset={() => onReset(NATIVE_PERSON_FIELDS.ALT_PHONE)}
        value={fieldValues.alt_phone ?? ''}
      />
      <EditPersonField
        field={NATIVE_PERSON_FIELDS.GENDER}
        hasChanges={NATIVE_PERSON_FIELDS.GENDER in fieldsToUpdate}
        markedFields={markedFields}
        onChange={(field, newValue) => onChange(field, newValue)}
        onReset={() => onReset(NATIVE_PERSON_FIELDS.GENDER)}
        value={fieldValues.gender ?? ''}
      />
      <EditPersonField
        field={NATIVE_PERSON_FIELDS.STREET_ADDRESS}
        hasChanges={NATIVE_PERSON_FIELDS.STREET_ADDRESS in fieldsToUpdate}
        markedFields={markedFields}
        onChange={(field, newValue) => onChange(field, newValue)}
        onReset={() => onReset(NATIVE_PERSON_FIELDS.STREET_ADDRESS)}
        value={fieldValues.street_address ?? ''}
      />
      <EditPersonField
        field={NATIVE_PERSON_FIELDS.CO_ADDRESS}
        hasChanges={NATIVE_PERSON_FIELDS.CO_ADDRESS in fieldsToUpdate}
        markedFields={markedFields}
        onChange={(field, newValue) => onChange(field, newValue)}
        onReset={() => onReset(NATIVE_PERSON_FIELDS.CO_ADDRESS)}
        value={fieldValues.co_address ?? ''}
      />
      <Box display="flex" gap={2}>
        <Box flex={0.3}>
          <EditPersonField
            field={NATIVE_PERSON_FIELDS.ZIP_CODE}
            hasChanges={NATIVE_PERSON_FIELDS.ZIP_CODE in fieldsToUpdate}
            markedFields={markedFields}
            onChange={(field, newValue) => onChange(field, newValue)}
            onReset={() => onReset(NATIVE_PERSON_FIELDS.ZIP_CODE)}
            value={fieldValues.zip_code ?? ''}
          />
        </Box>
        <EditPersonField
          field={NATIVE_PERSON_FIELDS.CITY}
          hasChanges={NATIVE_PERSON_FIELDS.CITY in fieldsToUpdate}
          markedFields={markedFields}
          onChange={(field, newValue) => onChange(field, newValue)}
          onReset={() => onReset(NATIVE_PERSON_FIELDS.CITY)}
          value={fieldValues.city ?? ''}
        />
      </Box>
      <EditPersonField
        field={NATIVE_PERSON_FIELDS.COUNTRY}
        hasChanges={NATIVE_PERSON_FIELDS.COUNTRY in fieldsToUpdate}
        markedFields={markedFields}
        onChange={(field, newValue) => onChange(field, newValue)}
        onReset={() => onReset(NATIVE_PERSON_FIELDS.COUNTRY)}
        value={fieldValues.country ?? ''}
      />
      <EditPersonField
        field={NATIVE_PERSON_FIELDS.EXT_ID}
        hasChanges={NATIVE_PERSON_FIELDS.EXT_ID in fieldsToUpdate}
        markedFields={markedFields}
        onChange={(field, newValue) => onChange(field, newValue)}
        onReset={() => onReset(NATIVE_PERSON_FIELDS.EXT_ID)}
        value={fieldValues.ext_id ? fieldValues.ext_id : ''}
      />
      {customFields.map((field) => {
        const fieldWritable =
          field.organization.id == orgId || field.org_write == 'suborgs';
        if (field.type === CUSTOM_FIELD_TYPE.JSON) {
          return;
        } else {
          return (
            <EditPersonField
              key={field.slug}
              disabled={!fieldWritable}
              field={field.slug}
              hasChanges={field.slug in fieldsToUpdate}
              label={field.title}
              markedFields={markedFields}
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
