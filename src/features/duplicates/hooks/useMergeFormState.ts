import { useEffect, useMemo, useState } from 'react';

import { ZetkinCustomField, ZetkinPerson } from 'utils/types/zetkin';
import getFieldSettings from '../utils/getFieldSettings';
import { NATIVE_PERSON_FIELDS } from 'features/views/components/types';

interface UseMergeFormStateArgs {
  customFields: ZetkinCustomField[];
  duplicates: ZetkinPerson[];
}

type PersonField = NATIVE_PERSON_FIELDS;

interface MergeFormState {
  overrides: Partial<ZetkinPerson>;
  fieldValues: Record<string, string[]>;
  hasConflictingValues: boolean;
  setOverride: (field: PersonField, value: string) => void;
}

export default function useMergeFormState({
  customFields,
  duplicates,
}: UseMergeFormStateArgs): MergeFormState {
  const { fieldValues, hasConflictingValues, initialOverrides } = useMemo(
    () => getFieldSettings({ customFields, duplicates }),
    [customFields, duplicates]
  );

  const [userOverrides, setUserOverrides] = useState<Partial<ZetkinPerson>>({});

  const duplicateSetKey = useMemo(() => {
    return duplicates
      .map((person) => person.id)
      .sort((a, b) => a - b)
      .join(',');
  }, [duplicates]);

  useEffect(() => {
    setUserOverrides({});
  }, [duplicateSetKey]);

  // When the available values change, filter user overrides that are no longer valid
  useEffect(() => {
    setUserOverrides((currentOverrides) => {
      let didFilter = false;
      const filteredOverrides: Partial<ZetkinPerson> = {};

      Object.entries(currentOverrides).forEach(([field, value]) => {
        const normalizedOverrideValue = String(value ?? '');
        const validValuesForField = fieldValues[field];

        if (
          validValuesForField &&
          validValuesForField.includes(normalizedOverrideValue)
        ) {
          filteredOverrides[field as keyof ZetkinPerson] =
            normalizedOverrideValue;
        } else {
          didFilter = true;
        }
      });

      return didFilter ? filteredOverrides : currentOverrides;
    });
  }, [fieldValues]);

  const setOverride = (field: PersonField, value: string) => {
    setUserOverrides((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const overrides = useMemo(
    () => ({
      ...initialOverrides,
      ...userOverrides,
    }),
    [initialOverrides, userOverrides]
  );

  return {
    fieldValues,
    hasConflictingValues,
    overrides,
    setOverride,
  };
}
