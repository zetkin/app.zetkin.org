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
      <Collapse in={!!note}>
        <SubmitCancelButtons onCancel={onCancel} submitDisabled={disabled} />
      </Collapse>
    </form>
  );

  function onChange(value: string) {
    if (value === '') {
      setNote(null);
    } else {
      setNote({ ...note, text: value });
    }
  }

  function onCancel() {
    setClear(clear + 1);
    setNote(null);
  }
};

export default TimelineAddNote;
