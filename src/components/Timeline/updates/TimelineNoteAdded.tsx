import { FormattedMessage } from 'react-intl';
import { marked } from 'marked';
import { Typography } from '@material-ui/core';
import { Box, makeStyles } from '@material-ui/core';

import UpdateContainer from './elements/UpdateContainer';
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
      <Typography
        className={classes.note}
        component="div"
        dangerouslySetInnerHTML={{
          __html: marked(update.details.note.text, { breaks: true }),
        }}
        variant="body1"
      ></Typography>
      {update.details.note.files.length && (
        <Box pt={2}>
          {update.details.note.files.map((file) => (
            <ZetkinFileObjectChip key={file.id} file={file} />
          ))}
        </Box>
      )}
    </UpdateContainer>
  );
};

export default TimelineNoteAdded;
