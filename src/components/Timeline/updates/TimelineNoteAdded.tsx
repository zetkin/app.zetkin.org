import { FormattedMessage } from 'react-intl';
import { makeStyles } from '@material-ui/core';
import { marked } from 'marked';
import { Typography } from '@material-ui/core';

import UpdateContainer from './elements/UpdateContainer';
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
      {update.details.note.files.map((file) => (
        <Typography key={file.id}>{file.original_name}</Typography>
      ))}
    </UpdateContainer>
  );
};

export default TimelineNoteAdded;
