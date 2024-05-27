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

  return (
    <Box
      border={1}
      sx={{ borderColor: theme.palette.grey[300], borderRadius: 2 }}
    >
      {sortedNativePersonFields.map((field, index) => {
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
