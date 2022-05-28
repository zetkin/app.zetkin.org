import { useIntl } from 'react-intl';
import { Box, Collapse } from '@material-ui/core';
import React, { useEffect, useState } from 'react';

import SubmitCancelButtons from '../forms/common/SubmitCancelButtons';
import TextEditor from './TextEditor';
import { ZetkinNoteBody } from 'types/zetkin';
import useFileUploads, { FileUploadState } from 'hooks/useFileUploads';

interface AddNoteProps {
  disabled?: boolean;
  onSubmit: (note: ZetkinNoteBody) => void;
}

const TimelineAddNote: React.FunctionComponent<AddNoteProps> = ({
  disabled,
  onSubmit,
}) => {
  const intl = useIntl();
  const [clear, setClear] = useState<number>(0);
  const [note, setNote] = useState<ZetkinNoteBody | null>(null);
  const { cancelFileUpload, getDropZoneProps, fileUploads } = useFileUploads();

  useEffect(() => {
    if (!disabled) {
      onCancel();
    }
  }, [disabled]);

  // Markdown string is truthy even if the visible text box is empty
  const visibleText = note?.text
    .replace(/(<([^>]+)>)/gi, '')
    .replace(/\r?\n|\r/g, '');

  const someLoading = fileUploads.some(
    (fileUpload) => fileUpload.state == FileUploadState.UPLOADING
  );

  return (
    <form
      onSubmit={(evt) => {
        evt.preventDefault();
        if (note?.text) {
          onSubmit({
            ...note,
            file_ids: fileUploads.map((fileUpload) => fileUpload.apiData!.id),
          });
        }
      }}
    >
      <Box {...getDropZoneProps()}>
        <TextEditor
          clear={clear}
          fileUploads={fileUploads}
          onCancelFile={cancelFileUpload}
          onChange={onChange}
          placeholder={intl.formatMessage({
            id: 'misc.timeline.add_note_placeholder',
          })}
        />
      </Box>
      <Collapse in={!!visibleText}>
        <SubmitCancelButtons
          onCancel={onCancel}
          submitDisabled={disabled || someLoading}
        />
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
