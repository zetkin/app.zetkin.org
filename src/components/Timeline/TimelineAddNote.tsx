import { Collapse } from '@material-ui/core';
import { Descendant } from 'slate';
import { useIntl } from 'react-intl';
import React, { useState } from 'react';

import SubmitCancelButtons from '../forms/common/SubmitCancelButtons';
import TextEditor from './TextEditor';
import { ZetkinNote } from 'types/zetkin';

interface AddNoteProps {
  onSubmit: (note: ZetkinNote) => void;
}

const blank: Descendant[] = [
  {
    children: [{ text: '' }],
    type: 'paragraph',
  },
];

const TimelineAddNote: React.FunctionComponent<AddNoteProps> = ({
  onSubmit,
}) => {
  const intl = useIntl();
  const [clear, setClear] = useState<number>(0);
  const [note, setNote] = useState<ZetkinNote | null>(null);

  return (
    <form
      onSubmit={() => {
        if (note?.content) {
          onSubmit(note);
        }
      }}
    >
      <TextEditor
        clear={clear}
        initialValue={blank}
        onChange={onChange}
        placeholder={intl.formatMessage({
          id: 'misc.timeline.add_note_placeholder',
        })}
      />
      <Collapse in={!!note}>
        <SubmitCancelButtons onCancel={onCancel} />
      </Collapse>
    </form>
  );

  function onChange(value: Descendant[]) {
    if (JSON.stringify(value) === JSON.stringify(blank)) {
      setNote(null);
    } else {
      setNote({ ...note, content: JSON.stringify(value) });
    }
  }

  function onCancel() {
    setClear(clear + 1);
    setNote(null);
  }
};

export default TimelineAddNote;
