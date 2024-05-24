import { FC, useState } from 'react';

import messageIds from 'features/duplicates/l10n/messageIds';
import { NATIVE_PERSON_FIELDS } from 'features/views/components/types';
import sortValuesByFrequency from 'features/duplicates/utils/sortValuesByFrequency';
import { useMessages } from 'core/i18n';
import { MenuItem, Select, Typography } from '@mui/material';

interface FieldSettingsRowProps {
  field: NATIVE_PERSON_FIELDS;
  values: string[];
}

const FieldSettingsRow: FC<FieldSettingsRowProps> = ({ field, values }) => {
  const messages = useMessages(messageIds);
  const [selectedValue, setSelectedValue] = useState(values[0]);

  const sortedValues = sortValuesByFrequency(field, values);

  const getGender = (value: string) => {
    if (!value) {
      return messages.modal.fieldSettings.noData();
    }

    if (value === 'f') {
      return messages.modal.fieldSettings.gender.f();
    } else if (value === 'm') {
      return messages.modal.fieldSettings.gender.m();
    } else {
      return messages.modal.fieldSettings.gender.o();
    }
  };

  return (
    <>
      {sortedValues.length === 1 && (
        <Typography color="secondary">
          {field === NATIVE_PERSON_FIELDS.GENDER
            ? getGender(sortedValues[0])
            : sortedValues[0]}
        </Typography>
      )}
      {sortedValues.length > 1 && (
        <Select
          onChange={(event) => setSelectedValue(event.target.value)}
          value={selectedValue}
        >
          {sortedValues.map((value, index) => (
            <MenuItem key={index} value={value}>
              {field === NATIVE_PERSON_FIELDS.GENDER ? getGender(value) : value}
            </MenuItem>
          ))}
        </Select>
      )}
    </>
  );
};

export default FieldSettingsRow;
