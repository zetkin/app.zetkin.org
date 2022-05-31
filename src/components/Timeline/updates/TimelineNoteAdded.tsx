import { FormattedMessage } from 'react-intl';
import { marked } from 'marked';
import { Box, makeStyles } from '@material-ui/core';

import CleanHtml from 'components/CleanHtml';
import EmailLoader from './elements/EmailLoader';
import UpdateContainer from './elements/UpdateContainer';
import { ZetkinFile } from 'types/zetkin';
import { ZetkinFileObjectChip } from 'components/ZetkinFileChip';
import ZetkinPersonLink from 'components/ZetkinPersonLink';
import { ZetkinUpdateJourneyInstanceAddNote } from 'types/updates';

interface Props {
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

const TimelineNoteAdded: React.FC<Props> = ({ update }) => {
  const classes = useStyles();
  const emailFiles: ZetkinFile[] = update.details.note.files.filter(
    (file) => file.mime_type == 'message/rfc822'
  );
  const miscFiles: ZetkinFile[] = update.details.note.files.filter(
    (file) => !emailFiles.includes(file)
  );

  return (
    <UpdateContainer
      headerContent={
        <FormattedMessage
          id="misc.updates.journeyinstance.addnote"
          values={{ actor: <ZetkinPersonLink person={update.actor} /> }}
        />
      }
      update={update}
    >
      <CleanHtml
        BoxProps={{
          className: classes.note,
          component: 'div',
        }}
        dirtyHtml={marked(update.details.note.text)}
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
    </UpdateContainer>
  );
};

export default TimelineNoteAdded;
