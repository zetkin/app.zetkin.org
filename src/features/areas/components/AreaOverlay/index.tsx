import { FC, useCallback, useContext, useEffect, useState } from 'react';
import { Close } from '@mui/icons-material';
import {
  Box,
  Button,
  ClickAwayListener,
  Divider,
  Paper,
  TextField,
  Typography,
} from '@mui/material';

import { ZetkinArea } from '../../types';
import useAreaMutations from '../../hooks/useAreaMutations';
import ZUIPreviewableInput, {
  ZUIPreviewableMode,
} from 'zui/ZUIPreviewableInput';
import { Msg, useMessages } from 'core/i18n';
import messageIds from '../../l10n/messageIds';
import ZUIEllipsisMenu from 'zui/ZUIEllipsisMenu';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import TagsSection from './TagsSection';

type Props = {
  area: ZetkinArea;
  editing: boolean;
  onBeginEdit: () => void;
  onCancelEdit: () => void;
  onClose: () => void;
};

const AreaOverlay: FC<Props> = ({
  area,
  editing,
  onBeginEdit,
  onCancelEdit,
  onClose,
}) => {
  const [title, setTitle] = useState(area.title);
  const [description, setDescription] = useState(area.description);
  const [fieldEditing, setFieldEditing] = useState<
    'title' | 'description' | null
  >(null);
  const { deleteArea, updateArea } = useAreaMutations(
    area.organization.id,
    area.id
  );
  const messages = useMessages(messageIds);
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);

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

  return (
    <Paper
      sx={{
        bottom: '1rem',
        display: 'flex',
        flexDirection: 'column',
        minWidth: 400,
        padding: 2,
        position: 'absolute',
        right: '1rem',
        top: '1rem',
        zIndex: 1000,
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
        <Box mb={2}>
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
      <Box flexGrow={1} my={2}>
        <TagsSection area={area} />
      </Box>
      <Box display="flex" gap={1}>
        {editing && (
          <>
            <Button
              onClick={() => {
                updateArea({
                  points: area.points,
                });
                onCancelEdit();
              }}
              variant="contained"
            >
              <Msg id={messageIds.overlay.buttons.save} />
            </Button>
            <Button onClick={() => onCancelEdit()} variant="outlined">
              <Msg id={messageIds.overlay.buttons.cancel} />
            </Button>
          </>
        )}
        {!editing && (
          <>
            <Button onClick={() => onBeginEdit()} variant="outlined">
              <Msg id={messageIds.overlay.buttons.edit} />
            </Button>
            <ZUIEllipsisMenu
              items={[
                {
                  label: messages.overlay.buttons.delete(),
                  onSelect: () => {
                    showConfirmDialog({
                      onSubmit: () => {
                        deleteArea();
                      },
                    });
                  },
                },
              ]}
            />
          </>
        )}
      </Box>
    </Paper>
  );
};

export default AreaOverlay;
