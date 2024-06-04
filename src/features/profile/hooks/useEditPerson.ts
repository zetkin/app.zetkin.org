import { useState } from 'react';

import checkInvalidFields from 'zui/ZUICreatePerson/checkInvalidFields';
import useCustomFields from './useCustomFields';
import { ZetkinPerson, ZetkinUpdatePerson } from 'utils/types/zetkin';

export default function useEditPerson(
  initialValues: ZetkinPerson,
  orgId: number
) {
  const customFields = useCustomFields(orgId).data ?? [];
  const [fieldsToUpdate, setFieldsToUpdate] = useState<ZetkinUpdatePerson>({});

  const invalidFields = checkInvalidFields(customFields, fieldsToUpdate);

  const onFieldValueChange = (
    field: keyof ZetkinUpdatePerson,
    newValue: string
  ) => {
    const isEmptyStringValue = !initialValues[field] && newValue === '';

    //om det gamla värdet inte fanns, och det nya värdet är tom sträng - plocka bort den
    if (isEmptyStringValue || newValue === initialValues[field]?.toString()) {
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
