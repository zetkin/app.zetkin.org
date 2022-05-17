import { FormattedMessage } from 'react-intl';
import { Typography } from '@material-ui/core';
import { createEditor, Descendant } from 'slate';
import { Editable, Slate, withReact } from 'slate-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Leaf } from '../TextEditor';
import { markdownToSlate } from '../TextEditor/helpers';
import TextElement from '../TextEditor/TextElement';
import UpdateContainer from './elements/UpdateContainer';
import ZetkinPersonLink from 'components/ZetkinPersonLink';
import { ZetkinUpdateJourneyInstanceAddNote } from 'types/updates';

interface Props {
  update: ZetkinUpdateJourneyInstanceAddNote;
}

const TimelineNoteAdded: React.FC<Props> = ({ update }) => {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState<Descendant[]>();
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const renderElement = useCallback((props) => <TextElement {...props} />, []);

  useEffect(() => {
    markdownToSlate(update.details.note.text).then((slateString) =>
      setValue(slateString)
    );
  }, [update]);

  if (!value) {
    return null;
  }

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
        <Slate editor={editor} value={value || []}>
          <Editable
            readOnly
            renderElement={renderElement}
            renderLeaf={renderLeaf}
          />
        </Slate>
      </Typography>
    </UpdateContainer>
  );
};

export default TimelineNoteAdded;
