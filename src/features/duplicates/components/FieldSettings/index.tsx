import { FC } from 'react';
import { Box, Divider, useTheme } from '@mui/material';

import FieldSettingsRow from './FieldSettingsRow';
import { NATIVE_PERSON_FIELDS } from 'features/views/components/types';
import { ZetkinPerson } from 'utils/types/zetkin';

interface FieldSettingsProps {
  duplicatePersons: ZetkinPerson[];
}

const FieldSettings: FC<FieldSettingsProps> = ({ duplicatePersons }) => {
  const theme = useTheme();

  const nativePersonFields = Object.values(NATIVE_PERSON_FIELDS);

  return (
    <Box
      border={1}
      sx={{ borderColor: theme.palette.grey[300], borderRadius: 2 }}
    >
      {nativePersonFields.map((field, index) => {
        const values = duplicatePersons.map((person) => {
          const value = person[field];
          return value ? value.toString() : '';
        });

        return (
          <>
            {index !== 0 && <Divider />}
            <FieldSettingsRow key={field} field={field} values={values} />
          </>
        );
      })}
    </Box>
  );
};

export default FieldSettings;
