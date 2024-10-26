import { NATIVE_PERSON_FIELDS } from 'features/views/components/types';
import sortValuesByFrequency from '../utils/sortValuesByFrequency';
import { ZetkinPerson } from 'utils/types/zetkin';

export default function useFieldSettings(duplicates: ZetkinPerson[]) {
  const sortedNativePersonFields: NATIVE_PERSON_FIELDS[] = [
    NATIVE_PERSON_FIELDS.FIRST_NAME,
    NATIVE_PERSON_FIELDS.LAST_NAME,
    NATIVE_PERSON_FIELDS.EMAIL,
    NATIVE_PERSON_FIELDS.PHONE,
    NATIVE_PERSON_FIELDS.ALT_PHONE,
    NATIVE_PERSON_FIELDS.GENDER,
    NATIVE_PERSON_FIELDS.STREET_ADDRESS,
    NATIVE_PERSON_FIELDS.CO_ADDRESS,
    NATIVE_PERSON_FIELDS.ZIP_CODE,
    NATIVE_PERSON_FIELDS.CITY,
    NATIVE_PERSON_FIELDS.COUNTRY,
    NATIVE_PERSON_FIELDS.EXT_ID,
  ];

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

  function entryContainsOneValue(entry: Array<string | string[]>) {
    return entry[1].length < 2;
  }

  const hasConflictingValues = !Object.entries(fieldValues).every(
    entryContainsOneValue
  );

  return { fieldValues, hasConflictingValues, initialOverrides };
}
