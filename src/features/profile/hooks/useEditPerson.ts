import { useState } from 'react';

import { ZetkinPerson, ZetkinUpdatePerson } from 'utils/types/zetkin';

export default function useEditPerson(initialValues: ZetkinPerson) {
  const [fieldsToUpdate, setFieldsToUpdate] = useState<ZetkinUpdatePerson>({});

  const onFieldValueChange = (
    field: keyof ZetkinUpdatePerson,
    newValue: string
  ) => {
    if (newValue === '' || newValue === initialValues[field]?.toString()) {
      const copied = { ...fieldsToUpdate };
      delete copied[field];
      setFieldsToUpdate(copied);
    } else {
      setFieldsToUpdate({ ...fieldsToUpdate, [field]: newValue });
    }
  };

  return { onFieldValueChange };
}
