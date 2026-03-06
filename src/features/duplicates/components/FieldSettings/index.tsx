import { FC } from 'react';
import {
  Alert,
  AlertTitle,
  Box,
  Divider,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useEffect, useMemo, useRef } from 'react';

import FieldSettingsRow from './FieldSettingsRow';
import messageIds from 'features/duplicates/l10n/messageIds';
import { NATIVE_PERSON_FIELDS } from 'features/views/components/types';
import { useMessages } from 'core/i18n';
import { ZetkinCustomField, ZetkinPerson } from 'utils/types/zetkin';
import getFieldSettings from 'features/duplicates/utils/getFieldSettings';

interface FieldSettingsProps {
  customFields: ZetkinCustomField[];
  duplicates: ZetkinPerson[];
  onChange: (field: NATIVE_PERSON_FIELDS, selectedValue: string) => void;
  resetKey: string;
  setOverrides: React.Dispatch<
    React.SetStateAction<Partial<ZetkinPerson> | null>
  >;
}

const FieldSettings: FC<FieldSettingsProps> = ({
  customFields,
  duplicates,
  onChange,
  resetKey,
  setOverrides,
}) => {
  const theme = useTheme();
  const messages = useMessages(messageIds);
  const lastResetKeyRef = useRef<string | null>(null);
  const { hasConflictingValues, fieldValues, initialOverrides } = useMemo(
    () => getFieldSettings({ customFields, duplicates }),
    [customFields, duplicates]
  );

  useEffect(() => {
    const resetKeyChanged = lastResetKeyRef.current !== resetKey;

    if (resetKeyChanged) {
      lastResetKeyRef.current = resetKey;
      setOverrides(initialOverrides);
      return;
    }

    setOverrides((prev) => (prev ? prev : initialOverrides));
  }, [initialOverrides, resetKey, setOverrides]);

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
        {Object.entries(fieldValues).map((entry) => {
          const [field, values] = entry;
          return (
            <React.Fragment key={field}>
              {field !== NATIVE_PERSON_FIELDS.FIRST_NAME && <Divider />}
              <FieldSettingsRow
                key={field}
                duplicates={duplicates}
                field={field as NATIVE_PERSON_FIELDS}
                onChange={(selectedValue: string) =>
                  onChange(field as NATIVE_PERSON_FIELDS, selectedValue)
                }
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
