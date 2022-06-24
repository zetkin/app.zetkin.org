import { Edit } from '@material-ui/icons';
import { FormattedMessage } from 'react-intl';
import { useState } from 'react';
import { Box, makeStyles } from '@material-ui/core';

import EmailLoader from './elements/EmailLoader';
import Markdown from 'components/Markdown';
import SubmitCancelButtons from 'components/forms/common/SubmitCancelButtons';
import TextEditor from '../TextEditor';
import UpdateContainer from './elements/UpdateContainer';
import ZetkinEllipsisMenu from 'components/ZetkinEllipsisMenu';
import { ZetkinFileObjectChip } from 'components/ZetkinFileChip';
import ZetkinPersonLink from 'components/ZetkinPersonLink';
import { ZetkinUpdateJourneyInstanceAddNote } from 'types/updates';
import { ZetkinFile, ZetkinNoteBody } from 'types/zetkin';

interface Props {
  onEditNote: (note: Pick<ZetkinNoteBody, 'text'> & { id: number }) => void;
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
  const [editing, setEditing] = useState(false);
  const [noteText, setNoteText] = useState(update.details.note.text);

  const classes = useStyles();
  const emailFiles: ZetkinFile[] = update.details.note.files.filter(
    (file) => file.mime_type == 'message/rfc822'
  );
  const miscFiles: ZetkinFile[] = update.details.note.files.filter(
    (file) => !emailFiles.includes(file)
  );

  return (
    <UpdateContainer
      actionButton={
        <ZetkinEllipsisMenu
          items={[
            {
              disabled: editing,
              id: 'edit',
              label: 'Edit',
              onSelect: () => setEditing(true),
              startIcon: <Edit />,
            },
          ]}
        />
      }
      headerContent={
        <FormattedMessage
          id="misc.updates.journeyinstance.addnote"
          values={{ actor: <ZetkinPersonLink person={update.actor} /> }}
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
          <TextEditor
            clear={0}
            fileUploads={[]}
            initialValue={noteText}
            onChange={(text) => setNoteText(text)}
            placeholder="Text"
          />
          <SubmitCancelButtons onCancel={() => setEditing(false)} />
        </form>
      ) : (
        // Not editing
        <>
          <Markdown
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
