import React, { useMemo } from 'react';
import { Stack } from '@mui/material';

import ZUITextField from 'zui/components/ZUITextField';
import { EmailThemePatchBody } from 'features/emails/types';
import { useMessages } from 'core/i18n';
import messageIds from 'features/emails/l10n/messageIds';

interface ThemeEditFieldProps {
  editingSection: keyof EmailThemePatchBody;
  value: string;
  onChange: (value: string) => void;
}

export const serializeField = (
  value: string,
  editingSection: keyof EmailThemePatchBody
) => {
  if (editingSection === 'css') {
    return value;
  }
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const ThemeEditField: React.FC<ThemeEditFieldProps> = ({
  editingSection,
  value,
  onChange,
}) => {
  const messages = useMessages(messageIds);

  const jsonError = useMemo(() => {
    if (editingSection === 'css' || !value) {
      return false;
    }
    try {
      JSON.parse(value);
      return false;
    } catch {
      return true;
    }
  }, [value, editingSection]);

  return (
    <Stack
      gap={2}
      sx={{
        '& .MuiFormControl-root': { height: '100%' },
        '& .MuiInputBase-input': {
          height: '100% !important',
          overflow: 'auto !important',
        },
        '& .MuiInputBase-root': { height: '100%' },
        height: '100%',
      }}
    >
      <ZUITextField
        error={jsonError}
        fullWidth
        helperText={
          jsonError ? messages.themes.themeEditor.jsonError() : undefined
        }
        maxRows={0}
        monospaced={true}
        multiline
        onChange={onChange}
        value={value}
      />
    </Stack>
  );
};

export default ThemeEditField;
