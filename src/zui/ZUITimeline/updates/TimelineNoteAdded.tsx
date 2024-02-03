import { Box } from '@mui/material';
import { Edit } from '@mui/icons-material';
import makeStyles from '@mui/styles/makeStyles';
import { useState } from 'react';

import EmailLoader from './elements/EmailLoader';
import { Msg } from 'core/i18n';
import UpdateContainer from './elements/UpdateContainer';
import { ZetkinFileObjectChip } from 'zui/ZUIFileChip';
import { ZetkinUpdateJourneyInstanceAddNote } from 'zui/ZUITimeline/types';
import ZUIEllipsisMenu from 'zui/ZUIEllipsisMenu';
import ZUIMarkdown from 'zui/ZUIMarkdown';
import ZUIPersonLink from 'zui/ZUIPersonLink';
import ZUISubmitCancelButtons from 'zui/ZUISubmitCancelButtons';
import ZUITextEditor from '../../ZUITextEditor';
import { ZetkinFile, ZetkinNote } from 'utils/types/zetkin';

import messageIds from '../l10n/messageIds';

interface Props {
  onEditNote: (note: Pick<ZetkinNote, 'id' | 'text'>) => void;
  update: ZetkinUpdateJourneyInstanceAddNote;
}

const useStyles = makeStyles(() => {
  return {
    note: {
      '& p:first-child': {
        marginTop: 0,
      },
      '& p:last-child': {
        marginBottom: 0,
      },
    },
  };
});

const TimelineNoteAdded: React.FC<Props> = ({ onEditNote, update }) => {
  const classes = useStyles();

  const [editing, setEditing] = useState(false);
  const [noteText, setNoteText] = useState(update.details.note.text);

  const emailFiles: ZetkinFile[] = update.details.note.files.filter(
    (file) => file.mime_type == 'message/rfc822'
  );
  const miscFiles: ZetkinFile[] = update.details.note.files.filter(
    (file) => !emailFiles.includes(file)
  );

  return (
    <UpdateContainer
      actionButton={
        <ZUIEllipsisMenu
          items={[
            {
              disabled: editing,
              id: `edit-note-${update.details.note.id}`,
              label: 'Edit',
              onSelect: () => setEditing(true),
              startIcon: <Edit />,
            },
          ]}
        />
      }
      headerContent={
        <Msg
          id={messageIds.updates.journeyinstance.addnote}
          values={{ actor: <ZUIPersonLink person={update.actor} /> }}
        />
      }
      update={update}
    >
      {editing ? (
        <form
          onSubmit={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onEditNote({ id: update.details.note.id, text: noteText });
            setEditing(false);
          }}
        >
          <ZUITextEditor
            clear={0}
            fileUploads={[]}
            initialValue={noteText}
            onChange={(text) => setNoteText(text)}
            placeholder="Text"
          />
          <ZUISubmitCancelButtons
            onCancel={() => setEditing(false)}
            submitButtonProps={{
              'data-testid': `TimelineNoteAdded-submitButton-note-${update.details.note.id}`,
            }}
          />
        </form>
      ) : (
        // Not editing
        <>
          <ZUIMarkdown
            BoxProps={{
              className: classes.note,
              component: 'div',
            }}
            markdown={update.details.note.text}
          />
          {!!miscFiles.length && (
            <Box pt={2}>
              {miscFiles.map((file) => (
                <ZetkinFileObjectChip key={file.id} file={file} />
              ))}
            </Box>
          )}
          {!!emailFiles.length && (
            <Box pt={2}>
              {emailFiles.map((emailFile) => (
                <Box key={emailFile.id} marginTop={4}>
                  <EmailLoader file={emailFile} />
                </Box>
              ))}
            </Box>
          )}
        </>
      )}
    </UpdateContainer>
  );
};

export default TimelineNoteAdded;
