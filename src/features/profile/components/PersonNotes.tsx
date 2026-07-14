import {
  Avatar,
  Box,
  Button,
  Collapse,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { FC, useContext, useState } from 'react';

import { ZetkinPerson } from 'utils/types/zetkin';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import ZUISection from 'zui/ZUISection';
import usePersonNotes from '../hooks/usePersonNotes';
import useAddPersonNote from '../hooks/useAddPersonNote';
import useDeletePersonNote from '../hooks/useDeletePersonNote';
import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import ZUIEllipsisMenu from 'zui/ZUIEllipsisMenu';

type Props = {
  orgId: number;
  person: ZetkinPerson;
};

const PersonNotes: FC<Props> = ({ orgId, person }) => {
  const messages = useMessages(messageIds);
  const [newNote, setNewNote] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [editorFocused, setEditorFocused] = useState(false);

  const notes = usePersonNotes(orgId, person.id);
  const addPersonNote = useAddPersonNote(orgId, person.id);
  const deletePersonNote = useDeletePersonNote(orgId, person.id);

  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);

  return (
    <ZUISection title={messages.notes.title()}>
      <Box sx={{ paddingBottom: 1 }}>
        <TextField
          fullWidth
          multiline
          onBlur={() => {
            if (!newNote.trim()) {
              setEditorFocused(false);
            }
          }}
          onChange={(ev) => setNewNote(ev.target.value)}
          onFocus={() => setEditorFocused(true)}
          placeholder={messages.notes.placeHolder()}
          sx={(theme) => ({
            backgroundColor:
              editorFocused || newNote.trim() ? theme.palette.common.white : '',
          })}
          value={newNote}
        />
        <Collapse in={!!newNote.trim()}>
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              justifyContent: 'flex-end',
              paddingTop: 1,
            }}
          >
            <Button
              disabled={!newNote.trim()}
              onClick={() => {
                setNewNote('');
                setEditorFocused(false);
              }}
              variant="text"
            >
              <Msg id={messageIds.notes.cancelButton} />
            </Button>
            <Button
              disabled={!newNote.trim()}
              loading={isSubmittingNote}
              onClick={async () => {
                const trimmedNote = newNote.trim();
                if (trimmedNote) {
                  setIsSubmittingNote(true);
                  await addPersonNote(trimmedNote);
                  setIsSubmittingNote(false);
                  setEditorFocused(false);
                  setNewNote('');
                }
              }}
              variant="contained"
            >
              <Msg id={messageIds.notes.addNoteButton} />
            </Button>
          </Box>
        </Collapse>
      </Box>
      <Stack divider={<Divider flexItem />} gap={2}>
        {notes
          .sort((a, b) => {
            return (
              new Date(b.created).getTime() - new Date(a.created).getTime()
            );
          })
          .map((note) => (
            <Box
              key={note.id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                padding: 1,
              }}
            >
              <Box
                sx={{
                  alignItems: 'flex-start',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                    gap: 2,
                  }}
                >
                  <Avatar
                    src={`/api/orgs/${orgId}/people/${note.author.id}/avatar`}
                    sx={{ height: 32, width: 32 }}
                  />
                  <Box
                    sx={{
                      alignItems: 'center',
                      display: 'flex',
                      flexWrap: 'wrap',
                    }}
                  >
                    <Typography noWrap sx={{ marginRight: 1 }}>
                      <Msg
                        id={messageIds.notes.note.author}
                        values={{
                          authorName: (
                            <Typography component="span" variant="h6">
                              {note.author.name}
                            </Typography>
                          ),
                        }}
                      />
                    </Typography>
                    <Typography color="secondary" component="span">
                      <ZUIRelativeTime
                        //Adding a "Z" here because timestamp from server is in GMT
                        datetime={note.created + 'Z'}
                      />
                    </Typography>
                  </Box>
                </Box>
                <ZUIEllipsisMenu
                  items={[
                    {
                      id: `note-${note.id}`,
                      label: messages.notes.note.delete(),
                      onSelect: () =>
                        showConfirmDialog({
                          onSubmit: () => deletePersonNote(note.id),
                          title: messages.notes.note.deleteWarningTitle(),
                          warningText:
                            messages.notes.note.deleteWarningDescription({
                              name: person.first_name,
                            }),
                        }),
                      startIcon: <Delete />,
                    },
                  ]}
                />
              </Box>
              <Box sx={{ paddingLeft: 6 }}>
                <Typography>{note.text}</Typography>
              </Box>
            </Box>
          ))}
      </Stack>
    </ZUISection>
  );
};

export default PersonNotes;
