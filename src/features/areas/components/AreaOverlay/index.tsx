import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
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
import ZUIEllipsisMenu from 'zui/ZUIEllipsisMenu';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/areas/l10n/messageIds';
import { ZUIExpandableText } from 'zui/ZUIExpandableText';

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
  const messages = useMessages(messageIds);
  const [title, setTitle] = useState(area.title);
  const [description, setDescription] = useState(area.description);
  const [fieldEditing, setFieldEditing] = useState<
    'title' | 'description' | null
  >(null);
  const { deleteArea, updateArea } = useAreaMutations(
    area.organization_id,
    area.id
  );
  const tagsElement = useRef<HTMLElement>();
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);
  const enteredEditableMode = useRef(false);

  const handleDescriptionTextAreaRef = useCallback(
    (el: HTMLTextAreaElement | null) => {
      if (el && enteredEditableMode.current) {
        // When entering edit mode for desciption, focus the text area and put
        // caret at the end of the text
        el.focus();
        el.setSelectionRange(el.value.length, el.value.length);
        // We want to display the last line of the textarea.
        // We do this by scrolling the element under the textarea into view.
        // This way we don't have to keep track of which element contains the scroll
        setTimeout(() => {
          tagsElement.current?.scrollIntoView();
        }, 0);
        enteredEditableMode.current = false;
      }
    },
    []
  );

  useEffect(() => {
    setTitle(area.title);
    setDescription(area.description);
  }, [area.id]);

  return (
    <Paper
      sx={{
        bottom: '1rem',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: 400,
        minWidth: 400,
        overflow: 'auto',
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
            updateArea({
              title: title?.trim() || messages.areas.default.title(),
            });
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
                <form
                  onSubmit={(ev) => {
                    ev.preventDefault();
                    if (fieldEditing === 'title') {
                      setFieldEditing(null);
                      updateArea({
                        title: title?.trim() || messages.areas.default.title(),
                      });
                    }
                  }}
                >
                  <TextField
                    fullWidth
                    onBlur={() => {
                      if (fieldEditing === 'title') {
                        setFieldEditing(null);
                        updateArea({
                          title:
                            title?.trim() || messages.areas.default.title(),
                        });
                      }
                    }}
                    onChange={(ev) => setTitle(ev.target.value)}
                    slotProps={{ htmlInput: props }}
                    sx={{ marginBottom: 2 }}
                    value={title}
                  />
                </form>
              )}
              renderPreview={() => (
                <Typography variant="h5">
                  {area.title?.trim() || messages.areas.default.title()}
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
              if (mode === ZUIPreviewableMode.EDITABLE) {
                enteredEditableMode.current = true;
              }
              setFieldEditing(
                mode === ZUIPreviewableMode.EDITABLE ? 'description' : null
              );
            }}
            renderInput={(props) => (
              <TextField
                fullWidth
                inputRef={handleDescriptionTextAreaRef}
                multiline
                onBlur={() => {
                  if (fieldEditing === 'description') {
                    setFieldEditing(null);
                    updateArea({ description });
                  }
                }}
                onChange={(ev) => setDescription(ev.target.value)}
                slotProps={{ htmlInput: props }}
                sx={{
                  marginTop: 2,
                }}
                value={description}
              />
            )}
            renderPreview={() => (
              <Box paddingTop={1}>
                <ZUIExpandableText
                  color="secondary"
                  content={
                    area.description?.trim().length
                      ? area.description
                      : messages.areas.default.description()
                  }
                  fontStyle={
                    area.description?.trim().length ? 'inherit' : 'italic'
                  }
                  maxVisibleChars={110}
                />
              </Box>
            )}
            value={area.description || ''}
          />
        </Box>
      </ClickAwayListener>
      <Divider />
      <Box ref={tagsElement} flexGrow={1} my={2}>
        {/*
        <TagsSection area={area} />
        */}
      </Box>
      <Box display="flex" gap={1}>
        {editing && (
          <>
            <Button
              onClick={() => {
                updateArea({
                  boundary: {
                    coordinates: [area.points],
                    type: 'Polygon',
                  },
                });
                onCancelEdit();
              }}
              variant="contained"
            >
              <Msg id={messageIds.areas.areaSettings.edit.saveButton} />
            </Button>
            <Button onClick={() => onCancelEdit()} variant="outlined">
              <Msg id={messageIds.areas.areaSettings.edit.cancelButton} />
            </Button>
          </>
        )}
        {!editing && (
          <>
            <Button onClick={() => onBeginEdit()} variant="outlined">
              <Msg id={messageIds.areas.areaSettings.edit.editButton} />
            </Button>
            <ZUIEllipsisMenu
              items={[
                {
                  label: <Msg id={messageIds.areas.areaSettings.delete} />,
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
