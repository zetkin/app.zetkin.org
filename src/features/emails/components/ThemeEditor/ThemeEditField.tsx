import React, { useMemo } from 'react';
import { Stack } from '@mui/material';
import { MJMLJsonObject } from 'mjml-core';

import ZUITextField from 'zui/components/ZUITextField';
import { BlockAttributes, EmailThemePatchBody } from 'features/emails/types';
import { useMessages } from 'core/i18n';
import messageIds from 'features/emails/l10n/messageIds';

interface ThemeEditFieldProps {
  editingSection: keyof EmailThemePatchBody;
  value: string;
  onChange: (value: string) => void;
}

export const parseField = (
  section: string | MJMLJsonObject | BlockAttributes | null | undefined,
  editingSection: keyof EmailThemePatchBody
): string => {
  if (section === null || section === undefined) {
    return '';
  }
  if (editingSection === 'css') {
    return (section as string) || '';
  }
  return JSON.stringify(section, null, 2);
};

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
    <Stack gap={2}>
      <ZUITextField
        error={jsonError}
        fullWidth
        helperText={
          jsonError ? messages.themes.themeEditor.jsonError() : undefined
        }
        maxRows={20}
        multiline
        onChange={onChange}
        value={value}
      />
    </Stack>
  );
};

export default ThemeEditField;
