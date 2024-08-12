import { Box, Collapse } from '@mui/material';
import React, { useEffect, useState } from 'react';

import { useMessages } from 'core/i18n';
import { ZetkinNoteBody } from 'utils/types/zetkin';
import ZUISubmitCancelButtons from '../ZUISubmitCancelButtons';
import ZUITextEditor from '../ZUITextEditor';
import useFileUploads, {
  FileUploadState,
} from 'features/files/hooks/useFileUploads';
import messageIds from './l10n/messageIds';
import { useNumericRouteParams } from 'core/hooks';

interface AddNoteProps {
  disabled?: boolean;
  onSubmit: (note: ZetkinNoteBody) => void;
}

const TimelineAddNote: React.FunctionComponent<AddNoteProps> = ({
  disabled,
  onSubmit,
}) => {
  const { orgId } = useNumericRouteParams();
  const messages = useMessages(messageIds);
  const [clear, setClear] = useState<number>(0);
  const [note, setNote] = useState<ZetkinNoteBody | null>(null);
  const {
    cancelFileUpload,
    getDropZoneProps,
    fileUploads,
    openFilePicker,
    reset: resetFileUploads,
  } = useFileUploads(orgId);

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
        <ZUITextEditor
          clear={clear}
          fileUploads={fileUploads}
          onCancelFile={cancelFileUpload}
          onChange={onChange}
          onClickAttach={() => openFilePicker()}
          placeholder={messages.addNotePlaceholder()}
        />
      </Box>
      <Collapse in={!!visibleText || fileUploads.length > 0}>
        <ZUISubmitCancelButtons
          onCancel={onCancel}
          submitButtonProps={{ 'data-testid': 'TimelineAddNote-submitButton' }}
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
    resetFileUploads();
    setClear(clear + 1);
    setNote(null);
  }
};

export default TimelineAddNote;
