import { useState } from 'react';
import { CountryCode } from 'libphonenumber-js';

import checkInvalidFields from 'zui/ZUICreatePerson/checkInvalidFields';
import useCustomFields from './useCustomFields';
import { ZetkinPerson, ZetkinUpdatePerson } from 'utils/types/zetkin';
import useOrganization from '../../organizations/hooks/useOrganization';

export default function useEditPerson(
  initialValues: ZetkinPerson,
  orgId: number
) {
  const customFields = useCustomFields(orgId).data ?? [];
  const [fieldsToUpdate, setFieldsToUpdate] = useState<ZetkinUpdatePerson>({});
  const organization = useOrganization(orgId).data;
  const countryCode = organization?.country as CountryCode;
  const invalidFields = checkInvalidFields(
    customFields,
    fieldsToUpdate,
    countryCode
  );

  const onFieldValueChange = (
    field: keyof ZetkinUpdatePerson,
    newValue: string | null
  ) => {
    const isEmptyValue =
      !initialValues[field] && (newValue === '' || newValue === null);

    if (isEmptyValue || newValue === initialValues[field]?.toString()) {
      const copied = { ...fieldsToUpdate };
      delete copied[field];
      setFieldsToUpdate(copied);
    } else {
      setFieldsToUpdate({ ...fieldsToUpdate, [field]: newValue });
    }
  };

  const hasUpdatedValues = !!Object.entries(fieldsToUpdate).length;
  const hasInvalidFields = !!Object.entries(invalidFields).length;

  return {
    fieldsToUpdate,
    hasInvalidFields,
    hasUpdatedValues,
    invalidFields,
    onFieldValueChange,
    setFieldsToUpdate,
  };
}
