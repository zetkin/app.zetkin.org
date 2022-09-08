import { Box } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import Image from 'next/image';
import { useEffect } from 'react';

import SubmitCancelButtons from './forms/common/SubmitCancelButtons';
import ZetkinDialog from './ZetkinDialog';
import { ZetkinFile } from 'utils/types/zetkin';
import { ZetkinFileUploadChip } from './ZetkinFileChip';
import useFileUploads, {
  FILECAT_IMAGES,
} from 'features/files/hooks/useFileUploads';

interface ImageUploadDialogProps {
  onClose: () => void;
  onSelectFile: (file: ZetkinFile) => void;
  open: boolean;
}
const ImageSelectDialog: React.FC<ImageUploadDialogProps> = ({
  onClose,
  onSelectFile,
  open,
}) => {
  const { fileUploads, getDropZoneProps, openFilePicker, reset } =
    useFileUploads({ accept: FILECAT_IMAGES, multiple: false });

  const selectedFileData = fileUploads[0]?.apiData ?? null;

  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open]);

  return (
    <ZetkinDialog onClose={onClose} open={open}>
      {!fileUploads.length && (
        <Box
          {...getDropZoneProps()}
          data-testid="ImageSelectDialog-dropZone"
          onClick={() => openFilePicker()}
          style={{
            backgroundColor: 'rgba(0,0,0,0.1)',
            borderColor: 'rgba(0,0,0,0.2)',
            borderRadius: 4,
            borderStyle: 'dashed',
            borderWidth: 2,
            cursor: 'pointer',
            padding: 20,
            textAlign: 'center',
          }}
        >
          <FormattedMessage id="misc.imageSelectDialog.instructions" />
        </Box>
      )}
      {!!fileUploads.length && (
        <>
          {fileUploads[0].apiData && (
            <Box
              height={300}
              marginBottom={1}
              marginLeft="auto"
              marginRight="auto"
              width={400}
            >
              <Image
                alt={fileUploads[0].apiData.original_name}
                height={3}
                layout="responsive"
                objectFit="contain"
                src={fileUploads[0].apiData.url}
                width={4}
              />
            </Box>
          )}
          <Box textAlign="center">
            <ZetkinFileUploadChip fileUpload={fileUploads[0]} />
          </Box>
        </>
      )}
      <form
        onSubmit={(evt) => {
          evt.preventDefault();
          evt.stopPropagation();
          if (selectedFileData) {
            onSelectFile(selectedFileData);
          }
        }}
      >
        <SubmitCancelButtons
          onCancel={() => onClose()}
          submitDisabled={!selectedFileData}
        />
      </form>
    </ZetkinDialog>
  );
};

export default ImageSelectDialog;
