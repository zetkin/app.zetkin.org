import { NATIVE_PERSON_FIELDS } from 'features/views/components/types';
import sortValuesByFrequency from '../utils/sortValuesByFrequency';
import { ZetkinPerson } from 'utils/types/zetkin';

export default function useFieldSettings(duplicates: ZetkinPerson[]) {
  const nativePersonFields = Object.values(NATIVE_PERSON_FIELDS).filter(
    (field) => field !== NATIVE_PERSON_FIELDS.ID
  );

  const sortedNativePersonFields = nativePersonFields.filter(
    (field) =>
      field === NATIVE_PERSON_FIELDS.FIRST_NAME ||
      field === NATIVE_PERSON_FIELDS.LAST_NAME ||
      field === NATIVE_PERSON_FIELDS.EMAIL ||
      field === NATIVE_PERSON_FIELDS.PHONE
  );

  const otherFields = nativePersonFields.filter(
    (field) =>
      field !== NATIVE_PERSON_FIELDS.FIRST_NAME &&
      field !== NATIVE_PERSON_FIELDS.LAST_NAME &&
      field !== NATIVE_PERSON_FIELDS.EMAIL &&
      field !== NATIVE_PERSON_FIELDS.PHONE
  );

  sortedNativePersonFields.push(...otherFields);

  const fieldValues: Record<string, string[]> = {};

  sortedNativePersonFields.forEach((field) => {
    const values = duplicates.map((person) => {
      const value = person[field];
      return value ? value.toString() : '';
    });

    fieldValues[field] = sortValuesByFrequency(values);
  });

  const initialOverrides: Partial<ZetkinPerson> = {};

  Object.entries(fieldValues).forEach((entry) => {
    const [field, values] = entry;

    if (values.length > 1) {
      initialOverrides[field] = values[0];
    }
  });

  return { fieldValues, initialOverrides };
}
