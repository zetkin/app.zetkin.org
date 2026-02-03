import { FC } from 'react';
import {
  Alert,
  AlertTitle,
  Box,
  Divider,
  Typography,
  useTheme,
} from '@mui/material';
import React from 'react';

import FieldSettingsRow from './FieldSettingsRow';
import messageIds from 'features/duplicates/l10n/messageIds';
import { useMessages } from 'core/i18n';
import { NATIVE_PERSON_FIELDS } from 'features/views/components/types';
import { ZetkinPerson } from 'utils/types/zetkin';

interface FieldSettingsProps {
  duplicates: ZetkinPerson[];
  overrides: Partial<ZetkinPerson>;
  fieldValues: Record<NATIVE_PERSON_FIELDS, string[]>;
  hasConflictingValues: boolean;
  onChange: (field: NATIVE_PERSON_FIELDS, selectedValue: string) => void;
}

const FieldSettings: FC<FieldSettingsProps> = ({
  duplicates,
  overrides,
  fieldValues,
  hasConflictingValues,
  onChange,
}) => {
  const theme = useTheme();
  const messages = useMessages(messageIds);

  return (
    <Box>
      <Typography variant="h6">
        {messages.modal.fieldSettings.title()}
      </Typography>
      {hasConflictingValues && (
        <Alert severity="warning">
          <AlertTitle>{messages.modal.warningTitle()}</AlertTitle>
          {messages.modal.warningMessage()}
        </Alert>
      )}
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
        sx={{
          borderColor: theme.palette.grey[300],
          borderRadius: 2,
          marginBottom: 2,
        }}
      >
        {Object.entries(fieldValues).map(([_field, values]) => {
          const field = _field as NATIVE_PERSON_FIELDS;
          const selectedValue = String(overrides[field] ?? values[0] ?? '');

          return (
            <React.Fragment key={field}>
              {field !== NATIVE_PERSON_FIELDS.FIRST_NAME && <Divider />}
              <FieldSettingsRow
                duplicates={duplicates}
                field={field}
                onChange={(selectedValue: string) =>
                  onChange(field, selectedValue)
                }
                value={selectedValue}
                values={values}
              />
            </React.Fragment>
          );
        })}
      </Box>
    </Box>
  );
};

export default FieldSettings;
