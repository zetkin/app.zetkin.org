import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { MJMLJsonObject } from 'mjml-core';
import { QuestionMark } from '@mui/icons-material';

import useEmailTheme from 'features/emails/hooks/useEmailTheme';
import ZUITextField from 'zui/components/ZUITextField';
import { BlockAttributes, EmailThemePatchBody } from 'features/emails/types';
import { useMessages } from 'core/i18n';
import messageIds from 'features/emails/l10n/messageIds';

interface EditTabProps {
  orgId: number;
  themeId: number;
  editingSection: 'frame_mjml' | 'css' | 'block_attributes';
  helpBlock?: React.ReactNode;
}

const parseField = (
  section: string | MJMLJsonObject | BlockAttributes | null | undefined,
  editingSection: EditTabProps['editingSection']
): string => {
  if (section === null || section === undefined) {
    return '';
  }
  if (editingSection === 'css') {
    return (section as string) || '';
  }
  return JSON.stringify(section, null, 2);
};

const serializeField = (
  value: string,
  editingSection: EditTabProps['editingSection']
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

const ThemeEditor: React.FC<EditTabProps> = ({
  orgId,
  themeId,
  editingSection,
  helpBlock,
}) => {
  const messages = useMessages(messageIds);
  const {
    data: theme,
    updateEmailTheme,
    mutating,
    isLoading,
  } = useEmailTheme(orgId, themeId);

  const sectionValue = useMemo(() => {
    return theme ? parseField(theme[editingSection], editingSection) : '';
  }, [theme, editingSection]);

  const [localValue, setLocalValue] = useState(sectionValue);
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    setLocalValue(sectionValue);
  }, [sectionValue]);

  const isDirty = useMemo(() => {
    return localValue !== sectionValue;
  }, [localValue, sectionValue]);

  const handleChange = (newValue: string) => {
    setLocalValue(newValue);
  };

  const handleSave = async () => {
    const patch: EmailThemePatchBody = {
      [editingSection]: serializeField(localValue, editingSection),
    };
    await updateEmailTheme(patch);
  };

  const jsonError = useMemo(() => {
    if (editingSection !== 'css' && localValue) {
      try {
        JSON.parse(localValue);
        return false;
      } catch {
        return true;
      }
    }
    return false;
  }, [localValue, editingSection]);

  if (isLoading || mutating.includes(editingSection)) {
    return <CircularProgress />;
  }

  return (
    <Stack gap={2} sx={{ flex: 1, minWidth: '0' }}>
      <Typography variant="h5">
        {messages.themes.themeEditor.editTitle()}
      </Typography>
      <ZUITextField
        error={jsonError}
        fullWidth
        helperText={
          jsonError ? messages.themes.themeEditor.jsonError() : undefined
        }
        maxRows={20}
        multiline
        onChange={handleChange}
        value={localValue}
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        {helpBlock && (
          <IconButton
            aria-label="help"
            onClick={() => setHelpOpen(true)}
            size="small"
          >
            <QuestionMark fontSize="small" />
          </IconButton>
        )}
        <Button
          color="primary"
          disabled={!isDirty || jsonError}
          onClick={handleSave}
          variant="contained"
        >
          {messages.themes.themeEditor.saveButton()}
        </Button>
      </Box>
      {/* Help Dialog */}
      <Dialog onClose={() => setHelpOpen(false)} open={helpOpen}>
        <DialogTitle>
          {messages.themes.themeEditor.helpDialog.title()}
        </DialogTitle>
        <DialogContent>
          <Typography component="div" variant="body1">
            {helpBlock}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHelpOpen(false)}>
            {messages.themes.themeEditor.helpDialog.closeButton()}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default ThemeEditor;
