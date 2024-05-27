import { FC } from 'react';
import { Box, Divider, useTheme } from '@mui/material';

import FieldSettingsRow from './FieldSettingsRow';
import { NATIVE_PERSON_FIELDS } from 'features/views/components/types';

interface FieldSettingsProps {
  fieldValues: Record<string, string[]>;
  onChange: (field: NATIVE_PERSON_FIELDS, selectedValue: string) => void;
}

const FieldSettings: FC<FieldSettingsProps> = ({ fieldValues, onChange }) => {
  const theme = useTheme();

  return (
    <Box
      border={1}
      sx={{ borderColor: theme.palette.grey[300], borderRadius: 2 }}
    >
      {Object.entries(fieldValues).map((entry, index) => {
        const [field, values] = entry;
        return (
          <>
            {index !== 0 && <Divider />}
            <FieldSettingsRow
              key={index}
              field={field as NATIVE_PERSON_FIELDS}
              onChange={(selectedValue: string) =>
                onChange(field as NATIVE_PERSON_FIELDS, selectedValue)
              }
              values={values}
            />
          </>
        );
      })}
    </Box>
  );
};

export default FieldSettings;
