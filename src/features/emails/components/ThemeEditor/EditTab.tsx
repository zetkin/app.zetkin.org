import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Stack } from '@mui/material';
import { MJMLJsonObject, MJMLJsonSelfClosingTag } from 'mjml-core';

import useEmailTheme from 'features/emails/hooks/useEmailTheme';
import ZUITextField from 'zui/components/ZUITextField';
import {
  BlockAttributes,
  EmailTheme,
  EmailThemePatchBody,
} from 'features/emails/types';
import { useMessages } from 'core/i18n';
import messageIds from 'features/emails/l10n/messageIds';

interface EditTabProps {
  orgId: number;
  themeId: number;
  editingSection: 'frame_mjml' | 'css' | 'block_attributes';
}

const parseField = (
  section: string | MJMLJsonObject | BlockAttributes | null | undefined,
  editingSection: EditTabProps['editingSection']
) => {
  if (section === null || section === undefined) {
    return '';
  }
  if (editingSection === 'css') {
    return section || '';
  }
  return JSON.stringify(section, null, 2);
};

const serializeField = (
  value: string | MJMLJsonSelfClosingTag | BlockAttributes,
  editingSection: EditTabProps['editingSection']
) => {
  if (editingSection === 'css') {
    return value;
  }
  try {
    return JSON.parse(value as string);
  } catch {
    return value;
  }
};

const EditTab: React.FC<EditTabProps> = ({
  orgId,
  themeId,
  editingSection,
}) => {
  const messages = useMessages(messageIds);
  const {
    data: theme,
    updateEmailTheme,
    mutating,
    isLoading,
  } = useEmailTheme(orgId, themeId);

  const sectionValue = theme
    ? parseField(theme[editingSection], editingSection)
    : '';
  const [localValue, setLocalValue] = useState(sectionValue);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setLocalValue(sectionValue);
    setDirty(false);
  }, [sectionValue, themeId]);

  const handleChange = (newValue: string) => {
    setLocalValue(newValue);
    setDirty(true);
  };

  const handleSave = async () => {
    const patch: EmailThemePatchBody = {
      [editingSection]: serializeField(localValue, editingSection),
    };
    await updateEmailTheme(patch as EmailTheme);
    setDirty(false);
  };

  let jsonError = false;
  if (editingSection !== 'css' && localValue) {
    try {
      JSON.parse(localValue as string);
      jsonError = false;
    } catch {
      jsonError = true;
    }
  }

  if (isLoading || mutating.includes(editingSection)) {
    return <CircularProgress />;
  }

  return (
    <Stack direction="column" display="flex">
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <ZUITextField
          error={jsonError}
          fullWidth
          helperText={
            jsonError ? messages.themes.themeEditor.jsonError() : undefined
          }
          maxRows={20}
          multiline
          onChange={handleChange}
          value={localValue as string}
        />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button
          color="primary"
          disabled={!dirty || jsonError}
          onClick={handleSave}
          variant="contained"
        >
          {messages.themes.themeEditor.saveButton()}
        </Button>
      </Box>
    </Stack>
  );
};

export default EditTab;
