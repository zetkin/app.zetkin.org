import { Box, Collapse, Typography } from '@mui/material';
import React, { FormEvent, useEffect, useState } from 'react';

import theme from 'theme';
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
  showPostRequestError?: boolean;
  disabled?: boolean;
  onSubmit: (note: ZetkinNoteBody) => void;
}

const TimelineAddNote: React.FunctionComponent<AddNoteProps> = ({
  showPostRequestError,
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
    if (!disabled && !showPostRequestError) {
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

  async function onSubmitHandler(evt: FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    if (note?.text) {
      onSubmit({
        ...note,
        file_ids: fileUploads.map((fileUpload) => fileUpload.apiData!.id),
      });
    }
  }
  return (
    <form onSubmit={onSubmitHandler}>
      <Box {...getDropZoneProps()}>
        <ZUITextEditor
          clear={clear}
          fileUploads={fileUploads}
          onCancelFile={cancelFileUpload}
          onChange={onChange}
          onClickAttach={() => openFilePicker()}
          placeholder={messages.addNotePlaceholder()}
        />
        {showPostRequestError && (
          <Box>
            <Typography color={theme.palette.error.main}>
              {messages.fileUploadErrorMessage()}
            </Typography>
          </Box>
        )}
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
