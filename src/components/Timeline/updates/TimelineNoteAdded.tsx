import { createEditor } from 'slate';
import { FormattedMessage } from 'react-intl';
import { Typography } from '@material-ui/core';
import { Editable, Slate, withReact } from 'slate-react';
import React, { useMemo } from 'react';

import UpdateContainer from './elements/UpdateContainer';
import ZetkinPersonLink from 'components/ZetkinPersonLink';
import { ZetkinUpdateJourneyInstanceAddNote } from 'types/updates';

interface Props {
  update: ZetkinUpdateJourneyInstanceAddNote;
}

const TimelineNoteAdded: React.FC<Props> = ({ update }) => {
  const editor = useMemo(() => withReact(createEditor()), []);

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
        <Slate
          editor={editor}
          value={JSON.parse(update.details.note.text) || []}
        >
          <Editable readOnly />
        </Slate>
      </Typography>
    </UpdateContainer>
  );
};

export default TimelineNoteAdded;
