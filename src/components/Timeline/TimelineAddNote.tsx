import { Collapse } from '@material-ui/core';
import { useIntl } from 'react-intl';
import React, { useEffect, useState } from 'react';

import SubmitCancelButtons from '../forms/common/SubmitCancelButtons';
import TextEditor from './TextEditor';
import { ZetkinNote } from 'types/zetkin';

interface AddNoteProps {
  disabled?: boolean;
  onSubmit: (note: Pick<ZetkinNote, 'text'>) => void;
}

const TimelineAddNote: React.FunctionComponent<AddNoteProps> = ({
  disabled,
  onSubmit,
}) => {
  const intl = useIntl();
  const [clear, setClear] = useState<number>(0);
  const [note, setNote] = useState<Pick<ZetkinNote, 'text'> | null>(null);

  useEffect(() => {
    if (!disabled) {
      onCancel();
    }
  }, [disabled]);

  // Markdown string is truthy even if the visible text box is empty
  const visibleText = note?.text
    .replace(/(<([^>]+)>)/gi, '')
    .replace(/\r?\n|\r/g, '');

  return (
    <form
      onSubmit={(evt) => {
        evt.preventDefault();
        if (note?.text) {
          onSubmit(note);
        }
      }}
    >
      <TextEditor
        clear={clear}
        onChange={onChange}
        placeholder={intl.formatMessage({
          id: 'misc.timeline.add_note_placeholder',
        })}
      />
      <Collapse in={!!visibleText}>
        <SubmitCancelButtons onCancel={onCancel} submitDisabled={disabled} />
      </Collapse>
    </form>
  );

  function onChange(markdown: string) {
    if (markdown === '') {
      setNote(null);
    } else {
      setNote({ ...note, text: markdown });
    }
  }

  function onCancel() {
    setClear(clear + 1);
    setNote(null);
  }
};

export default TimelineAddNote;
