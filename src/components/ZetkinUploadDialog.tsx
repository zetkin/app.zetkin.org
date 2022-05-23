import { useCallback, useState } from 'react';
import { Typography } from '@material-ui/core';
import { useIntl } from 'react-intl';
import { DropzoneAreaBase, FileObject } from 'material-ui-dropzone';

import SubmitCancelButtons from 'components/forms/common/SubmitCancelButtons';
import ZetkinDialog from 'components/ZetkinDialog';

export interface ZetkinUploadDialogProps {
  onCancel: () => void;
  onSubmit: () => void;
  title?: string;
  accept?: [string];
  open: boolean;
}

const ZetkinUploadDialog: React.FunctionComponent<
  ZetkinUploadDialogProps
> = ({ onCancel, onSubmit, title, accept, open }) => {
  const intl = useIntl();
  const [files, setFiles] = useState([]);

  return (
    <ZetkinDialog
      onClose={() => onCancel()}
      open={open}
      title={
        title || intl.formatMessage({ id: 'misc.UploadDialog.defaultTitle' })
      }
    >
      <Typography variant="body1">
        { intl.formatMessage({
            id: 'misc.UploadDialog.defaultWarningText',
          })}
      </Typography>
      <DropzoneAreaBase
        onAdd={(fileObjs : FileObject[]) => setFiles(fileObjs) }
        onDelete={(fileObj : FileObject, index) => console.log('Removed File:', fileObj)}
        onAlert={(message, variant) => console.log(`${variant}: ${message}`)}
        acceptedFiles={ accept }
        dropzoneText={ intl.formatMessage({ id: 'misc.UploadDialog.dropzoneText' }) }
        showPreviews={ true }
        showPreviewsInDropzone={ false }
        fileObjects={ files }
      />
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          onSubmit();
        }}
      >
        <SubmitCancelButtons
          onCancel={() => onCancel()}
          submitText={intl.formatMessage({
            id: 'misc.UploadDialog.button',
          })}
        />
      </form>
    </ZetkinDialog>
  );
};

export default ZetkinUploadDialog;
