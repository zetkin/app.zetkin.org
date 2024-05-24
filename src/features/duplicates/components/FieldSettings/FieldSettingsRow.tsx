import { FC, useState } from 'react';

import { NATIVE_PERSON_FIELDS } from 'features/views/components/types';
import sortValuesByFrequency from 'features/duplicates/utils/sortValuesByFrequency';
import { MenuItem, Select, Typography } from '@mui/material';

interface FieldSettingsRowProps {
  field: NATIVE_PERSON_FIELDS;
  values: string[];
}

const FieldSettingsRow: FC<FieldSettingsRowProps> = ({ field, values }) => {
  const [selectedValue, setSelectedValue] = useState(values[0]);

  const sortedValues = sortValuesByFrequency(field, values);

  return (
    <>
      {sortedValues.length === 1 && (
        <Typography color="secondary">{sortedValues[0]}</Typography>
      )}
      {sortedValues.length > 1 && (
        <Select
          onChange={(event) => setSelectedValue(event.target.value)}
          value={selectedValue}
        >
          {sortedValues.map((value) => (
            <MenuItem key={value} value={value}>
              {value}
            </MenuItem>
          ))}
        </Select>
      )}
    </>
  );
};

export default FieldSettingsRow;
