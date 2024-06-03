import { FC } from 'react';
import { Box, Divider, Typography, useTheme } from '@mui/material';

import FieldSettingsRow from './FieldSettingsRow';
import messageIds from 'features/duplicates/l10n/messageIds';
import { NATIVE_PERSON_FIELDS } from 'features/views/components/types';
import { useMessages } from 'core/i18n';

interface FieldSettingsProps {
  fieldValues: Record<string, string[]>;
  onChange: (field: NATIVE_PERSON_FIELDS, selectedValue: string) => void;
}

const FieldSettings: FC<FieldSettingsProps> = ({ fieldValues, onChange }) => {
  const theme = useTheme();
  const messages = useMessages(messageIds);

  return (
    <Box>
      <Typography variant="h6">
        {messages.modal.fieldSettings.title()}
      </Typography>
      <Box
        alignItems="center"
        display="flex"
        justifyContent="space-between"
        padding={1}
      >
        <Box flexDirection="column" marginRight={2} width="50%">
          <Typography color={theme.palette.grey[500]} variant="subtitle2">
            {messages.modal.fieldSettings.field()}
          </Typography>
        </Box>
        <Box flexDirection="column" marginRight={2} width="50%">
          <Typography color={theme.palette.grey[500]} variant="subtitle2">
            {messages.modal.fieldSettings.data()}
          </Typography>
        </Box>
      </Box>
      <Box
        border={1}
        sx={{ borderColor: theme.palette.grey[300], borderRadius: 2 }}
      >
        {Object.entries(fieldValues).map((entry) => {
          const [field, values] = entry;
          return (
            <>
              {field !== NATIVE_PERSON_FIELDS.FIRST_NAME && <Divider />}
              <FieldSettingsRow
                key={field}
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
    </Box>
  );
};

export default FieldSettings;
