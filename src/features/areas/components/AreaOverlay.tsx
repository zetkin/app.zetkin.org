import { FC, useCallback, useEffect, useState } from 'react';
import { Close } from '@mui/icons-material';
import {
  Box,
  ClickAwayListener,
  Divider,
  Link,
  Paper,
  TextField,
  Typography,
} from '@mui/material';

import { ZetkinArea } from '../types';
import useAreaMutations from '../hooks/useAreaMutations';
import ZUIPreviewableInput, {
  ZUIPreviewableMode,
} from 'zui/ZUIPreviewableInput';
import { useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';

type Props = {
  area: ZetkinArea;
  onClose: () => void;
};

const AreaOverlay: FC<Props> = ({ area, onClose }) => {
  const [title, setTitle] = useState(area.title);
  const [description, setDescription] = useState(area.description);
  const [fieldEditing, setFieldEditing] = useState<
    'title' | 'description' | null
  >(null);
  const { updateArea } = useAreaMutations(area.organization.id, area.id);
  const messages = useMessages(messageIds);

  const handleDescriptionTextAreaRef = useCallback(
    (el: HTMLTextAreaElement | null) => {
      if (el) {
        // When entering edit mode for desciption, focus the text area and put
        // caret at the end of the text
        el.focus();
        el.setSelectionRange(el.value.length, el.value.length);
        el.scrollTop = el.scrollHeight;
      }
    },
    []
  );

  useEffect(() => {
    setTitle(area.title);
    setDescription(area.description);
  }, [area]);

  const hostAndPath = `${window?.location.host}/o/${area.organization.id}/areas/${area.id}`;
  const href = `${window?.location.protocol}//${hostAndPath}`;

  return (
    <Paper
      sx={{
        bottom: '1rem',
        minWidth: 400,
        padding: 2,
        position: 'absolute',
        right: '1rem',
        top: '1rem',
        zIndex: 9999,
      }}
    >
      <ClickAwayListener
        mouseEvent="onMouseDown"
        onClickAway={() => {
          if (fieldEditing === 'title') {
            setFieldEditing(null);
            updateArea({ title });
          } else if (fieldEditing === 'description') {
            setFieldEditing(null);
            updateArea({ description });
          }
        }}
      >
        <Box padding={2}>
          <Box display="flex" justifyContent="space-between">
            <ZUIPreviewableInput
              mode={
                fieldEditing === 'title'
                  ? ZUIPreviewableMode.EDITABLE
                  : ZUIPreviewableMode.PREVIEW
              }
              onSwitchMode={(mode) => {
                setFieldEditing(
                  mode === ZUIPreviewableMode.EDITABLE ? 'title' : null
                );
              }}
              renderInput={(props) => (
                <TextField
                  fullWidth
                  inputProps={props}
                  onChange={(ev) => setTitle(ev.target.value)}
                  sx={{ marginBottom: 2 }}
                  value={title}
                />
              )}
              renderPreview={() => (
                <Typography variant="h5">
                  {area.title || messages.empty.title()}
                </Typography>
              )}
              value={area.title || ''}
            />
            <Close
              color="secondary"
              onClick={() => {
                onClose();
              }}
              sx={{
                cursor: 'pointer',
              }}
            />
          </Box>
          <ZUIPreviewableInput
            mode={
              fieldEditing === 'description'
                ? ZUIPreviewableMode.EDITABLE
                : ZUIPreviewableMode.PREVIEW
            }
            onSwitchMode={(mode) => {
              setFieldEditing(
                mode === ZUIPreviewableMode.EDITABLE ? 'description' : null
              );
            }}
            renderInput={(props) => (
              <TextField
                fullWidth
                inputProps={props}
                inputRef={handleDescriptionTextAreaRef}
                maxRows={4}
                multiline
                onChange={(ev) => setDescription(ev.target.value)}
                sx={{ marginTop: 2 }}
                value={description}
              />
            )}
            renderPreview={() => (
              <Box paddingTop={1}>
                <Typography
                  color="secondary"
                  fontStyle={
                    area.description?.trim().length ? 'inherit' : 'italic'
                  }
                  sx={{ overflowWrap: 'anywhere' }}
                >
                  {area.description?.trim().length
                    ? area.description
                    : messages.empty.description()}
                </Typography>
              </Box>
            )}
            value={area.description || ''}
          />
        </Box>
      </ClickAwayListener>
      <Divider />
      <Typography>
        <Link href={href} target="_blank">
          {hostAndPath}
        </Link>
      </Typography>
    </Paper>
  );
};

export default AreaOverlay;
