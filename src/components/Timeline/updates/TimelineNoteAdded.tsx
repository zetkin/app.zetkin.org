import { FormattedMessage } from 'react-intl';
import { marked } from 'marked';
import { Typography } from '@material-ui/core';

import UpdateContainer from './elements/UpdateContainer';
import ZetkinPersonLink from 'components/ZetkinPersonLink';
import { ZetkinUpdateJourneyInstanceAddNote } from 'types/updates';

interface Props {
  update: ZetkinUpdateJourneyInstanceAddNote;
}

const TimelineNoteAdded: React.FC<Props> = ({ update }) => {
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
      <Typography variant="body1">
        <div
          dangerouslySetInnerHTML={{
            __html: marked(update.details.note.text),
          }}
        />
      </Typography>
    </UpdateContainer>
  );
};

export default TimelineNoteAdded;
