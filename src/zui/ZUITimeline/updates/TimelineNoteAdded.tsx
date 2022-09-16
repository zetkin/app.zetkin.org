import { FormattedMessage } from 'react-intl';
import { Box, makeStyles } from '@material-ui/core';

import EmailLoader from './elements/EmailLoader';
import UpdateContainer from './elements/UpdateContainer';
import { ZetkinFile } from 'utils/types/zetkin';
import { ZetkinFileObjectChip } from 'zui/ZUIFileChip';
import { ZetkinUpdateJourneyInstanceAddNote } from 'zui/ZUITimeline/types';
import ZUIMarkdown from 'zui/ZUIMarkdown';
import ZUIPersonLink from 'zui/ZUIPersonLink';

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
          values={{ actor: <ZUIPersonLink person={update.actor} /> }}
        />
      }
      update={update}
    >
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
    </UpdateContainer>
  );
};

export default TimelineNoteAdded;
