import { Box, CircularProgress, Typography } from '@mui/material';
import { FC, ReactNode } from 'react';

import DropZoneContainer from './DropZoneContainer';
import messageIds from '../l10n/messageIds';
import { Msg } from 'core/i18n';
import { UploadFileOutlined } from '@mui/icons-material';
import { ZetkinFile } from 'utils/types/zetkin';
import useFileUploads, { FileUploadState } from '../hooks/useFileUploads';

type Props = {
  children: (props: { openFilePicker: () => void }) => ReactNode;
  onUploadComplete?: (file: ZetkinFile) => void;
  orgId: number;
};

const FileDropZone: FC<Props> = ({ children, onUploadComplete, orgId }) => {
  const {
    fileUploads,
    getDropZoneProps,
    getInputProps,
    isDraggingOver,
    openFilePicker,
  } = useFileUploads(orgId, {
    multiple: false,
    onUploadComplete: onUploadComplete,
  });

  const activeFileUploads = fileUploads.filter(
    (upload) => upload.state == FileUploadState.UPLOADING
  );
  const isUploading = activeFileUploads.length > 0;

  return (
    <Box height="100%">
      {isUploading && (
        <DropZoneContainer state="loading">
          <CircularProgress sx={{ mb: 2 }} />
          <Typography variant="body1">{activeFileUploads[0].name}</Typography>
        </DropZoneContainer>
      )}
      {!isUploading && (
        <Box
          data-testid="FileDropZone-dropZone"
          height="100%"
          {...getDropZoneProps()}
        >
          <input {...getInputProps()} />
          {isDraggingOver && (
            <DropZoneContainer state="accepting">
              <UploadFileOutlined
                color="primary"
                sx={{ fontSize: 40, mb: 1 }}
              />
              <Typography variant="body1">
                <Msg id={messageIds.fileUpload.dropToUpload} />
              </Typography>
            </DropZoneContainer>
          )}
          {!isDraggingOver && children({ openFilePicker })}
        </Box>
      )}
    </Box>
  );
};

export default FileDropZone;
